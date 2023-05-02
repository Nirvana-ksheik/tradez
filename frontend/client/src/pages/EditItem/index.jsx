import ItemForm from "components/ItemForm";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditItem = ({ getCookie }) => {

    const navigate = useNavigate();
    const {id} = useParams();

    const [data, setData] = useState("");
    const [selectedFile, setSelectedFile] = useState([]);

    useEffect(() => {   
        getItemDetails();
    }, []);

    const getItemDetails = async () => {

        const token = getCookie();

        let reqInstance = axios.create({
            headers: {
                Authorization: `Bearer ${token}`,
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
                'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
            }
        });

        const url = "http://localhost:3000/api/item/" + id;
        await reqInstance.get(
            url,
            {
                withCredentials: true,
                baseURL:'http://localhost:3000'
            }
        ).then(async ({data}) => {
            console.log("data: ", data);
            setData(data);
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

        console.log("selectedFiles: ", selectedFile);
        
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
                data &&
                <ItemForm data={data} setData={setData} setSelectedFile={setSelectedFile} submitForm={submitForm} />
            }
        </>
	);
};

export default EditItem;
