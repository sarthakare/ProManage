import PropTypes from "prop-types";
import "../../styles/TaskPopupEdit.css";
import axios from "axios";
import { useEffect, useState } from "react";

function TaskPopupEdit({ taskId, onClose }) {
  const [task, setTask] = useState(null);

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        console.log("Fetching task with ID:", taskId);
        const response = await axios.get(`/gettask/${taskId}`);
        if (response.status === 200) {
          setTask(response.data);
        } else {
          console.error("Failed to fetch task data.");
        }
      } catch (error) {
        console.error("Error fetching task data:", error);
      }
    };

    fetchTaskData();
  }, [taskId]);

  if (!task) {
    return <div>Loading...</div>;
  }

  return (
    <div className="taskPopupEdit">
      <div className="popupContent">
        <h2>Edit Task</h2>
        <table>
          <tbody>
            <tr>
              <td>Name:</td>
              <td>{task.name}</td>
            </tr>
            <tr>
              <td>Priority:</td>
              <td>{task.priority}</td>
            </tr>
            <tr>
              <td>Checklist:</td>
              <td>
                <ul>
                  {task.checklist.map((item, index) => (
                    <li key={index}>
                      {item.text} -{" "}
                      {item.isChecked ? "Completed" : "Incomplete"}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
            <tr>
              <td>Due Date:</td>
              <td>{task.dueDate}</td>
            </tr>
            <tr>
              <td>Created At:</td>
              <td>{task.createdAt}</td>
            </tr>
            <tr>
              <td>Updated At:</td>
              <td>{task.updatedAt}</td>
            </tr>
            <tr>
              <td>Status:</td>
              <td>{task.currentStatus}</td>
            </tr>
          </tbody>
        </table>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

TaskPopupEdit.propTypes = {
  taskId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default TaskPopupEdit;
