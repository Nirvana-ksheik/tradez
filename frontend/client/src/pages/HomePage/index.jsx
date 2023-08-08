import React from "react";
import UserHomePage from "components/UserHomePage";
import CharityHomePage from "components/CharityHomePage";
import { Role } from "lookups";
import "./homePage.css"

const HomePage = (props) => {

    return (
        <div>
        {
            props.user !== undefined && props.user !== null && props.user.role === Role.CHARITY ?
            <CharityHomePage currentLanguage={props.currentLanguage} user={props.user}/> :
            <UserHomePage currentLanguage={props.currentLanguage}/>
        }
        </div>
    )
}

export default HomePage;