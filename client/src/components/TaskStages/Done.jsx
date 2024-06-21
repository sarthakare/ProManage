import PropTypes from "prop-types";
import { VscCollapseAll } from "react-icons/vsc";
// import "../../styles/TaskStages/Done.css";

function Done({ tasks }) {
  return (
    <div className="doneContainer">
      <div className="containerName">Done</div>
      <div className="icons">
        <VscCollapseAll />
      </div>
      {tasks.map((task) => (
        <div key={task.id}>{task.name}</div>
      ))}
    </div>
  );
}

Done.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Done;
