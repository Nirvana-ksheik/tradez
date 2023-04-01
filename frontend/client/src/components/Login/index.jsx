import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import {useNavigate} from 'react-router-dom';
import classnames from 'classnames';

const Login = ({setCookie}) => {
	const [data, setData] = useState({ username: "", password: "" });
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

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
			setError(JSON.parse(error.response.data).message);
		}
	};

	return (
		<div className={styles.login_container}>
			<div className={styles.login_form_container}>
				<div className={styles.left}>
					<form className={styles.form_container} onSubmit={handleSubmit}>
						<h1>Login to Your Account</h1>
						<input
							type="text"
							placeholder="Username / Email"
							name="username"
							onChange={handleChange}
							value={data.username}
							required
							className={styles.input}
						/>
						<input
							type="password"
							placeholder="Password"
							name="password"
							onChange={handleChange}
							value={data.password}
							required
							className={styles.input}
						/>
						{error && <div className={styles.error_msg}>{error}</div>}
						<button type="submit" className={classnames(styles.green_btn, styles.margin_top_btn)}>
							Log In
						</button>
						<div>Forgot password ? <Link to="/forgot-password">click here</Link></div>
					</form>
				</div>
				<div className={styles.right}>
					<h1>New Here ?</h1>
					<Link to="/signup">
						<button type="button" className={classnames(styles.white_btn, styles.login_box)}>
							Sing Up
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Login;
