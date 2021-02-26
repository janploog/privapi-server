const mongoose = require("mongoose");

mongoose.set("useCreateIndex", true);

//Create Schema for Requests

const eventSchema = new mongoose.Schema({
	type: String,
	major: { type: Boolean, default: false },
	date: {
		type: Date,
		default: Date.now,
	},
	userLogin: String,
});

const assigneeSchema = new mongoose.Schema({
	role: String,
	userId: String,
	assignerId: String,
	date: {
		type: Date,
		default: Date.now,
	},
});

const payloadSchema = new mongoose.Schema({
	type: String,
	url: String,
	text: String,
	addedById: String,
	date: {
		type: Date,
		default: Date.now,
	},
});

const requestSchema = new mongoose.Schema({
	type: {
		type: String,
		required: true,
	},

	creationDate: {
		type: Date,
		default: Date.now,
	},

	EndpointID: {
		type: String,
		required: true,
	},

	EndpointReference: {
		// Reference for client to recognize requesting user (e.g. UserID in client database)
		type: String,
		required: true,
	},

	response: {
		type: String,
		required: false,
	},

	payload: [payloadSchema],

	currentProcessingStatus: {
		type: String,
		required: false,
	},

	processingStartedDate: {
		type: Date,
		required: false,
	},

	processingFinalizedDate: {
		type: Date,
		required: false,
	},
	assignees: [assigneeSchema],
	products: [String],
	source: {
		type: String,
		required: false,
	},
	archived: {
		type: Boolean,
		required: false,
	},
	events: [eventSchema],
});

module.exports = aRequest = mongoose.model("request", requestSchema);
