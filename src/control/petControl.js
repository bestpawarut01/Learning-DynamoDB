const AWS = require("aws-sdk");
require("dotenv");
require("aws-sdk/lib/maintenance_mode_message").suppress = true;

AWS.config.update({
	region: process.env.AWS_DEFAULT_REGION,
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const USER_TABLE = process.env.USER_TABLE;
const PET_TABLE = process.env.PET_TABLE;

const Pet = require("../models/Pet_Collection");
const User = require("../models/User_Collection");

exports.FindAllPet = async (req, res) => {
	try {
		const paramsFindAll = {
			TableName: PET_TABLE,
		};

		const data = await dynamoClient.scan(paramsFindAll).promise();

		res.status(200).json(data);
	} catch (error) {
		res.status(400).send(error);
	}
};

exports.AddPet = async (req, res) => {
	try {
		const params = {
			TableName: PET_TABLE,
		};

		// scan ข้อมูลของ pet ออกมาเก็บ
		const allPet = await dynamoClient.scan(params).promise();

		let noIDpet = 201;
		if (allPet.Items.length > 0) {
			// map id แต่ละตัวออกมาเก็บใน idPet รูปแบบ Array
			const idPet = allPet.Items.map((item) => parseInt(item.id, 10));

			noIDpet = Math.max(...idPet) + 1; // นำข้อมูลใน Array มาหาค่ามากที่สุดและ +1
		}

		const tempData = {
			// สร้างเพื่อเก็บข้อมูลรวมไว้ก่อน ก่อนที่จะนำเข้า Query
			id: noIDpet.toString(),
			petName: req.body.petName,
			petType: req.body.petType,
		};

		const query = {
			// ใน query มีชื่อ table , ข้อมูลรวมไว้ก่อนหน้า
			TableName: PET_TABLE,
			Item: tempData,
		};

		await dynamoClient.put(query).promise();
		console.log(query);
		res.status(200).json({ query });
	} catch (err) {
		res.status(400).send(err);
	}
};

exports.DeletePet = async (req, res) => {
	try {
		const { id } = req.params;

		const params = {
			// params คือการ scan ว่ามีข้อมูลเป็นหรือไม่
			TableName: PET_TABLE,
			FilterExpression: "id = :idValue",
			ExpressionAttributeValues: {
				":idValue": req.params.id,
			},
		};

		const allPet = await dynamoClient.scan(params).promise();

		if (allPet.Items.length > 0) {
			// ถ้ามีจะทำการลบ
			const tempDel = {
				TableName: PET_TABLE,
				Key: { id },
			};

			await dynamoClient.delete(tempDel).promise();
			console.log(tempDel);

			res.status(200).send("Delet pet successfully.");
		} else {
			// ถ้าไม่มีจะแจ้งเตือน
			res.status(404).send("Not Found pet.!");
		}
	} catch (error) {
		res.status(400).send(error);
	}
};

exports.FindPet = async (req, res) => {
	try {
		const params = {
			// params คือการ scan ว่ามีข้อมูลเป็นหรือไม่
			TableName: PET_TABLE,
			FilterExpression: "id = :idValue",
			ExpressionAttributeValues: {
				":idValue": req.params.id,
			},
		};

		const allPet = await dynamoClient.scan(params).promise();

		if (allPet.Items.length > 0) {
			res.status(200).send(allPet.Items);
		} else {
			res.status(404).send("Not Found pet.!");
		}
	} catch (error) {
		res.status(500).send();
	}
};

exports.UpdatePet = async (req, res) => {
	try {
		const { id } = req.params;

		const params = {
			// params คือการ scan ว่ามีข้อมูลเป็นหรือไม่
			TableName: PET_TABLE,
			FilterExpression: "id = :idValue",
			ExpressionAttributeValues: {
				":idValue": req.params.id,
			},
		};

		const allPet = await dynamoClient.scan(params).promise();

		if (allPet.Items.length > 0) {
			const tempUpdate = {
				id: id,
				petName: req.body.petName,
				petType: req.body.petType,
			};

			const queryUpdate = {
				TableName: PET_TABLE,
				Item: tempUpdate,
			};

			await dynamoClient.put(queryUpdate).promise();

			res.status(200).json({ queryUpdate });
		} else {
			res.status(404).send("Not Found pet.!");
		}
		return res.status(200).send();
	} catch (e) {
		res.status(400).send(e);
	}
};
