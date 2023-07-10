import React, { useState, useLayoutEffect } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Role } from "lookups";
import { ListGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import NotificationList from "../NotificationsList";
import { useTranslation } from "react-i18next";
import "./navBar.css";

function NavBar({user, getCookie, changeLanguage, currentLanguage}) {

	const [click, setClick] = useState(false);
	const [screenWidth, setScreenWidth] = useState();
	const { t } = useTranslation();

	const handleClick = () => setClick(!click);

  	const navigate = useNavigate();

	const handleLogin = () => {
		navigate("/login")
	}

	useLayoutEffect(() => {
		function detectScreenWidth() { setScreenWidth(window.screen.availWidth) }
		window.addEventListener('resize', detectScreenWidth);
		setScreenWidth(window.screen.availWidth);
		return () => window.removeEventListener('resize', detectScreenWidth);
	  }, []);

	const handleLogout = async() => {
		try {
			const url = "http://localhost:3000/api/auth/logout";
			const { data: res } = await axios.post(url, null, 
				{
					withCredentials: true,
					baseURL: 'http://localhost:3000'
				});
			console.log("result: ", res);
			navigate("/login");
		} catch (error) { 
			console.log(JSON.parse(error.response.data));
		}
		window.location.reload();
	}

	return (
	<>
		<nav className="navbar d-flex col-12 main-navbar">
		<div className="col-12 d-flex justify-content-between">
			<img src="http://localhost:3000/logo.png" className="logo-icon" alt="logo icon"/>
			<ul className={click ? "nav-menu active col-10" : "nav-menu"}>
				{
					user != null && user.role !== Role.CHARITY &&
					<li className="nav-item">
						<NavLink
						to="/allitems"
						className="nav-links"
						onClick={handleClick}
						>
						{t("AllItems")}
						</NavLink>
					</li>		
				}	
				{
					user != null && user.role == Role.USER && screenWidth < 992 &&
					<li className="nav-item">
						<NavLink
						to="/items/mine"
						className="nav-links"
						onClick={handleClick}
						>
						{t("MyItemsLink")}
						</NavLink>
					</li>
				}
				{
					user != null && user.role == Role.USER && screenWidth < 992 &&
					<li className="nav-item">
						<NavLink
						to="/items/create"
						className="nav-links"
						onClick={handleClick}
						>
						{t("AddItemLink")}
						</NavLink>
					</li>
				}
				{
					user != null && screenWidth < 992 && user.role != Role.CHARITY &&
					<li className="nav-item">
						<NavLink
						to="/items/archived"
						className="nav-links"
						onClick={handleClick}
						>
						{t("Archived")}
						</NavLink>
					</li>
				}
				{
					<NotificationList user={user} getCookie={getCookie}/>
				}
				{
					user == null &&
					<li className="nav-item-btn">
						<button type="button" onClick={handleLogin} className="white_btn">
							{t("Login")}
						</button>
					</li>	
				}
				<li className="nav-item-btn">
					{
						currentLanguage === "en" ?
						<button type="button" onClick={() => {
							changeLanguage("ar");
						}} className="white_btn">
							AR
						</button>
						:
						<button type="button" onClick={() => {
							changeLanguage("en");
						}} className="white_btn">
							EN
						</button>
					}

				</li>	
				{
					user != null && user.role == Role.USER && screenWidth < 992 &&
					<li className="nav-item">
						<NavLink
						to="/items/archived"
						className="nav-links"
						onClick={handleLogout}
						>
						{t("LogOutLink")}
						</NavLink>
					</li>
				}
				{
					user != null && screenWidth >= 992 &&
					<li className="nav-item-btn">
						<PopupList user={user} handleLogout={handleLogout}/>
					</li>
				}
			</ul>
		</div>
		</nav>
	</>
	);
}


function PopupList({user, handleLogout}) {

	const navigate = useNavigate();
	const [showList, setShowList] = useState(false);
	const { t } = useTranslation();

	const handleShowList = () => {
		setShowList(!showList);
	};

	return (
		<div>
		  <OverlayTrigger
			trigger="click"
			placement="bottom"
			rootClose
			overlay={
			
			  <Tooltip id="popup-list">
				<ListGroup>
					<ListGroup.Item action onClick={()=> {
							if(user){
								if(user.role === Role.CHARITY){
									navigate(`/charity/profile/${user.id}`);
								}else{
									navigate("/profile");
								}
							}
						}} className="popup-list-button">
						<div className="d-flex align-items-center justify-content-between col-12">
							<i className=" fa-solid fa-user-gear nav-bar-icon"></i>
							<span className="col-8 offset-1 d-flex justify-content-start align-items-center">{t("ProfileLink")}</span>
						</div>
					</ListGroup.Item>
					{
						user.role == Role.USER &&
						<ListGroup.Item action onClick={()=> {navigate("/items/create")}} className="popup-list-button">
							<div className="d-flex align-items-center justify-content-between col-12">
								<i className="col-3 fa fa-plus-circle nav-bar-icon"></i>
								<span className="col-8 offset-1 d-flex justify-content-start align-items-center">{t("AddItemLink")}</span>
							</div>
						</ListGroup.Item>
					}
					{
						user.role == Role.USER &&
						<ListGroup.Item action onClick={()=> {navigate("/items/mine")}} className="popup-list-button">
							<div className="d-flex align-items-center justify-content-between col-12">
								<i className="col-3 fa fa-cube nav-bar-icon"></i>
								<span className="col-8 offset-1 d-flex justify-content-start align-items-center">{t("MyItemsLink")}</span>
							</div>
						</ListGroup.Item>
					}
					{
						user.role != Role.CHARITY &&
						<ListGroup.Item action onClick={()=> {navigate("/allitems")}} className="popup-list-button">
						<div className="d-flex align-items-center justify-content-between col-12">
							<i className="col-3 fa fa-cubes nav-bar-icon"></i>
							<span className="col-8 offset-1 d-flex justify-content-start align-items-center">{t("AllItems")}</span>
						</div>
						</ListGroup.Item>
					}
					{
						user.role == Role.USER && 
						<ListGroup.Item action onClick={()=> {navigate("/items/archived")}} className="popup-list-button">
							<div className="d-flex align-items-center justify-content-between col-12">
								<i className="col-3 fa fa-file-archive nav-bar-icon"></i>
								<span className="col-8 offset-1 d-flex justify-content-start align-items-center">{t("ArchivedLink")}</span>
							</div>
						</ListGroup.Item>	
					}
					{
						user.role == Role.CHARITY && 
						<ListGroup.Item action onClick={()=> {navigate("/charity/posts/create")}} className="popup-list-button">
							<div className="d-flex align-items-center justify-content-between col-12">
								<i className="col-3 fa fa-file-archive nav-bar-icon"></i>
								<span className="col-8 offset-1 d-flex justify-content-start align-items-center">
									{t("AddPostLink")}
								</span>
							</div>
						</ListGroup.Item>	
					}
					<ListGroup.Item action onClick={()=> {navigate("/charities")}} className="popup-list-button">
						<div className="d-flex align-items-center justify-content-between col-12">
							<i className="col-3 fas fa-seedling nav-bar-icon"></i>
							<span className="col-8 offset-1 d-flex justify-content-start align-items-center">{t("CharitiesLink")}</span>
						</div>
					</ListGroup.Item>
					<ListGroup.Item action onClick={()=> {navigate("/charity/posts")}} className="popup-list-button">
						<div className="d-flex align-items-center justify-content-between col-12">
							<i className="col-3 fas fa-hand-holding-heart nav-bar-icon"></i>
							<span className="col-8 offset-1 d-flex justify-content-start align-items-center">{t("DonationsLink")}</span>
						</div>
					</ListGroup.Item>	
					
					<ListGroup.Item action onClick={handleLogout} className="popup-list-button">
						<div className="d-flex align-items-center justify-content-between col-12">
							<i className="col-3 fas fa-sign-out-alt nav-bar-icon"></i>
							<span className="col-8 offset-1 d-flex justify-content-start align-items-center">
								{t("LogOutLink")}
							</span>
						</div>
					</ListGroup.Item>
				</ListGroup>
			  </Tooltip>
			}
		  >
			<div className="d-flex align-items-center">
				<button type="button" onClick={handleShowList} className="white_btn">
					<div className="d-flex justify-content-center align-items-center">
						<span>{user.username}</span>
					</div>
				</button>
			</div>

		  </OverlayTrigger>
		</div>
	  );
}

export default NavBar;