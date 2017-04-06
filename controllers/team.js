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

        teamArgs.userName.forEach(user =>{
            numberOfUsers++;
        });

        teamArgs.userID = [];
        let count = 1;

        teamArgs.userName.forEach(userName =>{

            User.findOne({fullName: userName}).then(user => {

                teamArgs.userID.push( user._id );

                if (count==numberOfUsers){
                    Team.create(teamArgs).then(team => {

                        teamArgs.userID.forEach(userID => {

                            User.findOne ({_id: userID}).then(user =>{

                                user.team.push(team.id);

                                user.save(

                                )
                            })
                        })
                })};
                count++;
        })});
        res.redirect('/userViews/user')
    },
    editGet: (req,res) =>{

        let id = req.params.id;

        Team.findOne({'_id' : id }).then(team =>{
            res.render('team/edit', team);
        });
    },

    //TO DO POST ..



};

