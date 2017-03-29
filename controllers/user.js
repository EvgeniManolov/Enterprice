const User = require('mongoose').model('User');
const encryption = require('./../utilities/encryption');

module.exports = {
    loginGet: (req, res) => {
        res.render('home/index');
    },

    loginPost: (req, res) => {
        let loginArgs = req.body;
        User.findOne({email: loginArgs.email}).then(user => {
            if (!user ||!user.authenticate(loginArgs.password)) {
                let errorMsg = 'Either username or password is invalid!';
                loginArgs.error = errorMsg;
                res.render('home/index', loginArgs);
                return;
            }

            req.logIn(user, (err) => {
                if (err) {
                    console.log(err);
                    res.redirect('/home/index', {error: err.message});
                    return;
                }

                res.redirect('userViews/user');
            })
        })
    },

    logout: (req, res) => {
        req.logOut();
        res.redirect('/');
    }
};
