/**
 * Created by Marian on 7.4.2017 г..
 */

const mongoose = require('mongoose');
const User = require('mongoose').model('User');
const Occupation = require('mongoose').model('Occupation');

module.exports = {

    ratesGet: (req, res) => {

        User.find({}).populate('occupation').then(users => {

            /*TO DO: Error message*/

            res.render('rate/list', {users: users});
        })
    },

    rateEdit: (req, res) => {
        let rateParams = req.body;

        console.log(rateParams.id);
        console.log(rateParams.rate);

        User.findOne({_id: rateParams.id}).then(user => {

            console.log(user);
            user.rate = rateParams.rate;
            user.save();
        })
    }
};
