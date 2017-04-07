/**
 * Created by Lora on 4.4.2017 г..
 */

const User = require('mongoose').model('User');

module.exports = {
	
	profileGet: (req, res) => {
		
		let currentUser = req.user.id;
		
		User.findOne({_id: currentUser}).then(user => {

			res.render('userViews/userProfile',{user: user} );
		})
	}
}