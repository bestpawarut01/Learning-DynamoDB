const express = require("express");

require("dotenv").config();
// require("./database/mongoose");

const UserRouter = require("./src/routers/users");
const PetRouter = require("./src/routers/pets");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(UserRouter);
app.use(PetRouter);

app.listen(port, () => {
	console.log("Server is up on port " + port);
});
