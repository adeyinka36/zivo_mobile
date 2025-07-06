import React, { useEffect, useContext } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { usePathname, useRouter } from "expo-router";
import { useAuth } from '../hooks/useAuth';
import useNotification  from "@/context/NotificationContext";
import { api } from "@/context/auth";


export const storePushToken = async (userId: string, pushToken: string): Promise<boolean> =>{
    try{
        await api.post(`/push-token/${userId}`,{
            push_token: pushToken
        })
        return true;
    }catch(error){
        console.error('error storing token---', error);
        return false;
    }
}

export const getPushToken = async (userId: string) => {
    try {
        const tokenRes = await Notifications.getExpoPushTokenAsync({
            projectId: "6e27c21c-41b3-40f9-9bfd-1e5dce873c02",
        });
        
        await storePushToken(userId, tokenRes.data);
        return tokenRes.data;
    } catch (error) {
        console.error('Error getting push token:', error);
        // Don't throw error - push notifications are optional
        return null;
    }
}

export default function NotificationManager() {
  const { user } = useAuth();
  const router = useRouter();
  const {setNotificationData} = useNotification();

  // Register for push notifications
  useEffect(() => {
    const register = async () => {
      if (!user?.id) return;

      if (Device.isDevice) {
        const existingStatus = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus.status !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = await Notifications.getPermissionsAsync();
        }

        if (finalStatus.status !== "granted") {
          alert("Failed to get push token for push notification!");
          return;
        }

        const tokenRes = await Notifications.getExpoPushTokenAsync();
        await storePushToken(user.id, tokenRes.data);
      } else {
        alert("Must use physical device for Push Notifications");
      }

      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }
    };

    register();
  }, [user]);

  // Set how notifications behave when received
  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  }, []);

  useEffect(() => {
    const receivedSubscription = Notifications.addNotificationReceivedListener(notification => {
      const data = notification.request.content.data;
         //do something
         console.log('🔔 notification received------',data);
    });
  
    return () => {
      receivedSubscription.remove();
    };
  }, [setNotificationData]);


  useEffect(() => { 

    const responseSub = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      if(data.type === 'quiz_invite') {
       //do something
       console.log('🔔 notification response received------',data);
      }
       
      const handleNotification = async () => {

        const data = response.notification.request.content.data;
      
      }

      handleNotification();
      
    });
  
    return () => responseSub.remove();
  }, [setNotificationData]);

  return null;
}
