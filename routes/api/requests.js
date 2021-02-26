const express = require("express");
const router = express.Router();

// data model
const Request = require("../../models/Request");

// @route   GET api/requests
// @desc    Get all reequests
// @access  Public
router.get("/", (req, res) => {
	//console.log(req);
	Request.find()
		.sort({ date: -1 })
		.then((requests) => res.json(requests));
});

// @route   GET api/requests/:id
// @desc    Get a certain request, identified by id
// @access  Public
router.get("/:id", (req, res) => {
	//console.log(req);
	Request.findById(req.params.id)
		.sort({ date: -1 })
		.then((requests) => res.json(requests));
});

// @route   POST api/requests
// @desc    Create an request
// @access  Public
router.post("/", (req, res) => {
	const newRequest = new Request({
		type: req.body.type,
		clientNodeID: req.body.clientNodeID,
		clientNodeReference: req.body.clientNodeReference,
		response: req.body.response,
		currentProcessingStatus: "New",
	});

	newRequest
		.save()
		.then((requests) => {
			res.json(requests);
			console.log("New request added.");
		})
		.catch((err) => {
			req.status(404).json({ success: false });
			console.log("Adding new request failed.");
		});
});

// @route   DELETE api/requests
// @desc    Delete an items
// @access  Public
router.delete("/:id", (req, res) => {
	Item.findById(req.params.id)
		.then((request) => request.remove().then(() => res.json({ Success: true })))
		.catch((err) => res.status(404).json({ success: false }));
});

// @route   POST api/requests/assignee
// @desc    Add existing user as assignee to a request
// @access  Public
router.post("/:id/assignees/", (req, res) => {
	Request.findByIdAndUpdate(
		req.params.id,
		{
			$push: {
				assignees: {
					userId: req.body.userId,
					role: req.body.role,
					assignerId: req.body.assignerId,
				},
			},
		},
		{ safe: true, upsert: true, new: true },
		function (err, model) {
			if (err) {
				res.status(404).json({ success: false });
				console.log("Adding new Assignee to Request failed. ", err);
			} else {
				res
					.status(200)
					.json({
						userId: req.body.userId,
						role: req.body.role,
						assignerId: req.body.assignerId,
					});
				console.log(
					"Added new Assignee (",
					req.body.userId,
					") to Request successfully."
				);
			}
		}
	);
});

// @route   DELETE requests/assignees
// @desc    Delete an assignee from a request
// @access  Public
router.delete("/:id/assignees/:userId", (req, res) => {
	console.log(
		"Deleting Assignee",
		req.params.userId,
		"at request",
		req.params.id
	);
	Request.findByIdAndUpdate(
		req.params.id,
		{
			$pull: {
				assignees: {
					userId: req.params.userId,
				},
			},
		},
		{ safe: true },
		function (err, model) {
			if (err) {
				res.status(404).json({ success: false });
				console.log("Removing Assignee from Request failed. ", err);
			} else {
				res.status(200).json({ success: true });
				console.log("Removing Assignee from Request successful.");
			}
		}
	);
});

module.exports = router;
