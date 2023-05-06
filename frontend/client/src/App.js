import { Route, Routes } from "react-router-dom";
import Signup from "./components/Singup";
import Login from "./components/Login";
import { hot } from 'react-hot-loader/root';
import NavBar from "./components/Navbar";
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
import HomePage from "pages/HomePage";

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
		return decodedToken;
	}

	useEffect(() => {
		const loggedInUser = getUser();
		console.log("user is useEffect: ", loggedInUser);
		setUser(loggedInUser);
	  }, []);
	
	return (
		<div>
			<NavBar user={user}/>
			<Routes>
				<Route path="/" element={<HomePage getCookie={getCookie}/>} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/login" element={<Login setCookie={setCookie}/>} />
				<Route path="/items/mine" element={ user ? <MyItems getCookie={getCookie} user={user}/> : <Login setCookie={setCookie}/>} />
				<Route path="/allitems" element={<AllItems getCookie={getCookie} user={user}/>} />
				<Route path="/items/:id" element={ user ? <ItemDetails getCookie={getCookie} enableTrade={false}/> : <Login setCookie={setCookie}/>} />
				<Route path="/items/create" element={ user ? <AddItem getCookie={getCookie} /> : <Login setCookie={setCookie}/>} /> 
				<Route path="/items/edit/:id" element={ user ? <EditItem getCookie={getCookie} /> : <Login setCookie={setCookie}/>} />
				<Route path="/items/:primaryId/tradez/:id" element={ user ? <ItemDetails getCookie={getCookie} enableTrade={true}/> : <Login setCookie={setCookie}/>} />
				<Route path="/items/archived" element={ user ? <ArchivedItems getCookie={getCookie} /> : <Login setCookie={setCookie}/>} />
				<Route path="/profile" element={ user ? <UserProfile getCookie={getCookie} /> : <Login setCookie={setCookie}/>} />
				<Route path="/auth/reset/:token" element={<ResetPassword />} />
				<Route path="/forgot-password" element={<ForgotPassword />} />
				<Route path="/confirm-email/:token" element={<ConfirmEmail />} />
			</Routes>
		</div>
	);
}

export default hot(App);
