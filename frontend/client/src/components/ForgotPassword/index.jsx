import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import classnames from 'classnames';
import Ribbon from "components/Ribbon";
import { useTranslation } from "react-i18next";
import './styles.module.css'
import styles from "./styles.module.css";

const ForgotPassword = ({currentLanguage}) => {

	const [email, setEmail] = useState('');
	const [error, setError] = useState("");
    const [forgotPassRibbon, setForgotPassRibbon] = useState(false);
    const [forgotPassText, setForgotPassText] = useState('');

	const {t} = useTranslation();

	const handleChange = (e) => {
		setEmail(e.target.value);
	};

	const handleSubmit = async (e) => {
        setForgotPassRibbon(false);
		e.preventDefault();
		try {
            const url = "http://localhost:3000/api/auth/forgot";
  
            axios.post(
                url, 
                {email: email},
                {
                    withCredentials: true,
                    baseURL: 'http://localhost:3000'
                }
            ).then(({data: res}) => { 
                console.log("forgot pass result: ", res);
                setForgotPassRibbon(true);
                setForgotPassText(res);

            }).catch((err) => {
				console.log("error: ", err);
				setError(err);
			});

		} catch (error) { 
			console.log("error: ", error);
		}
	};

	return (
		<div dir={currentLanguage === "ar" ? "rtl" : "ltr"}className={styles.login_container}>
			<div className={styles.login_form_container}>
				<div className={styles.left}>
					<form className={styles.form_container} onSubmit={handleSubmit}>
						<h1 className="mb-5">{t("ResetPassword")}</h1>
						<input
							type="email"
							placeholder={t("EmailExample")}
							name="email"
							value={email}
                            onChange={handleChange}
							required
							className={styles.input}
						/>
						{error && <div className={styles.error_msg}>{error}</div>}
						<button type="submit" className={classnames(styles.green_btn, styles.margin_top_btn)}>
							{t("SendResetLink")}
						</button>
						<div>{t("LoginInstead")} <Link to="/login">{t("ClickHere")}</Link></div>
                        {
                            forgotPassRibbon &&
                            <Ribbon text={forgotPassText} setShowValue={setForgotPassText}/>
                        }
					</form>
				</div>
			</div>
		</div>
	);
};

export default ForgotPassword;
