import PropTypes from "prop-types";
import { useState } from "react";
import { VscCollapseAll } from "react-icons/vsc";
import { IoAdd } from "react-icons/io5";
import TaskPopup from "./TaskPopup";
// import "../../styles/TaskStages/ToDo.css";

function ToDo({ tasks, moveTask }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleAddTask = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleSaveTask = (newTask) => {
    // Logic to add the new task to the list
    tasks.push(newTask); // Add the new task to the tasks array
    setIsPopupOpen(false);
  };

  return (
    <div className="toDoContainer">
      <div className="containerName">To Do</div>
      <div className="icons">
        <IoAdd onClick={handleAddTask} />
        <VscCollapseAll />
      </div>
      {tasks.map((task) => (
        <div key={task.id}>
          {task.name}
          <button onClick={() => moveTask(task.id, "todo", "inProgress")}>
            Move to In Progress
          </button>
        </div>
      ))}
      <TaskPopup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        onSave={handleSaveTask}
      />
    </div>
  );
}

ToDo.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  moveTask: PropTypes.func.isRequired,
};

export default ToDo;
