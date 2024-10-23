// schema.js
const mongoose = require('mongoose');

// Customer schema with updated fields for date and time
const customerSchema = new mongoose.Schema({
    name: String,
    phone: String,
    frame: String,
    glasses: String,
    contactlens: String,
    remark: String,
    prescription: {
        right: {
            sphDV: String,
            cylDV: String,
            axisDV: String,
            prismDV: String,
            sphNV: String,
            cylNV: String,
            axisNV: String,
            prismNV: String,
            add: String
        },
        left: {
            sphDV: String,
            cylDV: String,
            axisDV: String,
            prismDV: String,
            sphNV: String,
            cylNV: String,
            axisNV: String,
            prismNV: String,
            add: String
        }
    },
    total: Number,
    advance: Number,
    balance: Number,
    dateAdded: String,
    timeAdded: String
});

// Create a Mongoose model for Customer
const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
