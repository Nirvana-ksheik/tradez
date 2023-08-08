import { useState, useLayoutEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./login.css"
import {useNavigate} from 'react-router-dom';
import CharityUser from "components/CharityUser";
import { useTranslation } from "react-i18next";

const Login = ({setCookie, currentLanguage}) => {
	const [data, setData] = useState({ username: "", password: "" });
	const [error, setError] = useState("");
	const [screenWidth, setScreenWidth] = useState();

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
		try {
			const url = "http://localhost:3000/api/auth/login";
			const {data : res} = await axios.post(url, data, 
				{
					withCredentials: true,
					baseURL: 'http://localhost:3000'
				});

			console.log("result: ", res.token);
			setCookie(res.token);
			navigate("/");

		} catch (error) { 
			console.log("error: ", error);
			if(error.response.data != null || error.response.data !== undefined){
				setError(JSON.parse(error.response.data).message);
			}
		}
	};

	return (
		<div dir={currentLanguage === "ar" ? "rtl" : "ltr"} className="col-12 col-md-10 offset-md-1 col-xl-6 offset-xl-3 d-flex flex-column align-items-center form-parent-container">
		<CharityUser />
		<div className="col-12 d-flex flex-column justify-content-center align-items-center mt-5 main-container">
			<div className="login_form_container d-flex col-12">
				<div className="left col-md-8 col-12 d-flex flex-column justify-content-center align-items-center">
					<form className="col-12 d-flex flex-column align-items-center" onSubmit={handleSubmit}>
						<p className="div-title mt-4">{t("LoginAsUser")}</p>
						<input
							type="text"
							placeholder="Username / Email"
							name="username"
							onChange={handleChange}
							value={data.username}
							required
							className="input col-8 offset-2"
						/>
						<input
							type="password"
							placeholder="Password"
							name="password"
							onChange={handleChange}
							value={data.password}
							required
							className="input col-8 offset-2"
						/>
						{error && <div className="error_msg col-8 offset-2">{error}</div>}
						<button type="submit" className="green_btn col-5 margin_top_btn">
							{t("Login")}
						</button>
						<div className="m-2 form-link">{t("ForgotPassword?")} <Link to="/forgot-password">{t("ClickHere")}</Link></div>
						{screenWidth < 768 && <div className="form-link">{t("SignupInstead?")} <Link to="/signup">{t("ClickHere")}</Link></div>}
					</form>

				</div>
				<div className="d-flex col-4 flex-column justify-content-center right">
					<p className="next-div-title">{t("NewHere?")}</p>
					<button type="button" className="white_btn login_box" onClick={() => navigate("/signup")}>
						{t("Signup")}
					</button>
				</div>
			</div>
		</div>
		</div>
	);
};

export default Login;