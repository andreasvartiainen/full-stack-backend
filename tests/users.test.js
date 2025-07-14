const bcrypt = require('bcrypt');
const User = require('../models/user');

const { test, describe, after, beforeEach } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const assert = require('node:assert');
const app = require('../app');
const helper = require('./test_helper');

const api = supertest(app);

describe('when there is initially one user in db', () => {
	beforeEach(async () => {
		await User.deleteMany({});

		const passwordHash = await bcrypt.hash('sekret', 10);
		const user = new User({ username: 'root', passwordHash });

		await user.save();
	});

	test('creation succeeds with a fresh username', async () => {
		const usersAtStart = await helper.usersInDb();

		const newUser = {
			username: 'tmivoa',
			name: 'Tomi Vartiainen',
			password: 'salasana',
			notes: []
		};

		await api
			.post('/api/users')
			.send(newUser)
			.expect(201)
			.expect('Content-Type', /application\/json/);

		const usersAtEnd = await helper.usersInDb();
		assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

		const usernames = usersAtEnd.map(u => u.username);
		assert(usernames.includes(newUser.username));
	});

	test('creation fails with proper statuscode and message if username is already taken', async () =>  {
		const usersAtStart = await helper.usersInDb();

		const newUser = {
			username: 'root',
			name: 'superuser',
			password: 'salasana2',
		};

		const result = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/);

		const usersAtEnd = await helper.usersInDb();
		assert(result.body.error.includes('expected `username` to be unique'));

		assert.strictEqual(usersAtEnd.length, usersAtStart.length);
	});
});

// don't forget
after(() => {
	mongoose.connection.close();
});
