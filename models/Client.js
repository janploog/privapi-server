const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);

//Create Schema

const ClientUserSchema = new mongoose.Schema({
	userLogin: {
		type: String,
		required: true,
	},
	userName: String,
	userInitials: String,
	userAvatar: String,
	roleAdmin: { type: Boolean, default: false },
	roleDispatcher: { type: Boolean, default: false },
	roleReviewer: { type: Boolean, default: false },
});

const productResourceSchema = new mongoose.Schema({
	name: { type: String, required: true },
	contactId: String,
});

const ClientProductSchema = new mongoose.Schema({
	name: { type: String, required: true },
	resources: [productResourceSchema],
	InfoReqStandardText: String,
});

const ClientSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	creationDate: {
		type: Date,
		default: Date.now,
	},
	logo: String,
	users: [ClientUserSchema],
	products: [ClientProductSchema],
});

module.exports = Client = mongoose.model("client", ClientSchema);
