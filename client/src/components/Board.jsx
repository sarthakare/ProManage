import "../styles/Board.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Backlog from "./TaskStages/Backlog";
import ToDo from "./TaskStages/ToDo";
import InProgress from "./TaskStages/Inprogress";
import Done from "./TaskStages/Done";
import AddPeople from "./TaskFunctions/AddPeople";
import { GoPeople } from "react-icons/go";
import toast from "react-hot-toast";

function Board() {
  const [user, setUser] = useState(null);
  const [currentDate, setCurrentDate] = useState("");
  const [selectedOption, setSelectedOption] = useState("thisWeek");
  const [isAddPeoplePopupOpen, setIsAddPeoplePopupOpen] = useState(false);
  const [tasks, setTasks] = useState([]);

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

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("/profile");
        setUser(response.data);
        console.log("User profile fetched successfully: ", response.data);
      } catch (error) {
        toast.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchTasks = async (userId) => {
      try {
        const response = await axios.get("/alltasksdetails", {
          params: {
            userId,
          },
        });
        setTasks(response.data);
        console.log("Tasks fetched successfully: Board : ", response.data);
      } catch (error) {
        toast.error("Error fetching tasks:", error);
      }
    };

    if (user && user.id) {
      fetchTasks(user.id);
    }
  }, [user]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const openAddPeoplePopup = () => {
    setIsAddPeoplePopupOpen(true);
  };

  const closeAddPeoplePopup = () => {
    setIsAddPeoplePopupOpen(false);
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
          <h1 className="componentHeading">
            Board Page{" "}
            <button className="add-people-button" onClick={openAddPeoplePopup}>
              <GoPeople className="addPeopleIcon" /> Add People
            </button>
          </h1>
          <div className="ddl">
            <select value={selectedOption} onChange={handleOptionChange}>
              <option value="today">Today</option>
              <option value="thisWeek">This Week</option>
              <option value="thisMonth">This Month</option>
            </select>
          </div>
        </div>
      </div>
      {user && (
        <div className="taskContainer">
          <Backlog tasks={tasks} selectedOption={selectedOption} user={user} />
          <ToDo tasks={tasks} selectedOption={selectedOption} user={user} />
          <InProgress
            tasks={tasks}
            selectedOption={selectedOption}
            user={user}
          />
          <Done tasks={tasks} selectedOption={selectedOption} user={user} />
        </div>
      )}
      {isAddPeoplePopupOpen && <AddPeople onClose={closeAddPeoplePopup} />}
    </div>
  );
}

export default Board;
