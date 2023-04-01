import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./navBar.css";
import { ListGroup, OverlayTrigger, Tooltip } from "react-bootstrap";

function NavBar({user}) {

	const [click, setClick] = useState(false);

	const handleClick = () => setClick(!click);

  	const navigate = useNavigate();

	const handleLogin = () => {
		navigate("/login")
	}

	return (
	<>
		<nav className="navbar">
		<div className="nav-container">
			<NavLink to="/" className="nav-logo">
			TradeZ
			</NavLink>

			<ul className={click ? "nav-menu active" : "nav-menu"}>
			<li className="nav-item">
				<NavLink
				to="/items"
				className="nav-links"
				onClick={handleClick}
				>
				Items
				</NavLink>
			</li>
			<li className="nav-item">
				<NavLink
				to="/items/mine"
				className="nav-links"
				onClick={handleClick}
				>
				My Items
				</NavLink>
			</li>
			{
				user == null &&
				
				<li>
					<button type="button" onClick={handleLogin} className="white_btn">
						Log In
					</button>
				</li>	
			}
			{
				user != null &&
				<li>
					<PopupList user={user}/>
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


function PopupList({user}) {

	const navigate = useNavigate();
	const [showList, setShowList] = useState(false);

	const handleShowList = () => {
		setShowList(!showList);
	};

	const showProfile = () =>{
		navigate('/profile');
	}

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
		<div className="popup-list">
		  <OverlayTrigger className="popup-list"
			trigger="click"
			placement="bottom"
			show={showList}
			overlay={
			  <Tooltip id="popup-list" className="popup-list">
				<ListGroup className="popup-list">
				  <ListGroup.Item action onClick={showProfile} className="popup-list-button">
					Show Profile
				  </ListGroup.Item>
				  <ListGroup.Item action onClick={handleLogout} className="popup-list-button">
					Logout
				  </ListGroup.Item>
				</ListGroup>
			  </Tooltip>
			}
		  >
			<button type="button" onClick={handleShowList} className="white_btn">
				<div className="d-flex justify-content-center align-items-center">
					<i className="fa-solid fa-user-gear me-2"></i>
					<span>{user.username}</span>
				</div>
			</button>
		  </OverlayTrigger>
		</div>
	  );
}

export default NavBar;