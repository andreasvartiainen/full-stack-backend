const Note = require('../models/note');
const User = require('../models/user');

//:NOTE:
//this file is for storing all the test data and functions used in testing

const initialNotes = [
	{
		content: 'HTML is easy',
		important: false, },
	{
		content: 'Browser can execute only JavaScript',
		important: true, },
];

const initialUsers = [
	{
		username: 'Tomiv',
		name: 'Tomi Vartiainen',
		password: 'slasana'
	}
];

const nonExistingId = async() => {
	const note = new Note({ content: 'willremovehtissoon' });
	await note.save();
	await note.deleteOne();

	return note._id.toString();
};

const notesInDb = async () => {
	const notes = await Note.find({});
	return notes.map(note => note.toJSON());
};

const usersInDb = async () => {
	const users = await User.find({});
	return users.map(user => user.toJSON());
};

module.exports = {
	initialNotes, initialUsers, nonExistingId, notesInDb, usersInDb
};
