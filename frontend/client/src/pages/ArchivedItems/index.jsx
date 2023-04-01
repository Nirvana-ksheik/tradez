import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./archivedItems.css";
import ItemsList from "components/ItemsList";

const ArchivedItems = ({getCookie}) => {

    const [items, setItems] = useState('');
    const [orderValue, setOrderValue ] = useState(null);
    const [orderDirectionValue, setOrderDirectionValue] = useState(null);
    const [searchTextValue, setSearchTextValue] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const clickEvent = (id)=>{
        const location = "/items/" + id
        navigate(location)
    }

    const getData = (controller) => {
        setIsLoading(true);
        try {
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
    <div className="col-10 offset-1">
        <ItemsList 
            clickEvent={clickEvent} getData={getData} items={items} orderValue={orderValue}
            setOrderValue={setOrderValue} orderDirectionValue={orderDirectionValue} setOrderDirectionValue={setOrderDirectionValue}
            searchTextValue={searchTextValue} setSearchTextValue={setSearchTextValue} isLoading={isLoading}
        /> 
    </div>
	);
};

export default ArchivedItems;
