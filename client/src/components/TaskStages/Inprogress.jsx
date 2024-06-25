import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { VscCollapseAll } from "react-icons/vsc";
import axios from "axios";
import TaskPopup from "../TaskFunctions/TaskPopup";
import "../../styles/ToDo.css";
import TaskCard from "../TaskFunctions/TaskCard";
import toast from "react-hot-toast";

function Inprogress({ selectedOption }) {
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
          .filter((task) => task.currentStatus === "INPROGRESS")
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
        toast.error("Error fetching tasks");
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
  }, [selectedOption]);

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
        <div className="containerName">Inprogress</div>
        <div className="icons">
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
Inprogress.propTypes = {
  selectedOption: PropTypes.string.isRequired,
};

export default Inprogress;
