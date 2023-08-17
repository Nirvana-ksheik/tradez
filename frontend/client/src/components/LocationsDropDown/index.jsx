import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import locationsData from '../../locations.json';
import { findLocationDescription } from '../../helpers/locationsHelper';
import "./locationsDropDown.css";

const LocationsDropDown = ({btnName, setDropValue, dropValue, currentLanguage, className, isMine}) => {

    const [options, setOptions] = useState([]);

    // Function to handle checkbox changes
    const handleCheckboxChange = (value) => {
        setDropValue(value);
        const cityName = findLocationDescription(value);
        setButtonName(cityName)
        console.log("location: ", dropValue)
      };

    const {t} = useTranslation();
    const [buttonName, setButtonName] = useState();
  
    useEffect(()=>{
      setButtonName(t(btnName));
    }, [setButtonName, t, btnName]);

    useEffect(() => {
        setOptions(locationsData)
    }, [currentLanguage]);

  return (

    <div dir={currentLanguage === "ar" ? "rtl" : "ltr"} className={className ? "" : 
    isMine ? 
    "d-flex col-lg-3 col-4 justify-content-lg-center justify-content-around dropdown-container m-2":
    "d-flex col-4 justify-content-lg-center justify-content-around dropdown-container m-2"}>
        <Dropdown as={ButtonGroup} className="col-12">
            <Button variant="none" className="dropDown-button col-12">{ t(buttonName) }</Button>
            <Dropdown.Toggle  id="dropdown-basic-button" className="col-3"/>

            <Dropdown.Menu variant="none" className="categories-dropdown-menu" aria-labelledby="dropdown-basic-button">
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
                ( () => {
                    let mainContainer = [];
                    options && options.forEach((obj, i) => {
                        mainContainer.push(
                            <Dropdown.Item 
                            key={i+1}
                            onClick={(e) => {
                                e.stopPropagation();
                              }}
                            href="#">
                                {
                                    obj.cities && 
                                        <Dropdown as={ButtonGroup} className="col-12 subcat-dropdown-btn">
                                            <div variant="none" className="col-9">{currentLanguage ==="ar" ? obj.arabic_description : obj.english_description}</div>
                                            <Dropdown.Toggle id="dropdown-basic-button-subcat" className="col-2 subcat-dropdown-toggle">
                                                <i className="fa-solid fa-angles-right"></i>
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu variant="none" className="dropdown-menu" aria-labelledby="dropdown-basic-button-subcat col-12">
                                            <div className="d-flex flex-column p-2">
                                            {
                                                ( () => {
                                                    let container = [];

                                                    obj.cities.forEach((city, j) => {
                                                        
                                                        container.push(
                                                            <div key={j + "-" + i}>
                                                                <span className={dropValue === city.id ? "subcat-selected" : "subcat-not-selected"} 
                                                                onClick={() => handleCheckboxChange(city.id)}>
                                                                    {currentLanguage ==="ar" ? city.arabic_description : city.english_description}
                                                                </span>
                                                            </div>
                                                        )
                                                    })
                                                    return container;
                                                })()
                                            }
                                            </div>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                }
                            </Dropdown.Item>
                        )
                    })

                    return mainContainer;
                })()
            }
            </Dropdown.Menu>
        </Dropdown>
    </div>

  )
}

export default LocationsDropDown;