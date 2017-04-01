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


        User.findOne({fullName: teamArgs.userID}).then(user =>
        {
            teamArgs.userID = user._id;
            Team.create(teamArgs).then(team => {

                console.log(team.id);
                user.team.push(team.id);
                user.save(err => {
                    if (err) {
                        res.redirect('/userViews/user', {error: err.message});
                    }

                    else {
                        res.redirect('/userViews/user')
                    }
                })
            });
    });

}};

