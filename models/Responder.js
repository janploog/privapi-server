const mongoose = require("mongoose");

mongoose.set("useCreateIndex", true);

// Create Schema for Responders (who is supposed to respond from the client)
//
// ##################################################################
// ####### Could probably covered better by roles in Keycloak #######
// ##################################################################
//
const RequestSchema = new mongoose.Schema({
	requestType: {
		//Types of Requests:
		///		1) ...
		///		2)  ...
		type: String,
		required: true,
	},

	responseType: {
		//Types of Responders:
		///		1) NotificationOnly
		///		2) Process
		///		3) Review
		type: String,
		required: true,
	},

	userLogin: {
		// Login of User to reference (from )
		type: String,
		required: true,
	},
});
