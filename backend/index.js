// Remove any file-sending responses

// index.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const moment = require('moment-timezone');
const Customer = require('./schema'); // Import Customer schema
const twilio = require("twilio");
require('dotenv').config();

const cors=require('cors')

const app = express();
app.use(cors())
const port = 5000;
const hostname = '0.0.0.0';

// Middleware for parsing JSON
app.use(bodyParser.json());

let up = ''; // Variable to hold customer ID

// MongoDB setup
mongoose.connect(process.env.MONGOURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Routes
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
    const currentDate = moment().tz('Asia/Kolkata'); // Set to India time zone
    const date = currentDate.format('DD/MM/YYYY'); // Format date
    const time = currentDate.format('HH:mm:ss'); // Format time
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
app.get('/sms/:id', async (req, res) => {
    const up = req.params.id;
    try {
        const customer = await Customer.findById(up);
        
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const accountSid = process.env.TWILIO_ACCOUNT_SID  
        console.log("aa") 
        console.log(accountSid)

        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const client = twilio(accountSid, authToken);

        
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

        // Send the SMS message via WhatsApp
        const message = await client.messages.create({
            body: messageBody,
            from: "whatsapp:+14155238886",  // Twilio's WhatsApp number
            to: `whatsapp:+91${customer.phone}`  // Customer's phone number
        });

        console.log("Message sent:", message.body);

        res.status(200).json({ message: 'SMS sent successfully', messageDetails: message.body });

    } catch (error) {
        console.error("Error sending SMS:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// Start the server
const server = app.listen(process.env.PORT || port, hostname, () => {
    console.log(`Server listening on http://${hostname}:${port}`);
});
