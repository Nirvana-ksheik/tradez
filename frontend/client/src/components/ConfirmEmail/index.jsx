import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner";
import Ribbon from "../Ribbon";
import axios from "axios";

const ConfirmEmail = ({isCharity = false, currentLanguage}) => {

    const [isLoading, setIsLoading] = useState(true);
    const [confirmEmailRibbon, setConfirmEmailRibbon] = useState(false);
    const [confirmEmailText, setConfirmEmailText] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const navigate = useNavigate();

    const {token} = useParams();
    const {t} = useTranslation();

    useEffect(()=>{
        const confirmEmail = async(controller) => {
            setIsLoading(true);
            try {
                let reqInstance = axios.create({
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log("token to be sent: ", token);
                const url = isCharity ? 
                            "http://localhost:3000/api/charity/auth/confirm/" + token :
                            "http://localhost:3000/api/auth/confirm/" + token;
    
                await reqInstance.post(
                    url, 
                    { 
                        signal: controller.signal
                    },
                    {
                        withCredentials: true,
                        baseURL: 'http://localhost:3000'
                    }
                ).then(({data: res}) => { 
                    setIsSuccess(true);
                    setIsLoading(false);
                    setConfirmEmailRibbon(true);
                    setConfirmEmailText(res);
                    setTimeout(()=>{
                        navigate('/login');
                    }, 10000);
                }).catch(err => {
                    console.log("err: ", err);
                    setConfirmEmailRibbon(true);
                    setConfirmEmailText(t("InvalidToken"))
                    setIsLoading(false);
                    setIsSuccess(false);
                })
            
            } catch (error) { 
                console.log("error: ", error);
                setConfirmEmailRibbon(true);
                setIsSuccess(false);
                setConfirmEmailText(t("ErrorHasOccured"));
                setIsLoading(false);
            }
        }

        const controller = new AbortController();
        confirmEmail(controller);

    }, [isCharity, navigate, token, t]);

	return (
    <div className="col-10 offset-1 mt-5 d-flex justify-content-center align-items-center">
        {
            isLoading &&
            <LoadingSpinner />
        }
        {
            confirmEmailRibbon &&
            <Ribbon text={confirmEmailText} setShowValue={setConfirmEmailRibbon} isSuccess={isSuccess}/>
        }
    </div>
	);
};

export default ConfirmEmail;
