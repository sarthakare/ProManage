import PropTypes from "prop-types";
import { useState } from "react";
import "../../styles/TaskPopup.css";

function TaskPopup({ isOpen, onClose, onSave }) {
  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState("");
  const [checklist, setChecklist] = useState([]);
  const [dueDate, setDueDate] = useState("");

  const handleSave = () => {
    const newTask = {
      id: new Date().toISOString(),
      name: taskName,
      priority,
      checklist,
      dueDate,
    };
    onSave(newTask);
    setTaskName("");
    setPriority("");
    setChecklist([]);
    setDueDate("");
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
                  priority === "high" ? "selected" : ""
                }`}
                onClick={() => setPriority("high")}
              >
                HIGH PRIORITY
              </button>
              <button
                type="button"
                className={`priority-button ${
                  priority === "moderate" ? "selected" : ""
                }`}
                onClick={() => setPriority("moderate")}
              >
                MODERATE PRIORITY
              </button>
              <button
                type="button"
                className={`priority-button ${
                  priority === "low" ? "selected" : ""
                }`}
                onClick={() => setPriority("low")}
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
              <input
                key={index}
                type="text"
                value={item}
                onChange={(e) => handleChecklistChange(index, e.target.value)}
                placeholder="Checklist Item"
              />
            ))}
            <button type="button" onClick={handleAddChecklistItem}>
              + Add New
            </button>
          </div>
          <div className="form-group">
            <button
              type="button"
              onClick={() => alert("Due Date Picker not implemented")}
            >
              Select Due Date
            </button>
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
