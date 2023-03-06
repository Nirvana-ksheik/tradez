import React, {useState} from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import { itemOrderByLookups, itemOrderDirectionLookups } from "lookups";
import "./searchBar.css";

const SearchBar = ({setOrderValue, setOrderDirectionValue, setSearchTextValue}) => {

  return (
    <>
      <div className="mt-5 mb-5">
          <div className="d-flex col-6 offset-3 flex justify-content-between align-items-baseline">
              <input type="text" id ="search_text" className="col-11 search-input form-control" onChange={(e) => {
                  setSearchTextValue(e.target.value);
                }} 
                placeholder="Search anything..."/>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" 
                  className="col-1 search-icon bi bi-search" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
              </svg>
          </div>
      </div>
      <div className="d-flex col-6 offset-3 flex-row justify-content-around">
        <DropDownButton btnName={"Order By"} setDropValue={setOrderValue} list={itemOrderByLookups}/>
        <DropDownButton btnName={"Order Direction"} setDropValue={setOrderDirectionValue} list={itemOrderDirectionLookups}/>
      </div>
    </>
  );
};

const DropDownButton = ({btnName, setDropValue, list}) => {

  const [buttonName, setButtonName] = useState(btnName);
  console.log("list is: ", list);
  return (
    <div className="d-flex col-2 justify-content-center dropdown-container">
      <Dropdown as={ButtonGroup}>
            <Button variant="none" className="dropDown-button">{ buttonName }</Button>
            <Dropdown.Toggle split  id="dropdown-basic-button" className="dropdown-toggle"/>

            <Dropdown.Menu variant="none" className="dropdown-menu" aria-labelledby="dropdown-basic-button">
              <Dropdown.Item 
                  key={0} 
                  onClick={()=> { 
                    setDropValue(null); 
                    setButtonName("No Option"); 
                  }}>
                  No Option
              </Dropdown.Item>
              <Dropdown.Divider />
              {
                list.map((obj, i) => {
                  return (
                    <Dropdown.Item 
                      key={i+1} onClick={()=> {
                        setDropValue(obj.value); 
                        setButtonName(obj.description);
                      }} 
                      href="#">
                        {obj.description}
                    </Dropdown.Item>
                  )
                })
              }
            </Dropdown.Menu>
      </Dropdown>
      </div>
  );
}

export default SearchBar;