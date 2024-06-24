import { useEffect, useState, useRef } from "react";
import { VscCollapseAll } from "react-icons/vsc";
import { IoAdd } from "react-icons/io5";
import axios from "axios";
import TaskPopup from "../TaskFunctions/TaskPopup";
import "../../styles/ToDo.css";
import TaskCard from "../TaskFunctions/TaskCard";
import toast from "react-hot-toast";

function ToDo() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [openTaskMenuId, setOpenTaskMenuId] = useState(null);
  const [isAllChecklistsCollapsed, setIsAllChecklistsCollapsed] =
    useState(true);
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
        withCredentials: true,
      });
      const transformedTasks = response.data.map((task) => ({
        ...task,
        checklist: task.checklist.map((item) => ({
          ...item,
          text: item.text.text, // Extracting the string value from the nested object
        })),
      }));
      setTasks(transformedTasks);
      console.log("Tasks fetched successfully:", transformedTasks);
    } catch (error) {
      toast.error("Error fetching tasks");
      if (error.response) {
        toast.error(`Server response: ${error.response.data}`);
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
    fetchTasks();
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

export default ToDo;
