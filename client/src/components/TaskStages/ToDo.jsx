import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { VscCollapseAll } from "react-icons/vsc";
import { IoAdd } from "react-icons/io5";
import TaskPopup from "../TaskFunctions/TaskPopup";
import "../../styles/ToDo.css";
import TaskCard from "../TaskFunctions/TaskCard";

function ToDo({ selectedOption, user, tasks }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [openTaskMenuId, setOpenTaskMenuId] = useState(null);
  const [isAllChecklistsCollapsed, setIsAllChecklistsCollapsed] =
    useState(true);
  const taskMenuRef = useRef(null);

  useEffect(() => {
    if (user && tasks.length > 0) {
      const now = new Date();

      const filtered = tasks
        .filter((task) => {
          const taskDate = new Date(task.createdAt);

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
        .filter(
          (task) =>
            task.currentStatus === "TODO" &&
            (task.userId === user.id || task.assignedUsers.includes(user.email))
        )
        .map((task) => ({
          ...task,
          checklist: task.checklist.map((item) => ({
            ...item,
            text: item.text ? item.text : "", // Ensure text is defined
          })),
        }));

      setFilteredTasks(filtered);
      console.log("Tasks filtered successfully:", filtered);
    }
  }, [selectedOption, user, tasks]);

  const handleAddTask = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleSaveTask = () => {
    setIsPopupOpen(false);
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
        {filteredTasks.map((task) => {
          return (
            <div key={task._id} ref={taskMenuRef}>
              <TaskCard
                task={task}
                openTaskMenuId={openTaskMenuId}
                toggleTaskMenu={toggleTaskMenu}
                isAllChecklistsCollapsed={isAllChecklistsCollapsed}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

ToDo.propTypes = {
  selectedOption: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  tasks: PropTypes.array.isRequired,
};

export default ToDo;
