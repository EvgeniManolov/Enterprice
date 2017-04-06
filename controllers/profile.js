/**
 * Created by Lora on 4.4.2017 г..
 */

const User = require('mongoose').model('User');

module.exports = {
	
	profileGet: (req, res) => {
		
		User.findOne({}).then(user => {
			
			res.render('userViews/userProfile',{user: user} );
		})
	}
}