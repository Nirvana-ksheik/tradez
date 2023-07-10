import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Ribbon from 'components/Ribbon';
import { Role } from 'lookups';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.css';

function ResetPassword({user, currentLanguage}) {

	const [password, setPassword] = useState();
	const [passwordConfirmation, setPasswordConfirmation] = useState();
	const [success, setSuccess] = useState(false);
	const [successText, setSuccessText] = useState('Password Updated Successfully');
	const [error, setError] = useState(null);

	const {token} = useParams();
	const {t} = useTranslation();

	const navigate = useNavigate();

	const checkError = () => {
		let passwordVal = document.getElementsByName("password")[0].value;
		let passwordConfirmationVal = document.getElementsByName("passwordConfirmation")[0].value;

		if(passwordVal !== passwordConfirmationVal){
			setError(t("PasswordsDontMatch"));
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
		if(user){
			e.preventDefault();
			setSuccess(false);
			if(password !== passwordConfirmation){
				setError(t("PasswordsDontMatch"));
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
				const itemUrl = user.role !== Role.CHARITY ? "http://localhost:3000/api/auth/reset/" + token : "http://localhost:3000/api/charity/auth/reset/" + token;
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
						if(user.role !== Role.CHARITY){
							navigate('/login');
						}else{
							navigate('/charity/login');
						}
					}, 5000);
				}).catch((err)=>{
					setError(t("InvalidToken"));
				});
	
			}catch(err){
				console.log("error: ", err);
			}
		}
    };

    // useEffect(() => {
    //     resetPassword();
    // }, []);

    return(
        <>
        <div dir={currentLanguage === "ar" ? "rtl" : "ltr"} className={styles.login_container}>
			<div className={styles.login_form_container}>
				<div className={styles.left}>
					<form className={styles.form_container} onSubmit={resetPassword}>
						<h1>{t("EnterYourNewPassword")}</h1>
						<input
							type="password"
							placeholder={t("NewPassword")}
							name="password"
							onChange={handleChange}							
							required
							className={styles.input}
						/>
						<input
							type="password"
							placeholder={t("ConfrimPassword")}
							name="passwordConfirmation"
							onChange={handleChange}
							required
							className={styles.input}
						/>
						{error && <div className={styles.error_msg}>{error}</div>}
						<button type="submit" className={styles.green_btn}>
							{t("ChangePassword")}
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