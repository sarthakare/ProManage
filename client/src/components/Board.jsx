import "../styles/Board.css";
import { useContext } from "react";
import { UserContext } from "../../contex/userContext";

function Board() {
  const {user} = useContext(UserContext);
  return (
    <div className="board">
      {!!user && <h2>Welcome! {user.name}</h2>}
      <h1>Board Page</h1>
    </div>
  );
}

export default Board;
