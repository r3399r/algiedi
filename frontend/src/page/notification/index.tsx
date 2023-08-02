import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import NotificationWidget from 'src/component/NotificationWidget';
import { Notification as NotificationType } from 'src/model/backend/entity/NotificationEntity';
import { RootState } from 'src/redux/store';
import { getNotification, readNotification } from 'src/service/NotificationService';

const Notification = () => {
  const [notification, setNotification] = useState<NotificationType[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);
  const { lastNotification } = useSelector((root: RootState) => root.ws);

  useEffect(() => {
    getNotification().then((res) => setNotification(res));
  }, [refresh]);

  useEffect(() => {
    if (lastNotification) setNotification([lastNotification, ...notification]);
  }, [lastNotification]);

  const onClick = (id: string) => () => {
    readNotification(id).then(() => setRefresh(!refresh));
  };

  return (
    <div className="relative">
      <NotificationWidget className="absolute right-0 top-0" />
      <div className="text-[20px] font-bold">Notifications</div>
      <div className="mt-5 flex flex-col gap-4">
        {notification.map((v) => (
          <div
            key={v.id}
            className="relative cursor-pointer rounded bg-white p-4"
            onClick={onClick(v.id)}
          >
            {!v.isRead && (
              <div className="absolute left-5 top-1/2 h-[5px] w-[5px] rounded-full bg-red" />
            )}
            <div className="pl-5">{v.type}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;
