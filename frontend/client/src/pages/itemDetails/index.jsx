import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {format} from 'date-fns';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./itemDetails.css";
import jwt from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import PopupScreen from "components/PopUpScreen";
import Tabs from "components/Tabs";

const ItemDetails = ({getCookie}) => {

    const [item, setItem] = useState('');
    const [mainImage, setMainImage] = useState('');
    const [user, setUser] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [location, setLocation] = useState('');

	const navigate = useNavigate();

    const {id} = useParams();
    const {primaryId} = useParams();

    const togglePopup = () => {
        setShowPopup(!showPopup);
        if(!showPopup){
            document.getElementById("main_details_div").classList.add("faded-div");
        }else{
            document.getElementById("main_details_div").classList.remove("faded-div");
        }
    }

    const getUser = () => {
		const token = getCookie();
		console.log("cooooooookie: ", token);
		if(token == null || token == undefined) {return null;}
		const decodedToken = jwt(token);
		console.log("decoded token: ", decodedToken);
		return decodedToken;
	}

    const goToEdit = (id) => {
        setLocation("/items/edit/" + id);
        navigate(location);
    }

    useEffect(() => {
        const token = getCookie();
        const usr = getUser();
        setUser(usr);
        console.log("userrrrrrrrrrrr: ", user);

        const controller = new AbortController();

        let reqInstance = axios.create({
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const itemUrl = "http://localhost:3000/api/item/" + id;
        reqInstance.get(
            itemUrl,
            {
                signal: controller.signal
            },
            {
                withCredentials: true,
                baseURL: 'http://localhost:3000'
            }
        ).then(({data: res}) => {
            setItem(res);
            console.log("item is: ", res)
            const img = 'http://localhost:3000' + res.imagePaths[0];
            setMainImage(img);
            console.log("itemTradeInOrder: ", res.itemTradeInOrder);
            return controller.abort();
        });
    }, []);

    const acceptTrade = async () =>{
        const token = getCookie();
        let reqInstance = axios.create({
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const itemUrl = "http://localhost:3000/api/tradez/accept";
        await reqInstance.put(
            itemUrl,
            {
                primaryItemId: primaryId,
                secondaryItemId: item._id,
                secondaryUserId: item.ownerId
            },
            {
                withCredentials: true,
                baseURL: 'http://localhost:3000'
            }
        );

        setLocation("/items/" + primaryId);
        navigate(location);
    }

	return (
        <>
        {
            showPopup && item && <PopupScreen togglePopup={togglePopup} getCookie={getCookie} itemId={item._id} userId={item.ownerId} />
        }
        <div className="container" id="main_details_div">
            <div className="col-12 d-flex flex-column mt-5 outer-box">
            {
                item && user && user.id === item.itemOwner.id &&
                <button className="btn btn-success col-2 offset-2" onClick={() => {goToEdit(item._id)}}>Edit</button>
            }
            {
                item.itemTradeInOrder &&
                <button className="btn btn-success col-2 offset-2" onClick={() => {acceptTrade()}}>Accept Offer</button>
            }
            {
                item && user && user.id !== item.itemOwner.id &&
                <button className="btn btn-primary col-2 offset-2" onClick={() => {togglePopup()}}>Offer Trade</button>
            }
            {
                item && 
                <div className="d-flex col-10 offset-1 mt-2 flex border shadow-lg">
                    <div className="d-flex col-12 flex-row">
                    <div className="col-5 d-flex align-items-center main-image-box m-2">
                        <img src={mainImage} className="col-12 main-image align-item-center" id="main_image"/>
                    </div>
                    
                    <div className="col-6 offset-1 m-2 content-box">
                        <div className="col-12 d-flex flex justify-content-between align-items-center">
                            <div className="col-8 title">{item.name}</div>
                            <div className="col-4 pe-3 approximate-price">~ {item.approximateValue} S.P</div>
                        </div>
                        <div className="col-12">{format(new Date(item.publishedDate), "y MMM do hh:mm")}</div>
                        <div className="col-12 d-flex align-items-center">
                            <FontAwesomeIcon icon={"user"} className="user-icon"/>
                            <span>{item.itemOwner.username}</span>
                        </div>
                        <div className="col-12 d-flex align-items-center">
                            <FontAwesomeIcon icon={"map-marker-alt"} className="location-icon"/>
                            <span>{item.locationName}</span>
                        </div>
                        <hr/>
                        <div className="col-12">{item.description}</div>
                        <div className="col-12 mt-4 d-flex justify-content-start image-slider">
                            {
                                (() => {
                                    let container = [];
                                    {
                                        item !== undefined && item !== null && item.imagePaths.forEach((data, index) => {
                                        container.push(
                                            <div className="each-slide col-2 border shadow-sm small-image m-1" key={index} onClick={()=>{
                                                const img = "http://localhost:3000" + data;
                                                setMainImage(img);
                                            }}>
                                                <img className="col-12" src={"http://localhost:3000" + data} alt="Image"/>
                                            </div>
                                        )
                                        })
                                    }
                                    return container;
                                })()
                            }
                        </div>
                    </div>
                </div>
            </div>
            }
            </div>
        </div>
        <Tabs id={id} getCookie={getCookie}/>
        </>
	);
};

export default ItemDetails;
