import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ItemsList from "components/ItemsList";

const UserItems = ({userId, currentLanguage}) => {

    const [items, setItems] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [orderValue, setOrderValue ] = useState(null);
    const [orderDirectionValue, setOrderDirectionValue] = useState(null);
    const [searchTextValue, setSearchTextValue] = useState(null);
    const [statusValue, setStatusValue] = useState(null);
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

            const url = "http://localhost:3000/api/items/" + userId;
        
            axios.get(
                url, 
                { 
                    params: { 
                        isMine: true,
                        archived: false,
                        order: orderValue,
                        orderDirection: orderDirectionValue,
                        searchText: searchTextValue,
                        status: statusValue,
                        category: categoryValue,
                        location: locationValue
                    },
                    signal: controller.signal
                }
            ).then(({data: res}) => { 
                setItems(res); 
                setIsLoading(false);
            }).catch((err)=> {
                console.log("Error : ", err);
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
                categoryValue={categoryValue} setCategoryValue={setCategoryValue}
                locationValue={locationValue} setLocationValue={setLocationValue}
                statusValue={statusValue} setStatusValue={setStatusValue} isLoading={isLoading} 
                canSeeStatusFilters={false} currentLanguage={currentLanguage} isUserProfile={true}
            /> 
        </div>
	);
};

export default UserItems;
