import PropTypes from "prop-types";
import "../../styles/TaskMenu.css";
import axios from "axios";
import { toast } from "react-hot-toast";

function TaskMenu({ task }) {
  const taskId = task._id;

  console.log("Received task:", task);

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/deletetask/${taskId}`);
      if (response.status === 200) {
        toast.success("Task deleted successfully.");
        window.location.reload();
      } else {
        toast.error("Failed to delete task.");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Error deleting task.");
    }
  };

  return (
    <div className="taskMenu">
    <button className="edit">Edit</button>
    <button className="share">Share</button>
      <button onClick={handleDelete} className="delete">
        Delete
      </button>
    </div>
  );
}

TaskMenu.propTypes = {
  task: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    checklist: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string.isRequired,
        isChecked: PropTypes.bool,
      })
    ).isRequired,
    dueDate: PropTypes.string,
    userId: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    currentStatus: PropTypes.string.isRequired,
  }).isRequired,
};

export default TaskMenu;
