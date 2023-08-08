import axios from "axios";

const notificationSender = async({userId, message, title, message_ar, title_ar, currentLanguage}) => {

    await axios.post('http://localhost:3000/api/send-notification', {
        userId: userId,
        body: currentLanguage === "ar" ? message_ar : message,
        title: currentLanguage === "ar" ? title_ar : title
    },
    {
        baseURL: 'http://localhost:3000',
        withCredentials: true
    })
    .then(({data: res}) => {
        if (res === 'OK') {
          console.log('Notification sent successfully');
        } 
        else {
          throw new Error('Error sending notification')
        }
    })
    .catch((error) => {
        console.error('Error sending notification:', error);
    });

    await axios.post('http://localhost:3000/api/notifications', {
        userId: userId,
        message: message,
        title: title,
        message_ar: message_ar,
        title_ar: title_ar
    },
    {
        baseURL: 'http://localhost:3000',
        withCredentials: true
    })
    .then(({data: res}) => {
        console.log('Notification saved successfully: ', res);
    })
    .catch((error) => {
        console.error('Error saving notification:', error);
    });
};

const adminNotificationSender = async({message, title, message_ar, title_ar, currentLanguage}) => {

    const admins = await axios.get('http://localhost:3000/api/auth/admins');

    for(const admin of admins){
        await notificationSender({userId: admin, message: message, title: title, message_ar: message_ar, title_ar: title_ar, currentLanguage: currentLanguage});
    }
};

export {notificationSender, adminNotificationSender}