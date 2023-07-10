import React, {useState, useEffect} from "react";
import { ListGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import axios from "axios";
import "./notificationsList.css"

const NotificationList = ({user, getCookie}) => {

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
                notifications && notifications.length > 0 && showNotifications ?
                <Tooltip id="notification-popup-list">
                    <ListGroup classsName="col-12">
                        {
                            notifications.map((notification, i) => {
                                return(
                                    <ListGroup.Item className="col-12" key={i}>
                                        <div className="d-flex flex-column">
                                            <label style={{textAlign: 'left', fontWeight: 700}}>{notification.title}</label>
                                            <p className="m-0">{notification.message}</p>
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
        <div className="me-4">
            <span id="group">
                <i className="fa-solid fa-bell notification-icon" style={{color: '#60b0ba'}} onClick={
                    () => {
                        setShowNotifications(!showNotifications);
                    }
                }></i>
                <span className="badge">{notifications ? notifications.length : 0}</span>
            </span>
        </div>

		  </OverlayTrigger>
	  );
}


export default NotificationList