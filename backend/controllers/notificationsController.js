import { getAllNotifications, saveNotification } from '../helpers/notificationHelper.js';
import { NotificationModel } from '../models/Notification.js';

const _getAllNotifications = async (req, res) => {

    const user = req.user;
    try {
        console.log("user: ", user);
        const notifications = await getAllNotifications({userId: user.id});
        res.status(200).json(notifications);
        console.log("finished getting notifications");
    } catch (err) {
        res.status(500).json(err.message);
    }
}
export { _getAllNotifications as getAllNotificationsController };

const _saveNotification = async (req, res) => {

    try {
        console.log("Notification body: ", req.body)
        const notification = new NotificationModel(req.body);
        const result = await saveNotification({notification});
        res.status(200).json(result);
        console.log("finished saving notifications");
    } catch (err) {
        res.status(500).json(err.message);
    }
}
export { _saveNotification as saveNotificationController };