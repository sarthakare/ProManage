import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/TaskPopup.css";
import { FaCircle, FaTrash, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { format } from "date-fns";

function TaskPopup({ isOpen, onClose, onSave }) {
  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState("");
  const [checklist, setChecklist] = useState([]);
  const [dueDate, setDueDate] = useState(null);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchAssignedUsers = async () => {
      try {
        const response = await axios.get("/getassignedusers");
        if (response.status === 200) {
          setAssignedUsers(response.data);
        } else {
          console.error("Failed to fetch assigned users");
        }
      } catch (error) {
        console.error("Error fetching assigned users:", error);
      }
    };

    fetchAssignedUsers();
  }, []);

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

    const formattedDueDate = dueDate ? format(dueDate, "dd/MM/yyyy") : null;

    const newTask = {
      id: new Date().toISOString(),
      name: taskName,
      priority,
      checklist,
      dueDate: formattedDueDate,
      assignedUsers: selectedUser ? [selectedUser.email] : [], // Assign empty array if no user is selected
    };

    // Log the data being saved
    console.log("Task data being saved:", newTask);

    try {
      const response = await axios.post("/savetask", newTask);
      if (response.status === 200) {
        onSave(newTask); // Call the onSave callback if the API call is successful
        setTaskName("");
        setPriority("");
        setChecklist([]);
        setDueDate(null);
        setSelectedUser(null);
        toast.success("Task saved successfully");
        window.location.reload();
      } else {
        // Handle error response from the server
        toast.error(`Error saving task: ${response.data}`);
      }
    } catch (error) {
      toast.error(`Error saving task: ${error.message}`);
    }
  };

  const handleAssignUser = (user) => {
    setSelectedUser(user);
    setDropdownOpen(false); 
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  if (!isOpen) {
    return null;
  }

  const handleAddChecklistItem = () => {
    setChecklist([...checklist, { text: "", isChecked: false }]);
  };

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

  const handleDeleteChecklistItem = (index) => {
    const newChecklist = checklist.filter((item, i) => i !== index);
    setChecklist(newChecklist);
  };

  const checkedCount = checklist.filter((item) => item.isChecked).length;

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
          {assignedUsers.length > 0 && (
            <div className="assigned-users-group">
              <label className="assigned-users-label">Assign to</label>
              <div className="dropdown">
                <button
                  type="button"
                  className="dropdown-button"
                  onClick={toggleDropdown}
                >
                  {selectedUser ? selectedUser.email : "Add an assignee"}
                  {dropdownOpen ? (
                    <FaChevronUp className="dropIcon" />
                  ) : (
                    <FaChevronDown className="dropIcon" />
                  )}
                </button>
                {dropdownOpen && (
                  <ul className="dropdown-list">
                    {assignedUsers.map((user) => (
                      <li key={user._id} className="dropdown-item">
                        <div className="email-initials">
                          {user.email.slice(0, 2).toUpperCase()}
                        </div>
                        <span>{user.email}</span>
                        <button
                          type="button"
                          className={`assign-button ${
                            selectedUser && selectedUser._id === user._id
                              ? "assigned"
                              : ""
                          }`}
                          onClick={() => handleAssignUser(user)}
                        >
                          {selectedUser && selectedUser._id === user._id
                            ? "Assigned"
                            : "Assign"}
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
              dateFormat="dd/MM/yyyy"
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

TaskPopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default TaskPopup;
