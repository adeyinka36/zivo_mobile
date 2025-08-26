import React, { useEffect, useContext } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { usePathname, useRouter } from "expo-router";
import { useAuth } from '@/hooks/useAuth';
import useNotification  from "@/context/NotificationContext";
import { api } from "@/context/auth";
import { useQuiz } from "@/context/QuizContext";
import { MediaWithQuestionType } from "@/types/MediaWithQuestion";


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
        const tokenRes = await Notifications.getExpoPushTokenAsync();
        
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
  const { setQuizData, quizData } = useQuiz();

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
      } else {
        alert("Must use physical device for Push Notifications");
      }

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
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
      if(data.type === 'quiz_invitation') {
        setQuizData(data.media as MediaWithQuestionType);
        router.replace('/(app)/quiz-invite');
       }
    });
  
    return () => {
      receivedSubscription.remove();
    };
  }, [setNotificationData]);


  useEffect(() => { 

    const responseSub = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      if(data.type === 'quiz_invitation') {
       setQuizData(data.media as MediaWithQuestionType);
       router.replace('/(app)/quiz-invite');
      }
       
      const handleNotification = async () => {

        const data = response.notification.request.content.data;
      
      }

      handleNotification();
      
    });
  
    return () => responseSub.remove();
  }, [setNotificationData, setQuizData]);

  return null;
}
