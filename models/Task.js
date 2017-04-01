/**
 * Created by Marian on 1.4.2017 г..
 */


const mongoose = require('mongoose');

let taskSchema = mongoose.Schema ({
    name: { type: String, required: true},
    description: {type: Text, required: true},
    deadline: {type: Date, required: true},
    comments: {type: Text, default: ''},
    project: {type: }

});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
