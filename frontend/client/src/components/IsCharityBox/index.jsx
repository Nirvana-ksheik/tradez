import React from "react";
import { useNavigate } from "react-router-dom";
import "./isCharityBox.css";

const IsCharityBox = () => {

    const navigation = useNavigate();

    return(
        <div className="col-12 col-md-10 offset-md-1 col-xl-6 offset-xl-3 mt-5">
            <div className="mt-3 charity-box col-12 d-flex flex-column align-items-center justify-content-center">
                <label>If you are a charity please proceed here</label>
                <button className="green_btn col-12" onClick={
                    () => {
                        navigation("/charity/signup")
                    }
                }>Proceed</button>
            </div>
        </div>
    );
}

export default IsCharityBox;