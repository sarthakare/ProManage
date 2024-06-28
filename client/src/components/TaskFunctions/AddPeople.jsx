import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "../../styles/AddPeople.css";

function AddPeople({ onClose }) {
  const [email, setEmail] = useState("");
  const [emailAdded, setEmailAdded] = useState(false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleAddEmail = async () => {
    try {
      const response = await axios.post(
        "/assignuser",
        { email }
      );
      if (response.status === 201) {
        console.log("Email added:", response.data.user);
        setEmailAdded(true);
      } else {
        console.error("Failed to add email");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleClose = () => {
    setEmail("");
    setEmailAdded(false);
    onClose();
  };

  return (
    <div className="add-people-popup">
      <div className="addPeople-popup-content">
        {emailAdded ? (
          <>
            <h2>{email} added to board</h2>
            <button className="confirmation-button" onClick={handleClose}>
              Okay, got it!
            </button>
          </>
        ) : (
          <>
            <h2>Add people to the board</h2>
            <input
              type="email"
              placeholder="Enter the email"
              value={email}
              onChange={handleEmailChange}
            />
            <div className="popup-buttons">
              <button className="addPeople-cancel-button" onClick={handleClose}>
                Cancel
              </button>
              <button className="addPeople-add-button" onClick={handleAddEmail}>
                Add Email
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

AddPeople.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default AddPeople;
