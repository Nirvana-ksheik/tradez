import React, { useEffect, useState, useLayoutEffect } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./navBar.css";
import { Role } from "lookups";
import { ListGroup, OverlayTrigger, Tooltip } from "react-bootstrap";

function NavBar({user}) {

	const [click, setClick] = useState(false);
	const [screenWidth, setScreenWidth] = useState();

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
			<img src="http://localhost:3000/logo.png" className="logo-icon"/>
			<ul className={click ? "nav-menu active col-10" : "nav-menu"}>			
				<li className="nav-item">
					<NavLink
					to="/allitems"
					className="nav-links"
					onClick={handleClick}
					>
					All Items
					</NavLink>
				</li>		
				{
					user != null && user.role == Role.USER && screenWidth < 992 &&
					<li className="nav-item">
						<NavLink
						to="/items/mine"
						className="nav-links"
						onClick={handleClick}
						>
						My Items
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
						Add Item
						</NavLink>
					</li>
				}
				{
					user != null && screenWidth < 992 &&
					<li className="nav-item">
						<NavLink
						to="/items/archived"
						className="nav-links"
						onClick={handleClick}
						>
						Archived
						</NavLink>
					</li>
				}
				{
					user == null &&
					<li className="nav-item-btn">
						<button type="button" onClick={handleLogin} className="white_btn">
							Log In
						</button>
					</li>	
				}
				{
					user != null && user.role == Role.USER && screenWidth < 992 &&
					<li className="nav-item">
						<NavLink
						to="/items/archived"
						className="nav-links"
						onClick={handleLogout}
						>
						Log Out
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
			<div className="nav-icon" onClick={handleClick}>
				<i className={click ? "fas fa-times" : "fas fa-bars"}></i>
			</div>
		</div>
		</nav>
	</>
	);
}


function PopupList({user, handleLogout}) {

	const navigate = useNavigate();
	const [showList, setShowList] = useState(false);

	const handleShowList = () => {
		setShowList(!showList);
	};


	return (
		<div>
		  <OverlayTrigger
			trigger="click"
			placement="bottom"
			show={showList}
			overlay={
			  <Tooltip id="popup-list">
				<ListGroup>
					<ListGroup.Item action onClick={()=> {navigate("/profile")}} className="popup-list-button">
						<div className="d-flex align-items-center justify-content-between col-12">
							<i className=" fa-solid fa-user-gear nav-bar-icon"></i>
							<span className="col-8 offset-1 d-flex justify-content-start align-items-center">Profile</span>
						</div>
					</ListGroup.Item>
					{
						user.role == Role.USER &&
						<ListGroup.Item action onClick={()=> {navigate("/items/create")}} className="popup-list-button">
							<div className="d-flex align-items-center justify-content-between col-12">
								<i className="col-3 fa fa-plus-circle nav-bar-icon"></i>
								<span className="col-8 offset-1 d-flex justify-content-start align-items-center">Add Item</span>
							</div>
						</ListGroup.Item>
					}
					{
						user.role == Role.USER &&
						<ListGroup.Item action onClick={()=> {navigate("/items/mine")}} className="popup-list-button">
							<div className="d-flex align-items-center justify-content-between col-12">
								<i className="col-3 fa fa-cube nav-bar-icon"></i>
								<span className="col-8 offset-1 d-flex justify-content-start align-items-center">My Items</span>
							</div>
						</ListGroup.Item>
					}
					<ListGroup.Item action onClick={()=> {navigate("/allitems")}} className="popup-list-button">
						<div className="d-flex align-items-center justify-content-between col-12">
							<i className="col-3 fa fa-cubes nav-bar-icon"></i>
							<span className="col-8 offset-1 d-flex justify-content-start align-items-center">All Items</span>
						</div>
					</ListGroup.Item>
					{
						user.role == Role.USER && 
						<ListGroup.Item action onClick={()=> {navigate("/items/archived")}} className="popup-list-button">
							<div className="d-flex align-items-center justify-content-between col-12">
								<i className="col-3 fa fa-file-archive nav-bar-icon"></i>
								<span className="col-8 offset-1 d-flex justify-content-start align-items-center">Archived</span>
							</div>
						</ListGroup.Item>	
					}
					<ListGroup.Item action onClick={handleLogout} className="popup-list-button">
						<div className="d-flex align-items-center justify-content-between col-12">
							<i className="col-3 fas fa-sign-out-alt nav-bar-icon"></i>
							<span className="col-8 offset-1 d-flex justify-content-start align-items-center">Log Out</span>
						</div>
					</ListGroup.Item>
				</ListGroup>
			  </Tooltip>
			}
		  >
			<button type="button" onClick={handleShowList} className="white_btn">
				<div className="d-flex justify-content-center align-items-center">
					<span>{user.username}</span>
				</div>
			</button>
		  </OverlayTrigger>
		</div>
	  );
}

export default NavBar;