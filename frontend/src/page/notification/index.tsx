import { formatDistanceToNow } from 'date-fns';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Cover from 'src/component/Cover';
import NotificationWidget from 'src/component/NotificationWidget';
import { Page } from 'src/constant/Page';
import { RootState } from 'src/redux/store';
import { loadNotification } from 'src/service/NotificationService';
import Message from './Message';

const Notification = () => {
  const navigate = useNavigate();
  const { notifications } = useSelector((root: RootState) => root.api);

  useEffect(() => {
    if (!notifications) loadNotification();
  }, []);

  return (
    <div className="relative">
      <NotificationWidget className="absolute right-0 top-0" />
      <div className="text-[20px] font-bold">Notifications</div>
      <div className="mt-5 flex flex-col gap-4">
        {(notifications ?? []).map((v) => (
          <div key={v.id} className="relative flex items-center rounded bg-white p-4">
            {!v.isRead && (
              <div className="absolute left-5 top-1/2 h-[5px] w-[5px] rounded-full bg-blue" />
            )}
            <Cover
              url={v.fromUser.avatarUrl}
              size={80}
              clickable
              onClick={() => navigate(`${Page.Explore}/user/${v.fromUserId}`)}
            />
            <div className="pl-5">
              <Message data={v} />
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
