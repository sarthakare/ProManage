import { useEffect, useState, useRef, useContext } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { VscCollapseAll } from "react-icons/vsc";
import { IoAdd } from "react-icons/io5";
import axios from "axios";
import TaskPopup from "../TaskFunctions/TaskPopup";
import "../../styles/ToDo.css";
import TaskCard from "../TaskFunctions/TaskCard";
import toast from "react-hot-toast";
import { UserContext } from "../../../contex/userContext.jsx";

function ToDo({ selectedOption }) {
  const { user } = useContext(UserContext);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [openTaskMenuId, setOpenTaskMenuId] = useState(null);
  const [isAllChecklistsCollapsed, setIsAllChecklistsCollapsed] =
    useState(true);
  const taskMenuRef = useRef(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("/savedtasks", {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        const filteredTasks = response.data
          .filter((task) => {
            const taskDate = new Date(task.createdAt);
            const now = new Date();
            if (selectedOption === "today") {
              return (
                taskDate.getDate() === now.getDate() &&
                taskDate.getMonth() === now.getMonth() &&
                taskDate.getFullYear() === now.getFullYear()
              );
            } else if (selectedOption === "thisWeek") {
              const oneWeekAgo = new Date(now);
              oneWeekAgo.setDate(now.getDate() - 7);
              return taskDate >= oneWeekAgo;
            } else if (selectedOption === "thisMonth") {
              const oneMonthAgo = new Date(now);
              oneMonthAgo.setDate(now.getDate() - 30);
              return taskDate >= oneMonthAgo;
            }
            return true;
          })
          .filter((task) => task.currentStatus === "TODO")
          .filter(
            (task) => task.userId === user.id || task.assignedUsers[0] === user.email
          ) // Filter tasks by user ID
          .map((task) => ({
            ...task,
            checklist: task.checklist.map((item) => ({
              ...item,
              text: item.text.text,
            })),
          }));

        setTasks(filteredTasks);
        console.log("Tasks fetched successfully:", filteredTasks);
      } catch (error) {
        toast.error("Error fetching tasks : todo");
        if (error.response) {
          toast.error(`Server response: ${error.response.data}`);
        }
      }
    };

    fetchTasks();
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedOption, user]);

  const handleAddTask = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleSaveTask = () => {
    setIsPopupOpen(false);
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
              openTaskMenuId={openTaskMenuId}
              toggleTaskMenu={toggleTaskMenu}
              isAllChecklistsCollapsed={isAllChecklistsCollapsed}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Add prop types validation
ToDo.propTypes = {
  selectedOption: PropTypes.string.isRequired,
};

export default ToDo;
