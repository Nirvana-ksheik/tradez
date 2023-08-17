import model from "../models/Notification.js";
import { convertUtcToClientDate } from "./dateHelper.js";

const getAllNotifications = async ({userId}) => {

    const notifications = await model.find({userId: userId}).sort([['createdDate', -1]]);

    if(notifications && notifications.length > 0){
        notifications.forEach((notification) => {
            notification.createdDate = convertUtcToClientDate({utcDate: notification.createdDate});                    
        })
    }

    return notifications;
}

const saveNotification = async ({notification}) => {

    const notificationResult = await model.create({...notification})
        .catch((err) => {
            console.log("Error saving notification: ", err);
        });

    return notificationResult;
}

export {getAllNotifications, saveNotification}