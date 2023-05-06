import React from "react";
import { useState } from "react";
import Item from "../../components/Item";
import SearchBar from "../../components/SearchBar";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useEffect } from "react";
import NoData from "../../assets/img/no_data_found.png";
import Pagination from "../../components/Pagination";
import "./itemsList.css"

const ItemsList = ({clickEvent, getData, items, orderValue, setOrderValue, orderDirectionValue, setOrderDirectionValue, searchTextValue, setSearchTextValue, statusValue, setStatusValue, isLoading, canSeeStatusFilters}) => {

    const itemsPerPage = 9;

    const [itemOffset, setItemOffset] = useState(0);
    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    
    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % items.length;
        setItemOffset(newOffset);
    };
    
    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;
        setCurrentItems(items.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(items.length / itemsPerPage));
        const controller = new AbortController();
        getData(controller);
        console.log("status filter: ", canSeeStatusFilters);
        return () =>{
            controller.abort();
        };
    }, 
    [items.length, orderValue, orderDirectionValue, searchTextValue, statusValue, itemOffset, itemsPerPage]);

    return (
    <div className="d-flex flex-column col-xl-10 offset-xl-1 justify-content-center">

        <SearchBar setOrderValue={setOrderValue} setOrderDirectionValue={setOrderDirectionValue} setSearchTextValue={setSearchTextValue} setStatusValue={canSeeStatusFilters === true ? setStatusValue : undefined}/>
        {
            items != null && items != undefined && currentItems != null && currentItems != undefined && currentItems.length > 0 && isLoading === false && 
            <>
                <div className="d-flex flex-wrap col-12 justify-content-center mt-4">
                    {
                        (() => {
                            console.log("current items: ", currentItems);
                            let container = [];
                            {
                                currentItems && currentItems.forEach((data, index) => {
                                console.log("single data is: ", data);
                                container.push(
                                    <Item key={index} data={data} clickEvent={()=> {clickEvent(data._id)}}/>
                                )
                                })
                            }
                            return container;
                        })()
                    }
                </div>
            </>
        }
        {
            isLoading === true && <LoadingSpinner />
        }
        {
            isLoading === false && (items == null || items == undefined || currentItems == null || currentItems == undefined || currentItems.length == 0) &&
            <div className="d-flex col-12 justify-content-center align-items-center">
                <img src={NoData} className="no-data-img"/>
            </div>
        }
        <Pagination handlePageClick={handlePageClick} pageCount={pageCount} maxItems={itemsPerPage}/>
    </div>
    );
}

export default ItemsList;