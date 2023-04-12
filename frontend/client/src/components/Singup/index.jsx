import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./signup.css"

const Signup = () => {
	const [data, setData] = useState({
		username: "",
		email: "",
		password: "",
	});
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = "http://localhost:3000/api/auth/signup";
			const { data: res } = await axios.post(url, data, 
				{
					withCredentials: true,
					baseURL: 'http://localhost:3000'
				});
			navigate("/login");
			console.log(res.message);
		} catch (error) {
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
		<div className="d-flex justify-content-center align-items-center col-6 offset-3 mt-5 main-container">
			<div className="login_form_container d-flex col-12">
				<div className="d-flex col-4 flex-column justify-content-center right	">
					<p className="next-div-title">Welcome Back</p>
					<button type="button" className="white_btn login_box" onClick={() => navigate("/login")}>
						Log in
					</button>
				</div>
				<div className="left col-8 d-flex flex-column justify-content-center align-items-center">
					<form className="col-12 d-flex flex-column align-items-center" onSubmit={handleSubmit}>
						<p className="div-title mt-4">Create Account</p>
						<input
							type="text"
							placeholder="User Name"
							name="username"
							onChange={handleChange}
							value={data.username}
							required
							className="input col-8 offset-2"
						/>
						<input
							type="email"
							placeholder="Email"
							name="email"
							onChange={handleChange}
							value={data.email}
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
							Sing Up
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Signup;
