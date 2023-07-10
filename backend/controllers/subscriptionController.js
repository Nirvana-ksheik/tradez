import webpush from 'web-push';
import model from '../models/Subscription.js';

const vapidKeys = {
  publicKey: process.env.PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY,
};

webpush.setVapidDetails(
  'mailto:tradez.noreply@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const _sendNotification = async (req, res) => {

  const { userId, message, title, body } = req.body;
  console.log(userId, message)
  // Get the user's subscription from the store
  const data = await model.findOne({userId: userId});
  console.log("Subscription found: ", data);
  if(data)
  {
    const subscription = data.subscription;
    
    if (subscription) {
      const payload = JSON.stringify({
        title: title,
        body: body,
      });
  
      webpush.sendNotification(subscription, payload)
        .then(() => {
          res.sendStatus(200);
        })
        .catch((error) => {
          console.error('Error sending push notification:', error);
          res.sendStatus(500);
        });
    } else {
      res.sendStatus(404);
    }
  } else {
    res.sendStatus(404);
  }
};

export { _sendNotification as sendNotification };


const _saveSubscription = async (req, res) => {

  const { userId, subscription } = req.body;

  const previousSubscription = await model.findOne({userId: userId});

  if(previousSubscription){
    await model.findByIdAndUpdate({_id: previousSubscription.id}, {userId: userId, subscription: subscription})
                .catch((err)=>{
                  console.log("Error updating subscription: ", err);
                });
  }
  else{
    await model.create({userId: userId, subscription: subscription})
                .catch((err)=>{
                  console.log("Error creating subscription: ", err);
                });
  }

  return res.sendStatus(200);
}
export { _saveSubscription as saveSubscription };
