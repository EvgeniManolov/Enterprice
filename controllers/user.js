const User = require('mongoose').model('User');
const Role = require('mongoose').model('Role');
const Team = require('mongoose').model('Team');
const Occupation = require('mongoose').model('Occupation');
const encryption = require('./../utilities/encryption');

module.exports = {

    registerPost:(req, res) => {
        let registerArgs = req.body;

        User.findOne({email: registerArgs.email}).then(user => {
            let errorMsg = '';
            if (user) {
                errorMsg = 'User with the same username exists!';
            } else if (registerArgs.password !== registerArgs.repeatedPassword) {
                errorMsg = 'Passwords do not match!'
            }

            if (errorMsg) {
                registerArgs.error = errorMsg;
                res.render('home/index', registerArgs)
            } else {
                let salt = encryption.generateSalt();
                let passwordHash = encryption.hashPassword(registerArgs.password, salt);


                let userObject = {
                    email: registerArgs.email,
                    passwordHash: passwordHash,
                    fullName: registerArgs.fullName,
                    salt: salt,
                    phone: registerArgs.phone,
                    country: registerArgs.country,
                    address: registerArgs.address,
                };

                let roles = [];

                Role.findOne({name: 'User'}).then(role => {
                    roles.push(role.id);

                    userObject.roles = roles;

                    Occupation.findOne({'occupationName': registerArgs.occupation}).then(occupation => {

                        userObject.occupation = occupation.id;
                        userObject.rate = occupation.occupationRate;

                        User.create(userObject).then(user => {

                            role.users.push(user.id);
                            role.save(err => {
                                if(err) {
                                    registerArgs.error = err.message;
                                    res.render('/home/index', registerArgs)
                                } else {
                                    res.redirect('/')
                                }
                            })
                        });
                    })
                })
            }
        })
    },

    loginGet: (req, res) => {
        Occupation.find({}).then(occupations => {

            res.render('home/index', {occupations: occupations});
        });
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

                res.redirect('/project/list');
            })
        })
    },

    logout: (req, res) => {
        req.logOut();
        res.redirect('/');
    },
    
    usersGet: (req, res) => {

        let professionsCount = [];

        Occupation.find({}).then(occupations => {

            for ( let i = 1; i < occupations.length; i++) {
                let currentOccupation = {profession: occupations[i].occupationName, count: 0};
                professionsCount.push(currentOccupation);
            }

            User.find({}).populate('occupation').then(users => {

                /*TO DO: Error message*/

                for ( let i = 0; i < users.length; i++ ){

                    for (let j = 0; j < professionsCount.length; j++ ) {

                        if (users[i].occupation.occupationName == professionsCount[j].profession){

                            professionsCount[j].count++;
                        }

                    };
                }

                res.render('userViews/list', {users: users, professionsCount: professionsCount});
            })
        });
    },

    userDetailsGet: (req, res) => {

        let userID = req.params.id; //take user id, then populate 'team (as object => this.team.name)'

        User.findOne({_id : userID }).populate('team').then(userData => {

            res.render('userViews/details', {userData: userData})
        })
    },

    profileGet: (req, res) => {

        let currentUser = req.user.id;

        User.findOne({_id: currentUser}).then(userData => {

            res.render('userViews/profile',{userData: userData} );
        })
    },

    pictureUpload: (req, res) => {
        let picture = req.files.image;
        let userID = req.user.id;

        if (picture) {
            let pictureName = userID + '_picture';
            let url = './public/images/userProfilePictures/' + pictureName;

            picture.mv(url, err => {
                if (err) {
                    console.log(err.message)
                } else {
                    User.findOne({_id: userID}).then(user => {
                        user.picture = pictureName;
                        user.save();
                        res.redirect('/userViews/profile')
                    })
                }
            })
        }
        }
};
