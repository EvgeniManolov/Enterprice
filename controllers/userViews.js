/**
 * Created by Marian on 27.3.2017 г..
 */

const mongoose = require('mongoose');
const Project = mongoose.model('Project');
const Customer = mongoose.model('Customer');

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

            res.render('userViews/user', {projects: projects});
        })
    }
};
