const mongoose = require('mongoose');

if (process.argv.length < 3) {
	console.log('give password as argument');
}

const password = process.argv[2];

const url = `mongodb+srv://tomvar98:${password}@cluster.rf51nux.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster`

mongoose.get('strictQuery', false);

mongoose.connect(url);

const noteSchema = new mongoose.Schema({
	content: String,
	important: Boolean,
});

const Note = mongoose.model('Note', noteSchema);

Note.find({}).then(result => {
	result.forEach(note => {
		console.log(note);
	})
	mongoose.connection.close();
})

const note = new Note({
	content: 'HTML is easy',
	important: true,
})

note.save().then(result => {
	console.log('note saved');
	mongoose.connection.close();
})
