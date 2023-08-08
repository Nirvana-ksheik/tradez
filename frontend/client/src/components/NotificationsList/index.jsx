import React, {useState, useEffect} from "react";
import { ListGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import axios from "axios";
import "./notificationsList.css"

const NotificationList = ({user, getCookie, currentLanguage}) => {

    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(()=>{
        const getAllNotifications = async() =>{
            const token = getCookie();
            let reqInstance = axios.create({
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    
            await reqInstance.get(
                "http://localhost:3000/api/notifications",
                {
                    withCredentials: true,
                    baseURL: 'http://localhost:3000'
                }
            ).then(({data: res}) =>{
                console.log("Successfully retrieved notifications");
                setNotifications(res);

            }).catch((err)=>{
                console.log("Error getting notifications: ", err);
            });    
        }

        getAllNotifications();
        
    }, [getCookie]);

    return (
		  <OverlayTrigger
			trigger="click"
			placement="bottom"
			rootClose
			overlay={
                notifications && notifications.length > 0 ?
                    <Tooltip id="notification-popup-list">
                        <ListGroup style={{paddingTop: 5, paddingBottom: 5}}>
                            {
                                notifications.map((notification, i) => {
                                    return(
                                        <ListGroup.Item className="col-12 mt-1 mb-1" key={i}>
                                            <div className="d-flex flex-column">
                                                <label className={currentLanguage === "ar" ? "text-right notification-title" : "text-left notification-title"} style={{fontWeight: 700}}>{
                                                    currentLanguage === "ar" ? notification.title_ar : notification.title
                                                }</label>
                                                <p className={currentLanguage === "ar" ? "text-right notification-text" : "text-left notification-text m-0"}>{
                                                    currentLanguage === "ar" ? notification.message_ar : notification.message
                                                }</p>
                                            </div>
                                        </ListGroup.Item>
                                    )
                                })
                            }

                        </ListGroup>
                    </Tooltip> 
                :
                <></>
			}
		  >
            <div className="ms-2 notification-bell-div" onClick={
                () => {
                    console.log("showNotification: ", showNotifications);
                    console.log("notiifications: " ,notifications)
                    setShowNotifications(!showNotifications);
                }
            }>
                <span id="group">
                    <i className="fa-solid fa-bell notification-icon" style={{color: '#60b0ba'}}></i>
                    <span className="badge">{notifications ? notifications.length : 0}</span>
                </span>
            </div>

		  </OverlayTrigger>
	  );
}


export default NotificationList