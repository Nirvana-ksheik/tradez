import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ItemStatus } from '../../lookups'
import { Notifications } from '../../notifications'
import { notificationSender } from '../../helpers/notificationHelper'
import axios from "axios";

const ChangeStatusDialogue = ({id, status, getCookie, setShowDialogue, ownerId, currentLanguage, isCharity}) => {

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

        const itemUrl = isCharity ? "http://localhost:3000/api/admin/charity/" + id : "http://localhost:3000/api/admin/item/" + id;
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
            const location = isCharity ? "/charities" : "/allitems";
            let notificationObject = null;
            if(status === ItemStatus.APPROVED){
                notificationObject = isCharity ? Notifications.ADMIN_APPROVE_CHARITY : Notifications.ADMIN_APPROVE_ITEM
            }
            else if(status === ItemStatus.REJECTED){
                notificationObject = isCharity ? Notifications.ADMIN_REJECT_CHARITY : Notifications.ADMIN_REJECT_ITEM
            }

            await notificationSender({
              userId: ownerId,
              message: notificationObject.message,
              title: notificationObject.title,
              message_ar: notificationObject.message_ar,
              title_ar: notificationObject.title_ar,
              currentLanguage: currentLanguage
            });

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
        <div className={isCharity ? "d-flex col-12 align-items-center justify-content-center" : "d-flex col-8 align-items-center justify-content-center"}>
            <div className={isCharity ? "d-flex col-12 mb-5 flex-column confirmation-dialogue": "d-flex col-8 mb-5 flex-column confirmation-dialogue"}>
                <div className="col-12 d-flex justify-content-start m-2 font-white">
                    <button className="btn btn-danger justify-content-start col-1" onClick={ ()=>{setShowDialogue(false)} }>X</button>
                </div>
                <div className="d-flex col-12 flex-column justify-content-center align-items-center">
                    <form onSubmit={changeItemStatus} className="col-12 justify-content-center align-items-center d-flex flex-column" method="POST">
                        {
                            status === ItemStatus.REJECTED &&
                            <div className="d-flex col-10 flex-column mt-3 justify-content-center align-items-center group p-2">
                                <h3 className="mb-2 align-center">{t("RejectionMessageLabel")}</h3>
                                <div className="d-flex flex-column col-12">
                                    <input className="form-control-sm col-12" type="text" placeholder={t("RejectionMessagePlaceholder")} name="rejectMessage" value={rejectMessage} onChange={handleChange}/>
                                    <p className="sub-text">{t("ReasonForRejectionLabel")}</p>
                                </div>
                            </div>
                        }
                        {
                            status === ItemStatus.APPROVED &&
                            <div className="d-flex col-12 flex-column mt-3 col-12 align-items-center justify-content-center group">
                                <h3 className=" align-center">{t("ConfirmationDialogue")}</h3>
                                <h5 className="">{t("ApproveConfirmation")}</h5>
                                <h5 className="">{t("ThisActionCantBeUndone")}</h5>
                            </div>
                        }
                        <div className="col-12 d-flex justify-content-center mb-lg-1 mt-3">
                            <input type="submit" className="m-1 mb-2 submit-btn-confirm-dialogue col-4" value={status === ItemStatus.APPROVED ? t("Approve") : t("Reject")}/>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
}

export default ChangeStatusDialogue;