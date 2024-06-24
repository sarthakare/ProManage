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
} = require("../controllers/authControllers");

router.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
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

module.exports = router;
