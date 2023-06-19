import React, {useState} from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import { itemOrderByLookups, itemOrderDirectionLookups, ItemStatusLookups } from "lookups";
import "./searchBar.css";

const SearchBar = ({setOrderValue, setOrderDirectionValue, setSearchTextValue, setStatusValue}) => {

  return (
    <>
      <div className="mt-5 mb-5 d-flex col-12">
          <div className="d-flex col-lg-6 col-10 offset-1 offset-lg-3 justify-content-lg-between justify-content-around align-items-lg-baseline">
              <input type="text" id ="search_text" className="col-lg-11 col-11 search-input form-control" onChange={(e) => {
                  setSearchTextValue(e.target.value);
                }} 
                placeholder="Search anything..."/>
          </div>
      </div>
      <div className="d-flex col-lg-6 col-12 offset-lg-3 flex-md-row flex-column justify-content-around">
        {
          setOrderValue !== null && setOrderValue !== undefined &&
          <DropDownButton btnName={"Order By"} setDropValue={setOrderValue} list={itemOrderByLookups}/>
        }
        {
          setOrderDirectionValue !== null && setOrderDirectionValue !== undefined &&
          <DropDownButton btnName={"Order Direction"} setDropValue={setOrderDirectionValue} list={itemOrderDirectionLookups}/>
        }
        {
          setStatusValue !== null && setStatusValue !== undefined &&
          <DropDownButton btnName={"Item Status"} setDropValue={setStatusValue} list={ItemStatusLookups}/>
        }
      </div>
    </>
  );
};

const DropDownButton = ({btnName, setDropValue, list}) => {

  const [buttonName, setButtonName] = useState(btnName);
  console.log("list is: ", list);
  return (
    <div className="d-flex col-lg-2 col-md-3 justify-content-lg-center justify-content-around dropdown-container m-0">
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