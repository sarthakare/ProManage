const User = require('../models/user');
const Task = require("../models/task");
const { hashPassword, comparePassword } = require("../helper/auth");
const jwt = require('jsonwebtoken');

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
          jwt.sign({email: user.email, id:user._id, name: user.name }, process.env.JWT_SECRET, {}, (err, token) =>{
            if(err) throw err;
            res.cookie('token', token).json(user);
          })
        } else {
          return res.json({
            error: "Password does not match!",
          });
        }
        
    } catch (error) {
        console.log(error);
    }
}

const getProfile = (req, res) =>{
  const {token} = req.cookies;
  if(token){
    jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) =>{
      if(err) throw err;
      res.json(user);
    })
  }else{
    res.json(null);
  }
}

const updateUserProfile = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const { name, email, oldPassword, newPassword } = req.body;
    if (!name || !email)
      return res.status(400).json({ error: "Name and email are required" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (oldPassword && newPassword) {
      const match = await comparePassword(oldPassword, user.password);
      if (!match)
        return res.status(400).json({ error: "Old password is incorrect" });

      user.password = await hashPassword(newPassword);
    }

    user.name = name;
    user.email = email;
    await user.save();

    return res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const saveTask = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { name, priority, checklist, dueDate } = req.body;

    if (!name || !priority || !checklist || !dueDate) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Ensure each checklist item has the required fields
    const validatedChecklist = checklist.map((item) => ({
      text: item.text,
      isChecked: item.isChecked !== undefined ? item.isChecked : false,
    }));

    const newTask = new Task({
      name,
      priority,
      checklist: validatedChecklist,
      dueDate,
      userId: decoded.id,
    });

    const savedTask = await newTask.save();
    return res.json(savedTask);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const savedTasks = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch tasks from the database for the logged-in user
    const tasks = await Task.find({ userId: decoded.id });

    // Ensure checklist items are objects
    const transformedTasks = tasks.map((task) => ({
      ...task._doc,
      checklist: task.checklist.map((item) => ({
        text: item,
        completed: item.isChecked,
      })),
    }));

    res.json(transformedTasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};



module.exports = {
  test,
  registerUser,
  loginUser,
  getProfile,
  updateUserProfile,
  saveTask,
  savedTasks,
};