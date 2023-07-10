import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ItemsList from "components/ItemsList";
import { Role } from "lookups";
import jwt from'jwt-decode';
import "./myItems.css";

const MyItems = ({getCookie, user, currentLanguage}) => {

    const [items, setItems] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [orderValue, setOrderValue ] = useState(null);
    const [orderDirectionValue, setOrderDirectionValue] = useState(null);
    const [searchTextValue, setSearchTextValue] = useState(null);
    const [statusValue, setStatusValue] = useState(null);

    const navigate = useNavigate();

    const clickEvent = (id)=>{
        const location = "/items/" + id
        navigate(location)
    }

    const getData = (controller) => {
        setIsLoading(true);
        const token = getCookie();
        let decodedToken = undefined;
        if(token != null && token != undefined){
            decodedToken = jwt(token);
        }

        let reqInstance = decodedToken != undefined && decodedToken.role == Role.USER ?
        axios.create({
            headers: {
                Authorization: `Bearer ${token}`
            }
        }) : axios;

        console.log("token to be sent: ", token);
        const url = "http://localhost:3000/api/items";
        
        try {
            reqInstance.get(
                url, 
                { 
                    params: { 
                        isMine: true,
                        archived: false,
                        order: orderValue,
                        orderDirection: orderDirectionValue,
                        searchText: searchTextValue,
                        status: statusValue
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
            setIsLoading(false);
        }
    }


	return (
        <div className="col-12 d-flex justify-content-center align-items-center">
            <ItemsList 
                clickEvent={clickEvent} getData={getData} items={items} orderValue={orderValue}
                setOrderValue={setOrderValue} orderDirectionValue={orderDirectionValue} setOrderDirectionValue={setOrderDirectionValue}
                searchTextValue={searchTextValue} setSearchTextValue={setSearchTextValue} 
                statusValue={statusValue} setStatusValue={setStatusValue} isLoading={isLoading} 
                canSeeStatusFilters={user !== undefined && user != null && user.role == Role.USER} currentLanguage={currentLanguage}
            /> 
        </div>
	);
};

export default MyItems;
