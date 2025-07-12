const logger = require('./logger');

const requestLogger = (request, response, next) => {
	logger.info('Method:', request.method);
	logger.info('Path:', request.path);
	logger.info('Body:', request.body);
	logger.info('---');
	next();
};

const unknownEnpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' });
};

const badRequest = (request, response) => {
	response.status(400).send({ error: 'bad endpoint :)' });
};

// remember to do error handlers last
const errorHandler = (error, request, response, next) => {
	switch (error.name) {
	case 'CastError': {
		return response.status(400).send({ error: 'malformed id' });
	}
	case 'ValidationError': {
		return response.status(400).json({ error: error.message });
	}
	}
	next(error);
};

module.exports = {
	requestLogger,
	unknownEnpoint,
	badRequest,
	errorHandler
};
