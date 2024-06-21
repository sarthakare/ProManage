import "../styles/Board.css";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../contex/userContext";
import { VscCollapseAll } from "react-icons/vsc";
import { IoAdd } from "react-icons/io5";

function Board() {
  const { user } = useContext(UserContext);
  const [currentDate, setCurrentDate] = useState("");
  const [selectedOption, setSelectedOption] = useState("thisWeek");

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
        <div className="backlogContainer">
          <div className="containerName">Backlog</div>
          <div className="icons">
            <VscCollapseAll />
          </div>
        </div>
        <div className="toDoContainer">
          <div className="containerName">To Do</div>
          <div className="icons">
            <IoAdd />{" "}
            <VscCollapseAll />
          </div>
        </div>
        <div className="inprocessContainer">
          <div className="containerName">Inprocess</div>
          <div className="icons">
            <VscCollapseAll />
          </div>
        </div>
        <div className="doneContainer">
          <div className="containerName">Done</div>
          <div className="icons">
            <VscCollapseAll />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Board;
