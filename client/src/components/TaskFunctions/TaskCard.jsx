import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { FaCircle, FaChevronUp, FaChevronDown } from "react-icons/fa";
import TaskMenu from "./TaskMenu";
import "../../styles/TaskCard.css";
import axios from "axios";

function TaskCard({ task, isAllChecklistsCollapsed }) {
  // Initialize the state with the checklist items from the task prop
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

  const taskOptionsRef = useRef(null);

  useEffect(() => {
    setIsChecklistVisible(!isAllChecklistsCollapsed);
  }, [isAllChecklistsCollapsed]);

  useEffect(() => {
    // Sync the state with the task prop whenever the task changes
    setChecklist(
      task.checklist.map((item) => ({
        ...item,
        isChecked: item.isChecked ?? false,
      }))
    );
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

  const toggleChecklistVisibility = () => {
    setIsChecklistVisible(!isChecklistVisible);
  };

  const updateChecklistInDatabase = async (updatedChecklist) => {
    try {
      console.log(
        "Updating checklist for task:",
        task._id,
        "with data:",
        updatedChecklist
      );
      const response = await axios.put("/updatechecklist", {
        taskId: task._id,
        checklist: updatedChecklist,
      });

      // Log the raw response data from the server
      console.log("Server response:", response);

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

  useEffect(() => {
    console.log("Task data:", task);
  }, [task]);

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
                  checked={item.completed}
                  onChange={() => handleCheckboxChange(index)}
                />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="taskFooter">
        <button className="dateButton">{formatDate(task.dueDate)}</button>
        <div className="statusButtons">
          <button>Backlog</button>
          <button>Progress</button>
          <button>Done</button>
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
    dueDate: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
  }).isRequired,
  isAllChecklistsCollapsed: PropTypes.bool.isRequired,
};

export default TaskCard;
