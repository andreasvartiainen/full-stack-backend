const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const config = require('./utils/config');
const logger = require('./utils/logger');
const notesRouter = require('./controllers/notes');
const usersRouter = require('./controllers/users');
const middleware = require('./utils/middleware');

const app = express();

logger.info('connecting to', config.MONGODB_URI);

mongoose
	.connect(config.MONGODB_URI)
	.then(() => logger.info('connected to MongoDB'))
	.catch((error) => logger.error('error connecting to MongoDB', error.message));


app.use(express.static('dist'));
app.use(express.json());
app.use(morgan('tiny'));

app.use('/api/notes', notesRouter);
app.use('/api/users', usersRouter);

app.use(middleware.unknownEnpoint);
app.use(middleware.badRequest);
app.use(middleware.errorHandler);

module.exports = app;
