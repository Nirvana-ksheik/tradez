import { useEffect, useState, useReducer } from "react";
import axios from "axios";
import "./getAllCharities.css";
import { useNavigate } from "react-router-dom";
import SearchBar from "components/SearchBar";
import LoadingSpinner from "components/LoadingSpinner";
import Pagination from "components/Pagination";
import Charity from "components/Charity";

const reducer = (state, action) => {
    switch (action.type) {
      case 'SET_CHARITIES':
        return { ...state, charities: action.payload };
      case 'SET_LOADING':
        return { ...state, isLoading: action.payload };
      default:
        return state;
    }
  };
  
  const initialState = {
    charities: '',
    isLoading: false,
  };

const AllCharities = ({getCookie, user, currentLanguage}) => {

    const [state, dispatch] = useReducer(reducer, initialState);
    const { charities, isLoading } = state;

    const [orderValue, setOrderValue ] = useState(null);
    const [orderDirectionValue, setOrderDirectionValue] = useState(null);
    const [searchTextValue, setSearchTextValue] = useState(null);

    const itemsPerPage = 9;

    const [charitiesOffset, setCharitiesOffset] = useState(0);
    const [currentCharities, setCurrentCharities] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    
    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % charities.length;
        setCharitiesOffset(newOffset);
    };

    const navigate = useNavigate();

    const clickEvent = (id) => {
        const url = '/charity/profile/' + id;
        navigate(url);
    };

    useEffect(()=> {
        const getData = async (controller) => {
            dispatch({ type: 'SET_LOADING', payload: true });
    
            try {
                const url = "http://localhost:3000/api/charity";
    
                await axios.get(
                    url, 
                    { 
                        params: {
                            order: orderValue,
                            orderDirection: orderDirectionValue,
                            searchText: searchTextValue
                        },
                        signal: controller.signal
                    }
                ).then(({data: res}) => { 
                    dispatch({ type: 'SET_CHARITIES', payload: res });
                    dispatch({ type: 'SET_LOADING', payload: false });
                });
            
            } catch (error) { 
                console.log("error: ", error);
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        }
        const controller = new AbortController();
        getData(controller);
        return () =>{
            controller.abort();
        };

    }, [orderDirectionValue, orderValue, searchTextValue]);

    useEffect(() => {
        const endOffset = charitiesOffset + itemsPerPage;
        setCurrentCharities(charities.slice(charitiesOffset, endOffset));
        setPageCount(Math.ceil(charities.length / itemsPerPage));
    }, [charities, charitiesOffset]);

	return (
        <div dir={currentLanguage === "ar" ? "rtl" : "ltr"} className="d-flex flex-column col-xl-10 offset-xl-1 justify-content-center">

        <SearchBar setOrderValue={setOrderValue} setOrderDirectionValue={setOrderDirectionValue} setSearchTextValue={setSearchTextValue} isCharity={true} currentLanguage={currentLanguage}/>
        {
            charities != null && charities !== undefined && currentCharities != null && currentCharities !== undefined && currentCharities.length > 0 && isLoading === false && 
            <>
                <div className="d-flex flex-wrap col-12 justify-content-center mt-4">
                    {
                        (() => {
                            console.log("current charities: ", currentCharities);
                            let container = [];       
                            currentCharities && currentCharities.forEach((data, index) => {
                                console.log("single data is: ", data);
                                container.push(
                                    <Charity key={index} data={data} clickEvent={()=> {clickEvent(data._id)}}  currentLanguage={currentLanguage}/>
                                )
                            })
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
            isLoading === false && (charities == null || charities === undefined || currentCharities == null || currentCharities === undefined || currentCharities.length === 0) &&
            <div className="d-flex col-12 justify-content-center align-items-center">
                No Data
            </div>
        }
        <Pagination handlePageClick={handlePageClick} pageCount={pageCount} maxItems={itemsPerPage} currentLanguage={currentLanguage}/>
        </div>
	);
};

export default AllCharities;
