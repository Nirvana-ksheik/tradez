import React from 'react';
import axios from 'axios';
import Ribbon from 'components/Ribbon';
import { useEffect, useRef } from 'react';
import { useState } from 'react';
import { Role } from 'lookups';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLayoutEffect } from 'react';
import { formatDateWithLanguage } from '../../helpers/dateFormatHelper';
import { formatNumberWithCommas } from '../../helpers/numberFormatHelper';
import LoadingSpinner from '../../components/LoadingSpinner';
import './userProfile.css';

const UserProfilePage = ({getCookie, user, currentLanguage}) => {

    const [userData, setUserData] = useState(null);
    const [forgotPassRibbon, setForgotPassRibbon] = useState(false);
    const [forgotPassText, setForgotPassText] = useState('');
	const [screenWidth, setScreenWidth] = useState();
    const [profilePicture, setProfilePicture] = useState();
    const [isLoading, setIsLoading] = useState();
    const [profilePictureUrl, setProfilePictureUrl] = useState();

    const inputFile = useRef(null) 

    const navigation = useNavigate();

    const { t } = useTranslation();

    useLayoutEffect(() => {
		function detectScreenWidth() { setScreenWidth(window.screen.availWidth) }
		window.addEventListener('resize', detectScreenWidth);
		setScreenWidth(window.screen.availWidth);
		return () => window.removeEventListener('resize', detectScreenWidth);
	  }, []);

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
    }, [getCookie, setUserData, user, navigation, profilePictureUrl]);

    useEffect(() => {
        // Clean up the object URL when the component unmounts
        return () => {
          if (profilePictureUrl) {
            URL.revokeObjectURL(profilePictureUrl);
            setProfilePictureUrl(null);
          }
        };
      }, [profilePictureUrl, setProfilePictureUrl]);

    const imageChange = (event)=> {
        event.preventDefault();
        var file = event.target.files[0];
        if(file){
            console.log("Chosen Image: ", file);
            const pictureURL = URL.createObjectURL(file);
            setProfilePictureUrl(pictureURL);
            setProfilePicture(file);
        }
    }

    const changeProfilePicture = async() => {

        if(!profilePicture || profilePicture == null){
            console.log("Profile picture not selected");
            return;
        }

        try{
            setIsLoading(true);
            const token = getCookie();
            let reqInstance = axios.create({
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const url = "http://localhost:3000/api/auth/update-logo";

            const formData = new FormData();
            formData.append('logo', profilePicture);
            
            await reqInstance.put(url, formData,
                {
					withCredentials: true,
					baseURL: 'http://localhost:3000',
				})
                .then(({data: res}) => {
                    console.log("logo image url: ", res);
                    setUserData(userData => ({...userData, logo: res}));
                    setProfilePicture(null);
                    if (profilePictureUrl) {
                        URL.revokeObjectURL(profilePictureUrl);
                        setProfilePictureUrl(null);
                    }
                    setIsLoading(false);
                })
                .catch((err)=>{
                    console.log("Error saving logo image to the database", err);
                    setIsLoading(false);
                });
        }catch(err){
            console.log("Error changing profile picture", err);
            setIsLoading(false);
        }
    }

    return (
        <>
            {
                isLoading ?
                <LoadingSpinner /> :

                userData != null && user != null && user !== undefined && 
                <div dir={currentLanguage === "ar" ? "rtl" : "ltr"} className="mt-lg-5 mt-3 d-flex col-12 flex-column justify-content-center">
                    <div className="col-12 d-flex justify-content-lg-around align-items-lg-start align-items-center flex-lg-row flex-column">
                        <div className={ screenWidth < 992 ? "col-lg-4 col-lg-5 d-flex flex-column align-items-center" : "col-lg-4 col-lg-5 d-flex flex-column"}>
                            {
                                (userData && userData.result && userData.result.logo) || (profilePictureUrl && profilePictureUrl != null) ?
                                <>
                                    <div style={{position: "relative"}}>
                                        <img className="col-12 icon profile-picture-placeholder" src={
                                                profilePictureUrl && profilePictureUrl != null ? 
                                                profilePictureUrl :
                                                "http://localhost:3000" + userData.result.logo
                                            } alt=''/>
                                        <i className="fa-solid fa-pen-to-square update-profile-pic-link edit-profile-picture-button" onClick={
                                            () => {
                                                inputFile.current.click();
                                            }
                                        }></i>
                                    </div>
                                    {
                                        profilePictureUrl && profilePictureUrl != null &&
                                        <button className="btnn col-12 mt-3" onClick={changeProfilePicture}>{t("Confirm")}</button>
                                    }
                                </> :
                                <div style={{position: "relative"}}>
                                    <i className="fas fa-user-circle col-12 icon"></i>
                                    <i className="fa-solid fa-pen-to-square update-profile-pic-link edit-profile-picture-button" onClick={
                                        () => {
                                            inputFile.current.click();
                                        }
                                    }></i>
                                </div> 
                            }
                            <div className='d-flex col-12 mt-3 justify-content-around align-items-end'>
                                <input type='file' id='file' ref={inputFile} style={{display: 'none'}} onChange={imageChange}/>
                            </div>
                            {
                                screenWidth >= 992 &&
                                <>
                                    <button className="mt-3 btnn">{t("LogOutLink")}</button>
                                    <button className="mt-3 btnn" onClick={changePassword}>{t("ChangePasswordLink")}</button>
                                </>
                            }

                        </div>
                        <div className="col-lg-3 col-11 mt-4 mt-lg-0">
                            <h2 className="username pe-1 ps-1 col-md-5 col-7 col-lg-12">{userData.result.username}</h2>
                            <div className="col-12 d-flex align-items-center justify-content-between pe-3 ps-3">
                                <i className="col-1 fa-solid fa-envelope align-items-center email-charity-logo align-items-center m-0"></i>
                                &nbsp;&nbsp;&nbsp;
                                <p className="col-11 email align-items-center font-bold m-0">{userData.result.email}</p>
                            </div>
                            <div className="col-12 d-flex align-items-center justify-content-between pe-3 ps-3">
                                <i className="col-1 fa-solid fa-cubes align-items-center email-charity-logo align-items-center m-0"></i>
                                &nbsp;&nbsp;&nbsp;
                                <p className="col-11 email align-items-center font-bold m-0">{formatNumberWithCommas(userData.result.numberOfTradez, currentLanguage) + t("NumberOfTradez")}</p>
                            </div>
                            <div className="col-12 d-flex align-items-center justify-content-between pe-3 ps-3">
                                <i className="col-1 fa-solid fa-cube align-items-center email-charity-logo align-items-center m-0"></i>
                                &nbsp;&nbsp;&nbsp;
                                <p className="col-11 email align-items-center font-bold m-0">{t("TotalItems") + formatNumberWithCommas(userData.result.totalItems, currentLanguage)}</p>
                            </div>                           
                            <div className='col-12 d-flex align-items-center justify-content-between mt-2 pe-3 ps-3'>
                                <p className='date charity-profile-text-headers'>{t("JoinedOn")} </p><p className="date date-weight">{formatDateWithLanguage(userData.result.createdDate, currentLanguage)}</p>
                            </div>
                        </div>
                        {
                            screenWidth < 992 &&
                            <div className='d-flex col-10 flex-column mt-5 align-items-center'>
                                <button className="mt-3 btnn col-12">{t("LogOutLink")}</button>
                                <button className="mt-3 btnn col-12" onClick={changePassword}>{t("ChangePasswordLink")}</button>
                            </div>
                        }
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