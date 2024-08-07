const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/authControllers");

// Routes
router.get("/", test);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", getProfile);
router.put("/updateuser", updateUserProfile);
router.post("/savetask", saveTask);
router.get("/savedtasks", savedTasks);
router.put("/updatechecklist", updateChecklist);
router.put("/updatetaskstatus", updateTaskStatus);
router.get("/alltasksdetails", allTasksDetails);
router.delete("/deletetask/:taskId", deleteTask);
router.get("/gettask/:taskId", getTask);
router.put("/edittaskdata/:id", editTaskData);
router.get("/viewtask/:taskId", viewTask);
router.post("/assignUser", assignUser);
router.get("/getassignedusers", getAssignedUsers);

module.exports = router;
