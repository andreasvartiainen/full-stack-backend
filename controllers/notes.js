const notesRouter = require('express').Router();
const Note = require('../models/note');

notesRouter.post('/', async (request, response, next) => {
	const body = request.body;

	// handle missing content
	if (!body.content) {
		return response.status(400).json({
			error: 'content missing'
		});
	}

	const note = new Note({
		content: body.content,
		important: body.important || false,
	});

	try {
		const savedNote = await note.save();
		response.status(201).json(savedNote);
	} catch (exception) {
		next(exception);
	}
});

notesRouter.get('/', (request, response) => {
	Note.find({}).then(notes => {
		response.json(notes);
	});
});

notesRouter.get('/:id', (request, response, next) => {
	const id = request.params.id;

	Note.findById(id).then(note => {
		if (note)
			response.json(note);
		else
			response.status(404).end();
	}).catch(error => next(error));
});

notesRouter.delete('/:id', (request, response, next) => {
	const id = request.params.id;

	Note.findByIdAndDelete(id)
		.then(() => {
			response.status(204).end();
		})
		.catch(error => next(error));
});

notesRouter.put('/:id', (request, response, next) => {
	const { content, important } = request.body;
	const id = request.params.id;

	Note.findById(id)
		.then(note => {
			if (!note) {
				return response.status(404).end();
			}

			note.content = content;
			note.important = important;

			return note.save().then(updatedNote => {
				response.json(updatedNote);
			});
		})
		.catch(error => next(error));
});

module.exports = notesRouter;
