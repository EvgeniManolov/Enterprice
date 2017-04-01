/**
 * Created by Marian on 29.3.2017 г..
 */

const mongoose = require('mongoose');

let customerSchema = mongoose.Schema ({
    customerName: { type: String, required: true, unique: true},
    customerPhone: {type: String, required: true},
    customerAddress: { type: String, default: ''},
    customerProjects: {type: [mongoose.Schema.Types.ObjectId], default: [], ref: 'Project'},
    customerEmail: {type: String, default: ''}

});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;