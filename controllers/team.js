/**
 * Created by User on 01/04/2017.
 */
const formatDate = require('./../utilities/formatDate');

const Team = require('mongoose').model('Team');
const User = require('mongoose').model('User');
const Role = require('mongoose').model('Role');

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
                    res.render('team/create', {users:users})
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

                                user.team = teamArgs.userID;

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

    teamDetailsGet:(req,res)=>{
        let id = req.params.id;
        Team.findOne({_id : id}).populate('userID').then(team=>{

          console.log(team);

            let user = req.user;
            let isAdmin = true;

            Role.findOne({name: 'Admin'}).then(role => {

                if(user.roles.indexOf(role._id) == -1) {
                    isAdmin = false;
                }

                for ( let i = 0; i < team.userID.length; i++){

                    team.userID[i].isAdmin = isAdmin;
                }

              res.render('./team/details',{team:team, isAdmin : isAdmin});
          });
      });
    },

    teamEditGet: (req,res) => {

        let user = req.user;
        let isAdmin = true;

        Role.findOne({name: 'Admin'}).then(role => {

            if(user.roles.indexOf(role._id) == -1) {
                isAdmin = false;
            }
            if (isAdmin) {
                let id = req.params.id;

                Team.findOne({'_id' : id }).then(team =>{
                    res.render('team/edit', {team:team});
                });
            } else {
                res.render('home/index', {error: 'Access denied!'})
            }
        })
    },
    teamEditPost: ( req, res ) =>{
        let id = req.params.id;
        let url = '/team/details/'+id;
        let teamArgs = req.body;

        Team.update({_id:id},{$set:{
            teamName: teamArgs.teamName,
            userID: teamArgs.userID
        }}).then(team=>{
            console.log(id)

            res.redirect(url);
        })
    },

    teamCreateNewPost: (req, res) => {
        let usersArray = req.body;

        console.log(usersArray);
    }
};

