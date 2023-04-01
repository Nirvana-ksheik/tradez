import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import {useNavigate} from 'react-router-dom';
import classnames from 'classnames';
import './styles.module.css'
import Ribbon from "components/Ribbon";

const ForgotPassword = () => {

	const [email, setEmail] = useState('');
	const [error, setError] = useState("");
    const [forgotPassRibbon, setForgotPassRibbon] = useState(false);
    const [forgotPassText, setForgotPassText] = useState('');

	const navigate = useNavigate();

	const handleChange = ({ currentTarget: input }) => {
		setEmail(input.value);
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

            }).catch((err) => console.log("error: ", err));


		} catch (error) { 
			console.log("error: ", error);

		}
	};

	return (
		<div className={styles.login_container}>
			<div className={styles.login_form_container}>
				<div className={styles.left}>
					<form className={styles.form_container} onSubmit={handleSubmit}>
						<h1 className="mb-5">Reset Password</h1>
						<input
							type="email"
							placeholder="someone.any@gmail.com"
							name="email"
							value={email}
                            onChange={handleChange}
							required
							className={styles.input}
						/>
						{error && <div className={styles.error_msg}>{error}</div>}
						<button type="submit" className={classnames(styles.green_btn, styles.margin_top_btn)}>
							Send Reset Link
						</button>
						<div>Login Instead ? <Link to="/login">click here</Link></div>
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
