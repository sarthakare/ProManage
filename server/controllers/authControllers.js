const User = require('../models/user');
const Task = require("../models/task");
const AssignUser = require("../models/assignUsers");
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
    const { name, priority, checklist, dueDate, assignedUsers } = req.body;

    if (!name || !priority || !checklist) {
      return res.json({ error: "All fields are required" });
    }

    // Ensure each checklist item has the required fields
    const validatedChecklist = checklist.map((item) => ({
      text: item.text,
      isChecked: item.isChecked !== undefined ? item.isChecked : false,
    }));

    // Parse the dueDate string to a Date object
    const parsedDueDate = dueDate
      ? new Date(dueDate.split("/").reverse().join("-"))
      : null;

    if (dueDate && isNaN(parsedDueDate)) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    const newTask = new Task({
      name,
      priority,
      checklist: validatedChecklist,
      dueDate: parsedDueDate,
      userId: decoded.id,
      assignedUsers: assignedUsers || [],
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
    const tasks = await Task.find({ userId: decoded.userId });

    // Ensure checklist items are objects
    const transformedTasks = tasks.map((task) => ({
      ...task._doc,
      checklist: task.checklist.map((item) => ({
        text: item.text,
        isChecked: item.isChecked,
      })),
    }));

    res.json(transformedTasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateChecklist = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { taskId, checklist } = req.body;

    if (!taskId || !Array.isArray(checklist)) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    // Log received checklist for debugging
    console.log("Received checklist:", checklist);

    // Ensure each checklist item has the required fields
    const validatedChecklist = checklist.map((item) => ({
      text: item.text,
      isChecked: item.isChecked === true, // Ensure strict comparison
    }));

    // Log transformed checklist for debugging
    console.log("Transformed checklist:", validatedChecklist);

    const task = await Task.findOneAndUpdate(
      { _id: taskId, userId: decoded.id },
      { checklist: validatedChecklist },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    return res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { taskId, currentStatus } = req.body;

    if (!taskId || !currentStatus) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    // Validate the current status
    const validStatuses = ["TODO", "BACKLOG", "INPROGRESS", "DONE"];
    if (!validStatuses.includes(currentStatus)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const task = await Task.findOne({
      _id: taskId,
      $or: [{ userId: decoded.id }, { assignedUsers: decoded.email }],
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found or unauthorized" });
    }

    task.currentStatus = currentStatus;
    const updatedTask = await task.save();

    return res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const allTasksDetails = async (req, res) => {
  try {
    // Fetch all tasks from the database
    const tasks = await Task.find();

    // Ensure checklist items are objects
    const transformedTasks = tasks.map((task) => ({
      ...task._doc,
      checklist: task.checklist.map((item) => ({
        text: item.text,
        isChecked: item.isChecked,
      })),
    }));

    // Return the transformed task data as a JSON response
    res.json(transformedTasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params; // Extract taskId from URL params

    if (!taskId) {
      return res.status(400).json({ error: "Task ID is required" });
    }

    // Assuming Task is your Mongoose model for tasks
    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getTask = async (req, res) => {
  try {
    const { taskId } = req.params; // Extract taskId from URL params

    if (!taskId) {
      return res.status(400).json({ error: "Task ID is required" });
    }

    // Fetch task from database by taskId
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task); // Return the task as JSON response
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const editTaskData = async (req, res) => {
  const taskId = req.params.id; // Ensure to use 'id' here
  const { name, priority, checklist, dueDate, assignedUsers } = req.body;

  // Log the received data
  console.log("Received data:", {
    name,
    priority,
    checklist,
    dueDate,
    assignedUsers,
  });

  try {
    const { token } = req.cookies;
    if (!token) {
      console.log("Unauthorized: No token provided");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      console.log("Unauthorized: Invalid token");
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Validate input data
    if (!name || !priority || !checklist) {
      console.log("Validation error: Missing required fields");
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find the task by ID and ensure it belongs to the authenticated user
    const task = await Task.findOne({ _id: taskId, userId: decoded.id });
    if (!task) {
      console.log(
        `Task not found: Task ID ${taskId} for user ID ${decoded.id}`
      );
      return res.status(404).json({ message: "Task not found" });
    }

    // Update the task
    task.name = name;
    task.priority = priority;
    task.checklist = checklist;
    task.dueDate = dueDate;
    task.assignedUsers = assignedUsers;

    const updatedTask = await task.save();
    console.log(`Task updated successfully: Task ID ${taskId}`);

    // Send the updated task as a response
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Error updating task" });
  }
};

const viewTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    // Fetch the task without checking for the token
    const task = await Task.findOne({ _id: taskId });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const assignUser = async (req, res) => {
  try {
    const { email } = req.body;
    const newUser = new AssignUser({ email });
    await newUser.save();
    res
      .status(201)
      .json({ message: "User assigned successfully", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const getAssignedUsers = async (req, res) => {
  try {
    const users = await AssignUser.find({});
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
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
  updateChecklist,
  updateTaskStatus,
  allTasksDetails,
  deleteTask,
  getTask,
  editTaskData,
  viewTask,
  assignUser,
  getAssignedUsers,
};
