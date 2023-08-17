import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ItemForm from "components/ItemForm";
import axios from "axios";

const EditItem = ({ getCookie, currentLanguage }) => {

    const navigate = useNavigate();
    const {id} = useParams();

    const [data, setData] = useState("");
    const [location, setLocation] = useState(null);
    const [selectedFile, setSelectedFile] = useState([]);
    const [categories, setCategories] = useState([]);

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
            setLocation(data.location);
            setCategories(data.categories)
        });
    };

    const submitForm = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        const categoriesString = JSON.stringify(categories);

        formData.append("_id", data._id);
        formData.append("name",  data.name);
        formData.append("approximateValue",  data.approximateValue);
        formData.append("locationName",  data.locationName);
        formData.append("description",  data.description);
        formData.append("categories", categoriesString);
        formData.append("location", location);
        
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
                <ItemForm data={data} setData={setData} setSelectedFile={setSelectedFile} 
                            submitForm={submitForm} currentLanguage={currentLanguage} 
                            categories={categories} setCategories={setCategories}
                            location={location} setLocation={setLocation} isEdit={true}/>
            }
        </>
	);
};

export default EditItem;
