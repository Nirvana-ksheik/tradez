import React from "react";
import Post from "components/Post";
import { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "../../components/SearchBar";
import LoadingSpinner from "../../components/LoadingSpinner"
import NoData from "../../assets/img/no_data_found.png";
// import InfiniteScroll from 'react-infinite-scroller';

const AllPosts = ({getCookie, user, currentLanguage, isMine}) => {

    const [posts, setPosts] = useState([]);
    const [orderValue, setOrderValue ] = useState(null);
    const [orderDirectionValue, setOrderDirectionValue] = useState(null);
    const [searchTextValue, setSearchTextValue] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {

        const getAllPosts = async (controller) => {
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
    
            const url = "http://localhost:3000/api/charity/posts";
            await reqInstance.get(
                url,
                {
                    params: {
                        chairtyId: isMine && user ? user._id : undefined,
                        order: orderValue,
                        orderDirection: orderDirectionValue,
                        searchText: searchTextValue
                    },
                    signal: controller.signal
                },
                {
                    withCredentials: true,
                    baseURL:'http://localhost:3000'
                }
            ).then(({data: res}) => {
                console.log("posts: ", res);
                setPosts(res);
                setIsLoading(false);
            }).catch((err) => {
                console.log("error: ", err);
                setIsLoading(false);
            })
        };
    
        const controller = new AbortController();
        getAllPosts(controller);

        return () => {
            controller.abort();
            setIsLoading(false);
        }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getCookie, isMine, searchTextValue, orderValue, orderDirectionValue]);

    return(
        <div dir={currentLanguage === "ar" ? "rtl" : "ltr"} className={isMine ? "col-12 d-flex flex-column align-items-center justify-content-center" :"d-flex flex-column col-xl-10 offset-xl-1 justify-content-center align-items-center"}>
        
        <SearchBar 
            setOrderValue={setOrderValue} setOrderDirectionValue={setOrderDirectionValue} 
            setSearchTextValue={setSearchTextValue} isCharity={false} isPosts={true}
            currentLanguage={currentLanguage} isMine={isMine}
        />
        {
            posts && !isLoading && posts.length > 0 &&
            <div className={isMine ? "col-10" :"col-8"}>
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
        }
        {
            !isLoading && posts.length === 0 &&
            <div className="d-flex col-12 justify-content-center align-items-center">
                <img src={NoData} className="no-data-img" alt=""/>
            </div>
        }
        {
            isLoading && 
            <LoadingSpinner />
        }

    </div>
    )
}

export default AllPosts;