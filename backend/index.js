const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const moment = require('moment-timezone');
const Customer = require('./schema'); 
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');

require('dotenv').config();

const cors=require('cors')

const app = express();
app.use(cors())

const port = 5000;
const hostname = '0.0.0.0';

const client = new Client({
    authStrategy: new LocalAuth(), 
});

console.log(client)
app.use(bodyParser.json());

app.get('/generateQR', (req, res) => {
    console.log('Generating QR code');
    client.on('qr', (qr) => {
        qrcode.toDataURL(qr, (err, url) => {
            console.log('QR code generated',url);   
            if (err) {
                console.error('Error generating QR code:', err);
                res.status(500).send('Failed to generate QR code');
            } else {
                res.send(url);
            }
        });
    });

    client.initialize();
    console.log('Client initialized');
});


let up = '';


mongoose.connect(process.env.MONGOURL);


app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API' });
});

app.post('/update', (req, res) => {
    const { name } = req.body;
    console.log('Received customer id:', name);
    up = name;
    res.status(200).json({ message: 'Customer ID updated', customerId: up });
});

app.post('/add-customer', async (req, res) => {
    console.log("called")
    console.log(req.body);
    const currentDate = moment().tz('Asia/Kolkata'); 
    const date = currentDate.format('DD/MM/YYYY'); 
    const time = currentDate.format('HH:mm:ss');
    const {
        name,
        phone,
        frame,
        glasses,
        contactlens,
        remark,
        prescription: {
          right: {
            sphDV: rightSphDV,
            cylDV: rightCylDV,
            axisDV: rightAxisDV,
            prismDV: rightPrismDV,
            sphNV: rightSphNV,
            cylNV: rightCylNV,
            axisNV: rightAxisNV,
            prismNV: rightPrismNV,
            add: rightAdd
          },
          left: {
            sphDV: leftSphDV,
            cylDV: leftCylDV,
            axisDV: leftAxisDV,
            prismDV: leftPrismDV,
            sphNV: leftSphNV,
            cylNV: leftCylNV,
            axisNV: leftAxisNV,
            prismNV: leftPrismNV,
            add: leftAdd
          }
        },
        total,
        advance,
        balance
      } = req.body;
    console.log(rightSphDV)
    const newCustomer = new Customer({
        name,
        phone,
        frame,
        glasses,
        contactlens,
        remark,
        prescription: {
            right: { sphDV: rightSphDV, cylDV: rightCylDV, axisDV: rightAxisDV, prismDV: rightPrismDV, sphNV: rightSphNV, cylNV: rightCylNV, axisNV: rightAxisNV, prismNV: rightPrismNV, add: rightAdd },
            left: { sphDV: leftSphDV, cylDV: leftCylDV, axisDV: leftAxisDV, prismDV: leftPrismDV, sphNV: leftSphNV, cylNV: leftCylNV, axisNV: leftAxisNV, prismNV: leftPrismNV, add: leftAdd }
        },
        total,
        advance,
        balance,
        dateAdded: date,
        timeAdded: time
    });
    await newCustomer.save();
    console.log("saved")
    res.status(201).json({ message: 'Customer added', customer: newCustomer });
});

app.get('/customers', async (req, res) => {
    const customers = await Customer.find();
    res.status(200).json(customers);
});

app.get('/get-customer/:id', async (req, res) => {
    try {
        const up = req.params.id;
        const customer = await Customer.findOne({ _id: up });
        if (customer) {
            console.log(customer);
            res.status(200).json(customer);
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get('/delete/:id', async (req, res) => {
    try {
        const up=req.params.id;
        await Customer.deleteOne({ _id: up });
        res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get('/balanceclear/:id', async (req, res) => {
    const up=req.params.id;
    const currentDate = moment().tz('Asia/Kolkata');
    const date = currentDate.format('DD/MM/YYYY');
    const customer = await Customer.findOne({ _id: up });
    customer.remark = "Balance(" + customer.balance + ") cleared successfully on " + date;
    customer.balance = 0;
    await customer.save();
    res.status(200).json({ message: 'Balance cleared', customer });
});

app.get('/pendingbalance', async (req, res) => {
    try {
        const customers = await Customer.find({ balance: { $gt: 0 } });
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
});
app.get('/sms/:id',async (req, res) => {
    const up = req.params.id;
    console.log(up);
        const customer = await Customer.findById(up);
        console.log(customer);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        
        const messageBody = `
            --------MISHA EYE CARE--------
            Hello ${customer.name},
            Here are your details:
            Frame: ${customer.frame}
            Glasses: ${customer.glasses}
            Contact Lenses: ${customer.contactlens}
            Prescription (Right Eye):
                SPH (DV): ${customer.prescription.right.sphDV}
                CYL (DV): ${customer.prescription.right.cylDV}
                AXIS (DV): ${customer.prescription.right.axisDV}
                Add: ${customer.prescription.right.add}
            Prescription (Left Eye):
                SPH (DV): ${customer.prescription.left.sphDV}
                CYL (DV): ${customer.prescription.left.cylDV}
                AXIS (DV): ${customer.prescription.left.axisDV}
                Add: ${customer.prescription.left.add}
            Total: ₹${customer.total}
            Advance: ₹${customer.advance}
            Balance: ₹${customer.balance}
            Remark: ${customer.remark}
            If you have any queries, feel free to contact us.
        `;
    const formattedNumber = `91${customer.phone}@c.us`; 
        console.log('Sending message to:', formattedNumber);
    client.sendMessage(formattedNumber, messageBody)
      .then(() => {
        console.log('Message sent successfully!');
        res.status(200).send({ success: true, message: 'Message sent successfully!' });
      })
      .catch((err) => {
        console.log('Failed to send message:', err);
        res.status(500).send({ success: false, error: err.message });
      });
  });

const server = app.listen(process.env.PORT || port, hostname, () => {
    console.log(`Server listening on http://${hostname}:${port}`);
});
