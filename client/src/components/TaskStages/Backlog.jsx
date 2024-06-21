import PropTypes from "prop-types";
import { VscCollapseAll } from "react-icons/vsc";
// import "../../styles/TaskStages/Backlog.css";

function Backlog({ tasks, moveTask }) {
  return (
    <div className="backlogContainer">
      <div className="containerName">Backlog</div>
      <div className="icons">
        <VscCollapseAll />
      </div>
      {tasks.map((task) => (
        <div key={task.id}>
          {task.name}
          <button onClick={() => moveTask(task.id, "backlog", "todo")}>
            Move to To Do
          </button>
        </div>
      ))}
    </div>
  );
}

Backlog.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  moveTask: PropTypes.func.isRequired,
};

export default Backlog;
