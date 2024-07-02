const express = require("express");
const router = express.Router();
const cors = require("cors");
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

router.use(
  cors({
    credentials: true,
    origin: "https://pro-manage-app-gamma.vercel.app",
  })
);

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
