import { Route, Routes, useParams } from "react-router-dom";
import Signup from "./components/Singup";
import Login from "./components/Login";
import { hot } from 'react-hot-loader/root';
import NavBar from "./components/Navbar";
import SideBar from "components/Sidebar";
import MyItems from "./pages/myItems";
import ItemDetails from "pages/itemDetails";
import Cookies from "universal-cookie";
import { useState, useEffect } from "react";
import AddItem from "pages/AddItem";
import jwt from 'jwt-decode';

function App() {
	const cookies = new Cookies();
	const [user, setUser] = useState(null);

	const setCookie = (token) =>{
		const decodedToken = jwt(token);
		cookies.set("jwt", token, {expires: new Date(decodedToken.exp * 1000)});
		console.log("decoded token: ", decodedToken);
		setUser(decodedToken);
	}

	const getCookie = () => {
		const token = cookies.get("jwt");
		return token;
	}

	const getUser = () => {
		const token = getCookie();
		if(token == null || token == undefined) {return null;}
		const decodedToken = jwt(token);
		setUser(decodedToken);
		return user;
	}

	useEffect(() => {
		(() => {
		  const loggedInUser = getUser();
		  if (loggedInUser != null && loggedInUser != undefined) setUser(loggedInUser);
		})();
	  }, [user]);

	return (
		<div>
			<SideBar />
			<NavBar user={user}/>
			<Routes>
				<Route path="/signup" element={<Signup />} />
				<Route path="/login" element={<Login setCookie={setCookie}/>} />
				<Route path="/items/mine" element={<MyItems getCookie={getCookie}/>} />
				<Route path="/items/:id" element={<ItemDetails getCookie={getCookie} />} />
				<Route path="/items/create" element={<AddItem getCookie={getCookie} />} />
			</Routes>
		</div>
	);
}

export default hot(App);
