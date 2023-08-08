import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ItemsList from "components/ItemsList";
import { ItemStatus } from "lookups";
import "./archivedItems.css";

const ArchivedItems = ({getCookie, currentLanguage}) => {

    const [items, setItems] = useState([]);
    const [orderValue, setOrderValue ] = useState(null);
    const [orderDirectionValue, setOrderDirectionValue] = useState(null);
    const [searchTextValue, setSearchTextValue] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [categoryValue, setCategoryValue] = useState([]);
    const [locationValue, setLocationValue] = useState(null);
    
    const navigate = useNavigate();

    const clickEvent = (id)=>{
        const location = "/items/" + id
        navigate(location)
    }

    const getData = (controller) => {
        try {
            setIsLoading(true);
            const token = getCookie();
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
                        archived: true,
                        order: orderValue,
                        orderDirection: orderDirectionValue,
                        searchText: searchTextValue,
                        status: ItemStatus.APPROVED,
                        category: categoryValue
                    }
                },
                {
                    signal: controller.signal,
                    withCredentials: true,
                    baseURL: 'http://localhost:3000'
                }
            ).then(({data: res}) => { 
                setItems(res); 
                setIsLoading(false);
            }).catch((err)=>{
                console.log("Error: ", err);
                setIsLoading(false);
            })
        
        } catch (error) { 
            console.log("error: ", error);
        }
    }


	return (
        <div className="col-12 d-flex justify-content-center align-items-center">
            <ItemsList 
                clickEvent={clickEvent} getData={getData} items={items} orderValue={orderValue}
                categoryValue={categoryValue} setCategoryValue={setCategoryValue}
                locationValue={locationValue} setLocationValue={setLocationValue}
                setOrderValue={setOrderValue} orderDirectionValue={orderDirectionValue} setOrderDirectionValue={setOrderDirectionValue}
                searchTextValue={searchTextValue} setSearchTextValue={setSearchTextValue} isLoading={isLoading} currentLanguage={currentLanguage}
            /> 
        </div>
	);
};

export default ArchivedItems;
