import { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import "../styles/Analytics.css";
import { UserContext } from "../../contex/userContext";

function Analytics() {
  const { user } = useContext(UserContext);
  const [taskCounts, setTaskCounts] = useState({
    backlog: 0,
    todo: 0,
    inProgress: 0,
    completed: 0,
    lowPriority: 0,
    moderatePriority: 0,
    highPriority: 0,
    dueDate: 0,
  });

  const calculateTaskCounts = useCallback(
    (tasks) => {
      const counts = {
        backlog: 0,
        todo: 0,
        inProgress: 0,
        completed: 0,
        lowPriority: 0,
        moderatePriority: 0,
        highPriority: 0,
        dueDate: 0,
      };

      tasks
        .filter((task) => task.userId === user.id) // Filter tasks by userId
        .forEach((task) => {
          if (task.currentStatus === "BACKLOG") counts.backlog++;
          if (task.currentStatus === "TODO") counts.todo++;
          if (task.currentStatus === "INPROGRESS") counts.inProgress++;
          if (task.currentStatus === "DONE") counts.completed++;
          if (task.priority === "HIGH PRIORITY") counts.highPriority++;
          if (task.priority === "MODERATE PRIORITY") counts.moderatePriority++;
          if (task.priority === "LOW PRIORITY") counts.lowPriority++;
          if (task.dueDate) counts.dueDate++;
        });

      setTaskCounts(counts);
    },
    [user.id]
  ); // Only re-create the function if user.id changes

  useEffect(() => {
    if (user && user.id) {
      axios
        .get("/alltasksdetails")
        .then((response) => {
          console.log(response.data); // Log the fetched tasks
          calculateTaskCounts(response.data);
        })
        .catch((error) => {
          console.error("There was an error fetching the tasks!", error);
        });
    }
  }, [user, calculateTaskCounts]); // Include calculateTaskCounts as a dependency

  return (
    <div className="analytics">
      <h2>Analytics</h2>
      <div className="task-dashboard">
        <div className="task-list">
          <div className="task-item">
            <span className="task-dot"></span>
            <span className="task-name">Backlog Tasks</span>
            <span className="task-count">{taskCounts.backlog}</span>
          </div>
          <div className="task-item">
            <span className="task-dot"></span>
            <span className="task-name">To-do Tasks</span>
            <span className="task-count">{taskCounts.todo}</span>
          </div>
          <div className="task-item">
            <span className="task-dot"></span>
            <span className="task-name">In-Progress Tasks</span>
            <span className="task-count">{taskCounts.inProgress}</span>
          </div>
          <div className="task-item">
            <span className="task-dot"></span>
            <span className="task-name">Completed Tasks</span>
            <span className="task-count">{taskCounts.completed}</span>
          </div>
        </div>
        <div className="task-list">
          <div className="task-item">
            <span className="task-dot"></span>
            <span className="task-name">Low Priority</span>
            <span className="task-count">{taskCounts.lowPriority}</span>
          </div>
          <div className="task-item">
            <span className="task-dot"></span>
            <span className="task-name">Moderate Priority</span>
            <span className="task-count">{taskCounts.moderatePriority}</span>
          </div>
          <div className="task-item">
            <span className="task-dot"></span>
            <span className="task-name">High Priority</span>
            <span className="task-count">{taskCounts.highPriority}</span>
          </div>
          <div className="task-item">
            <span className="task-dot"></span>
            <span className="task-name">Due Date Tasks</span>
            <span className="task-count">{taskCounts.dueDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
