import "../styles/Analytics.css";

function Analytics() {
  return (
    <div>
      <h1>Analytics</h1>
      <div className="task-dashboard">
        <div className="task-list">
          <div className="task-item">
            <span className="task-dot"></span>
            <span className="task-name">Backlog Tasks</span>
            <span className="task-count">16</span>
          </div>
          <div className="task-item">
            <span className="task-dot"></span>
            <span className="task-name">To-do Tasks</span>
            <span className="task-count">14</span>
          </div>
          <div className="task-item">
            <span className="task-dot"></span>
            <span className="task-name">In-Progress Tasks</span>
            <span className="task-count">03</span>
          </div>
          <div className="task-item">
            <span className="task-dot"></span>
            <span className="task-name">Completed Tasks</span>
            <span className="task-count">22</span>
          </div>
        </div>
        <div className="task-list">
          <div className="task-item">
            <span className="task-dot"></span>
            <span className="task-name">Low Priority</span>
            <span className="task-count">16</span>
          </div>
          <div className="task-item">
            <span className="task-dot"></span>
            <span className="task-name">Moderate Priority</span>
            <span className="task-count">14</span>
          </div>
          <div className="task-item">
            <span className="task-dot"></span>
            <span className="task-name">High Priority</span>
            <span className="task-count">03</span>
          </div>
          <div className="task-item">
            <span className="task-dot"></span>
            <span className="task-name">Due Date Tasks</span>
            <span className="task-count">03</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics
