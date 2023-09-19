const AWS = require("aws-sdk");
require("dotenv").config();
require("aws-sdk/lib/maintenance_mode_message").suppress = true;

AWS.config.update({
  region: process.env.AWS_DEFAULT_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const USER_TABLE = process.env.USER_TABLE;
const PET_TABLE = process.env.PET_TABLE;

exports.AddUser = async (req, res) => {
  try {
    const user = req.body;
    const params = {
      TableName: USER_TABLE,
    };

    // 1. สแกน DynamoDB เพื่อหาข้อมูลที่มีอยู่ในตาราง user
    const existingUser = await dynamoClient.scan(params).promise();

    // 2. หา id ใหม่สำหรับ user
    let newId = 101; // ค่าเริ่มต้นหากไม่มีข้อมูลในตาราง

    if (existingUser.Items.length > 0) {
      const idInUse = existingUser.Items.map((item) => parseInt(item.id, 10));
      newId = Math.max(...idInUse) + 1;
    }

    // 3. ตรวจสอบว่า username ซ้ำหรือไม่
    const usernameInUse = existingUser.Items.some(
      (item) => item.UserName.toLowerCase() === user.UserName.toLowerCase()
    );

    if (usernameInUse) {
      return res.status(400).json({ message: "Username already in use." });
    }

    // 4. กำหนด id ใหม่และเตรียมข้อมูล pet
    user.id = newId.toString();

    // 5. สร้าง id ของ pet
    const paramsPET = {
      TableName: PET_TABLE,
    };
    const reportPet = await dynamoClient.scan(paramsPET).promise();

    let newIdPet = 201;

    if (reportPet.Items.length > 0) {
      const idInPet = reportPet.Items.map((item) => parseInt(item.id, 10));
      newIdPet = Math.max(...idInPet) + 1;
    }

    // 6. สร้างข้อมูลสัตว์เลี้ยง
    const petList = {
      id: newIdPet.toString(),
      petName: user.petName,
    };

    // สร้าง Araray ให้กับรายชื่อ petName เพื่อรอรับการเก็บแบบ Array
    const tempArr = [];
    tempArr.push(newIdPet.toString());

    req.body.petName = tempArr;

    // 7. สร้าง query สำหรับ user
    const query = {
      TableName: USER_TABLE,
      Item: user,
    };

    // 8. สร้าง query สำหรับ pet
    const queryPet = {
      TableName: PET_TABLE,
      Item: petList,
    };

    // 9. อัปโหลดข้อมูลไปยัง DynamoDB ด้วย query ของ user และ pet
    await Promise.all([
      dynamoClient.put(query).promise(),
      dynamoClient.put(queryPet).promise(),
    ]);

    res.status(200).send("Input successfully");
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.DeleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const query = {
      TableName: USER_TABLE,
      Key: { id },
    };

    console.log(query);
    await dynamoClient.delete(query).promise();

    res.status(200).send("Delete Success");
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.FindUser = async (req, res) => {
  try {
    const { id } = req.params;

    const query = {
      TableName: USER_TABLE,
      Key: { id },
    };

    const findUser = await dynamoClient.get(query).promise();

    res.status(201).send(findUser);
  } catch (error) {
    res.status(500).send();
  }
};

exports.UpdateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const params = {
      TableName: USER_TABLE,
      Key: { id },
    };

    // 1. ค้นหาผู้ใช้ด้วย id
    const findUser = await dynamoClient.get(params).promise();

    // ถ้าไม่พบผู้ใช้หรือ object ว่าง
    if (!findUser.Item) {
      return res.status(400).json({ message: "Undefined id or username." });
    }

    // 2. สร้างข้อมูล temp สำหรับเก็บลงใน Table User
    const tempData = {
      id: id,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: req.body.age,
      UserName: findUser.Item.UserName,
      petName: findUser.Item.petName,
    };

    // 3. สร้าง query สำหรับเก็บลงใน Table User
    const query = {
      TableName: USER_TABLE,
      Item: tempData,
    };

    // 4. สร้างข้อมูล temp สำหรับเก็บลงใน Table Pet
    const petList = {
      id: findUser.Item.petName[0],
      petName: req.body.petName,
    };

    // 5. สร้าง query สำหรับเก็บลงใน Table Pet
    const queryPet = {
      TableName: PET_TABLE,
      Item: petList,
    };

    // 6. อัปโหลดข้อมูลไปยัง DynamoDB ด้วย query ของ User และ Pet
    await Promise.all([
      dynamoClient.put(query).promise(),
      dynamoClient.put(queryPet).promise(),
    ]);

    res.status(200).json(tempData);
  } catch (e) {
    res.status(400).send(e);
  }
};
