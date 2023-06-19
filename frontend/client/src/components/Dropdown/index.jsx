import React from "react";
import "./dropDown.css";

const Dropdown = () => {
  return (
    <>
      <div className="shadow-sm d-flex dropDownList position-absolute col-1">
        <ul className="flex flex-col col-12 align-items-baseline list-group">
          <a href="#edit" className="text-decoration-none text-reset col-12 user-select-none" key={1}>
              <li className="col-12 list-group-item list-group-item-action border-none">
                Edit
              </li>
          </a>
          <a href="#delete" className="text-decoration-none text-reset col-12 user-select-none" key={2}>
              <li className="col-12 list-group-item list-group-item-action">
                Delete
              </li>
          </a>        
        </ul>
      </div>
    </>
  );
};

export default Dropdown;