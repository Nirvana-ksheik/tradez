import ItemForm from "components/ItemForm";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ItemStatus } from "lookups";
import { Notifications, parseModelString } from "notifications";
import { adminNotificationSender } from "helpers/notificationHelper";
import "./addItem.css";

const AddItem = ({getCookie, user, currentLanguage}) => {

    const navigate = useNavigate();

    const [data, setData] = useState({
		name: "",
		approximateValue: "",
        description: ""
	});

    const [categories, setCategories] = useState([]);
    const [location, setLocation] = useState(null);
    const [selectedFile, setSelectedFile] = useState("");

    const submitForm = async (e) => {
        e.preventDefault();
        console.log("categories to submit: ", categories)
        const categoriesString = JSON.stringify(categories);

        const formData = new FormData();
        
        formData.append("name",  data.name);
        formData.append("approximateValue",  data.approximateValue);
        formData.append("description",  data.description);
        formData.append("status", ItemStatus.PENDING);
        formData.append("categories", categoriesString);
        formData.append("location", location);

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
			const url = "http://localhost:3000/api/item/create";
            
			await reqInstance.post(url, formData, 
				{
					withCredentials: true,
					baseURL: 'http://localhost:3000',
				})
                .then(async({data: res}) =>{
                    const modelData = {
                        username: user.username
                    };
                    const notificationObject = Notifications.ITEM_UPLOADED;
                    const notificationMessage = parseModelString(notificationObject.message, modelData);
                    const notificationMessageAr = parseModelString(notificationObject.message_ar, modelData);

                    await adminNotificationSender({
                      message: notificationMessage,
                      title: notificationObject.title,
                      message_ar: notificationMessageAr,
                      title_ar: notificationObject.title_ar,
                      currentLanguage: currentLanguage
                    });
                });

			navigate("/items/mine");

		} catch (error) { 
			console.log("error: ", error);
		}
    }

	return (
        <>
            <ItemForm data={data} setData={setData} setSelectedFile={setSelectedFile} 
                        submitForm={submitForm} currentLanguage={currentLanguage}
                        categories={categories} setCategories={setCategories}
                        location={location} setLocation={setLocation}/>
        </>
	);
};

export default AddItem;
