import React, {useEffect, useState} from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import { itemOrderByLookups, charityOrderByLookups, itemOrderDirectionLookups, ItemStatusLookups } from "lookups";
import { useTranslation } from "react-i18next";
import "./searchBar.css";

const SearchBar = ({setOrderValue, setOrderDirectionValue, setSearchTextValue, setStatusValue, isCharity, currentLanguage}) => {

  const {t} = useTranslation();
  
  return (
    <div className="col-12 d-flex flex-column align-items-center justify-content-center">
      <div className="mt-5 mb-5 d-flex col-12 align-items-center justify-content-center">
          <div className="d-flex col-lg-6 col-10 justify-content-lg-between justify-content-around align-items-lg-baseline">
              <input type="text" id ="search_text" className="col-lg-11 col-11 search-input form-control" onChange={(e) => {
                  setSearchTextValue(e.target.value);
                }} 
                placeholder={t("SearchAnything")}/>
          </div>
      </div>
      <div className="d-flex col-lg-6 col-12 flex-md-row flex-column justify-content-around">
        {
          setOrderValue !== null && setOrderValue !== undefined &&
          <DropDownButton btnName={t("OrderBy")} setDropValue={setOrderValue} list={isCharity ? charityOrderByLookups : itemOrderByLookups} currentLanguage={currentLanguage}/>
        }
        {
          setOrderDirectionValue !== null && setOrderDirectionValue !== undefined &&
          <DropDownButton btnName={t("OrderDirection")} setDropValue={setOrderDirectionValue} list={itemOrderDirectionLookups} currentLanguage={currentLanguage}/>
        }
        {
          setStatusValue !== null && setStatusValue !== undefined &&
          <DropDownButton btnName={t("ItemStatus")} setDropValue={setStatusValue} list={ItemStatusLookups} currentLanguage={currentLanguage}/>
        }
      </div>
    </div>
  );
};

const DropDownButton = ({btnName, setDropValue, list, currentLanguage}) => {

  const {t} = useTranslation();

  const [buttonName, setButtonName] = useState();

  useEffect(()=>{
    setButtonName(t(btnName));

  }, [setButtonName, t, btnName]);

  console.log("list is: ", list);

  return (
    <div dir="ltr" className="d-flex col-lg-2 col-md-3 justify-content-lg-center justify-content-around dropdown-container m-0">
      <Dropdown as={ButtonGroup}>
            <Button variant="none" className="dropDown-button">{ t(buttonName) }</Button>
            <Dropdown.Toggle split  id="dropdown-basic-button" className="dropdown-toggle"/>

            <Dropdown.Menu variant="none" className="dropdown-menu" aria-labelledby="dropdown-basic-button">
              <Dropdown.Item 
                  key={0} 
                  onClick={()=> { 
                    setDropValue(null); 
                    setButtonName(t("NoOption")); 
              }}>
                  {t("NoOption")}
              </Dropdown.Item>
              <Dropdown.Divider />
              {
                list.map((obj, i) => {
                  return (
                    <Dropdown.Item 
                      key={i+1} onClick={()=> {
                        setDropValue(obj.value); 
                        setButtonName(currentLanguage === "ar" ? obj.description_ar : obj.description);
                      }} 
                      href="#">
                        {currentLanguage ==="ar" ? obj.description_ar : obj.description}
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