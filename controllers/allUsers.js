/**
 * Created by Lora on 4.4.2017 г..
 */

const User = require('mongoose').model('User');

module.exports = {
	usersGet: (req, res) => {
		res.render('userViews/allUsers');
	}
}