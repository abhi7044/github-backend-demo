const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient, ReturnDocument } = require("mongodb");
const dotenv = require("dotenv");
var ObjectId = require("mongodb").ObjectId;
const User = require("../models/userModel");

dotenv.config();
const uri = process.env.MONGODB_URI;

let client;

async function connectClient() {
    if(!client){
        client = new MongoClient(uri);
        await client.connect();
    }
}

async function signup(req, res) {
    const username = req.body.username?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        await connectClient();
        const db = client.db("githubclone");
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({
            $or: [{ username }, { email }],
        });
        if (user) {
            return res.status(400).json({ message: "User already exists!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            username,
            password: hashedPassword,
            email,
            repositories: [],
            followedUsers: [],
            starRepos: [],
        };

        const result = await usersCollection.insertOne(newUser);

        const token = jwt.sign({ id: result.insertedId }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
        res.json({ token, userId: result.insertedId });
    } catch (err) {
        console.error("Error during signup : ", err.message);
        res.status(500).send("Server error");
    }
}

async function login(req, res) {
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;

    try {
        await connectClient();
        const db = client.db("githubclone");
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({ email });
console.log("Login email:", JSON.stringify(email), "| user found:", !!user);
if (!user) {
    return res.status(400).json({ message: "Invalid credential!" });
}

        const isMatch = await bcrypt.compare(password, user.password);
console.log("Password match:", isMatch, "| password length:", password.length);
if (!isMatch) {
    return res.status(400).json({ message: "Invalid credential!" });
}

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
        res.json({ token, userId: user._id });
    } catch (err) {
        console.error("Error during login : ", err.message);
        res.status(500).send("Server error!");
    };
};

async function getAllUsers(req, res) {
    try{
        await connectClient();
        const db = client.db("githubclone");
        const usersCollection = db.collection("users");

        const users = await usersCollection.find({}).toArray();
        res.json(users);
    }catch(err){
        console.error("Error during fetching : ", err.message);
        res.status(500).send("Server error!");
    }
};

async function getUserProfile(req, res)  {
    const currentID = req.params.id;
    try{
        await connectClient();
        const db = client.db("githubclone");
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({
            _id: new ObjectId(currentID)
        });

        if (!user){
            return res.status(404).json({message:"user not found!"});
        }
        res.send(user);
    }catch(err){
        console.error("Error during fetching : ", err.message);
        res.status(500).send("Server error!");
    }

    
}

async function updateUserProfile(req, res){
    const currentID = req.params.id;
    const {email, password} = req.body;

     if (!ObjectId.isValid(currentID)) {
        return res.status(400).json({ message: "Invalid user id" });
    }

    try{
        await connectClient();
        const usersCollection = client.db("githubclone").collection("users");
        
        const updateField = {};
        if (email) updateField.email = email;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateField.password = await bcrypt.hash(password, salt);
        }

         if (Object.keys(updateField).length === 0) {
            return res.status(400).json({ message: "Nothing to update" });
        }

        const result = await usersCollection.findOneAndUpdate({
        _id: new ObjectId(currentID) }, 
        { $set: updateField },
        { ReturnDocument: "after" }     
    );  
    if (!result.value) {
        return res.status(404).json({message: "User not found"});
    }
    res.send(result.value);
    }catch(err){
        console.error("Error during updating : ", err.message);
        res.status(500).send("Server error!");
    }
}   

async function deleteUserProfile(req, res) {
    const currentID = req.params.id;
 
    if (!ObjectId.isValid(currentID)) {
        return res.status(400).json({ message: "Invalid user id" });
    }
 
    try {
        await connectClient();
        const usersCollection = client.db("githubclone").collection("users");
 
        const result = await usersCollection.deleteOne({
            _id: new ObjectId(currentID),
        });
 
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }
 
        res.json({ message: "User profile deleted!" });
    } catch (err) {
        console.error("Error during deleting : ", err.message);
        res.status(500).send("Server error!");
    }
}

async function toggleStarRepo(req, res) {
  const { userId, repoId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const index = user.starRepos.findIndex((id) => id.toString() === repoId);
    let starred;
    if (index === -1) {
      user.starRepos.push(repoId);
      starred = true;
    } else {
      user.starRepos.splice(index, 1);
      starred = false;
    }
    await user.save();
    res.json({ starred, starRepos: user.starRepos });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function getStarredRepos(req, res) {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).populate("starRepos");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ starRepos: user.starRepos });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
}


module.exports = {
    getAllUsers,
    signup,
    login,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
    toggleStarRepo,
    getStarredRepos,
}