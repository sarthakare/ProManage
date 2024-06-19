const User = require('../models/user');
const { hashPassword, comparePassword } = require("../helper/auth");

const test = (req, res) =>{
    res.json('test is working');
}

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if name is entered
    if (!name) {
      return res.json({ error: "Name is required!" });
    }

    // Check if email is entered
    if (!email) {
      return res.json({ error: "Email is required!" });
    }

    // Check if email already exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res.json({ error: "Email is already taken!" });
    }

    // Check if password is entered
    if (!password) {
      return res.json({ error: "Password is required!" });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create user in database
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const loginUser = async (req, res) =>{
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
          return res.json({
            error: "No user found",
          });
        }

        // Check password matched
        const match = await comparePassword(password, user.password);
        if (match) {
          return res.json("Password matched");
        } else {
          return res.json({
            error: "Password does not match!",
          });
        }
        
    } catch (error) {
        console.log(error);
    }
}

module.exports ={
    test,
    registerUser,
    loginUser
}