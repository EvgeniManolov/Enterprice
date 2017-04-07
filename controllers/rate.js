/**
 * Created by Marian on 7.4.2017 г..
 */

const mongoose = require('mongoose');
const User = require('mongoose').model('User');

module.exports = {

    ratesGet: (req, res) => {

        User.find({}).then(users => {

            /*TO DO: Error message*/

            res.render('rate/list', {users: users});
        })
    }
};
