import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { FaCircle, FaChevronUp, FaChevronDown } from "react-icons/fa";
import TaskMenu from "./TaskMenu";
import "../../styles/TaskCard.css";
import axios from "axios";

function TaskCard({ task, isAllChecklistsCollapsed }) {
  const [checklist, setChecklist] = useState(
    task.checklist.map((item) => ({
      ...item,
      isChecked: item.isChecked ?? false,
    }))
  );
  const [isChecklistVisible, setIsChecklistVisible] = useState(
    !isAllChecklistsCollapsed
  );
  const [isTaskMenuOpen, setIsTaskMenuOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(task.currentStatus); // Initialize with task's current status

  const taskOptionsRef = useRef(null);

  useEffect(() => {
    setIsChecklistVisible(!isAllChecklistsCollapsed);
  }, [isAllChecklistsCollapsed]);

  useEffect(() => {
    setChecklist(
      task.checklist.map((item) => ({
        ...item,
        isChecked: item.isChecked ?? false,
      }))
    );
  }, [task]);

  useEffect(() => {
    setCurrentStatus(task.currentStatus); // Sync currentStatus with task prop
  }, [task]);

  const formatDate = (dateString) => {
    const options = { month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getPriorityColor = () => {
    switch (task.priority) {
      case "HIGH PRIORITY":
        return "#FF2473";
      case "MODERATE PRIORITY":
        return "#18B0FF";
      case "LOW PRIORITY":
        return "#63C05B";
      default:
        return "gray";
    }
  };

  const isDeadlineMissed = (dueDate) => {
    const currentDate = new Date();
    const taskDueDate = new Date(dueDate);
    return currentDate > taskDueDate;
  };

  const toggleChecklistVisibility = () => {
    setIsChecklistVisible(!isChecklistVisible);
  };

  const updateChecklistInDatabase = async (updatedChecklist) => {
    try {
      const response = await axios.put("/updatechecklist", {
        taskId: task._id,
        checklist: updatedChecklist,
      });

      if (response.status !== 200) {
        throw new Error("Failed to update checklist");
      }
    } catch (error) {
      console.error("Error updating checklist:", error);
    }
  };

  const handleCheckboxChange = async (index) => {
    const newChecklist = [...checklist];
    newChecklist[index].isChecked = !newChecklist[index].isChecked;
    setChecklist(newChecklist);

    await updateChecklistInDatabase(newChecklist);
  };

  const toggleTaskOptionsMenu = () => {
    setIsTaskMenuOpen(!isTaskMenuOpen);
  };

  const closeTaskMenu = (event) => {
    if (
      taskOptionsRef.current &&
      !taskOptionsRef.current.contains(event.target)
    ) {
      setIsTaskMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeTaskMenu);

    return () => {
      document.removeEventListener("mousedown", closeTaskMenu);
    };
  }, []);

  const updateTaskStatus = async (status) => {
    try {
      const response = await axios.put("/updateTaskStatus", {
        taskId: task._id,
        currentStatus: status,
      });

      if (response.status === 200) {
        setCurrentStatus(status);
        window.location.reload(); // Reload the window after status update
      } else {
        throw new Error("Failed to update task status");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const statuses = [
    { label: "Backlog", value: "BACKLOG" },
    { label: "To Do", value: "TODO" },
    { label: "In Progress", value: "INPROGRESS" },
    { label: "Done", value: "DONE" },
  ];

  const remainingStatuses = statuses.filter(
    (status) => status.value !== currentStatus
  );

  return (
    <div className="taskCard">
      <div className="taskHeader">
        <div className="priorityTag">
          <FaCircle style={{ color: getPriorityColor() }} />
          &nbsp;{task.priority}
        </div>
        <div
          className="taskOptions"
          ref={taskOptionsRef}
          onClick={toggleTaskOptionsMenu}
        >
          ...
        </div>
      </div>
      <h3>{task.name}</h3>
      {isTaskMenuOpen && (
        <div className="taskMenuWrapper">
          <TaskMenu task={task} />
        </div>
      )}
      <div className="checklist">
        <h4 onClick={toggleChecklistVisibility} style={{ cursor: "pointer" }}>
          Checklist ({checklist.filter((item) => item.isChecked).length}/
          {checklist.length}){" "}
          <div className="arrow">
            {isChecklistVisible ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        </h4>
        {isChecklistVisible && (
          <div className="checklistItems">
            {checklist.map((item, index) => (
              <div key={index} className="checklistItem">
                <input
                  type="checkbox"
                  checked={item.isChecked}
                  onChange={() => handleCheckboxChange(index)}
                />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="taskFooter">
        {task.dueDate && (
          <button
            className="dateButton"
            style={{
              backgroundColor: isDeadlineMissed(task.dueDate)
                ? "red"
                : "#dbdbdb",
              color: isDeadlineMissed(task.dueDate) ? "white" : "#5a5a5a",
            }}
          >
            {formatDate(task.dueDate)}
          </button>
        )}
        <div className="statusButtons">
          {remainingStatuses.map((status) => (
            <button
              key={status.value}
              onClick={() => updateTaskStatus(status.value)}
              style={{
                backgroundColor:
                  currentStatus === status.value ? "#cccccc" : "",
              }}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

TaskCard.propTypes = {
  task: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    checklist: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string.isRequired,
        isChecked: PropTypes.bool,
      })
    ).isRequired,
    dueDate: PropTypes.string,
    userId: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    currentStatus: PropTypes.string.isRequired, // Add currentStatus to PropTypes
  }).isRequired,
  isAllChecklistsCollapsed: PropTypes.bool.isRequired,
};

export default TaskCard;
