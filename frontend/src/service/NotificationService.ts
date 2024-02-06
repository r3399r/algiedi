import notificationEndpoint from 'src/api/notificationEndpoint';
import { Page } from 'src/constant/Page';
import { DetailedNotification } from 'src/model/backend/api/Notification';
import { NotificationType } from 'src/model/backend/constant/Notification';
import { Status } from 'src/model/backend/constant/Project';
import { filterNotification, replaceNotification, setNotifications } from 'src/redux/apiSlice';
import { dispatch } from 'src/redux/store';
import { finishWaiting, startWaiting } from 'src/redux/uiSlice';

export const loadNotification = async () => {
  try {
    dispatch(startWaiting());

    const res = await notificationEndpoint.getNotification();

    dispatch(setNotifications(res.data));
  } finally {
    dispatch(finishWaiting());
  }
};

export const readNotification = async (id: string) => {
  try {
    dispatch(startWaiting());

    const res = await notificationEndpoint.patchNotificationIdRead(id);

    dispatch(replaceNotification(res.data));
  } finally {
    dispatch(finishWaiting());
  }
};

export const deleteNotification = async (id: string) => {
  try {
    dispatch(startWaiting());

    await notificationEndpoint.deleteNotificationId(id);

    dispatch(filterNotification(id));
  } finally {
    dispatch(finishWaiting());
  }
};

export const getNavigateTo = (data: DetailedNotification) => {
  if (data.type === NotificationType.ProjectPublish) return `${Page.Explore}/${data.targetId}`;
  else if (
    [
      NotificationType.ProjectStart,
      NotificationType.ProjectUpdated,
      NotificationType.CreationUpdated,
      NotificationType.CreationUploaded,
      NotificationType.NewParticipant,
      NotificationType.InspiredApproved,
      NotificationType.InspiredUnapproved,
      NotificationType.PartnerReady,
      NotificationType.PartnerNotReady,
    ].includes(data.type)
  )
    if (data.target?.project?.status === Status.Published)
      return `${Page.Explore}/${data.targetId}`;
    else return Page.Project;
  else if (
    [NotificationType.Like, NotificationType.Comment, NotificationType.FolloweeUploaded].includes(
      data.type,
    )
  )
    return `${Page.Explore}/${data.targetId}`;
  else if (data.type === NotificationType.Follow) return `${Page.Explore}/user/${data.fromUserId}`;

  return '';
};
