import axios from 'axios';
import Ribbon from 'components/Ribbon';
import CategoriesDropDown from 'components/CategoriesDropDown'
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; 
import { formatNumberWithCommas } from '../../helpers/numberFormatHelper';
import { formatDateWithLanguage } from '../../helpers/dateFormatHelper';
import LoadingSpinner from 'components/LoadingSpinner';
import { useLayoutEffect } from 'react';
import { findCategoryDescription } from '../../helpers/categoriesHelper';
import AllPosts from '../AllPosts';
import ChangeStatusDialogue from '../../components/ChangeStatusDialogue';
import { CharityStatus, Role } from '../../lookups';
import IconTextButton from 'components/IconTextButton'
import { useRef } from 'react';
import { Notifications, parseModelString } from '../../notifications';
import { followersNotificationSender } from '../../helpers/notificationHelper';
import "./charityProilePage.css"

const CharityProfilePage = ({getCookie, user, currentLanguage}) => {

    const [userData, setUserData] = useState(null);
    const [forgotPassRibbon, setForgotPassRibbon] = useState(false);
    const [forgotPassText, setForgotPassText] = useState('');
	const [screenWidth, setScreenWidth] = useState();
    const [categories, setCategories] = useState([]);
    const [editCategories, setEditCategories] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmationDialogue, setShowConfirmationDialogue] = useState(false);
    const [itemStatus, setItemStatus] = useState();
    const [profilePictureUrl, setProfilePictureUrl] = useState();
    const [profilePicture, setProfilePicture] = useState();
    const [isFollower, setIsFollower] = useState([]);

    const inputFile = useRef(null);
    const navigate = useNavigate();
    const {id} = useParams();

    const {t} = useTranslation();

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
                setIsLoading(true);
                const token = getCookie();
                const url = 'http://localhost:3000/api/charity/auth/profile/' + id;
                let reqInstance = axios.create({
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
    
                await reqInstance.get(url,
                    {
                        signal: controller.signal
                    })
                    .then(({data: res}) => {
                        setUserData(res);
                        console.log("data returned from charity profile: ", res)
                        setCategories(res.result.categories);
                        setIsFollower(res.result.followers.find(({userId: val}) => val.toString() === user.id.toString()));
                        setIsLoading(false);
                        console.log("userr: ", userData);
                    })
                    .catch((err) => {
                        setIsLoading(false);
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
    }, [getCookie, setUserData, id, setCategories, profilePictureUrl, setIsFollower])

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

    const updateCharityCategories = async ()=>{

        setIsLoading(true);
        const token = getCookie();
        const url = 'http://localhost:3000/api/charity/categories';
        let reqInstance = axios.create({
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        await reqInstance.put(url, 
            {
                categories: categories
            })
            .then(({data: res}) => {
                editCategories(false);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log("Error updatin categories profile: ", err);
                setIsLoading(false);
            });

        const modelData = {
            username: user.username
        };

        const notificationObject = Notifications.CHARITY_UPDATED_NEEDS;
        const notificationMessage = parseModelString(notificationObject.message, modelData);
        const notificationMessageAr = parseModelString(notificationObject.message_ar, modelData);

        await followersNotificationSender({
            charityId: user.id,
            message: notificationMessage,
            title: notificationObject.title,
            message_ar: notificationMessageAr,
            title_ar: notificationObject.title_ar,
            currentLanguage: currentLanguage
        });

    }

    const editSubscription = async () => {

        setIsLoading(true);
        const token = getCookie();
        console.log("current user id: ", user.id);
        console.log("chartiy user id: ", userData.result._id);
        const url = 'http://localhost:3000/api/charity/subscription/' + userData.result._id;

        let reqInstance = axios.create({
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        await reqInstance.put(url, 
            {
                categories: categories
            })
            .then(({data: res}) => {
                console.log("isFollower: ", res);
                setIsLoading(false);
                setUserData((prevData) => ({ ...prevData, ...res }));
                setIsFollower(!isFollower);
            })
            .catch((err) => {
                console.log("Error updatin categories profile: ", err);
                setIsLoading(false);
            })
    }

    return (
        <>
            {
                isLoading &&
                <LoadingSpinner />
            }
            {
                !isLoading && userData != null && user != null && user !== undefined && 
                <div dir={currentLanguage === "ar" ? "rtl" : "ltr"} className="mt-md-5 mt-3 d-flex col-12 flex-lg-row flex-column justify-content-md-center align-items-md-center align-items-lg-start">
                    <div className={screenWidth <= 768 ? "col-12 d-flex justify-content-md-around align-items-center flex-md-row" : "col-12 col-lg-4 d-flex p-5 sticky-nav"}>
                        <div className={ screenWidth < 600 ? "col-md-5 d-flex flex-column align-items-center" : "col-lg-12 col-md-5 d-flex flex-column align"}>
                            {

                                userData.result.logo ?
                                <>
                                    <div style={{position: "relative"}}>
                                        <img className="charity-icon-logo col-12" src={"http://localhost:3000/" + userData.result.logo} alt="" />
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
                                </>
                                :
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
                                screenWidth >= 600 && userData.result._id === user.id &&
                                <>
                                    <button className="mt-3 btnn">{t("LogOutLink")}</button>
                                    <button className="mt-3 btnn" onClick={changePassword}>{t("ChangePasswordLink")}</button>
                                </>
                            }
                            {
                                screenWidth > 768 && 
                                <div className="col-3 col-md-4 col-lg-12 col-11 mt-5 mt-md-0 mt-lg-5">
                                    <h2 className="username col-md-12 pe-1 ps-1 col-8" onClick={() => {
                                        navigate("/charity/profile/" + userData.result._id);
                                        window.location.reload();
                                    }
                                    }>{userData.result.organizationName}
                                    </h2>
                                    <div className="col-12 d-flex align-items-center justify-content-between pe-3 ps-3">
                                        <i className="col-1 fa-solid fa-envelope align-items-center email-charity-logo align-items-center m-0"></i>
                                        &nbsp;&nbsp;&nbsp;
                                        <p className="col-11 email align-items-center font-bold m-0">{userData.result.email}</p>
                                    </div>
                                    <div className="col-12 d-flex align-items-center justify-content-between pe-3 ps-3">
                                        <i className="col-1 fa-solid fa-phone align-items-center email-charity-logo align-items-center m-0"></i>
                                        &nbsp;&nbsp;&nbsp;
                                        <p className="col-11 email align-items-center font-bold m-0">{userData.result.telephoneNb}</p>
                                    </div>
                                    <div className="col-12 d-flex align-items-center justify-content-between pe-3 ps-3">
                                        <i className="col-1 fa-solid fa-globe align-items-center email-charity-logo align-items-center m-0"></i>
                                        &nbsp;&nbsp;&nbsp;
                                        <a className="col-11 email align-items-center font-bold m-0" href={userData.result.website} target="_blank" rel="noreferrer" onClick={(e)=>{
                                            e.preventDefault();
                                            window.open(userData.result.website, '_blank', 'noreferrer')
                                        }}>{userData.result.website}</a>
                                    </div>
                                    <div className="col-12 d-flex align-items-center justify-content-between pe-3 ps-3">
                                        <i className="col-1 fa-solid fa-users align-items-center email-charity-logo align-items-center m-0"></i>
                                        &nbsp;&nbsp;&nbsp;
                                        <p className="col-11 email align-items-center font-bold m-0">{userData.result.directors}</p>
                                    </div>
                                    <div className="col-12 d-flex align-items-center justify-content-between pe-3 ps-3">
                                        <i className="col-1 fa-solid fa-user-tie align-items-center email-charity-logo align-items-center m-0"></i>
                                        &nbsp;&nbsp;&nbsp;
                                        <p className="col-11 email align-items-center font-bold m-0">{userData.result.ceo}</p>
                                    </div>
                                    <div className="col-12 d-flex align-items-center justify-content-between pe-3 ps-3">
                                        <i className="col-1 fa-solid fa-coins align-items-center email-charity-logo align-items-center m-0"></i>
                                        &nbsp;&nbsp;&nbsp;
                                        <p className="col-11 email align-items-center font-bold m-0">{formatNumberWithCommas(userData.result.annualTurnover, currentLanguage)}</p>
                                    </div>
        
                                    <div className='col-12 d-flex align-items-center justify-content-between mt-2 pe-3 ps-3'>
                                        <p className='date charity-profile-text-headers'>{t("JoinedOn")} </p><span className="date date-weight">{formatDateWithLanguage(userData.result.createdDate, currentLanguage)}</span>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                    {
                        screenWidth <= 768 &&
                        <div className="col-3 col-md-4 col-11 mt-4 mt-md-0 p-3 p-lg-0">
                            <h2 className="username col-md-12 pe-1 ps-1 col-8">{userData.result.organizationName}</h2>
                            <div className="col-12 d-flex align-items-center justify-content-between pe-3 ps-3">
                                <i className="col-1 fa-solid fa-envelope align-items-center email-charity-logo align-items-center m-0"></i>
                                &nbsp;&nbsp;&nbsp;
                                <p className="col-11 email align-items-center font-bold m-0">{userData.result.email}</p>
                            </div>
                            <div className="col-12 d-flex align-items-center justify-content-between pe-3 ps-3">
                                <i className="col-1 fa-solid fa-phone align-items-center email-charity-logo align-items-center m-0"></i>
                                &nbsp;&nbsp;&nbsp;
                                <p className="col-11 email align-items-center font-bold m-0">{userData.result.telephoneNb}</p>
                            </div>
                            <div className="col-12 d-flex align-items-center justify-content-between pe-3 ps-3">
                                <i className="col-1 fa-solid fa-globe align-items-center email-charity-logo align-items-center m-0"></i>
                                &nbsp;&nbsp;&nbsp;
                                <p className="col-11 email align-items-center font-bold m-0">{userData.result.website}</p>
                            </div>
                            <div className="col-12 d-flex align-items-center justify-content-between pe-3 ps-3">
                                <i className="col-1 fa-solid fa-users align-items-center email-charity-logo align-items-center m-0"></i>
                                &nbsp;&nbsp;&nbsp;
                                <p className="col-11 email align-items-center font-bold m-0">{userData.result.directors}</p>
                            </div>
                            <div className="col-12 d-flex align-items-center justify-content-between pe-3 ps-3">
                                <i className="col-1 fa-solid fa-user-tie align-items-center email-charity-logo align-items-center m-0"></i>
                                &nbsp;&nbsp;&nbsp;
                                <p className="col-11 email align-items-center font-bold m-0">{userData.result.ceo}</p>
                            </div>
                            <div className="col-12 d-flex align-items-center justify-content-between pe-3 ps-3">
                                <i className="col-1 fa-solid fa-coins align-items-center email-charity-logo align-items-center m-0"></i>
                                &nbsp;&nbsp;&nbsp;
                                <p className="col-11 email align-items-center font-bold m-0">{formatNumberWithCommas(userData.result.annualTurnover, currentLanguage)}</p>
                            </div>

                            <div className='col-12 d-flex align-items-center justify-content-between mt-2 pe-3 ps-3'>
                                <p className='date charity-profile-text-headers'>{t("JoinedOn")} </p><span className="date date-weight">{formatDateWithLanguage(userData.result.createdDate, currentLanguage)}</span>
                            </div>
                        </div>
                    }
                    <div className='col-8 d-flex flex-column justify-content-lg-center justiffy-content-center align-items-start p-lg-5'>
                        {
                            user && user.id !== userData.result._id &&
                            <div className='col-md-3 col-5 d-flex flex-column justify-content-center align-items-center mt-5 mt-lg-2'>
                                <button className={isFollower ? 'unfollow-btn col-11 ms-2' : 'follow-btn col-11 ms-2'} onClick={editSubscription}>
                                    {isFollower ? t("UnFollow") : t("Follow")}
                                </button>
                            </div>
                        }

                        <div className='col-md-10 col-12 d-flex flex-column justify-content-center align-items-center mt-5 mt-lg-2'>
                            <div className='col-11 d-flex flex-column'>
                            {
                                userData.result && userData.result.status === CharityStatus.PENDING && user && user.role === Role.ADMIN &&
                                <div className="d-flex col-12 mb-3 justify-content-between align-items-center">
                                    <IconTextButton 
                                        text={t("Approve")}
                                        onClick={() => {setItemStatus(CharityStatus.APPROVED); setShowConfirmationDialogue(true);}}
                                        icon={<i className="fas fa-check"></i>}
                                        btnClass={"approve"}
                                    />    
                                    <IconTextButton 
                                        text={t("Reject")}
                                        onClick={() => {setItemStatus(CharityStatus.REJECTED); setShowConfirmationDialogue(true);}}
                                        icon={<i className="fas fa-times"></i>}
                                        btnClass={"reject"}
                                    />         
                                </div>  
                            }
                            {
                                showConfirmationDialogue &&
                                <ChangeStatusDialogue id={userData.result._id} status={itemStatus} getCookie={getCookie} setShowDialogue={setShowConfirmationDialogue} ownerId={userData.result._id} currentLanguage={currentLanguage} isCharity={true}/>
                            }
                                <div className='col-12 d-flex flex-md-row flex-column mt-lg-3'>
                                    <h3 className={currentLanguage === "ar" ? 'text-right charity-profile-text-headers ms-4' : 'text-left charity-profile-text-headers me-4'}>{t("whatToDonateLabel")} </h3>
                                    {
                                        editCategories && userData.result._id === user.id &&
                                        <div className='d-flex justify-content-start align-items-center col-lg-6'>
                                            <CategoriesDropDown btnName={t("Categories")} setDropValue={setCategories} dropValue={categories} currentLanguage={currentLanguage} className={"col-12 form-control-sm"}/>
                                            <i className="fa-solid fa-circle-check categories-approve me-2 ms-2" onClick={async() => {
                                                await updateCharityCategories()
                                            }}></i>
                                            <i className="fa-solid fa-circle-xmark categories-reject me-2 ms-2" onClick={() => {
                                                setEditCategories(false);
                                            }}></i>
                                        </div>
                                    }

                                    {
                                        !editCategories && userData.result._id === user.id &&
                                        <i className="fa-solid fa-pen-to-square ms-2 me-2 categories-edit" onClick={() => {
                                            setEditCategories(true);
                                        }}></i>
                                    }
                                </div>

                                <div className="col-12 d-flex flex-wrap mt-3">
                                {
                                    ( () => {
                                        let container = [];

                                        categories.forEach((cat, j) => {
                                            container.push(
                                                <div key={j} className="subcat-label">
                                                    <span>
                                                        {findCategoryDescription(cat, currentLanguage)}
                                                    </span>
                                                </div>
                                            )
                                        })
                                        return container;
                                    })()
                                }
                                {
                                    ((categories == null || categories === undefined || categories.length === 0) && userData.result._id !== user.id) &&
                                    <h6 className={currentLanguage === "ar" ? 'text-right charity-profile-text' : 'text-left charity-profile-text'}>
                                        {t("CharityDidntAddCategories")}
                                    </h6>
                                }
                                </div>
                            </div>
                        </div>
                        <div className='col-md-10 col-12 d-flex flex-column justify-content-center align-items-center mt-5 mt-lg-3'>
                            <div className='col-11 d-flex flex-column'>
                                <h3 className={currentLanguage === "ar" ? 'text-right charity-profile-text-headers' : 'text-left charity-profile-text-headers'}>{t("Vision&MissionLabel")} </h3>
                                <h6 className={currentLanguage === "ar" ? 'text-right charity-profile-text' : 'text-left charity-profile-text'}>{userData.result.mission}</h6>
                            </div>
                        </div>
                    
                        <div className='col-md-10 col-12 d-flex flex-column justify-content-center align-items-center mt-5 mt-lg-3'>
                            <div className='col-11 d-flex flex-column'>
                                <h3 className={currentLanguage === "ar" ? 'text-right charity-profile-text-headers' : 'text-left charity-profile-text-headers'}>{t("AdditionalInformationLabel")} </h3>
                                <h6 className={currentLanguage === "ar" ? 'text-right charity-profile-text' : 'text-left charity-profile-text'}>{userData.result.additionalInfo}</h6>
                            </div>
                        </div>
                        {
                            screenWidth < 600 && userData.result._id === user.id &&
                            <div className='d-flex col-10 flex-column mt-5 mt-lg-2 align-items-center justify-content-center'>
                                <button className="mt-3 btnn col-12">{t("LogOutLink")}</button>
                                <button className="mt-3 btnn col-12" onClick={changePassword}>{t("ChangePasswordLink")}</button>
                            </div>
                        }
                        {
                            <AllPosts getCookie={getCookie} user={user} currentLanguage={currentLanguage} isMine={true}/>
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

export default CharityProfilePage;