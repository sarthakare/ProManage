import PropTypes from "prop-types";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/TaskPopup.css";
import { FaCircle, FaTrash, FaChevronDown, FaChevronUp } from "react-icons/fa";

function TaskPopupEdit({ taskId, onClose, onSave }) {
  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState("");
  const [checklist, setChecklist] = useState([]);
  const [dueDate, setDueDate] = useState(null);
  const [assignUser, setAssignUser] = useState(null);
  const [assignedUser, setAssignedUser] = useState([]);
  const [allAssignUserList, setAllAssignUserList] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        console.log("Fetching task with ID:", taskId);
        const response = await axios.get(`/gettask/${taskId}`);
        if (response.status === 200) {
          const taskData = response.data;
          setTaskName(taskData.name);
          setPriority(taskData.priority);
          setChecklist(taskData.checklist);
          setAssignedUser(taskData.assignedUsers || []);
          setDueDate(taskData.dueDate ? new Date(taskData.dueDate) : null);
        } else {
          toast.error("Failed to fetch task data.");
        }
        const addedUsers = await axios.get(`/getassignedusers`);
        if (addedUsers.status === 200) {
          setAllAssignUserList(addedUsers.data);
        } else {
          console.error("Failed to fetch assigned users");
        }
      } catch (error) {
        console.error("Error fetching task data:", error);
        toast.error("Error fetching task data.");
      }
    };

    fetchTaskData();
  }, [taskId]);

  const handleChecklistChange = (index, value) => {
    const newChecklist = checklist.map((item, i) =>
      i === index ? { ...item, text: value } : item
    );
    setChecklist(newChecklist);
  };

  const handleCheckboxChange = (index) => {
    const newChecklist = checklist.map((item, i) =>
      i === index ? { ...item, isChecked: !item.isChecked } : item
    );
    setChecklist(newChecklist);
  };

  const handleAddChecklistItem = () => {
    setChecklist([...checklist, { text: "", isChecked: false }]);
  };

  const handleDeleteChecklistItem = (index) => {
    const newChecklist = checklist.filter((item, i) => i !== index);
    setChecklist(newChecklist);
  };

  const handleAssignUser = (user) => {
    setAssignUser(user);
    setAssignedUser(user);
    setDropdownOpen(false);
  };

  const handleSave = async () => {
    // Validation checks
    if (!taskName) {
      toast.error("Task title is required");
      return;
    }
    if (!priority) {
      toast.error("Task priority is required");
      return;
    }
    if (checklist.length === 0) {
      toast.error("Checklist cannot be empty");
      return;
    }
    if (checklist.some((item) => !item.text)) {
      toast.error("All checklist items must have text");
      return;
    }

    const updatedTask = {
      name: taskName,
      priority,
      checklist,
      dueDate,
      assignedUsers: assignUser || assignedUser, // Ensure this includes the correct users
    };

    // Print data before sending it to the database
    console.log("Data to be sent to the database:", updatedTask);

    try {
      const response = await axios.put(`/edittaskdata/${taskId}`, updatedTask);
      if (response.status === 200) {
        onSave(updatedTask); // Call the onSave callback if the API call is successful
        toast.success("Task updated successfully.");
        onClose();
        window.location.reload();
      } else {
        toast.error("Failed to update task.");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Error updating task.");
    }
  };

  const checkedCount = checklist.filter((item) => item.isChecked).length;

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };


  return (
    <div className="popup">
      <div className="popup-content">
        <form className="taskPopupForm">
          <div className="title-group">
            <label className="taskTitle">
              Title <span>*</span>
            </label>
            <input
              className="titleInput"
              type="text"
              id="taskTitle"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Enter Task Title"
            />
          </div>
          <div className="priority-group">
            <label className="priority-label">
              Select Priority <span>*</span>
            </label>
            <div className="priority-options">
              <button
                type="button"
                className={`priority-button ${
                  priority === "HIGH PRIORITY" ? "selected" : ""
                }`}
                onClick={() => setPriority("HIGH PRIORITY")}
              >
                <FaCircle style={{ color: "#FF2473" }} /> HIGH PRIORITY
              </button>
              <button
                type="button"
                className={`priority-button ${
                  priority === "MODERATE PRIORITY" ? "selected" : ""
                }`}
                onClick={() => setPriority("MODERATE PRIORITY")}
              >
                <FaCircle style={{ color: "#18B0FF" }} /> MODERATE PRIORITY
              </button>
              <button
                type="button"
                className={`priority-button ${
                  priority === "LOW PRIORITY" ? "selected" : ""
                }`}
                onClick={() => setPriority("LOW PRIORITY")}
              >
                <FaCircle style={{ color: "#63C05B" }} /> LOW PRIORITY
              </button>
            </div>
          </div>
          {allAssignUserList.length > 0 && (
            <div className="assigned-users-group">
              <label className="assigned-users-label">Assign to</label>
              <div className="dropdown">
                <button
                  type="button"
                  className="dropdown-button"
                  onClick={toggleDropdown}
                >
                  {assignedUser.length > 0 ? assignedUser : "Add an assignee"}
                  {dropdownOpen ? (
                    <FaChevronUp className="dropIcon" />
                  ) : (
                    <FaChevronDown className="dropIcon" />
                  )}
                </button>
                {dropdownOpen && (
                  <ul className="dropdown-list">
                    {allAssignUserList.map((user) => (
                      <li key={user._id} className="dropdown-item">
                        <div className="email-initials">
                          {user.email.slice(0, 2).toUpperCase()}
                        </div>
                        <span>{user.email}</span>
                        <button
                          type="button"
                          className={`assign-button ${
                            assignedUser == user.email ? "assigned" : ""
                          }`}
                          onClick={() => handleAssignUser(user.email)}
                        >
                          {assignedUser == user.email ? "Assigned" : "Assign"}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
          <div className="checklist-group">
            <label className="checklist-label">
              Checklist ({checkedCount}/{checklist.length}) <span>*</span>
            </label>
            <div className="checkListContainer">
              {checklist.map((item, index) => (
                <div key={index} className="checkListItems">
                  <input
                    type="checkbox"
                    className="checklistCheckbox"
                    checked={item.isChecked}
                    onChange={() => handleCheckboxChange(index)}
                  />
                  <input
                    className="checklistInput"
                    type="text"
                    value={item.text}
                    onChange={(e) =>
                      handleChecklistChange(index, e.target.value)
                    }
                    placeholder="Checklist Item"
                  />
                  <button
                    className="deleteButton"
                    type="button"
                    onClick={() => handleDeleteChecklistItem(index)}
                  >
                    <FaTrash style={{ color: "red" }} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="add-new-button"
              onClick={handleAddChecklistItem}
            >
              + Add New
            </button>
          </div>
          <div className="footer-group">
            <DatePicker
              selected={dueDate}
              onChange={(date) => setDueDate(date)}
              dateFormat="yyyy/MM/dd"
              placeholderText="Select Due Date"
              className="due-date-picker"
            />
            <div className="form-actions">
              <button type="button" className="cancel-button" onClick={onClose}>
                Cancel
              </button>
              <button
                type="button"
                className="save-button"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

TaskPopupEdit.propTypes = {
  taskId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default TaskPopupEdit;
