/**
 * Created by Marian on 29.3.2017 г..
 */

const Customer = require('mongoose').model('Customer');
const Role = require('mongoose').model('Role');
const User = require('mongoose').model('User');

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
        Customer.find({}).sort('customerName').then(customers =>{
            let user = req.user;

            let isAdmin = true;

            Role.findOne({name: 'Admin'}).then(role => {

                if(user.roles.indexOf(role._id) == -1) {
                    isAdmin = false;
                }

                res.render('./customer/list', {customers: customers, isAdmin: isAdmin});
            })
    })}
};