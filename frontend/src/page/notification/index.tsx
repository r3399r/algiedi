import { formatDistanceToNow } from 'date-fns';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import NotificationWidget from 'src/component/NotificationWidget';
import { Page } from 'src/constant/Page';
import { Notification as Type } from 'src/model/backend/entity/NotificationEntity';
import { RootState } from 'src/redux/store';
import { loadNotification, readNotification } from 'src/service/NotificationService';

const mapping = {
  'project-start': 'The project has been started',
  'project-reject': 'The project has been rejected',
  'project-publish': 'The project has been published',
  'project-updated': 'The project has been updated',
  'creation-updated': 'A participant has updated his/her creation',
  'new-creation-uploaded': 'Project owner has uploaded a creation',
  'new-participant': 'A new participant has joined the project',
  'inspired-approved': 'Your inspiration has been approved',
  'inspired-unapproved': 'Your inspiration has been unapproved',
  'partner-ready': 'A partner has set the project as ready',
  'partner-not-ready': 'A partner thought that the project needs more work',
  follow: 'You have been followed',
  like: 'Your creation has been liked',
  comment: 'Your creation has been commented',
};

const Notification = () => {
  const { notifications } = useSelector((root: RootState) => root.api);
  const navigate = useNavigate();

  useEffect(() => {
    if (!notifications) loadNotification();
  }, []);

  const onClick = (data: Type) => () => {
    if (!data.isRead) readNotification(data.id);
    if (data.type === 'project-publish') navigate(`${Page.Explore}/${data.targetId}`);
    else if (
      [
        'project-start',
        'project-updated',
        'creation-updated',
        'new-creation-uploaded',
        'new-participant',
        'inspired-approved',
        'inspired-unapproved',
        'partner-ready',
        'partner-not-ready',
      ].includes(data.type)
    )
      navigate(`${Page.Project}`, { state: { id: data.targetId } });
    else if (['like', 'comment'].includes(data.type))
      navigate(`${Page.Explore}/user/${data.toUserId}`);
  };

  return (
    <div className="relative">
      <NotificationWidget className="absolute right-0 top-0" />
      <div className="text-[20px] font-bold">Notifications</div>
      <div className="mt-5 flex flex-col gap-4">
        {(notifications ?? []).map((v) => (
          <div
            key={v.id}
            className="relative cursor-pointer rounded bg-white p-4"
            onClick={onClick(v)}
          >
            {!v.isRead && (
              <div className="absolute left-5 top-1/2 h-[5px] w-[5px] rounded-full bg-red" />
            )}
            <div className="pl-5">{mapping[v.type]}</div>
            <div className="text-right text-sm text-grey">
              {v.createdAt ? formatDistanceToNow(new Date(v.createdAt)) : ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;
