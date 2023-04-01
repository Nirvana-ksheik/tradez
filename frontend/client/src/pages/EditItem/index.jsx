import ItemForm from "components/ItemForm";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditItem = ({ getCookie }) => {

    const navigate = useNavigate();
    const {id} = useParams();

    const [data, setData] = useState("");
    const [selectedFile, setSelectedFile] = useState("");

    useEffect(() => {   
        getItemDetails();
    }, []);

    const getItemDetails = async () => {

        const token = getCookie();

        let reqInstance = axios.create({
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const url = "http://localhost:3000/api/item/" + id;
        await reqInstance.get(
            url,
            {
                withCredentials: true,
                baseURL: 'http://localhost:3000'
            }
        ).then(async ({data}) => {
            console.log("data: ", data);
            setData(data);

            const newFiles = [];

            data.imagePaths.forEach((item, i) => {
                console.log("item in foreach is: ", item);

                const fileName = item.split("\\").pop();

                reqInstance.get("http://localhost:3000/api" + item, {
                    withCredentials: true,
                    baseURL: 'http://localhost:3000'
                })
                    .then((response) => response.blob())
                    .then((blob) => {    
                        const file = new File([blob], fileName, { type: blob.type });
                        newFiles.push(file);
                        if (newFiles.length === data.imagePaths.length) {
                          setSelectedFile(newFiles);
                        }
                    });
                        
                console.log("files: ", newFiles);
            });
        });
    };

    const submitForm = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append("_id", data._id);
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
			const url = "http://localhost:3000/api/item/edit/" + id;
			await reqInstance.put(url, formData, 
				{
					withCredentials: true,
					baseURL: 'http://localhost:3000'
				});

			navigate("/items/mine");

		} catch (error) { 
			console.log("error: ", error);
		}
    }    

	return (
        <>
            {   
                data && selectedFile &&
                <ItemForm data={data} setData={setData} selectedFile={selectedFile} setSelectedFile={setSelectedFile} submitForm={submitForm} />
            }
        </>
	);
};

export default EditItem;
