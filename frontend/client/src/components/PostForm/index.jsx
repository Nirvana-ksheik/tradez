import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './postForm.css'; // Import the CSS file for styling

const PostForm = (props) => {

  const [fileList, setFileList] = useState(null);

  const { t } = useTranslation();

  const handleDescriptionChange = (e) => {
    props.setDescription(e.target.value);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    await props.submitForm();
  };

  useEffect(()=>{
      console.log("props.selectedFile: ", props.selectedFile);
      if(props.selectedFile && props.selectedFile !== [] && props.selectedFile != null && props.selectedFile !== undefined){
          const images = Array.from(props.selectedFile);
          let urls = [];
          images.forEach((image, i) => {
              const url = 'http://localhost:3000' + image;
              urls.push(url);
          });
          setFileList(urls);
      }
  }, [props.selectedFile]);

  return (
    <div dir={props.currentLanguage === "ar" ? "rtl" : "ltr"} className='mt-5 col-md-12 col-lg-8 offset-lg-2 col-xl-6 offset-xl-3'>
    <form className="post-form" onSubmit={handleSubmit}>
      <label className="post-form-label">{t("DescriptionLabel")}</label>
      <textarea
        className="post-form-textarea"
        value={props.description}
        onChange={handleDescriptionChange}
      />

      <label className="post-form-label">{t("ImagesLabel")}</label>
      <div className="image-files-container col-12 d-flex flex-column align-items-center justify-content-center" tabIndex="0" role="button">
        <i className="fas fa-cloud-upload-alt drag-images-upload-icon"></i>
        <p className="mt-1 col-8 d-flex justify-content-center sub-text larger-font-size">{t("DragAndDropFilesHere")}</p>      
        <input className="post-form-file-input" 
            type="file" multiple name="imagesReferences" onChange={(e)=> {
                        const files = Array.from(e.target.files);
                        props.setSelectedFile(files);
                        if(files !== [] && files !== undefined){
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
            <div className="d-flex justify-content-center col-12 flex-wrap mt-1">
              {(() => {
                  let container = [];

                  fileList.forEach((data, index) => {
                    console.log("single data is: ", data);
                    container.push(
                        <img src={data} className="col-4 post-charity-images" key={index} alt=""/>
                    )
                  });

                  return container;
              })()}
            </div>
          }
          <p className="sub-text mt-2 larger-font-size">{t("DefaultImagesWillShow")}</p>
      </div>
      <div className="d-flex col-12 justify-content-center align-items-center">
        <button className="post-form-submit-button col-6" type="submit">
          {t("CreatePost")}
        </button>
      </div>
    </form>
    </div>
  );
};

export default PostForm;
