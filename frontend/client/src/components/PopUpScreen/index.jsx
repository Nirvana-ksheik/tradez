import { useState, useEffect } from "react";
import axios from "axios";
import Item from "../../components/Item";
import SearchBar from "../../components/SearchBar";
import LoadingSpinner from "../../components/LoadingSpinner";
import "./popupScreen.css";
import Pagination from "../../components/Pagination";
import { ItemStatus } from "lookups";
function PopupScreen(props) {

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
            const token = props.getCookie();
            let reqInstance = axios.create({
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("token to be sent: ", token);
            const url = "http://localhost:3000/api/items";

            reqInstance.get(
                url, 
                { 
                    params: { 
                        isMine: true,
                        archived: false,
                        order: orderValue,
                        orderDirection: orderDirectionValue,
                        searchText: searchTextValue,
                        status: ItemStatus.APPROVED
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

    const clickEvent = (data) => {

        console.log("primaryItemId: ", props.itemId);
        console.log("primaryUserId: ", props.userId);
        console.log("secondaryItemId: ", data._id);

        console.log("Enetered click event to trade");
        const token = props.getCookie();
        const url = "http://localhost:3000/api/trade/create";

        let reqInstance = axios.create({
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        reqInstance.post(
            url,
            {
                primaryUserId: props.userId,
                primaryItemId: props.itemId,
                secondaryItemId: data._id,
            },
            {
                withCredentials: true,
                baseURL: 'http://localhost:3000'
            }
        ).then(({data: res}) => { 
            console.log("performed trade: ", res);
        });
    }

	return (
    <>
        <div className="pop-up-div d-flex flex-column col-10 offset-1 mt-4">
            <button className = "btn btn-danger col-1" onClick={() => {props.togglePopup()}}>X</button>
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
                                        <Item key={index} data={data} clickEvent={() => {clickEvent(data)}}/>
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
            <Pagination handlePageClick={handlePageClick} pageCount={pageCount} maxItems={9}/>
        </div>
    </>
	);
}

export default PopupScreen;