import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

import "assets/vendor/nucleo/css/nucleo.css";
import "assets/vendor/font-awesome/css/font-awesome.min.css";
import "assets/scss/argon-design-system-react.scss?v1.1.0";

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
