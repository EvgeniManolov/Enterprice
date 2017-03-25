const Calculator = require('./../Models/Calculator');

module.exports = {
    indexGet: (req, res) => {
        res.render('home/index');
    },
    registerGet: (req, res) => {
        res.render('home/register');
    },

    userGet: (req, res) => {
        res.render('user/user');
    }
};