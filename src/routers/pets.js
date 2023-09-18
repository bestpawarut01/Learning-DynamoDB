const express = require("express");

const {
	AddPet,
	DeletePet,
	FindPet,
	UpdatePet,
} = require("../control/petControl");

const router = express.Router();

router.post("/pet/", AddPet);
router.delete("/pet/:userPet", DeletePet);
router.get("/pet/:userPet", FindPet);
router.patch("/pet/:userPet", UpdatePet);

module.exports = router;

// const express = require("express");

// const Pet = require("../models/Pet_Collection");

// const router = new express.Router();

// // Add pet
// router.post("/Pet-Collection", async (req, res) => {
// 	const userPet = new Pet(req.body);

// 	try {
// 		await userPet.save();
// 		res.status(201).send(userPet);
// 	} catch (error) {
// 		res.status(400).send(error);
// 	}
// });

// // Delete pet
// router.delete("/Del-pet/:petName", async (req, res) => {
// 	try {
// 		const _userPetName = await Pet.findOneAndDelete({
// 			petName: req.params.petName,
// 		});

// 		if (!_userPetName) {
// 			return res.status(404).send();
// 		}

// 		res.send(_userPetName);
// 	} catch (error) {}
// });

// // Find & show user
// router.get("/findPet/:petName", async (req, res) => {
// 	try {
// 		const _findUserPet = await Pet.find(
// 			{
// 				petName: req.params.petName,
// 			},
// 			{
// 				_id: 0,
// 				petName: 1,
// 				petType: 1,
// 			}
// 		);

// 		if (!_findUserPet) {
// 			res.status(404).send();
// 		}
// 		res.send(_findUserPet);
// 	} catch (error) {
// 		res.status(500).send();
// 	}
// });

// // Update user and check input new update
// router.patch("/Update-pet/:petName", async (req, res) => {
// 	const updates = Object.keys(req.body);

// 	const allowUpdate = ["petName", "petType"];

// 	const isvalidaOperation = updates.every((update) => {
// 		return allowUpdate.includes(update);
// 	});

// 	if (!isvalidaOperation) {
// 		return res.status(400).send({ error: "Invalid operation" });
// 	}

// 	try {
// 		const userPet = await Pet.findOneAndUpdate(
// 			{ petName: req.params.petName },
// 			req.body,
// 			{
// 				new: true,
// 				runValidators: true,
// 			}
// 		);
// 		if (!userPet) {
// 			return res.status(404).send();
// 		}

// 		return res.status(200).send(userPet);
// 	} catch (e) {
// 		res.status(400).send(e);
// 	}
// });
// module.exports = router;
