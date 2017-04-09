/**
 * Created by Marian on 29.3.2017 г..
 */

const Customer = require('mongoose').model('Customer');
const Role = require('mongoose').model('Role');
const User = require('mongoose').model('User');
const Project = require('mongoose').model('Project');

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

                res.render('./customer/list', {customers: customers});
            })
    },

    customerDetailsGet: (req, res)=> {
        let id = req.params.id;
        console.log(id);
        Customer.findOne({_id:id}).then(customer=>{
            console.log(customer);
            res.render('./customer/details', {customer:customer});
        });
    }
};