/**
 * Created by Marian on 29.3.2017 г..
 */

const Customer = require('mongoose').model('Customer');

module.exports = {
    customerCreateGet: (req, res) => {
        res.render('customer/create')
    },

    customerCreatePost: (req, res) => {
        let customerArgs = req.body;

        Customer.create(customerArgs).then(customer => {
            res.redirect('/project/list')
        })
    },

    allCustomersGet:(req,res) =>{
        Customer.find({}).then(customers =>{
            res.render('customer/list', {customers:customers});
        })
    }
};