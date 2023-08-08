const Notifications = {
    USER_LIKE_POST: {
        title: 'User Liked your Post',
        message: '##Model.username liked your post',
        title_ar: 'المستخدم اعجب بمنشورك',
        message_ar: '##Model.username اعجب بمنشورك',
    },
    USER_COMMENTED_ITEM: {
        title: 'User Commented on Your Item',
        message: '##Model.username added a comment on your item',
        title_ar: 'قام مستخدم بإضافة تعليق',
        message_ar: '##Model.username أضاف تعليق على احد عناضرك'
    },
    USER_COMMENTED_POST: {
        title: 'User Commented on Your Post',
        message: '##Model.username added a comment on your post',
        title_ar: 'قام مستخدم بإضافة تعليق',
        message_ar: '##model.username أضاف تعليق على منشورك'
    },
    USER_REPLY_COMMENT: {
        title: 'User Replied to Your Comment',
        message: '##Model.username has replied to your comment',
        title_ar: 'قام مستخدم بالرد على تعليقك',
        message_ar: '##Model.username رد على تعليقك',
    },
    ACCEPT_OFFER: {
        title: 'User Accepted Your Offer',
        message: '##Model.username has accepted your offer on ##Model.itemname',
        title_ar: 'قام مستخدم بالموافقة على عرضك',
        message_ar: '##Model.username وافق على عرضك ل ##Model.itemname',
    },
    MAKE_OFFER: {
        title: 'User Made You an Offer',
        message: '##Model.username made an offer on your ##Model.itemname',
        title_ar: 'قام مستخدم بتقديم عرض اليك',
        message_ar: '##Model.username قدم عرض ل ##Model.itemname',
    },
    ADMIN_APPROVE_ITEM: {
        title: 'Item Approved ',
        message: 'Your item has been approved and added successfully',
        title_ar: 'تمت الموافقة على غرضك',
        message_ar: 'لقد تمت الموافقة على غرضك ',
    },
    ADMIN_REJECT_ITEM: {
        title: 'Item Rejected ',
        message: 'Your item has been rejected, review for more details',
        title_ar: 'تم رفض غرضك',
        message_ar: 'لقد تم رفض غرضك. يرجى المراجعة للمزيد من التفاصيل',
    },
    ADMIN_APPROVE_CHARITY: {
        title: 'Application Approved',
        message: 'Congrats!, your application has been processed and approved',
        title_ar: 'تمت الموافقة على الطلب',
        message_ar: 'تهانينا! تم معالجة طلبك وتمت الموافقة عليه',
    },
    ADMIN_REJECT_CHARITY: {
        title: 'Application Rejected',
        message: 'Sorry, your application has been rejected, review for more details',
        title_ar: 'تم رفض الطلب',
        message_ar: 'عذرًا، تم رفض طلبك. يرجى المراجعة للمزيد من التفاصيل.'
    },
    CHARITY_SIGNUP: {
        title: 'Charity Registered an Application',
        message: "##Model.username 's application is pending your review",
        title_ar: 'تم تسجيل طلب منظمة خيرية.',
        message_ar: "طلب ##Model.username قيد الاإنتظار لمراجعتك"
    },
    ITEM_UPLOADED: {
        title: 'New Item Uploaded',
        message: "##Model.username 's uploaded a new item for you review",
        title_ar: 'تم رفع عنصر جديد.',
        message_ar: "قام المستخدم ##Model.username برفع عنصر جديد لمراجعتك."
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