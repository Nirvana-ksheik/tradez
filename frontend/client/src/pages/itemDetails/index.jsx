import axios from "axios";
import Tabs from "components/Tabs";
import PopupScreen from "components/PopUpScreen";
import IconTextButton from "components/IconTextButton";
import LoadingSpinner from "components/LoadingSpinner";
import { useState, useEffect, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import { ItemStatus, Role } from "lookups";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; 
import { formatNumberWithCommas } from "../../helpers/numberFormatHelper";
import { formatDateWithLanguage } from "../../helpers/dateFormatHelper";
import ChangeStatusDialogue from "../../components/ChangeStatusDialogue";
import { findLocationDescription } from "../../helpers/locationsHelper";
import "./itemDetails.css";

const ItemDetails = ({getCookie, enableTrade, user, currentLanguage}) => {

    const [item, setItem] = useState('');
    const [mainImage, setMainImage] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmationDialogue, setShowConfirmationDialogue] = useState(false);
    const [itemStatus, setItemStatus] = useState();
	const [screenWidth, setScreenWidth] = useState();

	useLayoutEffect(() => {

		function detectScreenWidth() { setScreenWidth(window.screen.availWidth) }
		window.addEventListener('resize', detectScreenWidth);
		setScreenWidth(window.screen.availWidth);
		return () => window.removeEventListener('resize', detectScreenWidth);
	}, []);

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
        try{
            reqInstance.get(
                itemUrl,
                {
                    withCredentials: true,
                    baseURL: 'http://localhost:3000',
                    signal: controller.signal
                }
            ).then(({data: res}) => {
                setIsLoading(false);
                setItem(res);
                console.log("item is: ", res)
                const img = 'http://localhost:3000' + res.imagePaths[0];
                setMainImage(img);
                console.log("itemTradeInOrder: ", res.itemTradeInOrder);
                console.log("item.status: ", res.status);
                console.log("user: ", user);
            }).catch((err)=>{
                console.log("Error: ", err);
                setIsLoading(false);
            })
        }catch(err){
            console.log("error: ", err);
        }

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
                    showPopup && item && <PopupScreen togglePopup={togglePopup} getCookie={getCookie} itemId={item._id} userId={item.ownerId} currentLanguage={currentLanguage}/>
                }
                <div className={showPopup ? "d-flex col-12 justify-content-center align-items-center flex-column faded-div" : 
                                "d-flex col-12 justify-content-center align-items-center flex-column"} id="main_details_div">
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
                        item && item.status === ItemStatus.APPROVED && item.archived === false && user && user.role === Role.USER && item.itemTradeInOrder === true && enableTrade === true &&
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
                        <ChangeStatusDialogue id={item._id} status={itemStatus} getCookie={getCookie} setShowDialogue={setShowConfirmationDialogue} ownerId={item.ownerId} currentLanguage={currentLanguage}/>
                    }
                    {
                        item && 
                        <div className={"d-flex col-lg-10 col-12 mt-2 mb-5 " + item.status + "-details "}>
                            <div className="d-flex col-12 flex-lg-row flex-column align-items-center align-items-lg-stretch ">

                                <div className="col-lg-4 col-5 d-flex">
                                    <img src={mainImage} className="col-12 main-image" id="main_image" alt=""/>
                                </div>
                                {
                                    screenWidth < 769 && 
                                    <div className="col-12 mt-4 d-flex justify-content-lg-start justify-content-center image-slider">
                                        {
                                            (() => {
                                                let container = [];
                                                
                                                item !== undefined && item !== null && item.imagePaths.forEach((data, index) => {
                                                container.push(
                                                    <div className="each-slide col-2 shadow-sm small-image me-1 ms-1" key={index} onClick={()=>{
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
                                }
                                <div className="col-lg-7 col-12 me-5 ms-5 m-2 content-box">
                                    <div className="col-12 d-flex flex justify-content-lg-start justify-content-between align-items-center">
                                        <div className="col-8 pe-2 ps-2 title item-details-text">{item.name}</div>
                                        <div className="col-4 pe-3 ps-3 approximate-price item-details-text">~ {formatNumberWithCommas(item.approximateValue, currentLanguage)} {t("S.P")}</div>
                                    </div>
                                    <div className="col-12 item-details-text item-details-date pe-2 ps-2 ">{formatDateWithLanguage(item.publishedDate, currentLanguage)}</div>
                                    <div className="col-12 mt-4 d-flex align-items-center">
                                        <FontAwesomeIcon icon={"user"} className="user-icon pe-2 ps-2"/>
                                        <span className="item-details-text pe-2 ps-2">{item.itemOwner.username}</span>
                                    </div>
                                    <div className="col-12 d-flex align-items-center">
                                        <FontAwesomeIcon icon={"map-marker-alt"} className="location-icon pe-2 ps-2"/>
                                        <span className="item-details-text pe-2 ps-2">{findLocationDescription(item.location, currentLanguage)}</span>
                                    </div>
                                    <h4 className="pe-2 ps-2 mt-4 item-details-text">{t("DescriptionLabel") }</h4>
                                    <div className="col-12 item-details-text p-2">{item.description}</div>
                                    {
                                        screenWidth >= 769 &&
                                        <div className="col-12 mt-4 d-flex justify-content-start image-slider">
                                            {
                                                (() => {
                                                    let container = [];
                                                    
                                                    item !== undefined && item !== null && item.imagePaths.forEach((data, index) => {
                                                    container.push(
                                                        <div className="each-slide col-2 shadow-sm small-image me-1 ms-1" key={index} onClick={()=>{
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
                                    }

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

export default ItemDetails;
