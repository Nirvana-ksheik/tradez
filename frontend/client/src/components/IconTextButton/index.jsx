import React from "react";
import "./iconTextButton.css"

const IconTextButton = ({ text, icon, onClick, btnClass}) => {
  return (
    <button className={"d-flex me-1 ms-1 mb-5 justify-content-between align-items-center button " + btnClass} onClick={onClick}>
      <span className={"button-icon " + btnClass}>{icon}</span>
      <span className="text">{text}</span>
    </button>
  );
};

export default IconTextButton;