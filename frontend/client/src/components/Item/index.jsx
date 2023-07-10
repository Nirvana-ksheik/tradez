import React from "react";
import { useTranslation } from "react-i18next";	
import "./Item.css";
import { formatNumberWithCommas } from "../../helpers/numberFormatHelper";

const Item = ({data, clickEvent, currentLanguage}) => {

	console.log("data is: ", data);

	const {t} = useTranslation();

	return (
	<div dir={currentLanguage === "ar" ? "rtl" : "ltr"} className={"col-xl-3 col-lg-3 col-sm-5 border m-3 shadow-sm item-container " + data.status}>
		<div onClick={clickEvent}>
			<div className="col-12">
				<img
					src={"http://localhost:3000" + data.imagePaths[0]}
					alt=""
					className="col-12 card-img-div"
				/>
			</div>
			<div className="col-12 pe-3 ps-3 mt-3">
				<p className="product-title">{data.name}</p> 
			</div>

			<div className="d-flex col-12 justify-content-between pe-3 ps-3">
				<p className="col-5 product-tradez">{t("OffersLabel")} {formatNumberWithCommas(data.tradez, currentLanguage)}</p>
				<p className="col-5 product-price">~{formatNumberWithCommas(data.approximateValue, currentLanguage)} {t("S.P")}</p>
			</div>

			<div className="col-12 product-description-container pe-3 ps-3">
				<p className="product-description">{data.description}</p>
			</div>
		</div>
	</div>
	);
};

export default Item;