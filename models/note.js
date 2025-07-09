const mongoose = require('mongoose');

if (process.argv.length < 3) {
	console.log('give password as argument');
}

const url = process.env.MONGODB_URI;

mongoose.get('strictQuery', false);

mongoose.connect(url)
	.then((_) => console.log('connected to MongoDB'))
	.catch((error) => console.log('error connecting to MongoDB', error.message))

const noteSchema = new mongoose.Schema({
	content: String,
	important: Boolean,
});

noteSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	}
})

module.exports = mongoose.model('Note', noteSchema)
