import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PostForm from "components/PostForm";
import { followersNotificationSender } from "../../helpers/notificationHelper";
import { Notifications, parseModelString } from "notifications";

const AddPost = ({user, getCookie, currentLanguage}) => {  
     
    const [description, setDescription] = useState();
    const [selectedFile, setSelectedFile] = useState();
    const navigate = useNavigate();

    const submitForm = async () => {
        const formData = new FormData();
        formData.append("description",  description);

        for (let i = 0; i < selectedFile.length; i++) {
            formData.append('imagesReferences', selectedFile[i]);
        }

        const token = getCookie();

        let reqInstance = axios.create({
            headers: {
                'ContentType': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            }
        });

		try {
			    const url = "http://localhost:3000/api/charity/posts/create";

			    await reqInstance.post(url, formData, {
                    withCredentials: true,
                    baseURL: 'http://localhost:3000',
                });

                const modelData = {
                    username: user.username
                };

                const notificationObject = Notifications.CHARITY_UPLOADED_POST;
                const notificationMessage = parseModelString(notificationObject.message, modelData);
                const notificationMessageAr = parseModelString(notificationObject.message_ar, modelData);
        
                await followersNotificationSender({
                    charityId: user.id,
                    message: notificationMessage,
                    title: notificationObject.title,
                    message_ar: notificationMessageAr,
                    title_ar: notificationObject.title_ar,
                    currentLanguage: currentLanguage
                });

			    navigate("/charity/posts");

		} catch (error) { 
			console.log("error: ", error);
		}
    }

    return (
        <>
            <PostForm setDescription={setDescription} setSelectedFile={setSelectedFile} submitForm={submitForm} currentLanguage={currentLanguage}/>
        </>
    );
}

export default AddPost;