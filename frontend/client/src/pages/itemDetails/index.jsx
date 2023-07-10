import axios from "axios";
import PopupScreen from "components/PopUpScreen";
import Tabs from "components/Tabs";
import IconTextButton from "components/IconTextButton";
import LoadingSpinner from "components/LoadingSpinner";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ItemStatus, Role } from "lookups";
import { Notifications } from "notifications";
import { notificationSender } from "helpers/notificationHelper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; 

import "./itemDetails.css";
import { formatNumberWithCommas } from "../../helpers/numberFormatHelper";
import { formatDateWithLanguage } from "../../helpers/dateFormatHelper";

const ItemDetails = ({getCookie, enableTrade, user, currentLanguage}) => {

    const [item, setItem] = useState('');
    const [mainImage, setMainImage] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmationDialogue, setShowConfirmationDialogue] = useState(false);
    const [itemStatus, setItemStatus] = useState();

	const navigate = useNavigate();

    const {id} = useParams();
    const {primaryId} = useParams();
    const {t} = useTranslation();

    const togglePopup = () => {
        setShowPopup(!showPopup);
        if(!showPopup){
            document.getElementById("main_details_div").classList.add("faded-div");
        }else{
            document.getElementById("main_details_div").classList.remove("faded-div");
        }
    }

    const goToEdit = (id) => {
        const location = "/items/edit/" + id;
        navigate(location);
    }

    useEffect(() => {
        setIsLoading(true);
        const token = getCookie();

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
            setIsLoading(false);
            setItem(res);
            console.log("item is: ", res)
            const img = 'http://localhost:3000' + res.imagePaths[0];
            setMainImage(img);
            console.log("itemTradeInOrder: ", res.itemTradeInOrder);
            return controller.abort();
        }).catch((err)=>{
            console.log("Error: ", err);
            setIsLoading(false);
        })
    }, [getCookie, id, user]);

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

        const location = "/items/" + primaryId;
        navigate(location);
    }

	return (
        <div className="d-flex col-12 justify-content-center align-items-center flex-column" dir={currentLanguage === "ar"? "rtl" : "ltr"}>
        {
            isLoading === true ? <LoadingSpinner /> 
            :
            <div className="d-flex col-10 justify-content-center align-items-center flex-column">
                {
                    showPopup && item && <PopupScreen togglePopup={togglePopup} getCookie={getCookie} itemId={item._id} userId={item.ownerId} />
                }
                <div className="d-flex col-12 justify-content-center align-items-center flex-column" id="main_details_div">
                    <div className="col-12 d-flex flex-column mt-5 justify-content-center align-items-center outer-box">
                    <div className="col-10 d-flex justify-content-start align-items-start">
                    {
                        item  && item.status === ItemStatus.APPROVED && item.archived === false && user && user.role === Role.USER && user.id === item.itemOwner.id &&
                        <IconTextButton 
                            text={t("Edit")}
                            onClick={() => {goToEdit(item._id)}}
                            icon={<i className="fa-regular fa-pen-to-square"></i>}
                        />
                    }
                    {
                        item && item.status === ItemStatus.APPROVED && item.archived === false && user && user.role === Role.USER && item.itemTradeInOrder && enableTrade === true &&
                        <IconTextButton 
                            text={t("AcceptOffer")}
                            onClick={() => {acceptTrade()}}
                            icon={<i className="fa-solid fa-circle-check"></i>}
                        />
                    }
                    {
                        item && item.status === ItemStatus.APPROVED && user && user.role === Role.USER && user.id !== item.itemOwner.id &&
                        <IconTextButton 
                            text={t("OfferTrade")}
                            onClick={() => {togglePopup()}}
                            icon={<i className="fa-solid fa-right-left"></i>}
                        />
                    }
                    </div>

                    {
                        item && item.status === ItemStatus.PENDING && user && user.role === Role.ADMIN &&
                        <div className="d-flex col-10 mb-3 justify-content-between align-items-center">
                            <IconTextButton 
                                text={t("Approve")}
                                onClick={() => {setItemStatus(ItemStatus.APPROVED); setShowConfirmationDialogue(true);}}
                                icon={<i className="fas fa-check"></i>}
                                btnClass={"approve"}
                            />    
                            <IconTextButton 
                                text={t("Reject")}
                                onClick={() => {setItemStatus(ItemStatus.REJECTED); setShowConfirmationDialogue(true);}}
                                icon={<i className="fas fa-times"></i>}
                                btnClass={"reject"}
                            />         
                        </div>  
                    }
                    {
                        showConfirmationDialogue &&
                        <RejectDialogue id={item._id} status={itemStatus} getCookie={getCookie} setShowDialogue={setShowConfirmationDialogue} ownerId={item.ownerId}/>
                    }
                    {
                        item && 
                        <div className={"d-flex col-10 mt-2 item-details-container mb-5 " + item.status}>
                            <div className="d-flex col-12 flex-row">
                            <div className="col-4 d-flex align-items-center">
                                <img src={mainImage} className="col-12 main-image" id="main_image" alt=""/>
                            </div>
                            
                            <div className="col-8 m-2 content-box">
                                <div className="col-12 d-flex flex justify-content-between align-items-center">
                                    <div className="col-8 pe-3 ps-3 title item-details-text">{item.name}</div>
                                    <div className="col-4 pe-3 ps-3 approximate-price item-details-text">~ {formatNumberWithCommas(item.approximateValue, currentLanguage)} {t("S.P")}</div>
                                </div>
                                <div className="col-12 item-details-text pe-3 ps-3">{formatDateWithLanguage(item.publishedDate, currentLanguage)}</div>
                                <div className="col-12 d-flex align-items-center">
                                    <FontAwesomeIcon icon={"user"} className="user-icon pe-2 ps-2"/>
                                    <span className="item-details-text pe-2 ps-2">{item.itemOwner.username}</span>
                                </div>
                                <div className="col-12 d-flex align-items-center">
                                    <FontAwesomeIcon icon={"map-marker-alt"} className="location-icon pe-2 ps-2"/>
                                    <span className="item-details-text pe-2 ps-2">{item.locationName}</span>
                                </div>
                                <div className="line-break"></div>
                                <div className="col-12 item-details-text">{item.description}</div>
                                <div className="col-12 mt-4 d-flex justify-content-start image-slider">
                                    {
                                        (() => {
                                            let container = [];
                                            
                                            item !== undefined && item !== null && item.imagePaths.forEach((data, index) => {
                                            container.push(
                                                <div className="each-slide col-2 border shadow-sm small-image m-1" key={index} onClick={()=>{
                                                    const img = "http://localhost:3000" + data;
                                                    setMainImage(img);
                                                }}>
                                                    <img className="col-12" src={"http://localhost:3000" + data} alt=""/>
                                                </div>
                                            )
                                            })
                                                                                  
                                            return container;
                                        })()
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    }
                    </div>
                    {
                        item && item.archived === false && item.status === ItemStatus.APPROVED && user && user.role === Role.USER &&
                        <Tabs id={id} getCookie={getCookie} user={user} ownerId={item.ownerId} currentLanguage={currentLanguage}/>
                    }
                    {
                        item && item.status === ItemStatus.REJECTED && user &&
                        <div className="bg-danger font-white d-flex flex-column col-10 mt-5 mb-3 rejected-message-container p-3">
                            <h4>{t("RejectionMessageLabel")} </h4>
                            <p>{item.rejectMessage}</p>
                        </div>
                    }
                </div>
            </div>
        }
        </div>
	);
};

const RejectDialogue = ({id, status, getCookie, setShowDialogue, ownerId}) => {

    const navigate = useNavigate();
    const [rejectMessage, setRejectMessage] = useState('');

    const {t} = useTranslation();

    const changeItemStatus = async(e) => {
        e.preventDefault();
        console.log("item id: ", id);
        console.log("status: ", status);
        const token = getCookie();
        let reqInstance = axios.create({
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const itemUrl = "http://localhost:3000/api/admin/item/" + id;
        await reqInstance.put(
            itemUrl,
            {
                status: status,
                rejectMessage: status === ItemStatus.REJECTED ? rejectMessage : null
            },
            {
                withCredentials: true,
                baseURL: 'http://localhost:3000'
            }
        ).then(async({data: res}) => {
            const location = "/allitems";
            let notificationObject = null;
            if(status === ItemStatus.APPROVED){
                notificationObject = Notifications.ADMIN_APPROVE_ITEM
            }
            else if(status === ItemStatus.REJECTED){
                notificationObject = Notifications.ADMIN_REJECT_ITEM
            }
    
            await notificationSender({userId: ownerId, message: notificationObject.message, title: notificationObject.title});
            navigate(location);

        }).catch((err) => {
            console.log("error: ", err);
        })
    }

    const handleChange = (e) => {
        console.log("reject message: ", e.target.value);
        setRejectMessage(e.target.value);
    }

    return (
        <div className="d-flex col-8 align-items-center justify-content-center">
            <div className="d-flex col-8 mb-5 flex-column confirmation-dialogue">
                <div className="col-12 d-flex justify-content-start m-2 font-white">
                    <button className="btn btn-danger justify-content-start col-1" onClick={()=>{setShowDialogue(false)}}>X</button>
                </div>
                <div className="d-flex col-12 flex-column justify-content-center align-items-center">
                    <form onSubmit={changeItemStatus} className="col-12 justify-content-center align-items-center d-flex flex-column" method="POST">
                        {
                            status === ItemStatus.REJECTED &&
                            <div className="d-flex col-10 flex-column mt-3 justify-content-center align-items-center group p-2">
                                <h3 className="mb-2 font-white align-center">{t("RejectionMessageLabel")}</h3>
                                <div className="d-flex flex-column col-12">
                                    <input className="form-control-sm col-12" type="text" placeholder={t("RejectionMessagePlaceholder")} name="rejectMessage" value={rejectMessage} onChange={handleChange}/>
                                    <p className="sub-text">{t("ReasonForRejectionLabel")}</p>
                                </div>
                            </div>
                        }
                        {
                            status === ItemStatus.APPROVED &&
                            <div className="d-flex col-12 flex-column mt-3 col-12 align-items-center justify-content-center group">
                                <h3 className="font-white align-center">{t("ConfirmationDialogue")}</h3>
                                <h5 className="font-white">{t("ApproveConfirmation")}</h5>
                                <h5 className="font-white">{t("ThisActionCantBeUndone")}</h5>
                            </div>
                        }
                        <div className="col-12 d-flex justify-content-center mb-lg-1">
                            <input type="submit" className="m-1 mb-2 submit-btn-confirm-dialogue col-4" value={status === ItemStatus.APPROVED ? t("Approve") : t("Reject")}/>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
}

export default ItemDetails;
