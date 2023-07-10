import React from "react";
import { useNavigate } from "react-router-dom";
import "./isUserBox.css";

const IsUserBox = () => {

    const navigation = useNavigate();

    return(
        <div className="col-12 col-md-10 offset-md-1 col-xl-6 offset-xl-3 mt-5">
            <div className="mt-3 user-box col-12 d-flex flex-column align-items-center justify-content-center">
                <label className="user-box-label">If you are a user please proceed here</label>
                <button className="white-btn col-12" onClick={
                    () => {
                        navigation("/signup")
                    }
                }>Proceed</button>
            </div>
        </div>
    );
}

export default IsUserBox;