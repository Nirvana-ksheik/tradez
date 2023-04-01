import { Route, Routes } from "react-router-dom";
import Signup from "./components/Singup";
import Login from "./components/Login";
import { hot } from 'react-hot-loader/root';
import NavBar from "./components/Navbar";
import SideBar from "components/Sidebar";
import MyItems from "./pages/myItems";
import ItemDetails from "pages/itemDetails";
import AllItems from "pages/AllItems";
import Cookies from "universal-cookie";
import { useState, useEffect } from "react";
import AddItem from "pages/AddItem";
import EditItem from "pages/EditItem";
import jwt from 'jwt-decode';
import ArchivedItems from "pages/ArchivedItems";
import UserProfile from "pages/UserProfile";
import ResetPassword from "components/ResetPassword";
import ForgotPassword from "components/ForgotPassword";
import ConfirmEmail from "pages/ConfirmEmail";

function App() {
	const cookies = new Cookies();
	const [user, setUser] = useState();

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
		console.log("cooooooookie: ", token);
		if(token == null || token == undefined) {return null;}
		const decodedToken = jwt(token);
		console.log("decoded token: ", decodedToken);
		setUser(decodedToken);
		return user;
	}

	useEffect(() => {
		  const loggedInUser = getUser();
		  console.log("user is useEffect: ", loggedInUser);
		  if (loggedInUser != null && loggedInUser != undefined) setUser(loggedInUser);
	  }, [user]);
	
	return (
		<div>
			<SideBar />
			<NavBar user={user}/>
			<Routes>
				<Route path="/signup" element={<Signup />} />
				<Route path="/login" element={<Login setCookie={setCookie}/>} />
				<Route path="/items/mine" element={<MyItems getCookie={getCookie}/>} />
				<Route path="/allitems" element={<AllItems getCookie={getCookie}/>} />
				<Route path="/items/:id" element={<ItemDetails getCookie={getCookie} />} />
				<Route path="/items/create" element={<AddItem getCookie={getCookie} />} />
				<Route path="/items/edit/:id" element={<EditItem getCookie={getCookie} />} />
				<Route path="/items/:primaryId/tradez/:id" element={<ItemDetails getCookie={getCookie} />} />
				<Route path="/items/archived" element={<ArchivedItems getCookie={getCookie} />} />
				<Route path="/profile" element={<UserProfile getCookie={getCookie} />} />
				<Route path="/auth/reset/:token" element={<ResetPassword />} />
				<Route path="/forgot-password" element={<ForgotPassword />} />
				<Route path="/confirm-email/:token" element={<ConfirmEmail />} />
			</Routes>
		</div>
	);
}

export default hot(App);
