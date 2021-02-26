var session = require("express-session");
var Keycloak = require("keycloak-connect");
const chalk = require("chalk");
const KeycloakConnect = require("keycloak-connect");

let keycloak;

var keycloakConfig = require("../config/keycloak.json");

function initKeycloak() {
	/*if (keycloak) {
		console.log("Already logged in, returning existing KC instance.");
		return keycloak;
	} else {
		console.log("Initializing Keycloak...");
		var memoryStore = new session.MemoryStore();
		keycloak = new Keycloak(
			{
				store: memoryStore,
				secret: "886b02b3-602a-4adb-80f4-d5fba670b484",
				resave: false,
				saveUninitialized: true,
			},
			keycloakConfig
		);
		return keycloak;
	}*/

	console.log("Initializing Keycloak...");
	var memoryStore = new session.MemoryStore();
	keycloak = new Keycloak(
		{
			store: memoryStore,
			secret: "886b02b3-602a-4adb-80f4-d5fba670b484",
			resave: false,
			saveUninitialized: true,
		},
		keycloakConfig
	);
	return keycloak;
}

module.exports = { initKeycloak };
