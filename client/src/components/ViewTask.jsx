import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import logo from "../assets/codesandbox.png";
import "../styles/ViewTask.css";
import { FaCircle } from "react-icons/fa";

function ViewTask() {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`/viewtask/${taskId}`);
        setTask(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching task details.");
        setLoading(false);
      }
    };
    fetchTask();
  }, [taskId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const getPriorityColor = () => {
    switch (task.priority) {
      case "HIGH PRIORITY":
        return "#FF2473";
      case "MODERATE PRIORITY":
        return "#18B0FF";
      case "LOW PRIORITY":
        return "#63C05B";
      default:
        return "gray";
    }
  };

  const checkedCount = task.checklist.filter((item) => item.isChecked).length;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });

    let daySuffix;
    if (day > 3 && day < 21) {
      daySuffix = "th";
    } else {
      switch (day % 10) {
        case 1:
          daySuffix = "st";
          break;
        case 2:
          daySuffix = "nd";
          break;
        case 3:
          daySuffix = "rd";
          break;
        default:
          daySuffix = "th";
      }
    }

    return `${month} ${day}${daySuffix}`;
  };

  return (
    <div className="viewTask">
      <div className="webHeading">
        <img src={logo} alt="logo" />
        <h2>Pro Manage</h2>
      </div>
      {task && (
        <div className="taskView">
          <div className="priority">
            <FaCircle style={{ color: getPriorityColor() }} />
            &nbsp;{task.priority}
          </div>
          <h1 className="taskName">{task.name}</h1>
          <h4>
            Checklist ({checkedCount}/{task.checklist.length})
          </h4>
          <ul>
            {task.checklist.map((item, index) => (
              <li key={index}>
                <input type="checkbox" checked={item.isChecked} readOnly />{" "}
                {item.text}
              </li>
            ))}
          </ul>
          {task.dueDate && (
            <div className="dueDate">
              <b>Due Date</b>{" "}
              <span className="date">{formatDate(task.dueDate)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

ViewTask.propTypes = {
  task: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    priority: PropTypes.string,
    checklist: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string,
        isChecked: PropTypes.bool,
      })
    ),
    dueDate: PropTypes.string,
    userId: PropTypes.string,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
    currentStatus: PropTypes.string,
  }),
};

export default ViewTask;
