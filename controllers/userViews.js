/**
 * Created by Marian on 27.3.2017 г..
 */

const mongoose = require('mongoose');
const Project = mongoose.model('Project');
const Customer = mongoose.model('Customer');
const Role = require('mongoose').model('Role');
const User = require('mongoose').model('User');

module.exports = {
    mainGet: (req, res) => {
        Project.find({}).sort('projectDueDate').populate('projectCustomer').populate('projectTeam').then(projects => {

            /*Format projectDueDate property of project and add another property 'date' in format (dd.mm.yyyy)*/

            projects.forEach(function (project) {

                let date = project.projectDueDate.getDate();
                if (date < 10)
                    date = '0' + date;
                let month = project.projectDueDate.getMonth()+1;
                if (month < 10)
                    month = '0' + month;
                let year = project.projectDueDate.getFullYear();

                project.date = '' + date + '.' + month + '.' + year;
            });

            let user = req.user;
            let isAdmin = true;

            Role.findOne({name: 'Admin'}).then(role => {

                if(user.roles.indexOf(role._id) == -1) {
                    isAdmin = false;
                }
                res.render('userViews/user', {projects: projects, isAdmin: isAdmin});
            })


        })
    },
    
    ratesGet: (req, res) => {
    
		User.find({}).then(users => {
        
            /*TO DO: Error message*/
		
			res.render('userViews/rates', {users: users});
		})
    }
};
