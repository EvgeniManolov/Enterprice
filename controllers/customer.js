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
        Customer.find({}).sort('customerName').then(customers => {


                res.render('./customer/list', {customers: customers})
            });

    },

    customerDetailsGet: (req, res)=> {
        let id = req.params.id;

        Customer.findOne({_id:id}).then(customer=>{

            let user = req.user;
            let isAdmin = true;

            Role.findOne({name: 'Admin'}).then(role => {

                if(user.roles.indexOf(role._id) == -1) {
                    isAdmin = false;
                }
                res.render('./customer/details', {customer:customer, isAdmin:isAdmin});
            })
        });
    },

    customerEditGet : (req,res)=>{
        let id = req.params.id;

        Customer.findOne({_id:id}).then(customer=>{
            res.render('customer/edit', {customer:customer})
        })
    },

    customerEditPost: (req,res)=>{
        let id = req.params.id;
        let url = '/customer/details/'+id;
        let customerArgs = req.body;

        Customer.update({_id: id}, {$set: {

            customerPhone: customerArgs.customerPhone,
            customerEmail: customerArgs.customerEmail,
            customerAddress: customerArgs.customerAddress,
        }}).then(customer=> {
            res.redirect(url);

            })
    }
};