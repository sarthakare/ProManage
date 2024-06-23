import { useEffect, useState, useRef } from "react";
import { VscCollapseAll } from "react-icons/vsc";
import { IoAdd } from "react-icons/io5";
import { FaCircle, FaChevronUp, FaChevronDown } from "react-icons/fa6";
import axios from "axios";
import TaskPopup from "./TaskPopup";
import PropTypes from "prop-types";
import "../../styles/ToDo.css";
import TaskMenu from "./TaskMenu";

function ToDo() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [openTaskMenuId, setOpenTaskMenuId] = useState(null);
  const [isAllChecklistsCollapsed, setIsAllChecklistsCollapsed] =
    useState(true); // State for collapsing all checklists
  const taskMenuRef = useRef(null);

  useEffect(() => {
    fetchTasks();
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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

  const handleClickOutside = (event) => {
    if (taskMenuRef.current && !taskMenuRef.current.contains(event.target)) {
      setOpenTaskMenuId(null);
    }
  };

  const toggleTaskMenu = (taskId) => {
    setOpenTaskMenuId(openTaskMenuId === taskId ? null : taskId);
  };

  const collapseAllChecklists = () => {
    setIsAllChecklistsCollapsed(!isAllChecklistsCollapsed);
  };

  return (
    <div className="toDoContainer">
      <div className="containerHeading">
        <div className="containerName">To Do</div>
        <div className="icons">
          <IoAdd onClick={handleAddTask} />
          <VscCollapseAll onClick={collapseAllChecklists} />
        </div>
        <TaskPopup
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          onSave={handleSaveTask}
        />
      </div>
      <div className="toDoTasks">
        {tasks.map((task) => (
          <div key={task._id} ref={taskMenuRef}>
            <TaskCard
              task={task}
              isMenuOpen={openTaskMenuId === task._id}
              toggleMenu={() => toggleTaskMenu(task._id)}
              closeMenu={() => setOpenTaskMenuId(null)}
              isAllChecklistsCollapsed={isAllChecklistsCollapsed}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function TaskCard({
  task,
  isMenuOpen,
  toggleMenu,
  closeMenu,
  isAllChecklistsCollapsed,
}) {
  const [checklist, setChecklist] = useState(task.checklist); // State for task checklist
  const [isChecklistVisible, setIsChecklistVisible] = useState(
    !isAllChecklistsCollapsed
  ); // State for checklist visibility

  useEffect(() => {
    setIsChecklistVisible(!isAllChecklistsCollapsed);
  }, [isAllChecklistsCollapsed]);

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

  const handleCheckboxChange = (index) => {
    const newChecklist = [...checklist];
    newChecklist[index].completed = !newChecklist[index].completed;
    setChecklist(newChecklist);

    // Optionally, you could also update the parent state here if needed
    // For example: onUpdateTask(task._id, newChecklist);
  };

  return (
    <div className="taskCard">
      <div className="taskHeader">
        <div className="priorityTag">
          <FaCircle style={{ color: getPriorityColor() }} />
          &nbsp; {/* Empty space for the dot */}
          {task.priority}
        </div>
        <div className="taskOptions" onClick={toggleMenu}>
          ...
          {isMenuOpen && <TaskMenu closeMenu={closeMenu} />}
        </div>
      </div>
      <h3>{task.name}</h3>
      <div className="checklist">
        <h4 onClick={toggleChecklistVisibility} style={{ cursor: "pointer" }}>
          Checklist ({checklist.filter((item) => item.completed).length}/
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
        completed: PropTypes.bool.isRequired,
      })
    ).isRequired,
    dueDate: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
  }).isRequired,
  isMenuOpen: PropTypes.bool.isRequired,
  toggleMenu: PropTypes.func.isRequired,
  closeMenu: PropTypes.func.isRequired,
  isAllChecklistsCollapsed: PropTypes.bool.isRequired, // Add this prop type
};

export default ToDo;
