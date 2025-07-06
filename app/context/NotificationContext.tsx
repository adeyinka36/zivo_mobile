import React, { createContext, useState, useContext } from 'react';

type NotificationData = Record<string, any> | null;

const NotificationContext = createContext<{
  notificationData: NotificationData;
  setNotificationData: React.Dispatch<React.SetStateAction<NotificationData>>;
}>({
  notificationData: null,
  setNotificationData: () => {},
});

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notificationData, setNotificationData] = useState<NotificationData>(null);

  return (
    <NotificationContext.Provider value={{ notificationData, setNotificationData }}>
      {children}
    </NotificationContext.Provider>
  );
};

const useNotification = () => useContext(NotificationContext);
export default useNotification;