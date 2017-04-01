/**
 * Created by Marian on 27.3.2017 г..
 */
const Project = require('mongoose').model('Project')
const Customer = require('mongoose').model('Customer');

module.exports = {
    createGet: (req, res) => {

        Customer.find({}).sort('customerName').then(customers => {

            res.render('project/create', {customers: customers})
        });
    },

    createPost: (req, res) => {
        let projectArgs = req.body;

        Customer.findOne({customerName: projectArgs.projectCustomer}).then(customer => {
            let customerId = customer._id;
            projectArgs.projectCustomer = customerId;

            Project.create(projectArgs).then(project => {
                customer.customerProjects.push(project.id);
                customer.save(err => {
                    if (err) {
                        res.redirect('/userViews/user', {error: err.message});
                    }

                    else {

                        res.redirect('/project/create#profile')
                    }
                });
            });
        });


    },

    projectDetails: (req, res) => {
        let id = req.params.id;

        Project.findOne({'_id' : id }).then(project => {
            res.render('project/details', project)
        });
    }
};
