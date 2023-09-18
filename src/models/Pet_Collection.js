const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PetColl = new Schema({
	petName: {
		type: String,
		required: true,
	},
	petType: {
		type: String,
		required: true,
	},
});

const Pet = mongoose.model("pet collections", PetColl);

module.exports = Pet;
// module.exports = PetColl;
