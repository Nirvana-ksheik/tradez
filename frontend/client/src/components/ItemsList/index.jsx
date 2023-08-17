import React from "react";
import { useState } from "react";
import Item from "../../components/Item";
import SearchBar from "../../components/SearchBar";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useEffect } from "react";
import NoData from "../../assets/img/no_data_found.png";
import Pagination from "../../components/Pagination";
import "./itemsList.css"

const ItemsList = ({clickEvent, getData, items, orderValue, setOrderValue, orderDirectionValue, setOrderDirectionValue, searchTextValue, setSearchTextValue, statusValue, setStatusValue, categoryValue, setCategoryValue, locationValue, setLocationValue, isLoading, canSeeStatusFilters, currentLanguage, isUserProfile}) => {

    const itemsPerPage = 9;

    const [itemOffset, setItemOffset] = useState(0);
    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    
    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % items.length;
        setItemOffset(newOffset);
    };
    
    useEffect(() => {
        
        const controller = new AbortController();
        getData(controller);
        
        return () =>{
            controller.abort();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderDirectionValue, orderValue, searchTextValue, statusValue, categoryValue]);

    useEffect(()=>{
        const endOffset = itemOffset + itemsPerPage;
        setCurrentItems(items.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(items.length / itemsPerPage));
    }, [itemOffset, items]);

    return (
    <div dir={currentLanguage === "ar" ? "rtl" : "ltr"} className={
        isUserProfile ?
        "d-flex flex-column col-12 align-items-center justify-content-center" :
        "d-flex flex-column col-10 align-items-center justify-content-center"}>

        <SearchBar setOrderValue={setOrderValue} setOrderDirectionValue={setOrderDirectionValue}
                   setSearchTextValue={setSearchTextValue}
                   setStatusValue={canSeeStatusFilters === true ? setStatusValue : undefined}
                   setCategoryValue={setCategoryValue} categoryValue={categoryValue}
                   currentLanguage={currentLanguage}
                   locationValue={locationValue} setLocationValue={setLocationValue} isUserProfile={isUserProfile}
        />
        {
            items != null && items !== undefined && currentItems != null && currentItems !== undefined && currentItems.length > 0 && isLoading === false && 
            <div className="col-12 d-flex flex-wrap justify-content-center align-items-center mt-4">
                {
                    (() => {
                        console.log("current items: ", currentItems);
                        let container = [];                  
                        currentItems && currentItems.forEach((data, index) => {
                            console.log("single data is: ", data);
                            container.push(
                                <div className="col-3 flex-wrap d-flex justify-content-center" key={index}>
                                    <div className="col-10 m-3">
                                        <Item isUserProfile={isUserProfile} currentLanguage={currentLanguage} key={index} data={data} clickEvent={()=> {clickEvent(data._id)}} isAdminPage={true}/>
                                    </div>
                                </div>
                            )
                        })
                        return container;
                    })()
                }
            </div>
        }
        {
            isLoading === true && <LoadingSpinner />
        }
        {
            isLoading === false && (items == null || items === undefined || currentItems == null || currentItems === undefined || currentItems.length === 0) &&
            <div className="d-flex col-12 justify-content-center align-items-center">
                <img src={NoData} className="no-data-img" alt=""/>
            </div>
        }
        <Pagination handlePageClick={handlePageClick} pageCount={pageCount} maxItems={itemsPerPage} currentLanguage={currentLanguage}/>
    </div>
    );
}

export default ItemsList;