const mongoose = require("mongoose");
// const validator = require("validator");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	UserName: {
		type: String,
		required: true,
	},
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	age: {
		type: Number,
	},
	pets: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "pet collections",
		},
	],
});

const UserColl = mongoose.model("user collections", UserSchema);

module.exports = UserColl;
