/**
 * Created by User on 01/04/2017.
 */
const formatDate = require('./../utilities/formatDate');
const addTeamMember = require('./../utilities/addTeamMember');

const Team = require('mongoose').model('Team');
const User = require('mongoose').model('User');
const Role = require('mongoose').model('Role');
const Project = require('mongoose').model('Project');

module.exports = {
    teamCreateGet: ( req, res ) => {

        let user = req.user;
        let isAdmin = true;

        Role.findOne({name: 'Admin'}).then(role => {

            if(user.roles.indexOf(role._id) == -1) {
                isAdmin = false;
            }
            if (isAdmin) {
                User.find({}).then(users=>{
                    res.render('team/create', {users:users, isAdmin: isAdmin})
                })
            } else {
                res.render('home/index', {error: 'Access denied!'})
            }
        })
    },

    teamCreatePost: ( req, res ) => {
        let teamArgs = req.body;
        let numberOfUsers = 0;

        let isArray = Array.isArray(teamArgs.userName);

        if(isArray) {
            teamArgs.userName.forEach(user =>{
                numberOfUsers++;
            });

            teamArgs.userID = [];
            let count = 1;

            teamArgs.userName.forEach(userName =>{

                User.findOne({fullName: userName}).then(user => {

                    teamArgs.userID.push( user._id );

                    if (count == numberOfUsers){
                        Team.create(teamArgs).then(team => {

                            teamArgs.userID.forEach(userID => {

                                User.findOne ({_id: userID}).then(user =>{

                                    user.team.push(team.id);

                                    user.save()
                                })
                            })
                        })}
                    count++;
                })});
        } else {

            User.findOne({fullName: teamArgs.userName}).then(user => {

                teamArgs.userID = user.id;

                    Team.create(teamArgs).then(team => {

                            User.findOne ({_id: teamArgs.userID}).then(user =>{

                                user.team.push(team.id);

                                user.save()
                            })
                        })
                    })}

        res.redirect('/project/list')
    },

    allTeamsGet:(req,res) => {
        Team.find({}).populate('userID').sort('teamName').then(teams=>{
            let user = req.user;

            let isAdmin = true;

            Role.findOne({name: 'Admin'}).then(role => {

                if(user.roles.indexOf(role._id) == -1) {
                    isAdmin = false;
                }

                res.render('team/list', {teams:teams, isAdmin:isAdmin});
            });
        })
    },

    teamDetailsGet: (req,res) => {
        let id = req.params.id;
        let selectedProjects = []; //these are the projects for a specific user


        Project.find({}).populate('projectTeam').then(projects => {

            /* filter only projects where current user is a member of the team */
            for (let i = 0; i < projects.length; i++) {

                if (projects[i].projectTeam.id == id) {
                    selectedProjects.push(projects[i])
                }
            }
        });


        User.find().then(users => {
            Team.findOne({_id: id}).populate('userID').then(team => {

                let user = req.user;
                let isAdmin = true;

                Role.findOne({name: 'Admin'}).then(role => {

                    if (user.roles.indexOf(role._id) == -1) {
                        isAdmin = false;
                    }


                    for (let i = 0; i < users.length; i++) {
                        let currentUser = users[i];
                        for (let j = 0; j < team.userID.length; j++) {
                            let currentMember = team.userID[j];
                            if (currentUser.fullName == currentMember.fullName) {
                                let index = users.indexOf(currentUser);
                                users.splice(index, 1);
                                i--;
                            }
                        }
                    }


                    for (let i = 0; i < team.userID.length; i++) {

                        team.userID[i].isAdmin = isAdmin;
                    }

                    res.render('./team/details', {
                        team: team,
                        isAdmin: isAdmin,
                        users: users,
                        selectedProjects: selectedProjects
                    });
                });
            });
        })
    },


    teamRemovePost: (req, res) => {

        let teamId = req.params.id;
        let userParams = req.body;
        let userId = userParams.userId;

        Team.findOne({_id: teamId}).then(team => {
            var index = team.userID.indexOf(userId);

            if(index != -1) {
                team.userID.splice(index, 1);

                team.save();
            }

            User.findOne({_id: userId}).then(user => {
                index = user.team.indexOf(teamId);

                if(index != -1) {
                    user.team.splice(index, 1);
                    user.save();
                }
            })
        })
    },

    teamAddPost: (req, res) => {

        let teamId = req.params.id;
        let users = req.body;

        if (!Array.isArray(users.userName)) {
            addTeamMember.addTeamMember(users.userName, teamId)
        } else {
            for (let i = 0; i < users.userName.length; i++) {
                addTeamMember.addTeamMember(users.userName[i], teamId)
            }
        }

        let url = '/team/details/' + teamId;
        res.redirect(url);
    }

};

