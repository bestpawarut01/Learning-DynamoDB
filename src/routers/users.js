const express = require("express");

const {
	AddUser,
	DeleteUser,
	FindUser,
	UpdateUser,
} = require("../control/userControl");

const router = express.Router();

router.post("/", AddUser);
router.delete("/:id", DeleteUser);
router.get("/:id", FindUser);
router.patch("/:id", UpdateUser);

module.exports = router;

// const express = require("express");

// const User = require("../models/User_Collection");
// const Pet = require("../models/Pet_Collection");

// const router = new express.Router();

// // Add User
// router.post("/User-Collection", async (req, res) => {
// 	try {
// 		// แยกข้อมูลที่นำเข้าเป็นแต่ละชื่อตาม Field ใน Collection
// 		const { UserName, firstName, lastName, age, petName, petType } =
// 			req.body;

// 		// หาข้อมูล User ว่ามีการสร้าง User นี้แล้วหรือไหม
// 		const existingUser = await User.findOne({
// 			UserName: req.body.UserName,
// 		});

// 		// ถ้ามีการสร้าง User แล้วจะ response ข้อความว่ามีแล้ว
// 		if (existingUser) {
// 			return res.status(400).send("User already exists");
// 		}

// 		// สร้าง temp ของ pet ใหม่เพื่อใช้ save ข้อมูลใหม่ลงใน pet Collection
// 		const pet = new Pet({ petName, petType });
// 		const savedPet = await pet.save();

// 		// สร้าง temp ข้อมูลเพื่อใช้ save ข้อมูลง collection
// 		const user = new User({
// 			UserName,
// 			firstName,
// 			lastName,
// 			age,
// 			pets: [savedPet._id], // นำข้อมูลที่เป็น temp ก่อนหน้ามาเราแต่ id
// 		});

// 		console.log(pet);

// 		console.log(user);
// 		// Save the User
// 		const savedUser = await user.save();

// 		res.status(201).send(savedUser);
// 	} catch (error) {
// 		res.status(500).send(error.message);
// 	}
// });

// // Delete User
// router.delete("/Del-user/:UserName", async (req, res) => {
// 	try {
// 		const _userName = await User.findOneAndDelete({
// 			UserName: req.params.UserName,
// 		});

// 		if (!_userName) {
// 			return res.status(404).send("Not Found User name!");
// 		}

// 		res.send(_userName);
// 	} catch (error) {}
// });

// // Find & show user
// router.get("/findUser/:UserName", async (req, res) => {
// 	try {
// 		const _findUser = await User.find(
// 			{ UserName: req.params.UserName },
// 			{
// 				_id: 0,
// 				UserName: 0,
// 				__v: 0,
// 			}
// 		);

// 		if (_findUser.length == 0) {
// 			return res.status(404).send("Invalid User Name");
// 		}
// 		res.status(201).send(_findUser);
// 	} catch (error) {
// 		res.status(500).send();
// 	}
// });

// // Update user and check input new update
// router.patch("/Update-user/:UserName", async (req, res) => {
// 	const updates = Object.keys(req.body);

// 	// สร้าง Array ที่เก็บชื่อ Attribute ของ User Collection
// 	const allowUpdate = ["firstName", "lastName", "age", "petName"];

// 	//เช็คว่า input ที่เข้ามามี attribute เหมือนกับใน Database ไหม
// 	const isvalidaOperation = updates.every((update) => {
// 		return allowUpdate.includes(update);
// 	});

// 	if (!isvalidaOperation) {
// 		return res.status(400).send({ error: "Invalid operation" });
// 	}

// 	// นำ User name ที่ได้ไปหาใน collection ถ้ามีจะ Update
// 	try {
// 		const user = await User.findOneAndUpdate(
// 			{ UserName: req.params.UserName },
// 			req.body,
// 			{
// 				new: true,
// 				runValidators: true,
// 			}
// 		);

// 		if (!user) {
// 			return res.status(404).send("Invalid User Name");
// 		}

// 		// สร้าง tempPetName เพื่อเก็บข้อมูลของ User ที่มี pets เป็น id
// 		const tempPetName = user.pets[0];

// 		// นำข้อมูล tempPetName ไปเช็คใน Pet Collection ถ้ามีจะ Update
// 		const findPetName = await Pet.findOneAndUpdate(
// 			{
// 				_id: tempPetName,
// 			},
// 			{ petName: req.body.petName }
// 		);

// 		if (findPetName.length == 0) {
// 			return res.status(404).send("Not Found id pet name!");
// 		}

// 		return res.status(200).send(user);
// 	} catch (e) {
// 		res.status(400).send(e);
// 	}
// });
// module.exports = router;
