import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./navBar.css";

function NavBar({user}) {
	const [click, setClick] = useState(false);
	
	const handleClick = () => setClick(!click);

  	const navigate = useNavigate();

	const handleLogout = async () => {
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
	};

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
				user === null &&
				
				<li>
					<button type="button" onClick={handleLogin} className="white_btn">
						Log In
					</button>
				</li>	
			}
			{
				user !== null &&

				<li>
					<button type="button" onClick={handleLogout} className="white_btn">
						Log Out
					</button>
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

export default NavBar;