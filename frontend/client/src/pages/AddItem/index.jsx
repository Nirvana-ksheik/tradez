import ItemForm from "components/ItemForm";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./addItem.css";

const AddItem = ({getCookie}) => {

    const navigate = useNavigate();

    const [data, setData] = useState({
		name: "",
		approximateValue: "",
		locationName: "",
        description: ""
	});

    const [selectedFile, setSelectedFile] = useState("");

    const submitForm = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name",  data.name);
        formData.append("approximateValue",  data.approximateValue);
        formData.append("locationName",  data.locationName);
        formData.append("description",  data.description);

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
				});

			navigate("/items/mine");

		} catch (error) { 
			console.log("error: ", error);
		}
    }

	return (
        <>
            <ItemForm data={data} setData={setData} selectedFile={selectedFile} setSelectedFile={setSelectedFile} submitForm={submitForm} />
        </>
	);
};

export default AddItem;
