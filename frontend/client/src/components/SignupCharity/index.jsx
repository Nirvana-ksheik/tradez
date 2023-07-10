import { useState, useLayoutEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "components/LoadingSpinner";
import Ribbon from "components/Ribbon";
import "./signupCharity.css";
import ExpandableTextArea from "components/ExpandabletextArea";
import CharityUser from "components/CharityUser";
import { Notifications, parseModelString } from "notifications";
import { adminNotificationSender } from "helpers/notificationHelper";
import { useTranslation } from "react-i18next";

const SignupCharity = ({currentLanguage}) => {
	const [data, setData] = useState({
		username: "",
		email: "",
		password: "",
	});

	const [error, setError] = useState("");
	const [screenWidth, setScreenWidth] = useState();
	const [isLoading, setIsLoading] = useState(false);
    const [signupRibbon, setSignupRibbon] = useState(false);
    const [signupText, setSignupText] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);

    const { t } = useTranslation();

	const navigate = useNavigate();

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
        console.log("data: ", data);
	};

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

	useLayoutEffect(() => {
		function detectScreenWidth() { setScreenWidth(window.screen.availWidth) }
		window.addEventListener('resize', detectScreenWidth);
		setScreenWidth(window.screen.availWidth);
		return () => window.removeEventListener('resize', detectScreenWidth);
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setSignupRibbon(false);
        const formData = new FormData();
        
        if(selectedFile){
            formData.append('logo', selectedFile);
        }

        formData.append('organizationName', data.organizationName);
        formData.append('address', data.address);
        formData.append('telephoneNb', data.telephoneNb);
        formData.append('email', data.email);
        formData.append('website', data.website);
        formData.append('registrationNb', data.registrationNb);
        formData.append('taxNb', data.taxNb);
        formData.append('directors', data.directors);
        formData.append('ceo', data.ceo);
        formData.append('annualTurnover', data.annualTurnover);
        formData.append('mission', data.mission);
        formData.append('additionalInfo', data.additionalInfo);

		try {
			const url = "http://localhost:3000/api/charity/auth/signup";
			const { data: res } = await axios.post(url, formData, 
				{
					withCredentials: true,
					baseURL: 'http://localhost:3000'
				});
			setIsLoading(false);
			setSignupRibbon(true);
			setSignupText("Please confirm your email to continue the process");

            const modelData = {
                username: data.organizationName
            };
            const notificationObject = Notifications.CHARITY_SIGNUP;
            const notificationMessage = parseModelString(notificationObject.message, modelData);
    
            await adminNotificationSender({message: notificationMessage, title: notificationObject.title});

			console.log(res.message);
		} catch (error) {
			setIsLoading(false);
			setSignupRibbon(true);
			setSignupText("Error occured");
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);
			}
		}
	};

	return (
		<>
		{isLoading === true && <LoadingSpinner />}
		{signupRibbon === true && <Ribbon text={signupText} setShowValue={setSignupRibbon} isSuccess={error === ""} showTime={10000}/>}
		{
			isLoading === false && 
			<div dir={currentLanguage === "ar" ? "rtl" : "ltr"} className="d-flex flex-column justify-content-center align-items-center col-12 col-md-11 mt-5 mb-5 form-parent-container charity-container-signup">
                <CharityUser />
				<div className="signup_form_container main-container mt-5 d-flex col-12">
					<div className="d-md-flex col-md-3 flex-md-column justify-content-md-center right">
						<p className="next-div-title">{t("WelcomeBack")}</p>
						<button type="button" className="white_btn login_box" onClick={() => {
                            navigate("/charity/login", {state: {isUser: false, isCharity: true}});
                        }}>
							{t("Login")}
						</button>
					</div>
					<div className="left col-md-9 col-12 d-flex flex-column justify-content-center align-items-center">
                        <p className="div-title mt-4">{t("CreateCharityAccount")}</p>
                        <hr></hr>
						<form className="col-12 d-flex flex-column" onSubmit={handleSubmit}>
                            <div className="col-12 d-flex">
                                <div className="col-md-6 col-12 d-flex flex-column justify-content-start charity-div">
                                    <div className="d-flex col-11 align-items-end justify-content-between m-3">
                                        <label className="col-3 charity-form-label">{t("OrganizationNameLabel")} </label>
                                        <input
                                            type="text"
                                            placeholder=""
                                            name="organizationName"
                                            onChange={handleChange}
                                            required
                                            className="charity-input col-8"
                                        />
                                    </div>
                                    <div className="d-flex col-11 align-items-end justify-content-between m-3">
                                        <label className="col-3 charity-form-label">{t("AddressLabel")} </label>
                                        <input
                                            type="text"
                                            placeholder=""
                                            name="address"
                                            onChange={handleChange}
                                            required
                                            className="charity-input col-8"
                                        />
                                    </div>
                                    <div className="d-flex col-11 align-items-end justify-content-between m-3">
                                        <label className="col-3 charity-form-label">{t("TelephoneNbLabel")} </label>
                                        <input
                                            type="text"
                                            placeholder=""
                                            name="telephoneNb"
                                            onChange={handleChange}
                                            required
                                            className="charity-input col-8"
                                        />
                                    </div>
                                    <div className="d-flex col-11 align-items-end justify-content-between m-3">
                                        <label className="col-3 charity-form-label">{t("EmailLabel")} </label>
                                        <input
                                            type="email"
                                            placeholder=""
                                            name="email"
                                            onChange={handleChange}
                                            required
                                            className="charity-input col-8"
                                        />
                                    </div>
                                    <div className="d-flex col-11 align-items-end justify-content-between m-3">
                                        <label className="col-3 charity-form-label">{t("WebsiteLabel")} </label>
                                        <input
                                            type="link"
                                            placeholder=""
                                            name="website"
                                            onChange={handleChange}
                                            required
                                            className="charity-input col-8"
                                        />
                                    </div>
                                    <div className="d-flex col-11 align-items-end justify-content-between m-3">
                                        <label className="col-3 charity-form-label">{t("RegistrationNbLabel")} </label>
                                        <input
                                            type="text"
                                            placeholder=""
                                            name="registrationNb"
                                            onChange={handleChange}
                                            required
                                            className="charity-input col-8"
                                        />
                                    </div>
                                    <div className="d-flex col-11 align-items-end justify-content-between m-3">
                                        <label className="col-3 charity-form-label">{t("TaxNbLabel")} </label>
                                        <input
                                            type="text"
                                            placeholder=""
                                            name="taxNb"
                                            onChange={handleChange}
                                            required
                                            className="charity-input col-8"
                                        />
                                    </div>
                                    <div className="d-flex col-11 align-items-end justify-content-between m-3">
                                        <label className="col-3 charity-form-label">{t("Trustees&DirectorsLabel")} </label>
                                        <input
                                            type="text"
                                            placeholder=""
                                            name="directors"
                                            onChange={handleChange} 
                                            required
                                            className="charity-input col-8"
                                        />
                                    </div>
                                    <div className="d-flex col-11 align-items-end justify-content-between m-3">
                                        <label className="col-3 charity-form-label">{t("CEO/ExecutiveLabel")} </label>
                                        <input
                                            type="text"
                                            placeholder=""
                                            name="ceo"
                                            onChange={handleChange}
                                            required
                                            className="charity-input col-8"
                                        />
                                    </div>
                                </div>
                                <div className=""></div>
                                <div className="col-md-6 col-12 d-flex flex-column justify-content-start charity-div">
                                    <div className="d-flex col-11 align-items-end justify-content-between m-3">
                                        <label className="col-3 charity-form-label">{t("AnnualTurnoverLabel")} </label>
                                        <input
                                            type="text"
                                            placeholder=""
                                            name="annualTurnover"
                                            onChange={handleChange}
                                            required
                                            className="charity-input col-8"
                                        />
                                    </div>
                                    <div className="d-flex col-11 align-items-end justify-content-between m-3">
                                        <label className="col-3 charity-form-label">{t("LogoImageLabel")}</label>
                                        <input
                                            type="file"
                                            placeholder=""
                                            name="logo"
                                            onChange={handleFileChange}
                                            required
                                            className="charity-input col-8"
                                        />
                                    </div>
                                    <div className="d-flex col-11 align-items-start justify-content-between m-3">
                                        <label className="col-3 charity-form-label">{t("Vision&MissionLabel")} </label>
                                        <ExpandableTextArea 
                                            name={"mission"}
                                            className={"charity-input col-8"}
                                            handleChange={handleChange}
                                            value={data.mission}
                                        />
                                    </div>
                                    <div className="d-flex col-11 align-items-start justify-content-between m-3">
                                        <label className="col-3 charity-form-label">{t("AdditionalInformationLabel")} </label>
                                        <ExpandableTextArea 
                                            name={"additionalInfo"}
                                            className={"charity-input col-8"}
                                            handleChange={handleChange}
                                            value={data.additionalInfo}
                                        />
                                    </div>
                                </div>
                            </div>
							{error && <div className="error_msg col-8 offset-2">{error}</div>}
                            <div className="col-12 d-flex align-items-center justify-content-center mb-2">
                                <button type="submit" className="green_btn col-6 margin_top_btn">
                                    {t("Signup")}
                                </button>
                            </div>

							{screenWidth < 768 && <div className="m-2">{t("LoginInstead?")} <Link to="/login">{t("ClickHere")}</Link></div>}
						</form>
					</div>
				</div>
			</div>
		}
		</>
	);
};

export default SignupCharity;
