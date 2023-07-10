import { useState, useEffect } from "react";
import { ItemStatus } from "lookups";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Item from "../../components/Item";
import SearchBar from "../../components/SearchBar";
import LoadingSpinner from "../../components/LoadingSpinner";
import Pagination from "../../components/Pagination";
import Ribbon from "components/Ribbon";
import "./popupScreen.css";

function PopupScreen(props) {

    const [items, setItems] = useState('');
    const [orderValue, setOrderValue ] = useState(null);
    const [orderDirectionValue, setOrderDirectionValue] = useState(null);
    const [searchTextValue, setSearchTextValue] = useState(null);
    const [itemOffset, setItemOffset] = useState(0);
    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [tradeRibbon, setTradeRibbon] = useState(false);
    const [tradeText, setTradeText] = useState('');
    const [isSuccess, setIsSuccess] = useState(null);
    const itemsPerPage = 9;

    const navigate = useNavigate();

    useEffect(() => {
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

        const endOffset = itemOffset + itemsPerPage;
        setCurrentItems(items.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(items.length / itemsPerPage));
        const controller = new AbortController();
        getMyItems(controller);
        return ()=>{
            controller.abort();
        };
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items.length, orderValue, orderDirectionValue, searchTextValue, itemOffset, itemsPerPage]);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % items.length;
        setItemOffset(newOffset);
      };

    const clickEvent = (data) => {
        setTradeRibbon(false);
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
            setIsSuccess(true);
            setTradeRibbon(true);
            setTradeText("Trade Succeeded");
        }).catch((err)=> {
            console.log("error: ", {err});
            setIsSuccess(false);
            setTradeRibbon(true);
            setTradeText(err.response.data.message);
        })
    }

    const callbackFunction = () => {
        navigate("/items/mine");
    }

	return (
    <div className="col-12 d-flex justify-content-center align-items-center mt-5">
        <div className="pop-up-div d-flex flex-column col-10 mt-4">      
            {
                tradeRibbon &&
                <Ribbon text={tradeText} setShowValue={setTradeRibbon} isSuccess={isSuccess} callbackFunction={isSuccess === true ? callbackFunction : undefined}/>
            }          
            <button className = "btn btn-danger col-1" onClick={() => {props.togglePopup()}}>X</button>
            <SearchBar setOrderValue={setOrderValue} setOrderDirectionValue={setOrderDirectionValue} setSearchTextValue={setSearchTextValue} currentLanguage={props.currentLanguage}/>
            {
                isLoading === false &&         
                    <div className="d-flex flex-wrap col-10 justify-content-start mt-4">
                        {
                            (() => {
                                console.log("current items: ", currentItems);
                                let container = [];                       
                                currentItems && currentItems.forEach((data, index) => {
                                console.log("single data is: ", data);
                                container.push(
                                    <Item key={index} data={data} clickEvent={() => {clickEvent(data)}} currentLanguage={props.currentLanguage}/>
                                )
                                })                             
                                return container;
                            })()
                        }
                    </div>
            }   
            {
                isLoading && <LoadingSpinner />
            }
            <Pagination handlePageClick={handlePageClick} pageCount={pageCount} maxItems={9} currentLanguage={props.currentLanguage}/>
        </div>
    </div>
	);
}

export default PopupScreen;