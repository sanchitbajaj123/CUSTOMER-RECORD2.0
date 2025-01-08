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
        const imageUrl="data:image/jpeg;base64,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"

        client.sendMessage(formattedNumber, messageBody)
        .then(() => {
          return client.sendMessage(formattedNumber, {
            mediaUrl: imageUrl  // Add image URL here
          });
        })
        .then(() => {
          console.log('Message and image sent successfully!');
          res.status(200).send({ success: true, message: 'Message and image sent successfully!' });
        })
        .catch((err) => {
          console.log('Failed to send message:', err);
          res.status(500).send({ success: false, error: err.message });
        });
  });

const server = app.listen(process.env.PORT || port, hostname, () => {
    console.log(`Server listening on http://${hostname}:${port}`);
});
