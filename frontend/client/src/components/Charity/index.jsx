import React from "react";
import { useTranslation } from "react-i18next";
import { findCategoryDescription } from "../../helpers/categoriesHelper";
import "./charity.css";

const Charity = ({data, clickEvent, currentLanguage}) => {

	console.log("data is: ", data);
	const { t } = useTranslation();

	return (
		<>
			{
				data && 
				<div className={" col-xl-3 col-lg-3 col-sm-5 border m-3 shadow-sm charity-list-main-container " + data.status}>
				<div onClick={clickEvent}>
					<div className="w-100">
						<img
							src={"http://localhost:3000" + data.logo}
							alt=""
							className="col-12 card-img-div"
						/>
					</div>
					<div className="col-12 pe-3 ps-3 mt-2">
						<p className="charity-organization-name">{data.organizationName}</p> 
					</div>
					<div className="col-12 d-flex align-items-center pe-3 ps-3">
						<i className="col-1 fa-solid fa-globe align-items-center email-charity-logo align-items-center m-0"></i>
						&nbsp;&nbsp;&nbsp;
						<a className="col-11 email-charity align-items-center font-bold m-0" href={data.website} target="_blank" rel="noreferrer" onClick={(e)=>{
							e.preventDefault();
							window.open(data.website, '_blank', 'noreferrer')
						}}>{data.website}</a>
					</div>
					<div className="col-12 d-flex align-items-center pe-3 ps-3 mb-2">
						<i className="col-1 fa-solid fa-user-tie align-items-center email-charity-logo align-items-center m-0"></i>
						&nbsp;&nbsp;&nbsp;
						<p className="col-11 email-charity align-items-center font-bold m-0">{data.ceo}</p>
					</div>
					<div className="col-12 d-flex flex-wrap mt-3 product-description-container">
						{
							( () => {
								let container = [];

								data.categories.forEach((cat, j) => {
									container.push(
										<div key={j} className="subcat-label">
											<span>
												{findCategoryDescription(cat, currentLanguage)}
											</span>
										</div>
									)
								})
								return container;
							})()
						}
						{
							(data.categories == null || data.categories === undefined || data.categories.length === 0) &&
							<h6 className={currentLanguage === "ar" ? 'text-right charity-profile-text' : 'text-left charity-profile-text'}>
								{t("CharityDidntAddCategories")}
							</h6>
						}
					</div>
					{/* <div className="col-12 product-charity-description-container mt-2 pe-3 ps-3">
						<p className="product-charity-description">{data.mission}</p>
					</div> */}
				</div>
				</div>
			}
		</>	
	);
};

export default Charity;