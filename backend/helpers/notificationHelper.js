import model from "../models/Notification.js";
import { convertUtcToClientDate } from "./dateHelper.js";

const getAllNotifications = async ({userId}) => {

    const notifications = await model.find({userId: userId}).sort([['createdDate', -1]]);

    if(notifications && notifications.length > 0){
        notifications.forEach((notification) => {
            notification.createdDate = convertUtcToClientDate({utcDate: notification.createdDate});                    
        })
    }

    console.log("Notifications: ", notifications);
    return notifications;
}

const saveNotification = async ({notification}) => {

    console.log("Notification to be saved: ", notification);

    const notificationResult = await model.create({...notification})
        .catch((err) => {
            console.log("Error saving notification: ", err);
        });

    console.log("Notifications: ", notificationResult);
    return notificationResult;
}

export {getAllNotifications, saveNotification}