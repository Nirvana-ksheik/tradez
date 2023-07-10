import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import PostForm from "components/PostForm";

const EditPost = ({getCookie, currentLanguage}) => {

    const [description, setDescription] = useState();
    const [selectedFile, setSelectedFile] = useState();
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();
    const {id} = useParams();

    useEffect(() => {

        const getItemDetails = async () => {
            setIsLoading(true);
            const token = getCookie();
    
            let reqInstance = axios.create({
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
                    'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
                }
            });
    
            const url = "http://localhost:3000/api/charity/posts/" + id;
            await reqInstance.get(
                url,
                {
                    withCredentials: true,
                    baseURL:'http://localhost:3000'
                }
            ).then(({data: res}) => {
                console.log("data: ", res);
                setDescription(res.description);
                setSelectedFile(res.images);
                setIsLoading(false);

            }).catch((err) => {
                console.log("error: ", err);
                setIsLoading(false);
            })
        };

        getItemDetails();

    }, [getCookie, id]);

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
			const url = "http://localhost:3000/api/charity/posts/edit/" + id;
			await reqInstance.post(url, formData, 
				{
					withCredentials: true,
					baseURL: 'http://localhost:3000',
				});

			navigate("/charity/posts");

		} catch (error) { 
			console.log("error: ", error);
		}
    }

    return (
        <>
        {
            !isLoading &&
            <PostForm setDescription={setDescription} description={description} selectedFile={selectedFile} setSelectedFile={setSelectedFile} submitForm={submitForm} currentLanguage={currentLanguage}/>
        }
        </>
    );
}

export default EditPost;