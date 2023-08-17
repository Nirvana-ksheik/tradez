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
  const [showOffers, setShowOffers] = useState(false);
  const [categoryValue, setCategoryValue] = useState([]);
  const [locationValue, setLocationValue] = useState(null);

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
                params:{
                  orderDirection: orderDirectionValue,
                  searchText: searchTextValue,
                  category: categoryValue,
                  location: locationValue
                },
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
        }).catch((err)=> {
          console.log("error: ", err);
        })
    
    } catch (error) { 
        console.log("error: ", error);
    }
  }, [items, props, orderDirectionValue, searchTextValue, categoryValue, locationValue])

  useEffect(() => {
    const controller = new AbortController();
    getData(controller);

    return () => {
      controller.abort();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationValue]);

  useEffect(()=> {
    const token = props.getCookie();
    const decodedToken = jwt(token);
    if(decodedToken && decodedToken.id == props.ownerId){
      setShowOffers(true);
    }else{
      setShowOffers(false);
      setActiveTab('comments');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setShowOffers, props.ownerId, props.getCookie]);

  return (
    <div dir={props.currentLanguage === "ar" ? "rtl" : "ltr"} className="main_wrapper d-flex justify-content-center align-items-center mt-5 col-12">
      <div className="row justify-content-center align-items-center col-12">
        <div className="col-12">
          <div className="d-flex col-12 justify-content-between">
            {
              showOffers &&
              <button
                className={`col-6 btn-tabs-custom  ${activeTab === 'products' ? 'active-tab' : ''}`}
                onClick={() => handleTabClick('products')}
              >
                {t("Offers")}
              </button>
            }

            <button
              className={`col-6 btn-tabs-custom ${activeTab === 'comments' ? 'active-tab' : ''}`}
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
                <div className='col-12 d-flex align-items-center justify-content-center'>
                    <ItemsList 
                        clickEvent={clickEvent} getData={getData} items={items} orderValue={orderValue}
                        setOrderValue={setOrderValue} orderDirectionValue={orderDirectionValue} setOrderDirectionValue={setOrderDirectionValue}
                        searchTextValue={searchTextValue} setSearchTextValue={setSearchTextValue}
                        isLoading={isLoading} currentLanguage={props.currentLanguage}
                        categoryValue={categoryValue} setCategoryValue={setCategoryValue}
                        locationValue={locationValue} setLocationValue={setLocationValue}
                        isUserProfile={true}
                        />            
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tabs;