import { useEffect } from "react";
import { useState } from "react";
import "./itemForm.css";
import axios from "axios";
const ItemForm = ({ data, setData, selectedFile, setSelectedFile, submitForm }) => {

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name] : input.value });
	};
    
    const [fileList, setFileList] = useState(null);

    useEffect(()=>{
        const dt = new DataTransfer();

        const getImages = async() => {
            const blobs = await Promise.all(data.imagePaths.map(imagePath => 
                axios.get('http://localhost:3000/api/image' + imagePath, {responseType: 'blob'})));

            const files = createFileListFromBlobs(blobs);
            setFileList(files);
        };
        
        getImages();
    }, []);

    function createFileListFromBlobs(blobs) {
        const dt = new DataTransfer();
        for (let i = 0; i < blobs.length; i++) {
            console.log("blob: ", blobs[i]);
            const filename = getFileName(blobs[i].request.responseURL);
            console.log("filename: ", filename);
            const file = new File([blobs[i]], filename, { type: blobs[i].data.type });

            dt.items.add(file);
        }
        return dt.files;
      }

    const getFileName = (path) => {
        console.log(path);
        const filename = path.split('--')[1];
        return filename
    }

	return (
        <>
            <div className="container d-flex col-8 offset-2 mt-5 mb-3 main-container flex-column">
                <h1 className="d-flex col-12 justify-content-center mt-2 font-white">ADD ITEM</h1>
                <hr></hr>
                <form className="d-flex col-12 flex-column" encType="multipart/form-data" onSubmit={submitForm}>
                    <div className="d-flex m-2 col-12 justify-content-around group">
                        <label className="col-3 font-white">Item Name</label>
                        <input className="col-6 form-control-sm" type="text" placeholder="" name="name" value={data.name} onChange={handleChange}/>
                    </div>
                    <div className="d-flex m-2 col-12 justify-content-around group">
                        <label className="col-3 font-white">Approximate Value</label>
                        <div className="col-6">
                            <input className="form-control-sm col-12" type="number" placeholder="e.g 9000.00 (S.P)" name="approximateValue" value={data.approximateValue} onChange={handleChange}/>
                            <p className="sub-text">How much do you evaluate your item's price (S.P)</p>
                        </div>

                    </div>
                    <div className="d-flex m-2 col-12 justify-content-around group">
                        <label className="col-3 font-white">Location</label>
                        <div className="col-6">
                            <input className="col-12 form-control-sm" type="text" placeholder="" name="locationName" value={data.locationName} onChange={handleChange}/>
                            <p className="sub-text">Your location for the trade</p>
                        </div>
                    </div>
                    <div className="d-flex m-2 col-12 justify-content-around group">
                        <label className="col-3 font-white">Item Description</label>
                        <div className="col-6">
                            <textarea className="col-12 form-control-sm" type="textarea" placeholder="" name="description" value={data.description} onChange={handleChange} />
                            <p className="sub-text">Describe your item</p>
                        </div>
                    </div>
                    <div className="d-flex m-2 col-12 justify-content-around align-items-center group">
                        <label className="col-3 font-white">Image Files</label>
                        <div className="inputContainer col-6 d-flex flex-column align-items-center justify-content-center" tabIndex="0" role="button">
                            <i className="fas fa-cloud-upload-alt icon"></i>
                            <p className="mt-1 col-8 d-flex justify-content-center">Drag and drop files here</p>        
                            <input className="fileupload-input col-8 btn btn-outline-light" 
                                type="file" multiple name="imagesReferences" onChange={(e)=> setSelectedFile(Array.from(e.target.files))} />
                            {
                                data && data.imagePaths &&
                                <div className="d-flex justify-content-around col-12 flex-wrap mt-1">
                                {(() => {
                                    let container = [];
                                    {
                                        data.imagePaths.forEach((data, index) => {
                                        console.log("single data is: ", data);
                                        container.push(
                                            <img src={'http://localhost:3000'+data} className="col-4" />
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
                    <input className="col-12 btn btn-light mt-5 mb-2" type="submit" value="Submit"/>
                </form>
            </div>
        </>
	);
};

export default ItemForm;
