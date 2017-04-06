/**
 * Created by Lora on 4.4.2017 г..
 */

const User = require('mongoose').model('User');

module.exports = {
	
	usersGet: (req, res) => {
		
		User.find({}).then(users => {
			
			/*TO DO: Error message*/
			
			res.render('userViews/allUsers', {users: users});
			
		})
	}
};