import "../styles/Board.css";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../contex/userContext";
import Backlog from "./TaskStages/Backlog";
import ToDo from "./TaskStages/ToDo";
import InProgress from "./TaskStages/Inprogress";
import Done from "./TaskStages/Done";

function Board() {
  const { user } = useContext(UserContext);
  const [currentDate, setCurrentDate] = useState("");
  const [selectedOption, setSelectedOption] = useState("thisWeek");
  const [tasks, setTasks] = useState({
    backlog: [],
    todo: [],
    inProgress: [],
    done: [],
  });

  useEffect(() => {
    const formatDate = (date) => {
      const day = date.getDate();
      const month = date.toLocaleString("default", { month: "short" });
      const year = date.getFullYear();

      let daySuffix;
      if (day === 1 || day === 21 || day === 31) {
        daySuffix = "st";
      } else if (day === 2 || day === 22) {
        daySuffix = "nd";
      } else if (day === 3 || day === 23) {
        daySuffix = "rd";
      } else {
        daySuffix = "th";
      }

      return `${day}${daySuffix} ${month}, ${year}`;
    };

    const today = new Date();
    setCurrentDate(formatDate(today));
  }, []);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const moveTask = (taskId, from, to) => {
    setTasks((prevState) => {
      const taskToMove = prevState[from].find((task) => task.id === taskId);
      return {
        ...prevState,
        [from]: prevState[from].filter((task) => task.id !== taskId),
        [to]: [...prevState[to], taskToMove],
      };
    });
  };

  return (
    <div className="board">
      <div className="headingContainer">
        <div className="topRow">
          <div className="nameContainer">
            {!!user && <h2>Welcome! {user.name}</h2>}
          </div>
          <div className="dateContainer">{currentDate}</div>
        </div>
        <div className="bottomRow">
          <h1>Board Page</h1>
          <div className="ddl">
            <select value={selectedOption} onChange={handleOptionChange}>
              <option value="today">Today</option>
              <option value="thisWeek">This Week</option>
              <option value="thisMonth">This Month</option>
            </select>
          </div>
        </div>
      </div>
      <div className="taskContainer">
        <Backlog tasks={tasks.backlog} moveTask={moveTask} />
        <ToDo tasks={tasks.todo} moveTask={moveTask} />
        <InProgress tasks={tasks.inProgress} moveTask={moveTask} />
        <Done tasks={tasks.done} />
      </div>
    </div>
  );
}

export default Board;
