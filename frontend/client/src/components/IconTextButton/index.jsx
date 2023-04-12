import React from "react";
import "./iconTextButton.css"

const IconTextButton = ({ text, icon, onClick }) => {
  return (
    <button className="d-flex justify-content-between align-items-center button" onClick={onClick}>
      <span className="button-icon">{icon}</span>
      <span className="text">{text}</span>
    </button>
  );
};

export default IconTextButton;