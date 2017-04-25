/**
 * Created by Marian on 25.4.2017 г..
 */

const User = require('mongoose').model('User');
const Team = require('mongoose').model('Team');

module.exports = {
        addTeamMember: function(userName, teamId){
        Team.findOne({_id: teamId}).then(team => {
            User.findOne({fullName: userName}).then(user => {
                team.userID.push(user.id);
                team.save();
            })
        })
    }
};
