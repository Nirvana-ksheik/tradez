import React from "react";
import mainLogo from'../../assets/img/charity-image-home.jpg';
import "./charityHomePage.css"

const CharityHomePage = ({currentLanguage}) => {

    return(
        <div dir={currentLanguage === "ar" ? "rtl" : "ltr"} className="d-flex col-12 flex-column justify-content-center align-items-center">
            <div className="col-10 d-flex justify-content-center align-items-center mt-5">
                <div className="col-6 d-flex flex-column">
                    <h1 className="home-text-font text-center">All You Want & All You Don't</h1>
                    <p className="text-center">Fast and secure exchanges from different locations<br></br>
                        with a variety of items to choose and dispose
                    </p>
                </div>
                <div className="col-6 d-flex justify-content-center align-items-center">
                    <img src={mainLogo} className="charity-logo-home-page" alt=""/>
                </div>
            </div>
            <svg viewBox="0 0 500 100" className="mt-4">
                <path d="M 0 50 C 150 150 300 0 500 80 L 500 0 L 0 0" fill="#8c5b97"></path>
                <path d="M 0 50 C 150 150 330 -30 500 50 L 500 0 L 0 0" fill="#8c5b97" opacity="0.8"></path>
                <path d="M 0 50 C 215 150 250 0 500 100 L 500 0 L 0 0" fill="#8c5b97" opacity="0.5"></path>
            </svg>
        </div>
    )
}

export default CharityHomePage;