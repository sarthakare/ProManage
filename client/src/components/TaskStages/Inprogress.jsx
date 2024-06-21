import PropTypes from "prop-types";
import { VscCollapseAll } from "react-icons/vsc";
// import "../../styles/TaskStages/InProgress.css";

function InProgress({ tasks, moveTask }) {
  return (
    <div className="inprogressContainer">
      <div className="containerName">In Progress</div>
      <div className="icons">
        <VscCollapseAll />
      </div>
      {tasks.map((task) => (
        <div key={task.id}>
          {task.name}
          <button onClick={() => moveTask(task.id, "inProgress", "done")}>
            Move to Done
          </button>
        </div>
      ))}
    </div>
  );
}

InProgress.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  moveTask: PropTypes.func.isRequired,
};

export default InProgress;
