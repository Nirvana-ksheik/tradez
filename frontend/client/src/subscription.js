// subscription.js

export const subscribeUser = async () => {
    try {
      // Check if the browser supports service workers
      if (!('serviceWorker' in navigator)) {
        throw new Error('Service workers are not supported by this browser.');
      }
  
      // Register the service worker
      const registration = await navigator.serviceWorker.register('http://localhost:3001/service-worker.js');
  
      // Check if the Push API is available
      if (!('PushManager' in window)) {
        throw new Error('Push notifications are not supported by this browser.');
      }
  
      // Subscribe the user to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array('BHT2gq-n9X1KRor_tHY-iRqH_TFgz0m2xbkWqKtwkV04XVZ-T4h0yF9pD3Z4LYjq2PqAdJOoXsndBfxq2cZiN3M'),
      });
  
      return subscription;
    } catch (error) {
      console.error('Error subscribing user:', error);
      throw error;
    }
  };
  
  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };
  