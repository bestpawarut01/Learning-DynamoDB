const AWS = require("aws-sdk");

const Pet = require("../models/Pet_Collection");
const User = require("../models/User_Collection");

exports.AddPet = async (req, res) => {
	const userPet = new Pet(req.body);

	try {
		await userPet.save();
		res.status(201).send(userPet);
	} catch (error) {
		res.status(400).send(error);
	}
};

exports.DeletePet = async (req, res) => {
	try {
		const _userPetName = await Pet.findOneAndDelete({
			petName: req.params.userPet,
		});

		if (_userPetName == null) {
			return res.status(404).send("Not Found pet user.!");
		}

		res.send(_userPetName);
	} catch (error) {}
};

exports.FindPet = async (req, res) => {
	try {
		const _findUserPet = await Pet.find(
			{
				petName: req.params.userPet,
			},
			{
				_id: 0,
				petName: 1,
				petType: 1,
			}
		);

		if (_findUserPet.length <= 0) {
			res.status(404).send("Not Found pet user.!");
		}
		res.send(_findUserPet);
	} catch (error) {
		res.status(500).send();
	}
};

exports.UpdatePet = async (req, res) => {
	const updates = Object.keys(req.body);

	const allowUpdate = ["petName", "petType"];

	const isvalidaOperation = updates.every((update) => {
		return allowUpdate.includes(update);
	});

	if (!isvalidaOperation) {
		return res.status(400).send({ error: "Invalid operation" });
	}

	try {
		const userPet = await Pet.findOneAndUpdate(
			{ petName: req.params.userPet },
			req.body,
			{
				new: true,
				runValidators: true,
			}
		);
		if (userPet == null) {
			return res.status(404).send("Not Found pet user.!");
		}

		return res.status(200).send(userPet);
	} catch (e) {
		res.status(400).send(e);
	}
};
