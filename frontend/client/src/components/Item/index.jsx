import React, {useState} from "react";
import Dropdown from "../Dropdown";
import { useNavigate } from "react-router-dom";
import "./Item.css";

const Item = ({data}) => {

	console.log("data is: ", data);
	const [openDropDown, setOpenDropDown] = useState(false);
	const navigate = useNavigate();
	return (
	<div className="container col-3 border m-3 shadow-sm item-container">
		<div className="three-dots mt-1"
				onClick={() => {setOpenDropDown((prev) => !prev)}}>	
		</div>
			{
				openDropDown && 
				<div className="col-12">
					<Dropdown/>
				</div>
			}
		<div onClick={()=>{
					const location = "/items/" + data._id
					navigate(location)
		}}>
			<div className="col-10 offset-1">
				<img
					src={"http://localhost:3000" + data.imagePaths[0]}
					alt=""
					className="card-img product-img"
				/>
			</div>
			<div className="col-12">
				<p className="product-title">{data.name}</p>
			</div>

			<div className="d-flex col-12 justify-content-between">
				<p className="col-6 product-tradez">Tradez: {data.tradez}</p>
				<p className="col-6 product-price">~{data.approximateValue} S.P</p>
			</div>

			<div className="col-12 product-description-container">
				<p className="product-description">{data.description}</p>
			</div>
		</div>
	</div>
	);
};

export default Item;