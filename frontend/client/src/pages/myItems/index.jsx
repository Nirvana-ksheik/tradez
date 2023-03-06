import { useState, useEffect } from "react";
import axios from "axios";
import Item from "../../components/Item";
import SearchBar from "../../components/SearchBar";
import ReactPaginate from 'react-paginate';
import LoadingSpinner from "../../components/LoadingSpinner";
import "./myItems.css";


const MyItems = ({getCookie}) => {

    const [items, setItems] = useState('');
    const [orderValue, setOrderValue ] = useState(null);
    const [orderDirectionValue, setOrderDirectionValue] = useState(null);
    const [searchTextValue, setSearchTextValue] = useState(null);
    const [itemOffset, setItemOffset] = useState(0);
    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const itemsPerPage = 9;


    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;
        setCurrentItems(items.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(items.length / itemsPerPage));
        const controller = new AbortController();
        getMyItems(controller);
        return ()=>{
            controller.abort();
        };
    }, 
    [items.length, orderValue, orderDirectionValue, searchTextValue, itemOffset, itemsPerPage]);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % items.length;
        setItemOffset(newOffset);
      };

    const getMyItems = (controller) => {
        setIsLoading(true);
        try {
            const token = getCookie();
            let reqInstance = axios.create({
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("token to be sent: ", token);
            const url = "http://localhost:3000/api/item";

            reqInstance.get(
                url, 
                { 
                    params: { 
                        isMine: true,
                        order: orderValue,
                        orderDirection: orderDirectionValue,
                        searchText: searchTextValue
                    },
                    signal: controller.signal
                },
                {
                    withCredentials: true,
                    baseURL: 'http://localhost:3000'
                }
            ).then(({data: res}) => { 
                setItems(res); 
                setIsLoading(false);
            });
        
        } catch (error) { 
            console.log("error: ", error);
        }
    }


	return (
    <>
        <SearchBar setOrderValue={setOrderValue} setOrderDirectionValue={setOrderDirectionValue} setSearchTextValue={setSearchTextValue} />
        {
            isLoading === false && 
            <>
                <div className="d-flex flex-wrap col-10 offset-2 justify-content-start mt-4">
                    {
                        (() => {
                            console.log("current items: ", currentItems);
                            let container = [];
                            {
                                currentItems && currentItems.forEach((data, index) => {
                                console.log("single data is: ", data);
                                container.push(
                                    <Item key={index} data = {data} />
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
};

export default MyItems;
