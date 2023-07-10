import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./charityUser.css"

const CharityUser = () => {

    const { state } = useLocation();
    const [userSelected, setUserSelected] = useState(state ? state.isUser : false);
    const [charitySelected, setChartiySelected] = useState(state ? state.isCharity : false);

    const navigate = useNavigate();

    useEffect(()=>{
        if(!userSelected && !charitySelected){
            setUserSelected(true);
        }
        if(userSelected){
            setChartiySelected(false);
            document.getElementById("charity-user-btn-user").classList.add("charity-user-btn-clicked");
            document.getElementById("charity-user-btn-charity").classList.remove("charity-user-btn-clicked");
        }
        if(charitySelected){
            setUserSelected(false);
            document.getElementById("charity-user-btn-charity").classList.add("charity-user-btn-clicked");
            document.getElementById("charity-user-btn-user").classList.remove("charity-user-btn-clicked");            
        }
    }, [setChartiySelected, setUserSelected, userSelected, charitySelected, navigate]);

	return (
        <div className="col-12 d-flex justify-content-between">
            <button id="charity-user-btn-user" className="col-6 p-2 charity-user-btn-user" onClick={() => {
                setUserSelected(true);
                navigate("/login", {state: {isUser: true, isCharity: false}})
            }}>User</button>
            <button id="charity-user-btn-charity" className="col-6 p-2 charity-user-btn-charity" onClick={() => {
                setChartiySelected(true);
                navigate("/charity/login", {state: {isUser: false, isCharity: true}})
            }}>Charity</button>
        </div>
	);
};

export default CharityUser;