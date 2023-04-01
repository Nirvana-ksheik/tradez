import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "components/LoadingSpinner";
import { useParams } from "react-router-dom";
import Ribbon from "components/Ribbon";

const ConfirmEmail = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [confirmEmailRibbon, setConfirmEmailRibbon] = useState(false);
    const [confirmEmailText, setConfirmEmailText] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const navigate = useNavigate();

    const {token} = useParams();

    const confirmEmail = async(controller) => {
        setIsLoading(true);
        try {
            let reqInstance = axios.create({
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("token to be sent: ", token);
            const url = "http://localhost:3000/api/auth/confirm/" + token;

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
                }, 3000);
            }).catch(err => {
                console.log("err: ", err);
                setConfirmEmailRibbon(true);
                setConfirmEmailText("Invalid Token / Token Expired")
                setIsLoading(false);
                setIsSuccess(false);
            })
        
        } catch (error) { 
            console.log("error: ", error);
            setConfirmEmailRibbon(true);
            setIsSuccess(false);
            setConfirmEmailText("An Error has occured, please try again later.");
            setIsLoading(false);
        }
    }

    useEffect(()=>{
        const controller = new AbortController();
        confirmEmail(controller);
    }, []);

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
