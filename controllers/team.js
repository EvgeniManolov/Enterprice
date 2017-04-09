/**
 * Created by User on 01/04/2017.
 */

const Team = require('mongoose').model('Team');
const User = require('mongoose').model('User');

module.exports = {
    teamCreateGet: ( req, res ) => {
        User.find({}).then(users=>{
            res.render('team/create', {users:users})
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
    allTeamsGet:(req,res) =>{
        Team.find({}).sort('teamName').then(teams=>{
            res.render('team/list', {teams:teams});
        })
    },

    teamDetailsGet:(req,res)=>{
      let id = req.params.id;
      Team.findOne({_id:id}).populate('userID').then(team=>{
          res.render('./team/details',{team:team});
      });
    },


    teamEditGet: (req,res) =>{

        let id = req.params.id;

        Team.findOne({'_id' : id }).then(team =>{
            res.render('team/edit', {team:team});
        });
    },

    teamEditPost: ( req, res ) =>{
        let id = req.params.id;
        let teamArgs = req.body;

        Team.update({_id:id},{$set:{
            teamName: teamArgs.teamName,
            userID: teamArgs.userID
        }}).then(team=>{
            console.log(id)
            res.redirect('/team/list')
        })
    }

};

