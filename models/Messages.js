const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);

const MessageSchema = new mongoose.Schema({
	type: String,
	major: { type: Boolean, default: false },
	date: {
		type: Date,
		default: Date.now,
	},
	user: String,
});

module.exports = message = mongoose.model("message", MessageSchema);
