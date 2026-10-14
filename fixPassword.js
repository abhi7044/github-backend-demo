const bcrypt = require("bcryptjs"); // jo tu controller mein use kar raha hai wahi (bcrypt ya bcryptjs)
const { MongoClient } = require("mongodb");
require("dotenv").config();

(async () => {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const users = client.db("githubclone").collection("users");

    const hash = await bcrypt.hash("123456", 10);
    const r = await users.updateOne(
        { email: "teslanikola6@gmail.com" },
        { $set: { password: hash } }
    );
    console.log("Updated:", r.modifiedCount);
    await client.close();
})();