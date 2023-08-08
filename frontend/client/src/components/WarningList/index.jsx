import React, {useState, useEffect} from "react";
import { ListGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { CharityStatus } from "../../lookups";
import { Link } from "react-router-dom";

const WarningList = ({currentLanguage, user}) => {

    const [charityData, setCharityData] = useState();
    const [showWarnings, setShowWarnings] = useState(false);

    const { t } = useTranslation();

    useEffect(()=>{
        console.log("user in useEffect homePage: ", user);
        const getProfile = async () => {
            const url = 'http://localhost:3000/api/charity/auth/profile/' + user.id;
            await axios.get(url)
                .then(({data: res}) => {
                    console.log("res: ", res.result);
                    setCharityData(res.result)
                })
                .catch((err) => {
                    console.log("error: ", err);
                });
        }

        getProfile();

    }, [user, setCharityData]);
    return (
		  <OverlayTrigger
			trigger="click"
			placement="bottom"
			rootClose
			overlay={
                user && charityData && (charityData.status === CharityStatus.PENDING || !charityData.didChangePassword) ?
                    <Tooltip id="notification-popup-list">
                        <ListGroup>
                        {
                            charityData.status === CharityStatus.PENDING &&
                            <div className="warning-message d-flex justify-content-center align-items-center">
                                <label>{t("ApplicationIsUnderProcess")}</label>
                            </div>
                        }
                        {
                            !charityData.didChangePassword &&
                            <div className="warning-message d-flex justify-content-center align-items-center">
                                <label>{t("DidntChangePasswordWarning")} <Link to={"/charity/profile/" + user.id}>{t("ClickHere")}</Link></label>
                            </div>
                        }
                        </ListGroup>
                    </Tooltip> 
                :
                <></>
			}
		  >
            <div className="me-2 ms-2 notification-bell-div" onClick={
                () => {
                    setShowWarnings(!showWarnings);
                }
            }>
                <span id="group">
                    <i className="fa-solid fa-triangle-exclamation me-2 ms-2 notification-icon"  style={{color: 'orange'}}></i>
                </span>
            </div>

		  </OverlayTrigger>
	  );
}


export default WarningList