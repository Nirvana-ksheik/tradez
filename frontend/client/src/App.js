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
import ResetPassword from "components/ResetPassword";
import ForgotPassword from "components/ForgotPassword";
import ConfirmEmail from "components/ConfirmEmail";
import SignupCharity from "components/SignupCharity";
import LoginCharity from "components/LoginCharity";
import UserProfilePage from "pages/UserProfilePage";
import CharityProfilePage from "pages/CharityProfilePage";
import AddPost from "pages/AddPost/addPost";
import EditPost from "pages/EditPost";
import AllPosts from "pages/AllPosts";
import AllCharities from "pages/getAllCharities";
import { subscribeUser } from "./subscription";
import axios from "axios";
import { useTranslation, I18nextProvider  } from "react-i18next";
import Landing from "./pages/Landing";
// eslint-disable-next-line no-unused-vars
import i18n from "./i18n";
import AllTradez from "./pages/AllTradez";
import { Role } from "./lookups";

function App() {

	const [user, setUser] = useState();
	const [cookiesObject, setCookiesObject] = useState(new Cookies());

	const { i18n } = useTranslation();
	let currentLanguage = i18n.language;

	const changeLanguage = (lng) => {
		currentLanguage = lng;
		i18n.changeLanguage(lng); // Switch the language
	};

	const setCookie = (token) =>{
		const previousToken = getCookie();
		if(previousToken == null || previousToken == undefined){
			console.log("ENTERED SET COOOOOOOOOKIE");
			const decodedToken = jwt(token);
			cookiesObject.set("jwt", token, {expires: new Date(decodedToken.exp * 1000)});
			setCookiesObject(cookiesObject);
			console.log("decoded token: ", decodedToken);
			setUser(decodedToken);
		}
	}

	const getCookie = () => {
		return cookiesObject.get("jwt");
	}

	useEffect(() => {
		
		const getCookieObject = () => {
			const token = cookiesObject.get("jwt");
			return token;
		}

		const getUser = () => {
			const token = getCookieObject();
			console.log("cooooooookie: ", token);
			if(token == null || token === undefined) {return null;}
			const decodedToken = jwt(token);
			console.log("decoded token: ", decodedToken);
			return decodedToken;
		}

		const loggedInUser = getUser();
		console.log("user is useEffect: ", loggedInUser);
		setUser(loggedInUser);

	}, [cookiesObject, setUser]);

	useEffect(() => {
		// Request permission for push notifications
		Notification.requestPermission()
		  .then((permission) => {
			console.log("Notification permission: ", permission);
			if (permission === 'granted') {
			  // Subscribe the user to push notifications
			  const usr =  subscribeUser();
			  console.log("Subscribe User: ", usr);
			  return usr;
			} else {
			  throw new Error('Permission denied for push notifications');
			}
		  })
		  .then(async(subscription) => {
			console.log("Subscribtion: ", subscription);
			// Send the subscription object to the backend server
			if(user){
				const userId = user.id; // Replace with the actual user ID
				await saveSubscription(userId, subscription);
			}
		  })
		  .catch((error) => {
			console.error('Error requesting permission:', error);
		  });
	  }, [user]);


	const saveSubscription = async (userId, subscription) => {
		await axios.post('http://localhost:3000/api/save-subscription', {
			userId: userId,
			subscription: subscription
		},
		{
			baseURL: 'http://localhost:3000'
		})
		.then(({data: res}) => {
			console.log("Response from saving subscription: ", res);
			if (res === 'OK') {
				console.log('Subscription saved successfully');
			} else {
				throw new Error('Error saving subscription');
			}
		})
		.catch((error) => {
			console.error('Error saving subscription:', error);
		});
	};

	return (
		<I18nextProvider i18n={i18n}>
		<div>
			<NavBar user={user} getCookie={getCookie} changeLanguage={changeLanguage} currentLanguage={currentLanguage}/>
			<Routes>
				<Route path="/" element={<Landing />} />
				<Route path="/signup" element={<Signup currentLanguage={currentLanguage}/>} />
				<Route path="/login" element={<Login setCookie={setCookie} currentLanguage={currentLanguage}/>} />
				<Route path="/items/mine" element={ user ? <MyItems getCookie={getCookie} user={user} currentLanguage={currentLanguage}/> : <Login setCookie={setCookie}/>} currentLanguage={currentLanguage}/>
				<Route path="/allitems" element={<AllItems getCookie={getCookie} user={user} currentLanguage={currentLanguage}/>} />
				<Route path="/items/:id" element={ user ? <ItemDetails getCookie={getCookie} enableTrade={false} user={user} currentLanguage={currentLanguage} /> : <Login setCookie={setCookie} currentLanguage={currentLanguage}/>} />
				<Route path="/items/create" element={ user ? <AddItem getCookie={getCookie} user={user} currentLanguage={currentLanguage}/> : <Login setCookie={setCookie} currentLanguage={currentLanguage}/>} /> 
				<Route path="/items/edit/:id" element={ user ? <EditItem getCookie={getCookie} currentLanguage={currentLanguage}/> : <Login setCookie={setCookie} currentLanguage={currentLanguage}/>} />
				<Route path="/items/:primaryId/tradez/:id" element={ user ? <ItemDetails getCookie={getCookie} enableTrade={true} currentLanguage={currentLanguage} user={user}/> : <Login setCookie={setCookie} currentLanguage={currentLanguage}/>} />
				<Route path="/items/archived" element={ user ? <ArchivedItems getCookie={getCookie} currentLanguage={currentLanguage}/> : <Login setCookie={setCookie} currentLanguage={currentLanguage}/>} />
				<Route path="/profile/:id" element={ user ? <UserProfilePage getCookie={getCookie} user={user} currentLanguage={currentLanguage} /> : <Login setCookie={setCookie} currentLanguage={currentLanguage}/>} />
				<Route path="/auth/reset/:token" element={<ResetPassword user={user} currentLanguage={currentLanguage}/>} />
				<Route path="/forgot-password" element={<ForgotPassword currentLanguage={currentLanguage}/>} />
				<Route path="/confirm-email/:token" element={<ConfirmEmail isCharity={false} currentLanguage={currentLanguage}/>} />
				<Route path="/charity/signup" element={<SignupCharity currentLanguage={currentLanguage}/>} />
				<Route path="/charity/login" element={<LoginCharity setCookie={setCookie} currentLanguage={currentLanguage}/>} />
				<Route path="/charity/confirm-email/:token" element={<ConfirmEmail isCharity={true} currentLanguage={currentLanguage}/>} />
				<Route path="/charity/profile/:id" element={ <CharityProfilePage getCookie={getCookie} user={user} currentLanguage={currentLanguage}/>} />
				<Route path="/charity/posts/create" element={ <AddPost user={user} getCookie={getCookie} currentLanguage={currentLanguage}/> } />
				<Route path="/charity/posts/edit/:id" element={ <EditPost getCookie={getCookie} currentLanguage={currentLanguage}/> } />
				<Route path="/charity/posts" element={ <AllPosts getCookie={getCookie} user={user} currentLanguage={currentLanguage}/> } />
				<Route path="/charities" element={ <AllCharities getCookie={getCookie} user={user} currentLanguage={currentLanguage}/> } />
				<Route path="/items/tradez" element={ user && user.role === Role.ADMIN ? <AllTradez getCookie={getCookie} user={user} currentLanguage={currentLanguage}/> : <Landing /> } />
			</Routes>
		</div>
		</I18nextProvider>
	);
}

export default hot(App);
