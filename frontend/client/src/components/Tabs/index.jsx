import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ItemsList from 'components/ItemsList';
import axios from 'axios';
import { useEffect } from 'react';
import CommentBox from 'components/CommentBox';
import jwt from 'jwt-decode';
import { useTranslation } from 'react-i18next';
import './tabs.css';

function Tabs(props) {

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('products');
  const [items, setItems] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [orderValue, setOrderValue ] = useState(null);
  const [orderDirectionValue, setOrderDirectionValue] = useState(null);
  const [searchTextValue, setSearchTextValue] = useState(null);

  const {t} = useTranslation();

  const handleTabClick = (tabName) => {
      setActiveTab(tabName);
  };

  const clickEvent = (id) => {
      const token = props.getCookie();
      let decodedToken = undefined;

      if(token != null && token !== undefined){
        decodedToken = jwt(token);
        console.log("decodedToken: ", decodedToken);
        console.log("ownerId: ", props.ownerId);
      }

      let loc = '/items/' + id;
      if(decodedToken != null && decodedToken !== undefined && decodedToken.id == props.ownerId){
        loc = '/items/' + props.id + '/tradez/' + id;
      }
      navigate(loc);
      window.location.reload();
  };

  const getData = useCallback(async(controller) => {
    setIsLoading(true);
    try {
        const token = props.getCookie();
        let reqInstance = axios.create({
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log("token to be sent: ", token);
        const url = "http://localhost:3000/api/tradez/" + props.id;

        reqInstance.get(
            url, 
            { 
                signal: controller.signal
            },
            {
                withCredentials: true,
                baseURL: 'http://localhost:3000'
            }
        ).then(({data: res}) => { 
            setItems(res); 
            console.log("itemsssss: ", items);
            setIsLoading(false);
        });
    
    } catch (error) { 
        console.log("error: ", error);
    }
  }, [items, props])

  useEffect(() => {
    const controller = new AbortController();
    getData(controller);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div dir={props.currentLanguage === "ar" ? "rtl" : "ltr"} className="container mt-5 col-12">
      <div className="row justify-content-center col-12">
        <div className="col-12">
          <div className="d-flex col-12 justify-content-between">
            <button
              className={`col-5 btn-tabs-custom border-bottom-2 ${activeTab === 'products' ? 'active-tab' : ''}`}
              onClick={() => handleTabClick('products')}
            >
              {t("Offers")}
            </button>
            <button
              className={`col-5 btn-tabs-custom border-bottom-2 ${activeTab === 'comments' ? 'active-tab' : ''}`}
              onClick={() => handleTabClick('comments')}
            >
              {t("Comments")}
            </button>
          </div>
          <div className="tab-content col-12">
            {activeTab === 'comments' ? (
              <div>
                <CommentBox itemId={props.id} getCookie={props.getCookie} user= {props.user} ownerId={props.ownerId} currentLanguage={props.currentLanguage}/>
              </div>
            ) : (
                items != null && items !== [] && items !== undefined && items !== '' &&
                <div className='col-12 d-flex align-items-center justify-content-center items-list'>
                    <ItemsList 
                        clickEvent={clickEvent} getData={getData} items={items} orderValue={orderValue}
                        setOrderValue={setOrderValue} orderDirectionValue={orderDirectionValue} setOrderDirectionValue={setOrderDirectionValue}
                        searchTextValue={searchTextValue} setSearchTextValue={setSearchTextValue} isLoading={isLoading} currentLanguage={props.currentLanguage}/>            
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tabs;