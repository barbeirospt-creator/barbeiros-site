import { supabase } from '@/lib/supabase';

const VAPID_PUBLIC_KEY = 'YOUR_VAPID_PUBLIC_KEY_HERE'; // In production this comes from env vars

export const pushNotificationService = {
  // Register the service worker if not already registered
  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        console.log('Service Worker registered with scope:', registration.scope);
        return registration;
      } catch (error) {
        console.error('Service Worker registration failed:', error);
        return null;
      }
    }
    return null;
  },

  // Subscribe user to push notifications
  async subscribeToPush(userId) {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.log('Push messaging is not supported');
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Check for existing subscription
      let subscription = await registration.pushManager.getSubscription();

      // If no subscription, create one
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
        });
      }

      // Save subscription to Supabase
      if (userId && subscription) {
        const { error } = await supabase
          .from('push_subscriptions')
          .upsert({ 
            user_id: userId, 
            subscription: subscription,
            created_at: new Date().toISOString()
          }, { onConflict: 'user_id' }); // Assuming one sub per user for simplicity, or manage multiple devices
          
        if (error) throw error;
      }

      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return null;
    }
  },

  // Helper to convert VAPID key
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  },

  // Handle local notifications manually if needed
  async sendLocalNotification(title, options = {}) {
    if (!('serviceWorker' in navigator)) return;
    
    const registration = await navigator.serviceWorker.ready;
    registration.showNotification(title, {
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-maskable.png',
      vibrate: [100, 50, 100],
      ...options
    });
  }
};