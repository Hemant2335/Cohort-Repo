const express = require("express");
require("dotenv").config();
const ConnectToDatabase = require("./db");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const app = express();
const PORT = 3000;
const bcrypt = require("bcrypt");
const jwtsecret = process.env.JWT_SECRET;
const Authentication = require("./middlewares/Middleware")

// Zod Schema

const Schema = zod.object({
  Name: zod.string(),
  Email: zod.string().email(),
  Password: zod.string().min(8),
});

// For body Parsing
app.use(express.json());

// Connecting to Database
ConnectToDatabase();

// Global Catches
app.use((err, req, res, next) => {
  if (err) {
    return res.status(500).send("Internal Error Occured");
  }
  next();
});

// Signup Endpoint , No authentication required
app.post("/signup", async (req, res) => {
  try {
    const Email = req.body.Email;
    const Name = req.body.Name;
    const Password = req.body.Password;
    // Validating the Input
    const respose = Schema.safeParse({
      Email: Email,
      Name: Name,
      Password: Password,
    });
    if (!respose.success) {
      return res.status(400).send("Please Enter Valid Inputs");
    }

    // Check for Existing user
    const isUser = await User.findOne({ Email: Email });
    if (isUser) {
      return res.status(400).send("User Already exists");
    }
    // Creating a Salt
    const salt = await bcrypt.genSalt(10);
    const NewPass = await bcrypt.hash(Password, salt);
    const Newuser = new User({
      Name: Name,
      Email: Email,
      Password: NewPass,
      Salt: salt,
    });
    Newuser.save();
    res.status(200).json({
      Status: "Success",
      Message: "User Created Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("something went Wrong");
  }
});

// Login Endpoint Requires Authentication
app.get("/login", async (req, res) => {
  try {
    const Email = req.body.Email;
    const Password = req.body.Password;
    // Checking if the User Exits
    const user = await User.findOne({ Email: Email });
    if (!user) {
      return res.status(400).send("User not found");
    }

    const salt = user.Salt;
    const HashedPassword = await bcrypt.hash(Password, salt);
    if (HashedPassword === user.Password) {
      const token = jwt.sign({ Email: Email }, jwtsecret);
      return res.status(200).json({
        Status: "Success",
        token: token,
      });
    }
    else
    {
      return res.status(200).json({
        Status: "Failed",
        Msg : "Invalid Username or Password"
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went Wrong");
  }
});


//Other Endpoints

app.get("/test" , Authentication , (req,res)=>{
  res.send("Working");
})

app.listen(PORT, () => {
  console.log(`The Server is Listening on Port ${PORT}`);
});
