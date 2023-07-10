import { useState, useLayoutEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "components/LoadingSpinner";
import Ribbon from "components/Ribbon";
import "./signup.css"
import CharityUser from "components/CharityUser";
import { useTranslation } from "react-i18next";

const Signup = ({currentLanguage}) => {
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

	const { t } = useTranslation();
	const navigate = useNavigate();

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
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
		try {
			const url = "http://localhost:3000/api/auth/signup";
			const { data: res } = await axios.post(url, data, 
				{
					withCredentials: true,
					baseURL: 'http://localhost:3000'
				});
			setIsLoading(false);
			setSignupRibbon(true);
			setSignupText("A link was sent to your email, please verify to continue");
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
			<div dir={currentLanguage === "ar" ? "rtl" : "ltr"} className="d-flex flex-column justify-content-center align-items-center col-12 col-md-10 offset-md-1 col-xl-6 offset-xl-3 mt-5 form-parent-container">
				<CharityUser />
				<div className="signup_form_container main-container mt-5 d-flex col-12">
					<div className="d-md-flex col-md-4 flex-md-column justify-content-md-center right">
						<p className="next-div-title">{t("WelcomeBack")}</p>
						<button type="button" className="white_btn login_box" onClick={() => navigate("/login", {state: {isUser: true, isCharity: false}})}>
							{t("Login")}
						</button>
					</div>
					<div className="left col-md-8 col-12 d-flex flex-column justify-content-center align-items-center">
						<form className="col-12 d-flex flex-column align-items-center" onSubmit={handleSubmit}>
							<p className="div-title mt-4">{t("CreateAccount")}</p>
							<input
								type="text"
								placeholder={t("UsernamePlaceHolder")}
								name="username"
								onChange={handleChange}
								value={data.username}
								required
								className="input col-8 offset-2"
							/>
							<input
								type="email"
								placeholder={t("EmailPlaceHolder")}
								name="email"
								onChange={handleChange}
								value={data.email}
								required
								className="input col-8 offset-2"
							/>
							<input
								type="password"
								placeholder={t("PasswordPlaceHolder")}
								name="password"
								onChange={handleChange}
								value={data.password}
								required
								className="input col-8 offset-2"
							/>
							{error && <div className="error_msg col-8 offset-2">{error}</div>}
							<button type="submit" className="green_btn col-5 margin_top_btn">
								{t("Signup")}
							</button>
							{screenWidth < 768 && <div className="m-2">{t("LoginInstead?")} <Link to="/login">{t("ClickHere")}</Link></div>}
						</form>
					</div>
				</div>
			</div>
		}
		</>
	);
};

export default Signup;
