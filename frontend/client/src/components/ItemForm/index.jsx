import { useEffect } from "react";
import { useState } from "react";
import "./itemForm.css";

const ItemForm = ({ data, setData, setSelectedFile, submitForm }) => {

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name] : input.value });
	};
    
    const [fileList, setFileList] = useState(null);

    useEffect(()=>{
        
        if(data && data.imagePaths != [] && data.imagePaths != null && data.imagePaths != undefined){
            const images = Array.from(data.imagePaths);
            let urls = [];
            images.forEach((image, i) => {
                const url = 'http://localhost:3000' + image;
                urls.push(url);
            });
            setFileList(urls);
        }
    }, []);

	return (
        <>
            <div className="container d-flex flex-column col-xl-8 col-lg-10 col-sm-12 offset-xl-2 offset-lg-1 mt-5 mb-3 form-main-container">
                <p className="d-flex col-12 justify-content-center mt-2 p-font">ADD ITEM</p>
                <form className="d-flex col-12 flex-column" encType="multipart/form-data" onSubmit={submitForm}>
                    <div className="d-flex col-12 flex-lg-row flex-column">
                        <div className="col-lg-6 col-12">
                            <div className="d-flex mt-5 col-12 justify-content-around group input-container">
                                <label className="col-3 font-white">Item Name</label>
                                <div className="col-7">
                                    <input className="col-12 form-control-sm" type="text" placeholder="" name="name" value={data.name} onChange={handleChange}/>
                                </div>
                            </div>
                            <div className="d-flex mt-5 col-12 justify-content-around group input-container">
                                <label className="col-3 font-white">Approximate Value</label>
                                <div className="col-7">
                                    <input className="form-control-sm col-12" type="number" placeholder="e.g 9000.00 (S.P)" name="approximateValue" value={data.approximateValue} onChange={handleChange}/>
                                    <p className="sub-text">How much do you evaluate your item's price (S.P)</p>
                                </div>

                            </div>
                            <div className="d-flex mt-5 col-12 justify-content-around group input-container">
                                <label className="col-3 font-white">Location</label>
                                <div className="col-7">
                                    <input className="col-12 form-control-sm" type="text" placeholder="" name="locationName" value={data.locationName} onChange={handleChange}/>
                                    <p className="sub-text">Your location for the trade</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-12">
                            <div className="d-flex mt-5 col-12 justify-content-around group input-container">
                                <label className="col-3 font-white">Item Description</label>
                                <div className="col-7">
                                    <textarea className="col-12 form-control-sm" type="textarea" placeholder="" name="description" value={data.description} onChange={handleChange} />
                                    <p className="sub-text">Describe your item</p>
                                </div>
                            </div>
                            <div className="d-flex mt-5 col-12 justify-content-around align-items-center group input-container">
                                <label className="col-3 font-white">Image Files</label>
                                <div className="image-files-container col-7 d-flex flex-column align-items-center justify-content-center" tabIndex="0" role="button">
                                    <i className="fas fa-cloud-upload-alt drag-images-upload-icon"></i>
                                    <p className="mt-1 col-8 d-flex justify-content-center sub-text">Drag and drop files here</p>        
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
                                            {
                                                fileList.forEach((data, index) => {
                                                console.log("single data is: ", data);
                                                container.push(
                                                    <img src={data} className="col-4" key={index} />
                                                )
                                                })
                                            }
                                            return container;
                                        })()}
                                        <p className="sub-text mt-2">Default images will be chosen if no new images were selected</p>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 d-flex justify-content-center mb-lg-3">
                        <input className="col-lg-4 col-10 btn mt-5 mb-2 submit-btn" type="submit" value="Submit"/>
                    </div>
                </form>
            </div>
        </>
	);
};

export default ItemForm;
