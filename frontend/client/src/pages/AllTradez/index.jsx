import { useEffect, useState } from "react";
import axios from "axios";
import "./allTradez.css";
import { useNavigate } from "react-router-dom";
import Item from "components/Item"
import { Notifications, parseModelString } from "../../notifications";
import { notificationSender } from "../../helpers/notificationHelper";
import LoadingSpinner from "../../components/LoadingSpinner";
import NoData from "../../assets/img/no-tradez.png";
import { useTranslation } from "react-i18next";

const AllTradez = ({getCookie, user, currentLanguage, isAdminPage}) => {

    const [tradez, setTradez] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [kpis, setKpis] = useState();
    // const [orderValue, setOrderValue ] = useState(null);
    // const [orderDirectionValue, setOrderDirectionValue] = useState(null);
    // const [searchTextValue, setSearchTextValue] = useState(null);
    // const [statusValue, setStatusValue] = useState(null);
    // const [categoryValue, setCategoryValue] = useState([]);
    // const [locationValue, setLocationValue] = useState(null);

    const {t} = useTranslation();
    const navigate = useNavigate();

    const clickEvent = (id) => {
        const url = '/items/' + id;
        navigate(url);
    };

    useEffect(()=> {
        const getData = (controller) => {
            try {
                setIsLoading(true);
                const token = getCookie();
    
                let reqInstance = axios.create({
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
    
                const url = "http://localhost:3000/api/admin/tradez";
    
                reqInstance.get(
                    url, 
                    { 
                        signal: controller.signal
                    }
                ).then(({data: res}) => { 
                    console.log("result of tradez for admin : ", res);
                    setTradez(res.result.tradez); 
                    setKpis(res.result.kpis);
                    setIsLoading(false);
                }).catch((err)=> {
                    console.log("Error : ", err);
                    setIsLoading(false);
                })
            
            } catch (error) { 
                console.log("error: ", error);
                setIsLoading(false);
            }
        }
        const controller = new AbortController();
        getData(controller);
        return ()=> {
            controller.abort();
        }

    }, [getCookie, setIsLoading, setTradez]);

    const DeliverItem = async (id, trade) => {
        setIsLoading(true);
        let sendNotifications = false;
        const token = getCookie();

        let reqInstance = axios.create({
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const url = "http://localhost:3000/api/admin/item/delivered/" + id;

        console.log("tradeId: ", trade.tradeId);
        await reqInstance.put(
            url,
            {
                tradeId: trade.tradeId
            }
        ).then(({data: res}) => { 
            console.log("result of delivering item : ", res);
            sendNotifications = res;
            setIsLoading(false);
        }).catch((err)=> {
            console.log("Error : ", err);
            setIsLoading(false);
        });

        if(sendNotifications){

            let modelData = {
                itemname: trade.item2.name,
            };

            const notificationObject = Notifications.ITEM_DELIVERED;
            let notificationMessage = parseModelString(notificationObject.message, modelData);
            let notificationMessageAr = parseModelString(notificationObject.message_ar, modelData);

            await notificationSender({
                userId: trade.item1.itemOwner.id,
                message: notificationMessage,
                title: notificationObject.title,
                message_ar: notificationMessageAr,
                title_ar: notificationObject.title_ar,
                currentLanguage: currentLanguage
            });

            modelData = {
                itemname: trade.item1.name
            }

            notificationMessage = parseModelString(notificationObject.message, modelData);
            notificationMessageAr = parseModelString(notificationObject.message_ar, modelData);

            await notificationSender({
                userId: trade.item2.itemOwner.id,
                message: notificationMessage,
                title: notificationObject.title,
                message_ar: notificationMessageAr,
                title_ar: notificationObject.title_ar,
                currentLanguage: currentLanguage
            });
        }
    }

	return (
        <div dir={currentLanguage === "ar" ? "rtl" : "ltr"} className="col-12 d-flex flex-column justify-content-center align-items-center mt-5">
            {
                isLoading &&
                <LoadingSpinner />
            }
            {
                kpis && kpis !== null && kpis !== undefined && !isLoading &&
                <div className="col-8 d-flex justify-content-around align-items-center kpi-container">
                    <div className="col-3 d-flex justify-content-center align-items-center">
                        <i className="fa-solid fa-truck kpi-icon"></i>
                        <div className="d-flex flex-column align-items-start justify-content-center me-3 ms-3">
                            <h3>{kpis.delivered}</h3>
                            <h4>Delivered</h4>
                        </div>
                    </div>
                    <div className="col-3 d-flex justify-content-center align-items-center">
                    <i class="fas fa-warehouse kpi-icon"></i>
                        <div className="d-flex flex-column align-items-start justify-content-center me-3 ms-3">
                            <h3>{kpis.notDelivered}</h3>
                            <h4>Not Delivered</h4>
                        </div>
                    </div>
                    <div className="col-3 d-flex justify-content-center align-items-center">
                    <i class="fas fa-table kpi-icon"></i>
                        <div className="d-flex flex-column align-items-start justify-content-center me-3 ms-3">
                            <h3>{kpis.total}</h3>
                            <h4>Total</h4>
                        </div>
                    </div>
                </div>
            }
            {
            tradez && !isLoading && tradez.length > 0 &&
            <div className="col-10 d-flex flex-column justify-content-center align-items-center">
                {
                    (() => {
                        let container = [];       
                        tradez.forEach((data, i) => {
                            console.log("single data is: ", data);
                            container.push(
                                <div className="col-12 d-flex justify-content-center align-items-center" key={i+1}>
                                    <div className="col-5 d-flex justify-content-between align-items-center">
                                        <div className="col-3 d-flex flex-column align-items-center justify-content-center">
                                            {
                                                data.item1.itemOwner.logo ? 
                                                <img className="charity-icon-logo col-12" src={"http://localhost:3000/" + data.item1.itemOwner.logo} alt="" /> :
                                                <i className="charity-icon-logo col-12 fa fa-user-circle no-user-icon-logo"></i>
                                            }
                                            <div className="product-item-title mt-2 trade-username" onClick={
                                                () => {
                                                    navigate("/profile/" + data.item1.itemOwner.id);
                                                }
                                            }>{data.item1.itemOwner.username}</div>
                                            {
                                                !data.item1.isDelivered &&
                                                <button className="btnn col-10 deliver-button" onClick={
                                                    async () => {
                                                        await DeliverItem(data.item1._id, data);
                                                    }
                                                }>Deliver</button>
                                            }
                                        </div>
                                        <div className="col-6 d-flex align-items-center justify-content-center">
                                            <Item data={data.item1} clickEvent={() => clickEvent(data.item1._id)} currentLanguage={currentLanguage} isUserProfile={false} isAdminPage={true}/>
                                        </div>
                                    </div>

                                    <div className="col-1 d-flex justify-content-center align-items-center">
                                        <i className="fas fa-exchange-alt two-way-arrow-icon col-12"></i>
                                    </div>

                                    <div className="col-5 d-flex justify-content-between align-items-center">
                                        <div className="col-6 d-flex align-items-center justify-content-center">
                                            <Item data={data.item2} clickEvent={() => clickEvent(data.item2._id)} currentLanguage={currentLanguage} isUserProfile={false} isAdminPage={true}/>
                                        </div>   
                                        <div className="col-3 d-flex flex-column align-items-center justify-content-center">
                                            {
                                                data.item2.itemOwner.logo ? 
                                                <img className="charity-icon-logo col-12" src={"http://localhost:3000/" + data.item2.itemOwner.logo} alt="" /> :
                                                <i className="charity-icon-logo col-12 fa fa-user-circle no-user-icon-logo"></i>
                                            }
                                            <div className="product-item-title mt-2 trade-username" onClick={
                                                () => {
                                                    navigate("/profile/" + data.item2.itemOwner.id);
                                                }
                                            }>{data.item2.itemOwner.username}</div>
                                            {
                                                !data.item2.isDelivered &&
                                                <button className="btnn col-10 deliver-button" onClick={
                                                    async () => {
                                                        await DeliverItem(data.item2._id, data);
                                                    }
                                                }>Deliver</button>
                                            }
                                        </div>  
                                    </div>
                                </div>
                            )
                        })
                        return container;
                    })()
                }
            </div>
            }
            {
            (tradez === undefined || tradez.length === 0) && !isLoading &&
            <div className="col-12 d-flex flex-column align-items-center justify-content-center">
                <img src={NoData} alt=""></img>
                <h1 className="no-tradez">{t("NoTradez")}</h1>
            </div>
            }
        </div>
	);
};

export default AllTradez;
