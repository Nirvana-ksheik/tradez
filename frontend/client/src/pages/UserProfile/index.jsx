import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import './userProfile.css';
import Ribbon from 'components/Ribbon';

const UserProfile = ({getCookie}) => {

    const [user, setUser] = useState(null);
    const [forgotPassRibbon, setForgotPassRibbon] = useState(false);
    const [forgotPassText, setForgotPassText] = useState('');

    const getUserProfile = async(controller) =>{
        console.log("entered get user profile");
        try {
            const token = getCookie();
            let reqInstance = axios.create({
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const url = "http://localhost:3000/api/auth/profile";
            await reqInstance.get(url, 
            { signal: controller.signal },
            {
                withCredentials: true,
                baseURL: 'http://localhost:3000'
            })
            .then(({data: res}) => { 
                console.log("result: ", res);
                setUser(res);
                console.log("userr: ", user);
            });

        }catch(err){
            console.log("error: ", err);
        }
    }

    const changePassword = () => {
        setForgotPassRibbon(false);
        try {
            const token = getCookie();
            let reqInstance = axios.create({
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("token to be sent: ", token);
            const url = "http://localhost:3000/api/auth/forgot";
            console.log("email: ", user.result.email);
            reqInstance.post(
                url, 
                {email: user.result.email},
                {
                    withCredentials: true,
                    baseURL: 'http://localhost:3000'
                }
            ).then(({data: res}) => { 
                console.log("forgot pass result: ", res);
                setForgotPassRibbon(true);
                setForgotPassText(res);
            });
        
        } catch (error) { 
            console.log("error: ", error);
        }
    }

    useEffect(() => {
        const controller = new AbortController();
        getUserProfile(controller);
        return ()=>{
            controller.abort();
        };
    }, []);

    return (
        <>
            {user != null &&
            <div className="mt-5 d-flex col-12 flex-column justify-content-center">
                <div className="col-12 d-flex justify-content-center">
                    <div className="col-4 offset-1 d-flex flex-column">
                        <i className="fas fa-user-circle col-12 icon"></i>
                        <button className="mt-3 btnn">Logout</button>
                        <button className="mt-3 btnn" onClick={changePassword}>Change Password</button>
                    </div>
                    <div className="col-3 offset-1">
                        <h2 className="username">{user.result.username}</h2>
                        <p className="email">{user.result.email}</p>
                        <p className="date">Joined on {user.createdOn}</p>
                    </div>
                </div>
            </div>}
            {
                forgotPassRibbon && 
                <Ribbon text={forgotPassText} setShowValue={setForgotPassRibbon}/>
            }
        </>
    );
}

export default UserProfile;