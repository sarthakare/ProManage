import PropTypes from "prop-types";
import "../../styles/TaskMenu.css";
import axios from "axios";
import { toast } from "react-hot-toast";

function TaskMenu({ taskId }) {
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
      <button onClick={handleDelete} className="delete">
        Delete
      </button>
    </div>
  );
}

TaskMenu.propTypes = {
  taskId: PropTypes.string.isRequired,
};

export default TaskMenu;
