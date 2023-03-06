import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {format} from 'date-fns';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./itemDetails.css";

const ItemDetails = ({getCookie}) => {

    const [item, setItem] = useState();
    const [mainImage, setMainImage] = useState();

    const {id} = useParams();

    useEffect(() => {
        const token = getCookie();
        const controller = new AbortController();

        let reqInstance = axios.create({
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log("token to be sent: ", token);
        const url = "http://localhost:3000/api/item/" + id;
        console.log("url is: ", url);
        reqInstance.get(
            url,
            {
                signal: controller.signal
            },
            {
                withCredentials: true,
                baseURL: 'http://localhost:3000'
            }
        ).then(({data}) => {
            setItem(data);
            const img = 'http://localhost:3000' + data.imagePaths[0];
            setMainImage(img);
            return controller.abort();
        });

    }, []);

	return (
        <>
        {
            item && 
            <div className="d-flex col-8 offset-2 outer-box flex border shadow-lg">
                           
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
        }
        
        </>
	);
};

export default ItemDetails;
