const mongoose = require('mongoose');
/*const Role = require('mongoose').model('Role');*/
mongoose.Promise = global.Promise;

module.exports = (config) => {
    mongoose.connect(config.connectionString);

    let database = mongoose.connection;
    database.once('open', (error) => {
        if (error) {
            console.log(error);
            return;
        }

        console.log('MongoDB ready!')
});


    require('./../models/Role').initialize();
    require('./../models/User').seedAdmin();
    require('./../models/Project');
    require('./../models/Customer');
    require('./../models/Team');
    require('./../models/Task');

};





