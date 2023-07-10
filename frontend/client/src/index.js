import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

import App from "./App";

if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
	  navigator.serviceWorker.register('http://localhost:3001/service-worker.js')
		.then(registration => {
		  console.log('Service Worker registered:', registration);
		})
		.catch(error => {
		  console.error('Error registering Service Worker:', error);
		});
	});
}


ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<App />
		</BrowserRouter>		
	</React.StrictMode>,
	document.getElementById("root")
);
