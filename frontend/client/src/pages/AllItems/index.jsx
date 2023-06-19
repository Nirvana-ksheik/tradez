import { useEffect, useState } from "react";
import axios from "axios";
import "./allitems.css";
import { useNavigate } from "react-router-dom";
import ItemsList from "components/ItemsList";
import { Role } from "lookups";
import jwt from 'jwt-decode';

const AllItems = ({getCookie, user}) => {

    const [items, setItems] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [orderValue, setOrderValue ] = useState(null);
    const [orderDirectionValue, setOrderDirectionValue] = useState(null);
    const [searchTextValue, setSearchTextValue] = useState(null);
    const [statusValue, setStatusValue] = useState(null);

    const navigate = useNavigate();

    const clickEvent = (id) => {
        const url = '/items/' + id;
        navigate(url);
    };

    const getData = (controller) => {
        setIsLoading(true);
        const token = getCookie();
        let decodedToken = undefined;
        if(token != null && token != undefined){
            decodedToken = jwt(token);
        }
        console.log("decoded token in get data: ", decodedToken);
        let reqInstance = decodedToken != undefined && decodedToken.role == Role.ADMIN ?
        axios.create({
            headers: {
                Authorization: `Bearer ${token}`
            }
        }) : axios;

        try {
            const url = decodedToken != undefined && decodedToken.role == Role.ADMIN ? "http://localhost:3000/api/items" : "http://localhost:3000/api/public/items";
            reqInstance.get(
                url, 
                { 
                    params: { 
                        isMine: false,
                        archived: false,
                        order: orderValue,
                        orderDirection: orderDirectionValue,
                        searchText: searchTextValue,
                        status: statusValue
                    },
                    signal: controller.signal
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
        <ItemsList 
            clickEvent={clickEvent} getData={getData} items={items} orderValue={orderValue}
            setOrderValue={setOrderValue} orderDirectionValue={orderDirectionValue} setOrderDirectionValue={setOrderDirectionValue}
            searchTextValue={searchTextValue} setSearchTextValue={setSearchTextValue}
            statusValue={statusValue} setStatusValue={setStatusValue} isLoading={isLoading} canSeeStatusFilters={user != undefined && user != null && user.role == Role.ADMIN}/>
	);
};

export default AllItems;
