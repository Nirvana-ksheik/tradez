import { useState, useLayoutEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "components/LoadingSpinner";
import Ribbon from "components/Ribbon";
import "./signupCharity.css";

const SignupCharity = () => {
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

	const navigate = useNavigate();

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
        console.log("data: ", data);
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
			const url = "http://localhost:3000/api/charity/auth/signup";
			const { data: res } = await axios.post(url, data, 
				{
					withCredentials: true,
					baseURL: 'http://localhost:3000'
				});
			setIsLoading(false);
			setSignupRibbon(true);
			setSignupText("Please confirm your email to continue the process");
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
			<div className="d-flex justify-content-center align-items-center col-12 col-md-11 mt-5 mb-5 main-container-signup charity-container-signup">
				<div className="signup_form_container d-flex col-12">
					{/* <div className="d-md-flex col-md-3 flex-md-column justify-content-md-center right">
						<p className="next-div-title">Welcome Back</p>
						<button type="button" className="white_btn login_box" onClick={() => navigate("/login")}>
							Log in
						</button>
					</div> */}
					<div className="left col-md-12 col-12 d-flex flex-column justify-content-center align-items-center">
                        <p className="div-title mt-4">Create Charity Account</p>
                        <hr></hr>
						<form className="col-12 d-flex flex-column" onSubmit={handleSubmit}>
                            <div className="col-12 d-flex">
                                <div className="col-md-6 col-12 d-flex flex-column justify-content-start charity-div">
                                    <div className="d-flex col-11 align-items-end justify-content-between m-3">
                                        <label className="col-3">Organization Name: </label>
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
                                        <label className="col-3">Address: </label>
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
                                        <label className="col-3">Telephone Nb: </label>
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
                                        <label className="col-3">Email: </label>
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
                                        <label className="col-3">Website: </label>
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
                                        <label className="col-3">Charity Registration Nb: </label>
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
                                        <label className="col-3">Tax Nb: </label>
                                        <input
                                            type="text"
                                            placeholder=""
                                            name="taxNb"
                                            onChange={handleChange}
                                            required
                                            className="charity-input col-8"
                                        />
                                    </div>
                                </div>
                                <div className=""></div>
                                <div className="col-md-6 col-12 d-flex flex-column justify-content-start charity-div">
                                    <div className="d-flex col-11 align-items-end justify-content-between m-3">
                                        <label className="col-3">Trustees & Directors: </label>
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
                                        <label className="col-3">CEO / Executive Director: </label>
                                        <input
                                            type="text"
                                            placeholder=""
                                            name="ceo"
                                            onChange={handleChange}
                                            required
                                            className="charity-input col-8"
                                        />
                                    </div>
                                    <div className="d-flex col-11 align-items-end justify-content-between m-3">
                                        <label className="col-3">Annual Turnover: </label>
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
                                        <label className="col-3">Vision & Mission: </label>
                                        <textarea
                                            type="text"
                                            placeholder=""
                                            name="mission"
                                            onChange={handleChange}
                                            required
                                            className="charity-input col-8"
                                        />
                                    </div>
                                    <div className="d-flex col-11 align-items-end justify-content-between m-3">
                                        <label className="col-3">Additional Information: </label>
                                        <textarea
                                            type="text"
                                            placeholder=""
                                            name="additionalInfo"
                                            onChange={handleChange}
                                            required
                                            className="charity-input col-8"
                                        />
                                    </div>
                                </div>
                            </div>
							{error && <div className="error_msg col-8 offset-2">{error}</div>}
                            <div className="col-6 offset-3 mb-2">
                                <button type="submit" className="green_btn col-12 margin_top_btn">
                                    Sing Up
                                </button>
                            </div>


							{screenWidth < 768 && <div className="m-2">Login Instead ? <Link to="/login">click here</Link></div>}
						</form>
					</div>
				</div>
			</div>
		}
		</>
	);
};

export default SignupCharity;
