import PropTypes from "prop-types";
import { useState } from "react";
import axios from "axios"; // Make sure you have axios installed
import DatePicker from "react-datepicker"; // Import DatePicker
import "react-datepicker/dist/react-datepicker.css"; // Import DatePicker styles
import "../../styles/TaskPopup.css";

function TaskPopup({ isOpen, onClose, onSave }) {
  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState("");
  const [checklist, setChecklist] = useState([]);
  const [dueDate, setDueDate] = useState(null); // Initialize dueDate as null

  const handleSave = async () => {
    const newTask = {
      id: new Date().toISOString(),
      name: taskName,
      priority, // Directly use the priority state
      checklist,
      dueDate,
    };

    try {
      const response = await axios.post("/savetask", newTask);
      if (response.status === 200) {
        onSave(newTask); // Call the onSave callback if the API call is successful
        setTaskName("");
        setPriority("");
        setChecklist([]);
        setDueDate(null); // Reset dueDate to null
      } else {
        // Handle error response from the server
        console.error("Error saving task:", response.data);
      }
    } catch (error) {
      // Handle any errors that occurred during the request
      console.error("Error saving task:", error);
    }
  };

  if (!isOpen) {
    return null;
  }

  const handleAddChecklistItem = () => {
    setChecklist([...checklist, ""]);
  };

  const handleChecklistChange = (index, value) => {
    const newChecklist = checklist.map((item, i) =>
      i === index ? value : item
    );
    setChecklist(newChecklist);
  };

  const handleDeleteChecklistItem = (index) => {
    const newChecklist = checklist.filter((item, i) => i !== index);
    setChecklist(newChecklist);
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <h2>Create New Task</h2>
        <form>
          <div className="form-group">
            <label htmlFor="taskTitle">
              Title <span>*</span>
            </label>
            <input
              type="text"
              id="taskTitle"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Enter Task Title"
            />
          </div>
          <div className="form-group">
            <label>
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
                HIGH PRIORITY
              </button>
              <button
                type="button"
                className={`priority-button ${
                  priority === "MODERATE PRIORITY" ? "selected" : ""
                }`}
                onClick={() => setPriority("MODERATE PRIORITY")}
              >
                MODERATE PRIORITY
              </button>
              <button
                type="button"
                className={`priority-button ${
                  priority === "LOW PRIORITY" ? "selected" : ""
                }`}
                onClick={() => setPriority("LOW PRIORITY")}
              >
                LOW PRIORITY
              </button>
            </div>
          </div>
          <div className="form-group">
            <label>
              Checklist (0/{checklist.length}) <span>*</span>
            </label>
            {checklist.map((item, index) => (
              <div key={index} className="checkListItems">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleChecklistChange(index, e.target.value)}
                  placeholder="Checklist Item"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteChecklistItem(index)}
                >
                  &times;
                </button>
              </div>
            ))}
            <button
              type="button"
              className="add-new-button"
              onClick={handleAddChecklistItem}
            >
              + Add New
            </button>
          </div>
          <div className="form-group">
            <label>
              Due Date <span>*</span>
            </label>
            <DatePicker
              selected={dueDate}
              onChange={(date) => setDueDate(date)}
              dateFormat="yyyy/MM/dd"
              placeholderText="Select Due Date"
              className="due-date-picker"
            />
          </div>
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="save-button" onClick={handleSave}>
              Save
            </button>
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
