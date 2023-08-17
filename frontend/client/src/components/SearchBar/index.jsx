import React, {useEffect, useState} from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import { itemOrderByLookups, charityOrderByLookups, itemOrderDirectionLookups, ItemStatusLookups, postOrderByLookups } from "lookups";
import { useTranslation } from "react-i18next";
import CategoriesDropDown from "../CategoriesDropDown";
import LocationsDropDown from "../LocationsDropDown";
import "./searchBar.css";

const SearchBar = ({setOrderValue, setOrderDirectionValue, setSearchTextValue, setStatusValue, setCategoryValue, categoryValue, locationValue, setLocationValue, isCharity, currentLanguage, isPosts, isUserProfile, isMine}) => {

  const {t} = useTranslation();
  const [hideShowFilters, setHideShowFilters] = useState(false);

  return (
    <div className={isUserProfile ? 
        "col-10 d-flex flex-column align-items-center justify-content-center" :
        " col-8 d-flex flex-column align-items-center justify-content-center"
    }>
      <div className="mt-5 mb-5 d-flex col-12 align-items-center justify-content-center">
          <div className="d-flex col-12 justify-content-center align-items-center">
              <input type="text" id ="search_text" className="col-lg-11 col-10 search-input" onChange={(e) => {
                  setSearchTextValue(e.target.value);
                }} 
                placeholder={t("SearchAnything")}/>
                <i className={!hideShowFilters ? "fa-solid fa-filter-circle-xmark hide-show-filters col-2" : "fa-solid fa-filter hide-show-filters col-2"} onClick={() => { setHideShowFilters(!hideShowFilters) }}></i>
          </div>
      </div>
      {
        hideShowFilters && 
        <div className={isUserProfile ? 
            "d-flex col-8 flex-column justify-content-start align-items-start" :
            "d-flex col-12 col-12 flex-column justify-content-center align-items-between"}>
              <div className="col-12 d-flex flex-column">
                <div className={isUserProfile ? "col-12 d-flex justify-content-center align-items-center" : "col-12 d-flex justify-content-center align-items-center"}>
                  <h3 className="col-2 me-2 ms-2 primary-variant text-center">{t("Sorting")}</h3>
                  <div className={isUserProfile ? "col-10 d-flex justify-content-around" : "col-10 d-flex justify-content-start"}>
                    {
                      setOrderValue !== null && setOrderValue !== undefined &&
                      <DropDownButton btnName={t("OrderBy")} setDropValue={setOrderValue} list={isCharity ? charityOrderByLookups : isPosts ? postOrderByLookups : itemOrderByLookups} currentLanguage={currentLanguage} isMine={isMine}/>
                    }
                    {
                      setOrderDirectionValue !== null && setOrderDirectionValue !== undefined &&
                      <DropDownButton btnName={t("OrderDirection")} setDropValue={setOrderDirectionValue} list={itemOrderDirectionLookups} currentLanguage={currentLanguage} isMine={isMine}/>
                    }
                  </div>
                </div>
              {
                (setStatusValue || setLocationValue || setCategoryValue) &&
                <div className={isUserProfile ? "col-12 d-flex justify-content-center align-items-center" : "col-12 d-flex justify-content-center align-items-center"}>
                  <h3 className="col-2 me-2 ms-2 primary-variant text-center">{t("Filters")}</h3>
                  <div className={isUserProfile ? "col-10 d-flex justify-content-around" : "col-10 d-flex justify-content-start"}>
                    {
                      setStatusValue !== null && setStatusValue !== undefined &&
                      <DropDownButton btnName={t("ItemStatus")} setDropValue={setStatusValue} list={ItemStatusLookups} currentLanguage={currentLanguage} isMine={isMine}/>
                    }
                    {
                      setLocationValue !== null && setLocationValue !== undefined &&
                      <LocationsDropDown btnName={t("Location")} setDropValue={setLocationValue} dropValue={locationValue} currentLanguage={currentLanguage} isMine={isMine}/>
                    }
                    {
                      setCategoryValue !== null && setCategoryValue !== undefined &&
                      <CategoriesDropDown currentLanguage={currentLanguage} btnName={t("Categories")} setDropValue={setCategoryValue} dropValue={categoryValue} isMine={isMine}/>
                    }
                  </div>
                </div>
              } 
              </div>

        </div>
      }

    </div>
  );
};

const DropDownButton = ({btnName, setDropValue, list, currentLanguage, isMine}) => {

  const {t} = useTranslation();
  const [buttonName, setButtonName] = useState();

  useEffect(()=>{
    setButtonName(t(btnName));

  }, [setButtonName, t, btnName]);

  console.log("list is: ", list);

  return (
    <div dir="ltr" className={
        isMine ? 
        "d-flex col-5 justify-content-lg-center justify-content-around dropdown-container m-2":
        "d-flex col-4 justify-content-lg-center justify-content-around dropdown-container m-2"}>
      <Dropdown as={ButtonGroup} className="col-12">
            <Button variant="none" className="dropDown-button col-9">{ t(buttonName) }</Button>
            <Dropdown.Toggle split  id="dropdown-basic-button" className="dropdown-toggle col-3"/>

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