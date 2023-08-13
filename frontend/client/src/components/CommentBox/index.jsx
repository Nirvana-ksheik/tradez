import React, { useState, useEffect } from "react";
import axios from "axios";
import { Notifications, parseModelString } from "notifications";
import { notificationSender } from "helpers/notificationHelper";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "components/LoadingSpinner";
import Pagination from "../../components/Pagination";
import "font-awesome/css/font-awesome.min.css";
import "./comment.css";
import { formatNumberWithCommas } from "../../helpers/numberFormatHelper";
import { formatDateWithLanguage } from "../../helpers/dateFormatHelper";
import { Dropdown } from "react-bootstrap";

function CommentBox({ getCookie, itemId, ownerId, user, currentLanguage }) {
    const [comment, setComment] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [totalComments, setTotalComments] = useState([]);
    const itemsPerPage = 25;

    const [itemOffset, setItemOffset] = useState(0);
    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);

    const { t } = useTranslation();

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % totalComments.length;
        setItemOffset(newOffset);
    };

    const handleChange = ({ currentTarget: input }) => {
        console.log("comment: ", input.value);
        setComment(input.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (comment === "" || comment == null || comment === undefined) {
            setIsLoading(false);
            return;
        }

        const newComment = {
            commentText: comment,
            itemId: itemId,
        };

        const token = getCookie();
        let reqInstance = axios.create({
            headers: {
                Authorization: `Bearer ${token}`,
                TimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
        });

        reqInstance
            .post("http://localhost:3000/api/comments/add", newComment, {
                withCredentials: true,
                baseURL: "http://localhost:3000",
            })
            .then(async ({ data: res }) => {
                console.log("comment result: ", res);
                let newCommentList = currentItems;
                newCommentList.push(res);
                const endOffset = itemOffset + itemsPerPage;
                setCurrentItems(newCommentList.slice(itemOffset, endOffset));
                setPageCount(Math.ceil(newCommentList.length / itemsPerPage));
                setComment("");
                setIsLoading(false);
                const modelData = {
                    username: user.username,
                };
                const notificationObject = Notifications.USER_COMMENTED_ITEM;
                const notificationMessage = parseModelString(notificationObject.message, modelData);
                const notificationMessageAr = parseModelString(notificationObject.message_ar, modelData);

                await notificationSender({
                    userId: ownerId,
                    message: notificationMessage,
                    title: notificationObject.title,
                    message_ar: notificationMessageAr,
                    title_ar: notificationObject.title_ar,
                    currentLanguage: currentLanguage,
                });
            });
    };

    const submitReplyComment = (parentCommentId) => {
        console.log("parentCommentId: ", parentCommentId);
        const replyCommentInput = document.getElementById(parentCommentId + "_reply_comment_input");
        console.log("replyCommentInput = ", replyCommentInput);
        let replyComment = "";

        if (replyCommentInput !== undefined && replyCommentInput != null) {
            replyComment = replyCommentInput.value;
            console.log("reply comment: ", replyComment);
        }

        if (replyComment === "" || replyComment == null || replyComment === undefined) {
            setIsLoading(false);
            return;
        }

        const newComment = {
            commentText: replyComment,
            itemId: itemId,
            isReply: true,
            parentCommentId: parentCommentId,
        };

        const token = getCookie();
        let reqInstance = axios.create({
            headers: {
                Authorization: `Bearer ${token}`,
                TimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
        });

        reqInstance
            .post("http://localhost:3000/api/comments/add", newComment, {
                withCredentials: true,
                baseURL: "http://localhost:3000",
            })
            .then(async ({ data: res }) => {
                setIsLoading(false);
                console.log("comment result: ", res);
                let newCommentsList = [];

                currentItems.forEach((cmnt, i) => {
                    if (cmnt.commentId == parentCommentId) {
                        console.log("idddddddddddddddddd match.............");
                        cmnt.replyComments.push(res);
                    }
                    newCommentsList.push(cmnt);
                });

                const endOffset = itemOffset + itemsPerPage;
                setCurrentItems(totalComments.slice(itemOffset, endOffset));
                setPageCount(Math.ceil(totalComments.length / itemsPerPage));
                const replyDiv = document.getElementById(parentCommentId + "_reply_comment");

                if (replyDiv !== undefined) {
                    replyDiv.remove();
                }

                const modelData = {
                    username: user.username,
                };
                const notificationObject = Notifications.USER_REPLY_COMMENT;
                const notificationMessage = parseModelString(notificationObject.message, modelData);
                const notificationMessageAr = parseModelString(notificationObject.message_ar, modelData);

                await notificationSender({
                    userId: ownerId,
                    message: notificationMessage,
                    title: notificationObject.title,
                    message_ar: notificationMessageAr,
                    title_ar: notificationObject.title_ar,
                    currentLanguage: currentLanguage,
                });
            })
            .catch((err) => {
                console.log("error: ", err);
                setIsLoading(false);
            });
    };

    function handleReplyHTML(comment) {
      // <div className="comment-form d-flex col-lg-8 col-md-10 col-12 me-4 ms-4 justify-content-between">
      //   <input
      //       type="text"
      //       placeholder={t("WriteACommentPlaceholder")}
      //       value={comment}
      //       onChange={handleChange}
      //       className="charity-post-enter-comment col-9"
      //   />
      //   <button className="comment-send-btn col-2 d-flex justify-content-around align-items-center p-2" onClick={handleSubmit}>
      //       <span className="d-flex align-items-center me-1 ms-1">
      //           <i className="fa-brands fa-telegram comment-send-icon"></i>
      //       </span>
      //       <span className="comment-send-text me-1 ms-1">{t("Submit")}</span>
      //   </button>
      // </div>
        console.log("comment: ", comment);
        const commentDiv = document.getElementById(comment.commentId);
        const replyDiv = document.getElementById(comment.commentId + "_reply_comment");
        if (replyDiv != null && replyDiv !== undefined) {
            replyDiv.remove();
        }
        if (commentDiv != null && commentDiv !== undefined) {
            const newReplyDiv = document.createElement("div");
            newReplyDiv.className = "comment-form d-flex col-lg-8 col-md-10 col-12 me-4 ms-4 justify-content-between align-items-center";
            newReplyDiv.id = comment.commentId + "_reply_comment";

            const inputReply = document.createElement("input");
            inputReply.type = "text";
            inputReply.className = "charity-post-enter-comment col-9";
            inputReply.placeholder = t("WriteACommentPlaceholder");
            inputReply.id = comment.commentId + "_reply_comment_input";

            const icon = document.createElement("button");
            icon.className = "comment-send-btn col-2 d-flex justify-content-around align-items-center p-2";
            icon.onclick = () => {
                console.log("submitting reply comment: ", comment.commentId);
                submitReplyComment(comment.commentId);
            };

            const iconSpan = document.createElement("span");
            iconSpan.className = "d-flex align-items-center me-1 ms-1";

            const iconSpanIcon = document.createElement("i");
            iconSpanIcon.className = "fa-brands fa-telegram comment-send-icon"

            const submitTextSpan = document.createElement("span");
            submitTextSpan.className = "comment-send-text me-1 ms-1";
            submitTextSpan.innerHTML = t("Submit");

            iconSpan.appendChild(iconSpanIcon);
            iconSpan.appendChild(submitTextSpan);

            icon.appendChild(iconSpan);

            const trashIcon = document.createElement("i");
            trashIcon.className = "fa-solid fa-trash delete-reply-comment-icon";
            trashIcon.onclick = () => {
                console.log("deleting reply comment");
                newReplyDiv.remove();
            };

            newReplyDiv.appendChild(inputReply);
            newReplyDiv.appendChild(icon);
            newReplyDiv.appendChild(trashIcon);

            commentDiv.appendChild(newReplyDiv);
        }
    }

    const showReplyComments = (commentId) => {
        console.log("entered show reply comments");
        const replyCommentsTextHTML = document.getElementById("show_reply_comments_link_" + commentId);
        replyCommentsTextHTML.hidden = true;
        const hideCommentsTextHTML = document.getElementById("hide_reply_comments_link_" + commentId);
        hideCommentsTextHTML.hidden = false;
        const replyCommentsContainer = document.getElementById("reply_comments_container_" + commentId);
        replyCommentsContainer.hidden = false;
    };

    const hideReplyComments = (commentId) => {
        console.log("hide reply comments link");
        const hideCommentsTextHTML = document.getElementById("hide_reply_comments_link_" + commentId);
        hideCommentsTextHTML.hidden = true;
        const replyCommentsTextHTML = document.getElementById("show_reply_comments_link_" + commentId);
        replyCommentsTextHTML.hidden = false;
        const replyCommentsContainer = document.getElementById("reply_comments_container_" + commentId);
        replyCommentsContainer.hidden = true;
    };

    useEffect(() => {
        setIsLoading(true);
        const controller = new AbortController();
        var timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        console.log("TimeZONEEEEEEEEEEEEEEEEEEEEEEEEEE:", timeZone);
        let reqInstance = axios.create({
            headers: {
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
        });

        reqInstance
            .get(
                "http://localhost:3000/api/comments/" + itemId,
                {
                    signal: controller.signal,
                },
                {
                    withCredentials: true,
                    baseURL: "http://localhost:3000",
                }
            )
            .then(({ data: res }) => {
                setTotalComments(res);
                console.log("comments result list: ", res);
                const endOffset = itemOffset + itemsPerPage;
                setCurrentItems(res.slice(itemOffset, endOffset));
                setPageCount(Math.ceil(res.length / itemsPerPage));
                setIsLoading(false);
            });

        return () => {
            controller.abort();
        };
    }, [itemId, itemOffset, itemsPerPage, setTotalComments]);

    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <a
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
        >
            {<i className="fa fa-ellipsis-v delete-comment-btn-post"></i>}
            {children}
        </a>
    ));

    return (
        <>
            {isLoading === false ? (
                <div dir={currentLanguage === "ar" ? "rtl" : "ltr"} className="mt-5">
                    <div className="comment-form d-flex col-lg-8 col-md-10 col-12 me-4 ms-4 justify-content-between">
                        <input
                            type="text"
                            placeholder={t("WriteACommentPlaceholder")}
                            value={comment}
                            onChange={handleChange}
                            className="charity-post-enter-comment col-9"
                        />
                        <button className="comment-send-btn col-2 d-flex justify-content-around align-items-center p-2" onClick={handleSubmit}>
                            <span className="d-flex align-items-center me-1 ms-1">
                                <i className="fa-brands fa-telegram comment-send-icon"></i>
                            </span>
                            <span className="comment-send-text me-1 ms-1">{t("Submit")}</span>
                        </button>
                    </div>
                    <ul className="d-flex col-12 m-5 flex-column" dir={currentLanguage === "ar" ? "rtl" : "ltr"}>
                        {currentItems.length > 0 &&
                            currentItems.map((comment, index) => (
                                <li key={index} className="me-3 ms-3 col-12 d-flex flex-column" id={comment.commentId}>
                                    <div key={index} className="comment-li-none m-0 mt-3 ">
                                        <div className="d-flex flex-row m-0 col-12">
                                            <img src={"http://localhost:3000" + comment.user.logo} alt="" className="comment-image-logo me-2 ms-2" />
                                            <div className="d-flex justify-content-center flex-column align-items-start col-12 mb-1">
                                                <div className="d-flex justify-content-start align-item-center col-12">
                                                    <p className="m-0 font-large font-grey">{comment.user.username}</p>
                                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                                    <p className="m-0 font-large font-grey">
                                                        {formatDateWithLanguage(comment.commentDate, currentLanguage)}
                                                    </p>
                                                    {user && user.id === comment.userId && (
                                                        <>
                                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                            <Dropdown>
                                                                <Dropdown.Toggle as={CustomToggle}></Dropdown.Toggle>
                                                                <Dropdown.Menu size="sm" title="">
                                                                    <Dropdown.Item
                                                                        onClick={() => {
                                                                            // handleDeleteComment(obj._id);
                                                                        }}
                                                                    >
                                                                        {t("Delete")}
                                                                    </Dropdown.Item>
                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                        </>
                                                    )}
                                                </div>
                                                <p className="col-12 m-0 font-large font-black">{comment.commentText}</p>
                                            </div>
                                        </div>
                                        <div className="col-12 d-flex justify-content-start align-items-start">
                                            <i className="fa-solid fa-reply me-4 ms-4 reply-icon" onClick={() => handleReplyHTML(comment)}></i>
                                            {comment.replyComments.length > 0 && (
                                                <i
                                                    className="link mb-4 comment-text"
                                                    onClick={() => showReplyComments(comment.commentId)}
                                                    id={"show_reply_comments_link_" + comment.commentId}
                                                >
                                                    {t("Show")} {formatNumberWithCommas(comment.replyComments.length, currentLanguage)} {t("Replies")}
                                                </i>
                                            )}
                                            <i
                                                className="link mb-3 comment-text"
                                                hidden
                                                onClick={() => hideReplyComments(comment.commentId)}
                                                id={"hide_reply_comments_link_" + comment.commentId}
                                            >
                                                {t("HideReplies")}
                                            </i>
                                        </div>
                                        <ul hidden id={"reply_comments_container_" + comment.commentId}>
                                            {Array.isArray(comment.replyComments) &&
                                                comment.replyComments !== [] &&
                                                comment.replyComments != null &&
                                                comment.replyComments != undefined &&
                                                Array.from(comment.replyComments).map((replyComment, i) => (
                                                    <li key={i} className="m-2 col-12 d-flex flex-column">
                                                        <div className="d-flex flex-row m-0 col-12">
                                                            <img
                                                                src={"http://localhost:3000" + replyComment.user.logo}
                                                                alt=""
                                                                className="comment-image-logo me-2 ms-2"
                                                            />
                                                            <div className="d-flex justify-content-center flex-column align-items-start col-12 mb-1">
                                                                <div className="d-flex justify-content-start align-item-center col-12">
                                                                    <p className="m-0 font-large font-grey">{replyComment.user.username}</p>
                                                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                                                    <p className="m-0 font-large font-grey">
                                                                        {formatDateWithLanguage(replyComment.commentDate, currentLanguage)}
                                                                    </p>
                                                                    {user && user.id === replyComment.userId && (
                                                                        <>
                                                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                                            <Dropdown>
                                                                                <Dropdown.Toggle as={CustomToggle}></Dropdown.Toggle>
                                                                                <Dropdown.Menu size="sm" title="">
                                                                                    <Dropdown.Item
                                                                                        onClick={() => {
                                                                                            // handleDeleteComment(obj._id);
                                                                                        }}
                                                                                    >
                                                                                        {t("Delete")}
                                                                                    </Dropdown.Item>
                                                                                </Dropdown.Menu>
                                                                            </Dropdown>
                                                                        </>
                                                                    )}
                                                                </div>
                                                                <p className="col-12 m-0 font-large font-black">{replyComment.commentText}</p>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>
                                </li>
                            ))}
                    </ul>
                </div>
            ) : (
                <LoadingSpinner />
            )}
            <Pagination handlePageClick={handlePageClick} pageCount={pageCount} maxItems={5} currentLanguage={currentLanguage} />
        </>
    );
}

export default CommentBox;
