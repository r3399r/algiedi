import { formatDistanceToNow } from 'date-fns';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Cover from 'src/component/Cover';
import NotificationMessage from 'src/component/NotificationMessage';
import NotificationWidget from 'src/component/NotificationWidget';
import { Page } from 'src/constant/Page';
import { RootState } from 'src/redux/store';
import { loadNotification } from 'src/service/NotificationService';

const Notification = () => {
  const navigate = useNavigate();
  const { notifications } = useSelector((root: RootState) => root.api);

  useEffect(() => {
    loadNotification();
  }, []);

  return (
    <div className="relative">
      <div className="flex items-end justify-between">
        <div className="text-[20px] font-bold">Notifications</div>
        <NotificationWidget />
      </div>
      <div className="mt-5 flex flex-col gap-4">
        {(notifications ?? []).map((v) => (
          <div key={v.id} className="relative flex items-center rounded bg-white p-4">
            {!v.isRead && (
              <div className="absolute right-5 top-5 h-[5px] w-[5px] rounded-full bg-blue" />
            )}
            <Cover
              url={v.fromUser.avatarUrl}
              size={80}
              clickable
              onClick={() => navigate(`${Page.Explore}/user/${v.fromUserId}`)}
              type="user"
            />
            <div className="pl-5">
              <NotificationMessage data={v} />
            </div>
            <div className="absolute bottom-5 right-5 text-right text-sm text-grey">
              {v.createdAt ? formatDistanceToNow(new Date(v.createdAt)) : ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;
