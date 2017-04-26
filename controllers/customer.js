/**
 * Created by Marian on 29.3.2017 г..
 */
const formatDate = require('./../utilities/formatDate');

const Customer = require('mongoose').model('Customer');
const Role = require('mongoose').model('Role');
const User = require('mongoose').model('User');
const Project = require('mongoose').model('Project');

module.exports = {
    customerCreateGet: (req, res) => {
        let user = req.user;
        let isAdmin = true;

        Role.findOne({name: 'Admin'}).then(role => {

                if(user.roles.indexOf(role._id) == -1) {
                    isAdmin = false;
                }

        if (isAdmin) {
            res.render('customer/create', {isAdmin: isAdmin})

        } else {
            res.render('home/index', {error: 'Access denied!'})
        }})
    },

    customerCreatePost: (req, res) => {
        let customerArgs = req.body;

        Customer.create(customerArgs).then(customer => {
            res.redirect('/project/list')
        })
    },

    allCustomersGet:(req,res) =>{
        Customer.find({}).sort('customerName').then(customers => {
            let user = req.user;
            let isAdmin = true;

            Role.findOne({name: 'Admin'}).then(role => {

                if (user.roles.indexOf(role._id) == -1) {
                    isAdmin = false;
                }

                res.render('./customer/list', {customers: customers, isAdmin: isAdmin})
            });
        });
    },

    customerDetailsGet: (req, res)=> {
        let id = req.params.id;

        let selectedProjects = []; //these are the projects for a specific customer


        Project.find({}).populate('projectCustomer').then(projects => {

                /* filter only projects where current customer is assigned of the project */
                for (let i = 0; i < projects.length; i++) {
                        if (projects[i].projectCustomer.id == id) {
                            selectedProjects.push(projects[i])
                        }
                }});


        Customer.findOne({_id:id}).then(customer=>{

            /* Check if user is Admin*/
            let user = req.user;
            let isAdmin = true;

            Role.findOne({name: 'Admin'}).then(role => {

                if(user.roles.indexOf(role._id) == -1) {
                    isAdmin = false;
                }
                res.render('./customer/details', {customer:customer, isAdmin:isAdmin, selectedProjects:selectedProjects});
            })
        });
    },

    customerEditGet : (req,res)=>{
        let user = req.user;
        let isAdmin = true;

        Role.findOne({name: 'Admin'}).then(role => {

            if(user.roles.indexOf(role._id) == -1) {
                isAdmin = false;
            }

            if (isAdmin) {
                let id = req.params.id;

                Customer.findOne({_id:id}).then(customer=>{
                    res.render('customer/edit', {customer:customer, isAdmin: isAdmin})
                })

            } else {
                res.render('home/index', {error: 'Access denied!'})
        }})
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