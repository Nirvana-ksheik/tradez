import React, { useState, useEffect } from "react";
import axios from "axios";
import { Gallery } from "react-grid-gallery";
import { notificationSender } from "helpers/notificationHelper";
import { Notifications, parseModelString } from "notifications";
import { useTranslation } from "react-i18next";
import { formatNumberWithCommas } from "../../helpers/numberFormatHelper";
import { formatDateWithLanguage } from "../../helpers/dateFormatHelper";
import { Dropdown } from "react-bootstrap";
import "./post.css";
import { useNavigate } from "react-router-dom";

const Post = ({ getCookie, user, initialData, currentLanguage }) => {
  const [liked, setLiked] = useState();

  const [comment, setComment] = useState("");
  const [imagesPaths, setImagesPaths] = useState([]);
  const [data, setData] = useState(initialData);
  const [showAllComments, setShowAllComments] = useState(false);

  const navigate = useNavigate();

  const { t } = useTranslation();

  useEffect(() => {
    if(data){
      console.log('data.comments: ', data.comments);
      console.log("data.likes: ", data.likes);
      if(data.likes){
        console.log("likesArray: ", data.likes);
        if (data.likes.find(({userId: val}) => val === user.id)) {
          setLiked(true);
        } else {
          setLiked(false);
        }
      }
      console.log("images: ", data.imagesReferences);
      if(data.imagesReferences){
          const images = [];
          data.imagesReferences.forEach((img) => {
              let newImage = {
                  src: 'http://localhost:3000' + img,
                  width: 320,
                  height: 320
              }
              images.push(newImage);
          });
          setImagesPaths(images);
      }
    }

  }, [data, setImagesPaths, user.id, initialData, setData]);

  const handleLike = async () => {
    let url = '';
    if (!liked) {
      url = 'http://localhost:3000/api/charity/posts/' + data._id + '/like';
    } else {
      url = 'http://localhost:3000/api/charity/posts/' + data._id + '/unlike'
    }
    const token = getCookie();
    let reqInstance = axios.create({
      headers: {
        Authorization: `Bearer ${token}`,
        TimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    });
    await reqInstance.post(url, {})
      .then(async({ data: res }) => {
        console.log("result is: ", res);
        setLiked(!liked);
        setData((prevData) => ({ ...prevData, ...res }));
        if(!liked){

          const modelData = {
            username: user.username
          };
          const notificationObject = Notifications.USER_LIKE_POST;
          const notificationMessage = parseModelString(notificationObject.message, modelData);
          const notificationMessageAr = parseModelString(notificationObject.message_ar, modelData);

          await notificationSender({
            userId: data.charityId,
            message: notificationMessage,
            title: notificationObject.title,
            message_ar: notificationMessageAr,
            title_ar: notificationObject.title_ar,
            currentLanguage: currentLanguage
          });
        }
      })
  }

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleDeleteComment = async (commentId) => {
    const token = getCookie();
    const url = "http://localhost:3000/api/charity/posts/" + data._id + "/comment/" + commentId;

    let reqInstance = axios.create({
      headers: {
        Authorization: `Bearer ${token}`,
        TimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }
    });

    await reqInstance.delete(url)
      .then(({ data: res }) => {
        console.log("result is: ", res);
        setData(res);
      })
      .catch((err) => {
        console.log("error is: ", err);
      });
  }

  const handleCommentSubmit = async (event) => {
    event.preventDefault();

    if (comment.trim() !== "") {
      const token = getCookie();
      const url =
        "http://localhost:3000/api/charity/posts/" + data._id + "/comment";

      let reqInstance = axios.create({
        headers: {
          Authorization: `Bearer ${token}`,
          TimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      });

      await reqInstance
        .post(url, {
          commentText: comment,
        })
        .then(async({ data: res }) => {
          console.log("result is: ", res);
          setData(res);

          const modelData = {
            username: user.username
          };
          const notificationObject = Notifications.USER_COMMENTED_POST;
          const notificationMessage = parseModelString(notificationObject.message, modelData);
          const notificationMessageAr = parseModelString(notificationObject.message_ar, modelData);

          await notificationSender({
            userId: data.charityId,
            message: notificationMessage,
            title: notificationObject.title,
            message_ar: notificationMessageAr,
            title_ar: notificationObject.title_ar,
            currentLanguage: currentLanguage
          });
        })
        .catch((err) => {
          console.log("error is: ", err);
        });

      setComment("");
    }
  };

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
      ref={ref}
      onClick={e => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {<i className="fa fa-ellipsis-v delete-comment-btn-post"></i>}
      {children}
  
    </a>
  ));

  return (
    <div dir={currentLanguage === "ar" ? "rtl" : "ltr"} className="col-12 m-4">
    {
      data && 
      <div className="post-container">
      <div className="col-12 d-flex align-items-center mb-4">
        <img className="post-charity-logo me-4 ms-4" src={"http://localhost:3000/" + data.logo} alt="" />
        <div className="d-flex flex-column">
          <label className="username background-color-none item-details-text" onClick={()=>{
            navigate("/charity/profile/" + data.charityId);
          }}>{data.username}</label>
          <label>{formatDateWithLanguage(data.publishedDate, currentLanguage)}</label>
        </div>
      </div>
      <div className="post-description">
        <p>
          {data.description}
        </p>
      </div>
      <div>
        <Gallery images={imagesPaths} />
      </div>
      <div>
      </div>
      <div className="post-actions">
        <div className="d-flex col-12 justify-content-between align-items-center mt-2">
        {
          liked ? 
          <div className="d-flex align-items-center">
            <i className="fa-solid fa-thumbs-up like-icon clickable" onClick={handleLike}></i> &nbsp; {t("Liked")}
          </div> :
          <div className="d-flex align-items-center">
            <i className="fa-regular fa-thumbs-up like-icon clickable" onClick={handleLike}></i> &nbsp; {t("Like")}
          </div>
        }
          <div className="d-flex align-items-center">
            <p>{data.likes ? formatNumberWithCommas(data.likes.length, currentLanguage) : formatNumberWithCommas(0, currentLanguage)} {t("Likes")}  . <span className="clickable" onClick={()=> {setShowAllComments(!showAllComments)}}>{showAllComments ? t("Hide") : t("Show")}&nbsp;{data.comments ? formatNumberWithCommas(data.comments.length, currentLanguage) : formatNumberWithCommas(0, currentLanguage)} {t("Comments")}</span></p>
          </div>
        
        </div>
        <form onSubmit={handleCommentSubmit} className="comment-form d-flex col-12 justify-content-between">
          <input
            type="text"
            placeholder={t("WriteACommentPlaceholder")}
            value={comment}
            onChange={handleCommentChange}
            className="charity-post-enter-comment col-9"
          />
          <button className="comment-send-btn col-2 d-flex justify-content-around align-items-center p-2" onClick={handleCommentSubmit}>
            <span className="d-flex align-items-center me-1 ms-1"><i className="fa-brands fa-telegram comment-send-icon"></i></span>
            <span className="comment-send-text me-1 ms-1">{t("Submit")}</span>
          </button>
        </form>
      </div>
      <div className="post-comments">
        <ul className="p-1">
          {showAllComments && data.comments.map((obj, index) => (
            <div key={index} className="comment-li-none m-0 mt-3 ">
              <div className="d-flex flex-row m-0 col-12">
                <img src={"http://localhost:3000" + obj.logo} alt="" className="comment-image-logo me-1 ms-1"/>
                <div className="d-flex justify-content-center flex-column align-items-start col-12 mb-1">
                  <div className="d-flex justify-content-start align-item-center col-12">
                      <p className="m-0 font-medium font-grey">{obj.username}</p>&nbsp;&nbsp;&nbsp;&nbsp;
                      <p className="m-0 font-medium font-grey">{formatDateWithLanguage(obj.commentDate, currentLanguage)}</p>
                      {
                        user && user.id === obj.userId &&
                        <>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          <Dropdown >
                              <Dropdown.Toggle as={CustomToggle}>
                              </Dropdown.Toggle>
                              <Dropdown.Menu size="sm" title=""> 
                                <Dropdown.Item onClick={() => {
                                  handleDeleteComment(obj._id);
                                }}>{t("Delete")}</Dropdown.Item>
                              </Dropdown.Menu>
                          </Dropdown>
                        </>
                      }
                  </div>
                  <p className="col-12 m-0 font-large font-black">{obj.commentText}</p>
                </div>
              </div>
            </div>
          ))}
        </ul>
      </div>
      </div>
    }
    </div>
  );
};

export default Post;
