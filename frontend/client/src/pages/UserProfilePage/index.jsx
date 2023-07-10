import React from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import { Role } from 'lookups';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Ribbon from 'components/Ribbon';
import './userProfile.css';

const UserProfilePage = ({getCookie, user, currentLanguage}) => {

    const [userData, setUserData] = useState(null);
    const [forgotPassRibbon, setForgotPassRibbon] = useState(false);
    const [forgotPassText, setForgotPassText] = useState('');
    const navigation = useNavigate();

    const { t } = useTranslation();

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
            const url = "http://localhost:3000/api/auth/forgot";
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
        const getUserProfile = async(controller) =>{
            console.log("entered get user profile");
            try {
                const token = getCookie();
                let reqInstance = axios.create({
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const url = "http://localhost:3000/api/auth/profile";
                await reqInstance.get(url, 
                { signal: controller.signal },
                {
                    withCredentials: true,
                    baseURL: 'http://localhost:3000'
                })
                .then(({data: res}) => { 
                    console.log("result: ", res);
                    setUserData(res);
                });
    
            }catch(err){
                console.log("error: ", err);
            }
        }

        if(user != null && user.role === Role.CHARITY){
            navigation("/");
        }

        const controller = new AbortController();
        getUserProfile(controller);

        return ()=>{
            controller.abort();
        };
    }, [getCookie, setUserData, user, navigation]);

    return (
        <>
            {
                userData != null && user != null && user !== undefined && 
                <div dir={currentLanguage === "ar" ? "rtl" : "ltr"} className="mt-5 d-flex col-12 flex-column justify-content-center">
                    <div className="col-12 d-flex justify-content-center">
                        <div className="col-4 offset-1 d-flex flex-column">
                            <i className="fas fa-user-circle col-12 icon"></i>
                            <button className="mt-3 btnn">{t("LogOutLink")}</button>
                            <button className="mt-3 btnn" onClick={changePassword}>{t("ChangePasswordLink")}</button>
                        </div>
                        <div className="col-3 offset-1">
                            <h2 className="username">{userData.result.username}</h2>
                            <p className="email">{userData.result.email}</p>
                            <div className='d-flex col-8 justify-content-between'>
                                <p className='date'>{t("JoinedOn")} </p><span className="date date-weight">{userData.result.createdDate}</span>
                            </div>
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

export default UserProfilePage;