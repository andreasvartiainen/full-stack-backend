// :NOTE:
// test is for creating specific tests
// after is for running after executing testing
// before each runs before all tests, used here to reinitialize the database.
const { test, after, beforeEach } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const assert = require('node:assert');

const app = require('../app');
const helper = require('./test_helper');
const Note = require('../models/note');

// :NOTE:
// supertest package helps testing api calls
// it cretes an internal server automatically
const api = supertest(app);


//:NOTE:
// reinitialize the database before testing
// not working because async fires after "finishing" before each
// so tests start before actually finishing it
//
// beforeEach(async () => {
// 	await Note.deleteMany({});
// 	console.log('cleared');
//
// 	helper.initialNotes.forEach(async (note) => {
// 		let noteObject = new Note(note);
// 		await noteObject.save();
// 		console.log('saved');
// 	});
// 	console.log('done');
// });
//


//:NOTE:
//	way to handle promises by turning all of them into a single
//	promise using Promise.all(promiseArray); call
//
// beforeEach(async () => {
// 	await Note.deleteMany({});
//
// 	// map all notes in the helper to new Note() calls
// 	const noteObjects = helper.initialNotes
// 		.map(note => new Note(note));
// 	// note.save creates promise object
// 	const promiseArray = noteObjects.map(note => note.save());
// 	// wait till all promises are filled
// 	await Promise.all(promiseArray);
// });

//:NOTE:
//	Best way to handle this problem using mongoose built in function
//  insertMany()
//
beforeEach(async() => {
	await Note.deleteMany({});
	await Note.insertMany(helper.initialNotes);
});

test.only('notes are returned as json', async () => {
	await api
		.get('/api/notes')
		.expect(200)
		.expect('Content-Type', /application\/json/);
});

test('a specific note is within the returned notes', async () => {
	const response = await api.get('/api/notes');

	const contents = response.body.map(e => e.content);
	assert.strictEqual(contents.includes('HTML is easy'), true);
});

test('all notes are returned', async () => {
	const response = await api.get('/api/notes');

	assert.strictEqual(response.body.length, helper.initialNotes.length);
});

test('a valid note can be added ', async () => {
	const newNote = {
		content: 'async/await simplifies making async calls',
		important: true,
	};

	// create new note and wait till the function finishes
	await api
		.post('/api/notes')
		.send(newNote)
		.expect(201)
		.expect('Content-Type', /application\/json/);

	const notesAtEnd = await helper.notesInDb();
	assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1);

	const contents = notesAtEnd.map((n) => n.content);
	assert(contents.includes('async/await simplifies making async calls'));
});

test('note without content is not added', async () => {
	const newNote = {
		important: true
	};

	await api
		.post('/api/notes')
		.send(newNote)
		.expect(400);

	const notesAtEnd = await helper.notesInDb();
	assert.strictEqual(notesAtEnd.length, helper.initialNotes.length);
});

test('a specific note can be viewed', async() => {
	const notesAtStart = await helper.notesInDb();
	const noteToView = notesAtStart[0];

	//:NOTE:
	//	don't forget await lol
	const resultNote = await api
		.get(`/api/notes/${noteToView.id}`)
		// .get('/api/notes/1')
		.expect(200)
		.expect('Content-Type', /application\/json/);

	assert.deepStrictEqual(resultNote.body, noteToView);
});

test('a note can be deleted', async() => {
	const notesAtStart = await helper.notesInDb();
	const notesToDelete = notesAtStart[0];

	await api
		.delete(`/api/notes/${notesToDelete.id}`)
		.expect(204);

	const notesAtEnd = await helper.notesInDb();

	const contents = notesAtEnd.map((n) => n.contents);
	assert(!contents.includes(notesToDelete.content));

	assert.strictEqual(notesAtEnd.length, helper.initialNotes.length - 1);
});

after(async () => {
	await mongoose.connection.close();
});
