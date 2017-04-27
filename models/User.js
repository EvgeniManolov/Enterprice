const mongoose = require('mongoose');
const encryption = require('./../utilities/encryption');
const Role = require('mongoose').model('Role');
const Occupation = require('mongoose').model('Occupation');

let userSchema = mongoose.Schema(
    {
        email: {type: String, required: true, unique: true},
        passwordHash: {type: String, required: true},
        fullName: {type: String, required: true, unique: true},
        phone: {type: String, default: ''},
        country: {type: String, default: ''},
        address: {type: String, default: ''},
        salt: {type: String, required: true},
        rate: {type: Number, default: 0},
        team: {type: [mongoose.Schema.Types.ObjectId], default: [], ref: 'Team'},
        roles: [{type: mongoose.Schema.Types.ObjectId, ref: 'Role'}],
        occupation: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Occupation'},
        picture: {type: String, default: 'default.png'}
    }
);

userSchema.method ({
   authenticate: function (password) {
       let inputPasswordHash = encryption.hashPassword(password, this.salt);
       let isSamePasswordHash = inputPasswordHash === this.passwordHash;

       return isSamePasswordHash;
   },

});

const User = mongoose.model('User', userSchema);

module.exports = User;

module.exports.seedAdmin = () => {
    let email = 'admin@enterprice.com';

    User.findOne({email: email}).then(admin => {
        if (!admin) {
            Role.findOne({name: 'Admin'}).then(role => {
                let salt = encryption.generateSalt();
                let passwordHash = encryption.hashPassword('123', salt);

                let roles = [];
                roles.push(role.id);

                Occupation.findOne({occupationName: "Admin"}).then(occupation => {
                    let user = {
                        email: email,
                        passwordHash: passwordHash,
                        fullName: 'Admin',
                        salt: salt,
                        roles: roles,
                        occupation: occupation
                    };

                    User.create(user).then(user => {
                        role.users.push(user.id);
                        role.save(err => {
                            if(err) {
                                console.log(err.message)
                            } else {
                                console.log('Admin seeded successfully!')
                            }

                        })
                    })
                })
            })
        }
    })
};



