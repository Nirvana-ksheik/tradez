import React from "react";
import Post from "components/Post";
import { useEffect, useState } from "react";
import axios from "axios";

const AllPosts = ({getCookie, user, currentLanguage}) => {

    const [posts, setPosts] = useState([]);


    useEffect(() => {

        const getAllPosts = async () => {
            const token = getCookie();
    
            let reqInstance = axios.create({
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
                    'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
                }
            });
    
            const url = "http://localhost:3000/api/charity/posts";
            await reqInstance.get(
                url,
                {
                    withCredentials: true,
                    baseURL:'http://localhost:3000'
                }
            ).then(({data: res}) => {
                console.log("posts: ", res);
                setPosts(res);    
            }).catch((err) => {
                console.log("error: ", err);
            })
        };
    
        getAllPosts();
    
    }, [getCookie]);

    return(
        <div className="col-md-12 col-lg-8 offset-lg-2 col-xl-4 offset-xl-4 d-flex flex-column">
            {
                (() => {
                    let container = [];       
                    posts && posts.forEach((data) => {
                        console.log("single data is: ", data);
                        container.push(
                            <Post key={data._id} user={user} getCookie={getCookie} initialData={data} currentLanguage={currentLanguage}/>
                        )
                    })
                    return container;
                })()
            }
        </div>
    )
}

export default AllPosts;