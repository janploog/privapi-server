const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");

const items = require("./routes/api/items");
const requests = require("./routes/api/requests");
const clients = require("./routes/api/clients");

//ENV Config
// const db = require("./config/keys").mongoURI;
// const mongoUser = require("./config/keys").mongoUser;
// const mongoPw = require("./config/keys").mongoPw;
// const mongoAuthDb = require("./config/keys").mongoAuthDb;
// const keycloakConfig = require("./config/keycloak.json");

const db = "";
const mongoUser = "";
const mongoPw = "";
const mongoAuthDb = "";
const keycloakConfig = "";

// Set variables & connections according to environment
const dotenv = require("dotenv");
dotenv.config();
switch (process.env.NODE_ENV) {
	case "production":
		db = process.env.MONGO_URI_PROD;
		mongoUser = process.env.MONGO_USER_PROD;
		mongoPw = process.env.MONGO_PW_PROD;
		mongoAuthDb = process.env.MONGO_AUTH_DB_PROD;
		keycloakConfig = require("./config/keycloak_PROD.json");
		break;

	case "demo":
		db = process.env.MONGO_URI_DEMO;
		mongoUser = process.env.MONGO_USER_DEMO;
		mongoPw = process.env.MONGO_PW_DEMO;
		mongoAuthDb = process.env.MONGO_AUTH_DB_DEMO;
		keycloakConfig = require("./config/keycloak_DEMO.json");
		break;

	default:
		db = process.env.MONGO_URI_DEV;
		mongoUser = process.env.MONGO_USER_DEV;
		mongoPw = process.env.MONGO_PW_DEV;
		mongoAuthDb = process.env.MONGO_AUTH_DB_DEV;
		keycloakConfig = require("./config/keycloak_DEV.json");
}

consolee.log("ENV:");
console.log("  - mongo:", db);

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
