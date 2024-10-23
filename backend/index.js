// Remove any file-sending responses

// index.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const moment = require('moment-timezone');
const Customer = require('./schema'); // Import Customer schema

const app = express();
const port = 5000;
const hostname = '0.0.0.0';

// Middleware for parsing JSON
app.use(bodyParser.json());

let up = ''; // Variable to hold customer ID

// MongoDB setup
mongoose.connect('mongodb+srv://sanchitbajaj2003:root@cluster0.n0euieh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
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
    console.log(req.body);
    const currentDate = moment().tz('Asia/Kolkata'); // Set to India time zone
    const date = currentDate.format('DD/MM/YYYY'); // Format date
    const time = currentDate.format('HH:mm:ss'); // Format time

    const {
        name, phone, frame, glasses, contactlens, remark,
        'right-sph-dv': rightSphDV, 'right-cyl-dv': rightCylDV, 'right-axis-dv': rightAxisDV, 'right-prism-dv': rightPrismDV,
        'right-sph-nv': rightSphNV, 'right-cyl-nv': rightCylNV, 'right-axis-nv': rightAxisNV, 'right-prism-nv': rightPrismNV, 'right-add': rightAdd,
        'left-sph-dv': leftSphDV, 'left-cyl-dv': leftCylDV, 'left-axis-dv': leftAxisDV, 'left-prism-dv': leftPrismDV,
        'left-sph-nv': leftSphNV, 'left-cyl-nv': leftCylNV, 'left-axis-nv': leftAxisNV, 'left-prism-nv': leftPrismNV, 'left-add': leftAdd,
        total, advance, balance
    } = req.body;

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
    res.status(201).json({ message: 'Customer added', customer: newCustomer });
});

app.get('/customers', async (req, res) => {
    const customers = await Customer.find();
    res.status(200).json(customers);
});

app.get('/get-customer', async (req, res) => {
    try {
        const up = req.query.id;
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

app.get('/delete', async (req, res) => {
    try {
        const up=req.query.id;
        await Customer.deleteOne({ _id: up });
        res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get('/balanceclear', async (req, res) => {
    const up=req.query.id;
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

// Start the server
const server = app.listen(process.env.PORT || port, hostname, () => {
    console.log(`Server listening on http://${hostname}:${port}`);
});
