const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

let notes = [
	{ id: "1", content: "HTML is easy", important: true },
	{ id: "2", content: "Browser can execute only JavaScript", important: false },
	{ id: "3", content: "GET and POST are the most important methods of HTTP protocol", important: true },
	{ id: "4", content: "My own note", important: true },
	{ id: "5", content: "More notes", important: true },
]

const generateId = () => {
	const maxId = notes.length > 0
		? Math.max(...notes.map(n => Number(n.id)))
		: 0
	return String(maxId + 1);
}

app.post('/api/notes', (request, response) => {
	const body = request.body;
	
	// handle missing content
	if (!body.content) {
		return response.status(400).json({
			error: 'content missing'
		})
	}

	const note = {
		content: body.content,
		// if important is missign we default to false
		important: body.important || false,
		id: generateId(),
	}

	// append note to notes
	notes = [...notes, note];

	// return json response
	response.json(note);
})

app.get('/', (request, response) => {
	response.send('<h1>Hello World!</h1>');
})

app.get('/api/notes', (request, response) => {
	response.json(notes);
})

app.get('/api/notes/:id', (request, response) => {
	const id = request.params.id;
	const note = notes.find(note => note.id === id);

	if (note) {
		response.json(note);
	} else {
		response.statusMessage = 'You done fucked up boy'
		response.status(404).end();
	}
})

app.delete('/api/notes/:id', (request, response) => {
	const id = request.params.id;
	notes = notes.filter(note => note.id !== id);

	response.status(204).end();
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`server running on port ${PORT}`);
})
