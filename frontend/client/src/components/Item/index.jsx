import React from "react";
import { useTranslation } from "react-i18next";	
import { formatNumberWithCommas } from "../../helpers/numberFormatHelper";
import { findCategoryDescription } from "../../helpers/categoriesHelper";
import { findLocationDescription } from "../../helpers/locationsHelper";
import "./Item.css";

const Item = ({data, clickEvent, currentLanguage, isUserProfile, isAdminPage}) => {

	console.log("data is: ", data);

	const {t} = useTranslation();

	return (
		<div dir={currentLanguage === "ar" ? "rtl" : "ltr"} className={isUserProfile ? 
				"col-12 m-3 item-container " + data.status : 
				isAdminPage ? 
					(data.archived !== true ?
					"col-12 m-3 item-container item-container " + data.status :
					"col-12 m-3 item-container item-container is-delivered-" + data.isDelivered) :
				"col-xl-3 col-lg-3 col-sm-5 m-3 item-container " + data.status}>
			<div onClick={clickEvent}>
				<div className="col-12">
					<img
						src={"http://localhost:3000" + data.imagePaths[0]}
						alt=""
						className="col-12 card-img-div"
					/>
				</div>
				<div className="col-12 mt-3 pe-3 ps-3">
					<p className={isAdminPage ? "product-item-title-small" : "product-item-title"}>{data.name}</p> 
				</div>
				<div className={isAdminPage ? "col-12 d-flex align-items-center pe-2 ps-2 justify-content-start mb-1" : "col-12 d-flex align-items-center pe-2 ps-2 justify-content-start mb-3"}>
					<i className={isAdminPage ? "fa-solid fa-location-dot pe-2 ps-2 item-location-icon-small" : "fa-solid fa-location-dot pe-2 ps-2 item-location-icon"}></i>
					<p className={isAdminPage ? "item-description-small" : "item-description"}>{findLocationDescription(data.location, currentLanguage)}</p> 
				</div>
				<div className={isAdminPage ? "col-12 pe-3 ps-3 product-description-container-small" : "col-12 pe-3 ps-3 product-description-container"}>
					<div className={isAdminPage ? "col-12 d-flex flex-wrap product-item-description-small" : "col-12 d-flex flex-wrap product-item-description"}>
					{
						( () => {
							if(data.categories && data.categories !==[])
							{
								let container = [];

								data.categories.forEach((cat, j) => {
									container.push(
										<div key={j} className={isAdminPage ? "subcat-label-item-small" : "subcat-label-item"}>
											<span>
												{findCategoryDescription(cat, currentLanguage)}
											</span>
										</div>
									)
								})
								return container;
							}
						})()
					}
					</div>
				</div>

				<div className="d-flex col-12 justify-content-between mt-4 pe-3 ps-3">
					<p className={isAdminPage ? "col-5 product-item-tradez-small" : "col-5 product-item-tradez"}>{t("OffersLabel")} {formatNumberWithCommas(data.tradez, currentLanguage)}</p>
					<p className={isAdminPage ? "col-5 product-item-price-small" : "col-5 product-item-price"}>~{formatNumberWithCommas(data.approximateValue, currentLanguage)} {t("S.P")}</p>
				</div>
			</div>
		</div>
	);
};

export default Item;