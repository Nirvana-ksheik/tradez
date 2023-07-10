const Notifications = {
    USER_LIKE_POST: {
        title: 'User Liked your Post',
        message: '##Model.username liked your post',
    },
    USER_COMMENTED_ITEM: {
        title: 'User Commented on Your Item',
        message: '##Model.username added a comment on your item'
    },
    USER_COMMENTED_POST: {
        title: 'User Commented on Your Post',
        message: '##Model.username added a comment on your post'
    },
    USER_REPLY_COMMENT: {
        title: 'User Replied to Your Comment',
        message: '##Model.username has replied to your comment',
    },
    ACCEPT_OFFER: {
        title: 'User Accepted Your Offer',
        message: '##Model.username has accepted your offer on ##Model.itemname',
    },
    MAKE_OFFER: {
        title: 'User Made You an Offer',
        message: '##Model.username made an offer on your ##Model.itemname',
    },
    ADMIN_APPROVE_ITEM: {
        title: 'Item Approved ',
        message: 'Your item has been approved and added successfully',
    },
    ADMIN_REJECT_ITEM: {
        title: 'Item Rejected ',
        message: 'Your item has been rejected, review for more details',
    },
    ADMIN_APPROVE_CHARITY: {
        title: 'Application Approved',
        message: 'Congrats !, your application has been processed and approved',
    },
    ADMIN_REJECT_CHARITY: {
        title: 'Application Rejected',
        message: 'Sorry, your application has been rejected, review for more details'
    },
    CHARITY_SIGNUP: {
        title: 'Charity Registered an Application',
        message: "##Model.username 's application is pending your review"
    },
    ITEM_UPLOADED: {
        title: 'New Item Uploaded',
        message: "##Model.username 's uploaded a new item for you review"
    }
}


const parseModelString = (notificationText, modelData = undefined) => {
    console.log("Input string: ", notificationText);
    console.log("Model data: ", modelData);

    if(modelData){
        return notificationText.replace(/##Model\.(\w+)/g, function(match, variableName) {
            return modelData[variableName] || match;
          });
    }
    
    return notificationText;
}

export {Notifications, parseModelString}