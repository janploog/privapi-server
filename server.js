const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");

const items = require("./routes/api/items");
const requests = require("./routes/api/requests");
const clients = require("./routes/api/clients");

//DB Config
const db = require("./config/keys").mongoURI;
const mongoUser = require("./config/keys").mongoUser;
const mongoPw = require("./config/keys").mongoPw;
const mongoAuthDb = require("./config/keys").mongoAuthDb;

const MONGO_CONNECTION, MONGO_PORT;

// Set variables & connections according to environment
const dotenv = require("dotenv");
dotenv.config();
switch (process.env.NODE_ENV) {
	case "production":
}

console.log(`Your port is ${process.env.PORT_LISTEN_DEV}`);

const app = express();

//BodyParser Middleware
app.use(bodyParser.json());

//Preventing CORS Errors
/*var corsOptions = {
	origin: function (origin, callback) {
		var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
		callback(null, isWhitelisted);
	},
};*/
//app.use(cors());

app.use(cors({ origin: true }));
app.set("trust proxy", true);

var session = require("express-session");
//session
app.use(
	session({
		secret: "172dc6b2-d3d6-4cce-9800-1cc8634ff43d",
		resave: false,
		saveUninitialized: true,
		store: memoryStore,
	})
);

var Keycloak = require("keycloak-connect");
const keycloakConfig = require("./config/keycloak.json");

var memoryStore = new session.MemoryStore();
console.log("Initializing Keycloak...");

var keycloak = new Keycloak({ memoryStore }, keycloakConfig);

app.use(keycloak.middleware());

//Connect to MongoDB
mongoose
	.connect(db, {
		authSource: mongoAuthDb,
		user: mongoUser,
		pass: mongoPw,
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("MongoDB connected"))
	.catch((err) => console.log(err));

//Use routes
app.use("/v1.0/items", items);
app.use("/v1.0/requests", requests);
app.use("/v1.0/clients", clients);
//app.use("/api/requests", keycloak.protect(), requests);

app.get("/check-sso", keycloak.checkSso());

//Serve static assets if in production
if (process.env.NODE_ENV === "production") {
	//Set staatic folder
	app.use(express.static("client/build"));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
	});
}

//const port = process.env.PORT || 5000;
const port = process.env.PORT || require("./config/ports").serverPort;

app.use(keycloak.middleware({ logout: "/" }));

app.listen(port, () => console.log(`Server started on port ${port}`));
