import React from "react";
// import mainLogo from'../../assets/img/charity-image-home.jpg';
import "./charityHomePage.css"

const CharityHomePage = ({currentLanguage}) => {

    return(
        <div dir={currentLanguage === "ar" ? "rtl" : "ltr"} className="d-flex col-12 flex-column justify-content-lg-start align-items-lg-center charity-homepage-main-div" style={{height: "90vh", position: "absolute"}}>
            <div className="col-12 col-lg-10 flex-lg-row flex-column d-flex justify-content-center align-items-center mt-5">
                <div className="col-lg-5 col-12 d-flex flex-column">
                    <h1 className="home-text-font text-center">All You Want & All You Don't</h1>
                    <p className="text-center">Fast and secure exchanges from different locations<br></br>
                        with a variety of items to choose and dispose
                    </p>
                </div>
                <div className="col-lg-7 col-md-10 col-12 d-flex justify-content-center align-items-center">
                    {/* <img src={mainLogo} className="charity-logo-home-page" alt=""/> */}
                </div>
            </div>

            <div style={{position: "absolute", bottom: 0}} className="col-12">
                <svg  viewBox="0 0 500 85" className="mt-4 svg-wave">
                    <path d="M 0 50 C 150 150 300 0 500 60 L 500 0 L 0 0" fill="#0094C3"></path>
                    <path d="M 0 50 C 150 150 330 -30 500 40 L 500 0 L 0 0" fill="#00274D" opacity="0.8"></path>
                    <path d="M 0 50 C 215 150 250 0 500 85 L 500 0 L 0 0" fill="#0094C3" opacity="0.2"></path>
                </svg>
            </div>
        </div>
    )
}

export default CharityHomePage;