import React from "react";
import "./iconTextButton.css"

const IconTextButton = ({ text, icon, onClick, btnClass}) => {
  return (
    <button className={"d-flex justify-content-between align-items-center button " + btnClass} onClick={onClick}>
      <span className={"button-icon " + btnClass}>{icon}</span>
      <span className="text">{text}</span>
    </button>
  );
};

export default IconTextButton;