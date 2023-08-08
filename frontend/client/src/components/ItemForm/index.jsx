import { useEffect } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { findCategoryDescription } from "../../helpers/categoriesHelper";
import { findLocationDescription } from "../../helpers/locationsHelper";
import LocationsDropDown from "../LocationsDropDown";
import ExpandableTextArea from "components/ExpandabletextArea";
import CategoriesDropDown from "../CategoriesDropDown";
import "./itemForm.css";

const ItemForm = ({ data, setData, setSelectedFile, submitForm, currentLanguage, categories, setCategories, location, setLocation}) => {

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name] : input.value });
	};
    
    const [fileList, setFileList] = useState(null);

    const {t} = useTranslation();

    useEffect(()=>{
        
        if(data && data.imagePaths !== [] && data.imagePaths != null && data.imagePaths !== undefined){
            const images = Array.from(data.imagePaths);
            let urls = [];
            images.forEach((image, i) => {
                const url = 'http://localhost:3000' + image;
                urls.push(url);
            });
            setFileList(urls);
        }
    }, [data]);

	return (
        <div dir={currentLanguage === "ar" ? "rtl" : "ltr"} className="col-12 d-flex justify-content-center align-items-center">
            <div className="container d-flex flex-column col-xl-8 col-10  mt-5 mb-3 form-main-container">
                <p className="d-flex col-12 justify-content-center mt-2 p-font">{t("AddItemLink")}</p>
                <form className="d-flex col-12 flex-column" encType="multipart/form-data" onSubmit={submitForm}>
                    <div className="d-flex col-12 flex-lg-row flex-column">
                        <div className="col-lg-6 col-12">
                            <div className="d-flex mt-md-5 mt-1 col-12 flex-md-row flex-column justify-content-around group input-container">
                                <label className="col-md-3 col-12 font-label">{t("ItemName")}</label>
                                <div className="col-md-7 col-11">
                                    <input className="col-12 form-control-sm" type="text" placeholder="" name="name" value={data.name} onChange={handleChange}/>
                                </div>
                            </div>
                            <div className="d-flex mt-md-5 mt-1 col-12 flex-md-row flex-column justify-content-around group input-container">
                                <label className="col-md-3 col-12 font-label">{t("ApproximateValue")}</label>
                                <div className="col-md-7 col-11">
                                    <input className="form-control-sm col-12" type="number" placeholder={t("ApproximateValuesPlaceholder")} name="approximateValue" value={data.approximateValue} onChange={handleChange}/>
                                    <p className="sub-text">{t("ApproximateValueSubText")}</p>
                                </div>

                            </div>
                            <div className="d-flex mt-md-5 mt-1 flex-md-row flex-column col-12 justify-content-around group input-container">
                                <label className="col-md-3 col-12 font-label">{t("ItemDescription")}</label>
                                <div className="col-md-7 col-11">
                                    <ExpandableTextArea
                                        name={"description"}
                                        className={"col-12 form-control-sm text-area-description"}
                                        handleChange={handleChange}
                                        value={data.description}
                                    />
                                    <p className="sub-text">{t("ItemDescriptionSubText")}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-12 ">
                            <div className="d-flex mt-md-5 mt-1 flex-md-row flex-column col-12 justify-content-around group input-container">
                                <label className="col-md-3 col-12 font-label">{t("ItemCategories")}</label>
                                <div className="col-md-7 col-11">
                                    <CategoriesDropDown btnName={t("Categories")} setDropValue={setCategories} dropValue={categories} currentLanguage={currentLanguage} className={"col-12 form-control-sm"}/>
                                    <div className="col-12 d-flex flex-wrap">
                                    {
                                        ( () => {
                                            let container = [];

                                            categories.forEach((cat, j) => {
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
                                    </div>
                                    <p className="sub-text">{t("ItemCategoriesSubText")}</p>
                                </div>
                            </div>
                            <div className="d-flex mt-md-5 mt-1 col-12 flex-md-row flex-column justify-content-around group input-container">
                                <label className="col-md-3 col-12 font-label">{t("Location")}</label>
                                <div className="col-md-7 col-11">
                                    <LocationsDropDown btnName={t("Location")} setDropValue={setLocation} dropValue={location} currentLanguage={currentLanguage} className={"col-12 form-control-sm"}/>
                                    {
                                        location &&
                                        <div className="col-12 d-flex flex-wrap">
                                            <div className="subcat-label">
                                                <span>
                                                    {findLocationDescription(location, currentLanguage)}
                                                </span>
                                            </div>
                                        </div>
                                    }
                                    <p className="sub-text">{t("LocationSubText")}</p>
                                </div>
                            </div>
                            <div className="d-flex mt-md-5 mt-1 flex-md-row flex-column col-12 justify-content-around align-items-center group input-container">
                                <label className="col-md-3 col-12 font-label">{t("ImageFiles")}</label>
                                <div className="image-files-container col-md-7 col-11 d-flex flex-column align-items-center justify-content-center" tabIndex="0" role="button">
                                    <i className="fas fa-cloud-upload-alt drag-images-upload-icon"></i>
                                    <p className="mt-1 col-8 d-flex justify-content-center sub-text">{t("DragAndDropFilesHere")}</p>        
                                    <input className="fileupload-input col-8" 
                                        type="file" multiple name="imagesReferences" onChange={(e)=> {
                                                    const files = Array.from(e.target.files);
                                                    setSelectedFile(files);
                                                    if(files != [] && files != undefined){
                                                        let urls = [];
                                                        files.forEach((file, i)=>{
                                                            const objectUrl = URL.createObjectURL(file);
                                                            console.log("object url: ", objectUrl);
                                                            urls.push(objectUrl);
                                                        });
                                                        setFileList(urls);
                                                    }
                                                    console.log("selected files: ", e.target.files);
                                                }
                                            } />
                                    {
                                        fileList &&
                                        <div className="d-flex justify-content-around col-12 flex-wrap mt-1">
                                        {(() => {
                                            let container = [];
                                            
                                                fileList.forEach((data, index) => {
                                                console.log("single data is: ", data);
                                                container.push(
                                                    <img src={data} className="col-4" key={index} alt=""/>
                                                )
                                                })
                                            
                                            return container;
                                        })()}
                                        <p className="sub-text mt-2">{t("DefaultImagesWillShow")}</p>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 d-flex justify-content-center mb-lg-3">
                        <input className="col-lg-4 col-10 btn mt-5 mb-2 submit-btn" type="submit" value={t("AddItemLink")}/>
                    </div>
                </form>
            </div>
        </div>
	);
};

export default ItemForm;
