import PropTypes from "prop-types";
import "../../styles/TaskMenu.css";

function TaskMenu({ onEdit, onShare, onDelete }) {
  return (
    <div className="taskMenu">
      <button onClick={onEdit} >Edit</button>
      <button onClick={onShare}>Share</button>
      <button onClick={onDelete} className="delete">Delete</button>
    </div>
  );
}

TaskMenu.propTypes = {
  onEdit: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default TaskMenu;
