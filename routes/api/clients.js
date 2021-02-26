const express = require("express");
const router = express.Router();

// data model
const model = require("../../models/Client");

// @route   GET api/clients
// @desc    Get all clients
// @access  Public
router.get("/:id", (req, res) => {
	//console.log(req);
	model
		.findById(req.params.id)

		.then((data) => res.json(data))
		.catch((err) => {
			res.status(404).json({ success: false });
			console.log(err);
		});
});

// @route   POST api/clients
// @desc    Create a client
// @access  Public
router.post("/", (req, res) => {
	const users = req.body.users;
	const newClient = new model({
		name: req.body.name,
		users: req.body.users,
		products: req.body.products,
	});
	//console.log(newClient);

	newClient
		.save()
		.then((data) => {
			res.json(data);
			console.log("New client added.");
		})
		.catch((err) => {
			res.status(404).json({ success: false });
			console.log("Adding new client failed.");
		});
});

// @route   POST api/clients/users
// @desc    Create a user within a client
// @access  Public
router.post("/:id/user/", (req, res) => {
	model.findByIdAndUpdate(
		req.params.id,
		{
			$push: {
				users: {
					userLogin: req.body.userLogin,
					userName: req.body.userName,
					userInitials: req.body.userInitials,
					userAvatar: req.body.userAvatar,
					roleAdmin: req.body.roleAdmin,
					roleDispatcher: req.body.roleDispatcher,
					roleReviewer: req.body.roleReviewer,
				},
			},
		},
		{ safe: true, upsert: true, new: true },
		function (err, model) {
			if (err) {
				res.status(404).json({ success: false });
				console.log("Adding new user to client failed. ", err);
			} else {
				res.status(200).json({ success: true });
				console.log("Adding new user to client successful.");
			}
		}
	);
});

// @route   DELETE api/clients
// @desc    Delete a client
// @access  Public
router.delete("/:id/user/:userId", (req, res) => {
	console.log("Deleting user", req.params.userId, "at client", req.params.id);
	model
		.findById(req.params.id)
		.then((client) => {
			console.log("Found Client:", client._id);
			client.users.pull({ _id: req.params.userId });
			client.save();
			res.status(200).json({ success: true });
			console.log("Deleted User");

			//data.remove().then(() => res.json({ Success: true }));
		})
		.catch((err) => {
			console.log("Error deleting User:", req.params.userId);
			console.log(err);
			res.status(404).json({ success: false });
		});
});

module.exports = router;
