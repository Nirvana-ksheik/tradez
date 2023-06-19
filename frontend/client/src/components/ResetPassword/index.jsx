import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Ribbon from 'components/Ribbon';

function ResetPassword() {

	const [password, setPassword] = useState();
	const [passwordConfirmation, setPasswordConfirmation] = useState();
	const [success, setSuccess] = useState(false);
	const [successText, setSuccessText] = useState('Password Updated Successfully');
	const [error, setError] = useState(null);
	const {token} = useParams();
	
	const navigate = useNavigate();

	const checkError = () => {
		let passwordVal = document.getElementsByName("password")[0].value;
		let passwordConfirmationVal = document.getElementsByName("passwordConfirmation")[0].value;

		if(passwordVal !== passwordConfirmationVal){
			setError("Passwords Don't match");
		}else{
			setError(undefined);
		}
	}

	const handleChange = ({ currentTarget: input }) => {
		console.log("input value: ", input.value);
		const value = input.value;
		if(input.name == "password"){
			setPassword(value)
		}else{
			setPasswordConfirmation(value);
		}
		// setData({ ...data, [input.name]: input.value });
		console.log("password: ", password);
		console.log("confirmation: ", passwordConfirmation);

		checkError();
	};

	const resetPassword = (e) => {
		e.preventDefault();
		setSuccess(false);
		if(password != passwordConfirmation){
			setError("Passwords Don't match");
			return;
		}
		try{
			console.log("tokennnn: ", token);
			let reqInstance = axios.create({
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			console.log("password: ", password);
			const itemUrl = "http://localhost:3000/api/auth/reset/" + token;
			reqInstance.post(
				itemUrl,
				{
					password: password
				},
				{
					withCredentials: true,
					baseURL: 'http://localhost:3000'
				}
			).then(({data: res}) => {
				console.log("result: ", res);
				setSuccess(true);
				setTimeout(()=>{
					navigate('/login');
				}, 10000);
			}).catch((err)=>{
				setError("Invalid Token / Token Expired");
			});

		}catch(err){
			console.log("error: ", err);
		}
    };

    // useEffect(() => {
    //     resetPassword();
    // }, []);

    return(
        <>
        <div className={styles.login_container}>
			<div className={styles.login_form_container}>
				<div className={styles.left}>
					<form className={styles.form_container} onSubmit={resetPassword}>
						<h1>Enter your new Password</h1>
						<input
							type="password"
							placeholder="New Password"
							name="password"
							onChange={handleChange}							
							required
							className={styles.input}
						/>
						<input
							type="password"
							placeholder="Confirm Password"
							name="passwordConfirmation"
							onChange={handleChange}
							required
							className={styles.input}
						/>
						{error && <div className={styles.error_msg}>{error}</div>}
						<button type="submit" className={styles.green_btn}>
							Submit
						</button>
						{
							success &&
							<Ribbon text={successText} setShowValue={setSuccessText}/>
						}
					</form>
				</div>
			</div>
		</div>
        </>
    );
}

export default ResetPassword;