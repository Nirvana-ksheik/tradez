import axios from 'axios';
import { useEffect, useState } from 'react';
import Ribbon from 'components/Ribbon';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; 
import "./charityProilePage.css"
import { formatNumberWithCommas } from '../../helpers/numberFormatHelper';

const CharityProfilePage = ({getCookie, user, currentLanguage}) => {

    const [userData, setUserData] = useState(null);
    const [forgotPassRibbon, setForgotPassRibbon] = useState(false);
    const [forgotPassText, setForgotPassText] = useState('');
    const {id} = useParams();

    const {t} = useTranslation();

    const changePassword = () => {
        setForgotPassRibbon(false);
        try {
            const token = getCookie();
            let reqInstance = axios.create({
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("token to be sent: ", token);
            const url = "http://localhost:3000/api/charity/auth/forgot";
            console.log("email: ", userData.result.email);
            reqInstance.post(
                url, 
                {email: userData.result.email},
                {
                    withCredentials: true,
                    baseURL: 'http://localhost:3000'
                }
            ).then(({data: res}) => { 
                console.log("forgot pass result: ", res);
                setForgotPassRibbon(true);
                setForgotPassText(res);
            });
        
        } catch (error) { 
            console.log("error: ", error);
        }
    }

    useEffect(() => {
        const getUserProfile = async(controller) => {

            try{
    
                const token = getCookie();
                const url = 'http://localhost:3000/api/charity/auth/profile/' + id;
                let reqInstance = axios.create({
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
    
                await reqInstance.get(url)
                    .then(({data: res}) => {
                        setUserData(res);
                        console.log("userr: ", userData);
                    })
                    .catch((err) => {
                        console.log("Error requesting charity profile: ", err);
                    })
        
            }catch(err){
                console.log("error: ", err);
            }
        }

        const controller = new AbortController();
        getUserProfile(controller);
        return ()=>{
            controller.abort();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getCookie, setUserData, id])

    return (
        <>
            {
                userData != null && user != null && user !== undefined && 
                <div dir={currentLanguage === "ar" ? "rtl" : "ltr"} className="mt-5 d-flex col-12 flex-column justify-content-center align-items-center">
                    <div className="col-12 d-flex justify-content-center">
                        <div className="col-4 offset-1 d-flex flex-column">
                            {
                                userData.result.logo ?
                                <img className="charity-icon-logo col-12" src={"http://localhost:3000/" + userData.result.logo} alt="" /> :
                                <i className="fas fa-user-circle col-12 icon"></i>
                            }
                            <button className="mt-3 btnn">{t("LogOutLink")}</button>
                            <button className="mt-3 btnn" onClick={changePassword}>{t("ChangePasswordLink")}</button>
                        </div>
                        <div className="col-3 offset-1">
                            <h2 className="username">{userData.result.organizationName}</h2>
                            <p className="email">{userData.result.email}</p>
                            <p className="email">{userData.result.telephoneNb}</p>
                            <p className="email">{userData.result.website}</p>
                            <p className="email">{userData.result.directors}</p>
                            <p className="email">{userData.result.ceo}</p>
                            <p className="email">{formatNumberWithCommas(userData.result.annualTurnover, currentLanguage)}</p>

                            <div className='d-flex col-8 justify-content-between'>
                                <p className='date'>{t("JoinedOn")} </p><span className="date date-weight">{userData.result.createdDate}</span>
                            </div>
                        </div>
                    </div>
                    <div className='col-10 d-flex flex-column justify-content-center align-items-center mt-5'>
                        <div className='col-12 d-flex flex-column'>
                            <h3 className={currentLanguage === "ar" ? 'text-right' : 'text-left'}>{t("Vision&MissionLabel")} </h3>
                            <h6 className={currentLanguage === "ar" ? 'text-right' : 'text-left'}>{userData.result.mission}</h6>
                        </div>
                    </div>
                    <div className='col-10  d-flex flex-column justify-content-center align-items-center mt-5'>
                        <div className='col-12 d-flex flex-column'>
                            <h3 className={currentLanguage === "ar" ? 'text-right' : 'text-left'}>{t("AdditionalInformationLabel")} </h3>
                            <h6 className={currentLanguage === "ar" ? 'text-right' : 'text-left'}>{userData.result.additionalInfo}</h6>
                        </div>
                    </div>
                </div>
            }
            {
                forgotPassRibbon && 
                <Ribbon text={forgotPassText} setShowValue={setForgotPassRibbon}/>
            }
        </>
    );
}

export default CharityProfilePage;