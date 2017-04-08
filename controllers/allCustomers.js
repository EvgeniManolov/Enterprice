/**
 * Created by User on 08/04/2017.
 */

const Customer = require('mongoose').model('Customer');

module.exports = {
    allCustomersGet:(req,res) =>{
        Customer.find({}).then(customers =>{
            res.render('customer/allCustomersView', {customers:customers});
        })
    }
};
