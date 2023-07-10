import React from "react";
import { formatNumberWithCommas } from "../../helpers/numberFormatHelper";
import { useTranslation } from "react-i18next";
import "./charity.css";

const Charity = ({data, clickEvent, currentLanguage}) => {

	console.log("data is: ", data);

	const { t } = useTranslation();

	return (
	<div className={" col-xl-3 col-lg-3 col-sm-5 border m-3 shadow-sm charity-list-main-container"}>
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
				<i className="col-1 fa-solid fa-envelope align-items-center email-charity-logo align-items-center m-0"></i>
				&nbsp;&nbsp;&nbsp;
				<p className="col-11 email-charity align-items-center font-bold m-0">{data.email}</p>
			</div>
			<div className="col-12 d-flex align-items-center pe-3 ps-3">
				<i className="col-1 fa-solid fa-user-tie align-items-center email-charity-logo align-items-center m-0"></i>
				&nbsp;&nbsp;&nbsp;
				<p className="col-11 email-charity align-items-center font-bold m-0">{data.ceo}</p>
			</div>
			<div className="col-12 d-flex align-items-center pe-3 ps-3">
				<i className="col-1 fa-solid fa-coins align-items-center email-charity-logo align-items-center m-0"></i>
				&nbsp;&nbsp;&nbsp;
				<p className="col-11 email-charity align-items-center font-bold m-0">{formatNumberWithCommas(data.annualTurnover, currentLanguage)} {t("S.P")}</p>
			</div>

			<div className="col-12 product-description-container mt-2 pe-3 ps-3">
				<p className="product-description">{data.mission}</p>
			</div>
		</div>
	</div>
	);
};

export default Charity;