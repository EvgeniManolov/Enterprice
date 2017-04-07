/**
 * Created by Lora on 4.4.2017 г..
 */

const User = require('mongoose').model('User');

module.exports = {

    profileGet: (req, res) => {

        let userID = req.user.id;

        User.findOne({_id: userID}).then(user => {

            res.render('userViews/userProfile',{user: user} );
        })
    }
}