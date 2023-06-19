import React from "react";
import mainLogo from'../../assets/img/trading-image-home-1.png';

import "./homePage.css"
const HomePage = ({getCookie}) => {

    return (
        <>
            <div className="col-10 offset-1 d-flex justify-content-between align-items-center mt-5">
                <div className="col-6 d-flex flex-column">
                    <h1 className="home-text-font">All You Want & All You Don't</h1>
                    <p>Fast and secure exchanges from different locations,<br></br>
                        with a variety of items to choose and dispose
                    </p>
                </div>
                <div className="col-6 d-flex justify-content-end">
                    <img src={mainLogo} className="logo-home-page"/>
                </div>

           </div>
           <svg viewBox="0 0 500 100" className="mt-4">
                <path d="M 0 50 C 150 150 300 0 500 80 L 500 0 L 0 0" fill="#8c5b97"></path>
                <path d="M 0 50 C 150 150 330 -30 500 50 L 500 0 L 0 0" fill="#8c5b97" opacity="0.8"></path>
                <path d="M 0 50 C 215 150 250 0 500 100 L 500 0 L 0 0" fill="#8c5b97" opacity="0.5"></path>
            </svg>
        </>
    )
}

export default HomePage;