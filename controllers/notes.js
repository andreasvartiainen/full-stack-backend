const notesRouter = require('express').Router();
const Note = require('../models/note');

notesRouter.post('/', async (request, response) => {
	const body = request.body;

	const note = new Note({
		content: body.content,
		important: body.important || false,
	});

	const savedNote = await note.save();
	response.status(201).json(savedNote);
})

notesRouter.get('/', async (request, response, next) => {
	const resultNotes = await Note.find({});
	response.json(resultNotes);
});

notesRouter.get('/:id', async (request, response, next) => {
	const id = request.params.id;

	//:NOTE:
	//	wrapping async calls to try .. catch is a
	//	way to get the errors 
	//	but starting from express 5 this is unnecessary ?? and doesn't
	//	have to or can install the express-async-error library
	const resultNote = await Note.findById(id);

	if (resultNote) {
		response.json(resultNote);
	} else {
		response.status(404).end();
	}
});

notesRouter.delete('/:id', async (request, response, next) => {
	const id = request.params.id;

	await Note.findByIdAndDelete(id);
	response.status(204).end();

});

notesRouter.put('/:id', (request, response, next) => {
	const { content, important } = request.body;
	const id = request.params.id;

	const resultNote = Note.findById(id);
	if (!resultNote) {
		response.status(404).end();
	}

	resultNote.content = content;
	resultNote.important = important;

	resultNote.save();
	response.json(resultNote);
});

module.exports = notesRouter;
