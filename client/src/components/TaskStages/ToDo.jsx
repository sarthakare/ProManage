import { useEffect, useState } from "react";
import { VscCollapseAll } from "react-icons/vsc";
import { IoAdd } from "react-icons/io5";
import { FaCircle } from "react-icons/fa6";
import TaskPopup from "./TaskPopup";
import axios from "axios";
import PropTypes from "prop-types";
import "../../styles/ToDo.css";

function ToDo() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("/savedtasks", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Include cookies in the request
      });
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      if (error.response) {
        console.error("Server response:", error.response.data);
      }
    }
  };

  const handleAddTask = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleSaveTask = () => {
    setIsPopupOpen(false);
    fetchTasks(); // Fetch tasks again to update the list
  };

  return (
    <div className="toDoContainer">
      <div className="containerHeading">
        <div className="containerName">To Do</div>
        <div className="icons">
          <IoAdd onClick={handleAddTask} />
          <VscCollapseAll />
        </div>
        <TaskPopup
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          onSave={handleSaveTask}
        />
      </div>
      <div className="toDoTasks">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} />
        ))}
      </div>
    </div>
  );
}

function TaskCard({ task }) {
  
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

  return (
    <div className="taskCard">
      <div className="taskHeader">
        <div className="priorityTag">
          <FaCircle style={{ color: getPriorityColor() }} />
          &nbsp; {/* Empty space for the dot */}
          {task.priority}
        </div>
        <div className="taskOptions">...</div>
      </div>
      <h3>{task.name}</h3>
      <div className="checklist">
        <h4>
          Checklist ({task.checklist.filter((item) => item.completed).length}/
          {task.checklist.length})
        </h4>
        <div className="checklistItems">
          {task.checklist.map((item, index) => (
            <div key={index} className="checklistItem">
              <input type="checkbox" checked={item.completed} readOnly />
              <span>{item.text}</span>
            </div>
          ))}
        </div>
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
        completed: PropTypes.bool.isRequired,
      })
    ).isRequired,
    dueDate: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
  }).isRequired,
};

export default ToDo;
