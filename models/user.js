const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true // this ensures the uniqueness of the username
	},
	name: String,
	passwordHash: String,
	notes: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Note'
		}
	]
});

userSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
		// the password has should not be revealed
		delete returnedObject.passwordHash;
	}
});

const User = mongoose.model('User', userSchema);

module.exports = User;
