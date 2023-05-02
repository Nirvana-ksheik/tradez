import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from 'components/LoadingSpinner';
import "./comment.css";
import Pagination from "../../components/Pagination";
import 'font-awesome/css/font-awesome.min.css';

function CommentBox({getCookie, itemId}) {

  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [totalComments, setTotalComments] = useState([]);
  const itemsPerPage = 20;

  const [itemOffset, setItemOffset] = useState(0);
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);

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
    if(comment == '' || comment == null || comment == undefined){
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
            TimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
    });

    reqInstance.post(
      'http://localhost:3000/api/comments/add', 
      newComment,
      {
          withCredentials: true,
          baseURL: 'http://localhost:3000'
      }
    ).then(({data: res}) => { 
      console.log("comment result: ", res);
      let newCommentList = currentItems;
      newCommentList.push(res);
      const endOffset = itemOffset + itemsPerPage;
      setCurrentItems(newCommentList.slice(itemOffset, endOffset));
      setPageCount(Math.ceil(newCommentList.length / itemsPerPage));
      setComment("");
      setIsLoading(false);
    });
  }

  const submitReplyComment = (parentCommentId) =>{
    console.log("parentCommentId: ", parentCommentId);
    const replyCommentInput = document.getElementById(parentCommentId + '_reply_comment_input');
    console.log("replyCommentInput = ", replyCommentInput);
    let replyComment = '';

    if(replyCommentInput != undefined && replyCommentInput != null){
      replyComment = replyCommentInput.value;
      console.log('reply comment: ', replyComment);
    }

    if(replyComment == '' || replyComment == null || replyComment == undefined){
      setIsLoading(false);
      return;
    }

    const newComment = {
      commentText: replyComment,
      itemId: itemId,
      isReply: true,
      parentCommentId: parentCommentId
    };

    const token = getCookie();
    let reqInstance = axios.create({
        headers: {
            Authorization: `Bearer ${token}`,
            TimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
    });

    reqInstance.post(
      'http://localhost:3000/api/comments/add', 
      newComment,
      {
          withCredentials: true,
          baseURL: 'http://localhost:3000'
      }
    ).then(({data: res}) => { 
      setIsLoading(false);
      console.log("comment result: ", res);
      let newCommentsList = [];
      currentItems.forEach((cmnt, i) => {
        if(cmnt.commentId == parentCommentId){
          console.log("idddddddddddddddddd match.............");
          cmnt.replyComments.push(res);
        }
        newCommentsList.push(cmnt);
      });
      const endOffset = itemOffset + itemsPerPage;
      setCurrentItems(totalComments.slice(itemOffset, endOffset));
      setPageCount(Math.ceil(totalComments.length / itemsPerPage));
      const replyDiv = document.getElementById(parentCommentId + '_reply_comment');
      if(replyDiv != undefined)
        replyDiv.remove();
    }).catch(err => {
      console.log("error: ", err);
      setIsLoading(false);
    });
  }

  function handleReplyHTML(comment) {
    console.log("comment: ", comment);
    const commentDiv = document.getElementById(comment.commentId);
    const replyDiv = document.getElementById(comment.commentId + '_reply_comment');
    if(replyDiv != null && replyDiv != undefined){
      replyDiv.remove();
    }
    if(commentDiv != null && commentDiv != undefined){

      const newReplyDiv = document.createElement('div');
      newReplyDiv.className = 'd-flex col-8 comment-input-div align-items-end justify-content-start';
      newReplyDiv.id = comment.commentId + '_reply_comment';

      const inputReply = document.createElement('input');
      inputReply.type =  'text';
      inputReply.className = 'comment-input-text col-10';
      inputReply.placeholder = "Reply to comment";
      inputReply.id = comment.commentId + '_reply_comment_input';
      
      const icon = document.createElement('i');
      icon.className = 'fa-solid fa-paper-plane send-message-icon';
      icon.onclick = () => {
        console.log("submitting reply comment: ", comment.commentId);
        submitReplyComment(comment.commentId);
      }

      const trashIcon = document.createElement('i');
      trashIcon.className = 'fa-solid fa-trash delete-reply-comment-icon';
      trashIcon.onclick = () => {
        console.log("deleting reply comment");
        newReplyDiv.remove();
      }

      newReplyDiv.appendChild(inputReply);
      newReplyDiv.appendChild(icon);
      newReplyDiv.appendChild(trashIcon);

      commentDiv.appendChild(newReplyDiv);
    }
  }

  const showReplyComments = async(commentId) => {
    console.log("entered show reply comments");
    const replyCommentsTextHTML = document.getElementById("show_reply_comments_link_" + commentId);
    replyCommentsTextHTML.hidden = true;
    const hideCommentsTextHTML = document.getElementById("hide_reply_comments_link_" + commentId);
    hideCommentsTextHTML.hidden = false;
    const replyCommentsContainer = document.getElementById('reply_comments_container_' + commentId);
    replyCommentsContainer.hidden = false;
  };

  const hideReplyComments = (commentId) => {
    console.log("hide reply comments link");
    const hideCommentsTextHTML = document.getElementById("hide_reply_comments_link_" + commentId);
    hideCommentsTextHTML.hidden = true;
    const replyCommentsTextHTML = document.getElementById("show_reply_comments_link_" + commentId);
    replyCommentsTextHTML.hidden = false;
    const replyCommentsContainer = document.getElementById('reply_comments_container_' + commentId);
    replyCommentsContainer.hidden = true;  
  };

  useEffect(()=>{
    setIsLoading(true);
    const controller = new AbortController();
    var timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log("TimeZONEEEEEEEEEEEEEEEEEEEEEEEEEE:", timeZone);
    let reqInstance = axios.create({
      headers: {
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    });

    reqInstance.get(
      'http://localhost:3000/api/comments/' + itemId,
      {
        signal: controller.signal
      },
      {
          withCredentials: true,
          baseURL: 'http://localhost:3000'
      }
    ).then(({data: res}) => {
      setTotalComments(res);
      console.log("comments result list: ", res);
      const endOffset = itemOffset + itemsPerPage;
      setCurrentItems(res.slice(itemOffset, endOffset));
      setPageCount(Math.ceil(res.length / itemsPerPage));
      setIsLoading(false);
    });

    return ()=>{
      controller.abort();
    };
  }, [itemId, itemOffset, itemsPerPage, setTotalComments]);

  return (
    <>
    { 
    isLoading == false ?
    <div className="mt-5">
        <div className = "d-flex col-12 align-items-end justify-content-start">
            <i className="fa fa-user user-comment-icon-main-comment"></i>
            <div className='d-flex col-8 comment-input-div justify-content-start'>
              <input type="text" value={comment} className='comment-input-text col-10' placeholder='Leave a comment' onChange={handleChange} />
              <i className="fa-solid fa-paper-plane send-message-icon" onClick={handleSubmit}/>
            </div>
        </div>
        <hr/> 
        <ul className="d-flex col-12 flex-column">
        {
          currentItems.length > 0 &&

          currentItems.map((comment, index) =>         
            
              <li key={index} className="m-2 col-12 d-flex flex-column" id={comment.commentId}>
                <div className='col-12 d-flex align-items-center' key={index}>
                  <i className="fa fa-user user-comment-icon me-2"></i>
                  <span className="comment-username me-2">{comment.user.username}</span>
                  <span className="comment-commentdate">{comment.commentDate}</span>
                </div>
                <p className='col-12 m-2 comment-text'>{comment.commentText}</p>
                <div className='col-12 d-flex flex-column justify-content-start align-items-start'>
                  <div className='col-12 d-flex justify-content-start align-items-start'>
                    <i className="fa-solid fa-reply me-4 reply-icon" onClick={() => handleReplyHTML(comment)}></i>
                    {
                      comment.replyComments.length > 0 && 
                      <i className='link mb-4 comment-text' onClick={async() => await showReplyComments(comment.commentId)} id={"show_reply_comments_link_" + comment.commentId}>show {comment.replyComments.length} replies</i>
                    }
                    <i className='link mb-3 comment-text' hidden onClick={() => hideReplyComments(comment.commentId)} id={"hide_reply_comments_link_" + comment.commentId}>hide replies</i>
                  </div>
                  <ul hidden id={'reply_comments_container_' + comment.commentId}>
                    {
                      Array.isArray(comment.replyComments) && comment.replyComments != [] && comment.replyComments != null && comment.replyComments != undefined &&
                      
                        Array.from(comment.replyComments).map((replyComment, i) => 
                            <li key={i} className="m-2 col-12 d-flex flex-column">
                                <div className='col-12 align-items-center d-flex'>
                                  <i className="fa fa-user comment-user-icon me-2"></i>
                                  <span className="comment-username me-2">{replyComment.user.username}</span>
                                  <span className="comment-commentdate">{replyComment.commentDate}</span>
                                </div>
                                <p className='col-12 m-2 comment-text'>{replyComment.commentText}</p>
                            </li>
                        )
                    }
                  </ul>
                </div>
              </li>
            )          
        }
      </ul>
    </div>
    : <LoadingSpinner />
    }
    <Pagination handlePageClick={handlePageClick} pageCount={pageCount} maxItems={5}/>
    </>
  );
}

export default CommentBox;