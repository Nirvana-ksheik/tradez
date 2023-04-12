import React from "react";
import { useState } from "react";
import Item from "../../components/Item";
import SearchBar from "../../components/SearchBar";
import ReactPaginate from 'react-paginate';
import LoadingSpinner from "../../components/LoadingSpinner";
import { useEffect } from "react";

const ItemsList = ({clickEvent, getData, items, orderValue, setOrderValue, orderDirectionValue, setOrderDirectionValue, searchTextValue, setSearchTextValue, isLoading}) => {

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
        return () =>{
            controller.abort();
        };
    }, 
    [items.length, orderValue, orderDirectionValue, searchTextValue, itemOffset, itemsPerPage]);

    return (
    <>
        <SearchBar setOrderValue={setOrderValue} setOrderDirectionValue={setOrderDirectionValue} setSearchTextValue={setSearchTextValue} />
        {
            isLoading === false && 
            <>
                <div className="d-flex flex-wrap col-12 justify-content-start mt-4">
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
            isLoading && <LoadingSpinner />
        }
        <div className="paginated-list-container">
            <ReactPaginate
                breakLabel="..."
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel="< previous"
                renderOnZeroPageCount={null}
                containerClassName="pagination"
                pageLinkClassName="page-num"
                previousLinkClassName="page-num"
                nextLinkClassName="page-num"
                activeLinkClassName="active"
            />
        </div>
    </>
    );
}

export default ItemsList;