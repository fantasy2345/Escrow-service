import faker from 'faker';
import PropTypes from 'prop-types';
import { noCase } from 'change-case';
import { useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { set, sub, formatDistanceToNow } from 'date-fns';
import { useEffect } from 'react';
import { Icon } from '@iconify/react';
import bellFill from '@iconify/icons-eva/bell-fill';
import clockFill from '@iconify/icons-eva/clock-fill';
import doneAllFill from '@iconify/icons-eva/done-all-fill';
// material
import {
  Box,
  List,
  Badge,
  Button,
  Avatar,
  Tooltip,
  Divider,
  ListItem,
  Typography,
  ListItemText,
  ListSubheader,
  ListItemAvatar
} from '@material-ui/core';
// utils
import { mockImgAvatar } from '../../utils/mockImages';
// components
import Scrollbar from '../../components/Scrollbar';
import MenuPopover from '../../components/MenuPopover';
import { MIconButton } from '../../components/@material-extend';
import io from 'socket.io-client';
import useAuth from 'src/hooks/useAuth';
import { useDispatch, useSelector } from 'react-redux';
import { getNotifications, setSocket } from '../../redux/slices/notification';
import axios from 'axios';
// ----------------------------------------------------------------------

const ENDPOINT = process.env.REACT_APP_API_URL;

const NOTIFICATIONS = [
  {
    id: faker.datatype.uuid(),
    title: 'Your order is placed',
    description: 'waiting for shipping',
    avatar: null,
    type: 'order_placed',
    createdAt: new Date(),
    isUnRead: true
  }
];

function renderContent(notification) {
  const title = (
    <Typography variant="subtitle2">
      <Typography
        component="span"
        variant="body2"
        sx={{ color: 'text.secondary' }}
      >
        &nbsp; {noCase(notification.description)}
      </Typography>
    </Typography>
  );

  if (notification.type === 'order_placed') {
    return {
      avatar: (
        <img
          alt={notification.title}
          src="/static/icons/ic_notification_package.svg"
        />
      ),
      title
    };
  }
  if (notification.type === 'order_shipped') {
    return {
      avatar: (
        <img
          alt={notification.title}
          src="/static/icons/ic_notification_shipping.svg"
        />
      ),
      title
    };
  }
  if (notification.type === 'mail') {
    return {
      avatar: (
        <img
          alt={notification.title}
          src="/static/icons/ic_notification_mail.svg"
        />
      ),
      title
    };
  }
  if (notification.type === 'chat_message') {
    return {
      avatar: (
        <img
          alt={notification.title}
          src="/static/icons/ic_notification_chat.svg"
        />
      ),
      title
    };
  }
  return {
    avatar: <img alt={notification.title} src={notification.avatar} />,
    title
  };
}

NotificationItem.propTypes = {
  notification: PropTypes.object.isRequired,
  handleMarkAsRead: PropTypes.func
};

function NotificationItem({ notification, handleMarkAsRead }) {
  const { avatar, title } = renderContent(notification);

  return (
    <ListItem
      button
      to="#"
      disableGutters
      key={notification.id}
      component={RouterLink}
      sx={{
        py: 1.5,
        px: 2.5,
        '&:not(:last-of-type)': { mb: '1px' },
        ...(notification.isUnRead && {
          bgcolor: 'action.selected'
        })
      }}
      onClick={() => handleMarkAsRead(notification.id)}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled'
            }}
          >
            <Box
              component={Icon}
              icon={clockFill}
              sx={{ mr: 0.5, width: 16, height: 16 }}
            />
          </Typography>
        }
      />
    </ListItem>
  );
}

export default function NotificationsPopover() {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const { notifications, socket } = useSelector((state) => state.notifications);
  const dispatch = useDispatch();
  const { user } = useAuth();


  const totalUnRead = notifications.filter((item) => item.isUnRead == 1).length;

  useEffect(() => {
    if (user) {
      dispatch(getNotifications(user.email));
    }
  }, [user]);

  useEffect(() => {
    if (socket == null) {
      const msock = io(ENDPOINT);
      dispatch(setSocket(msock));
    }

    if (socket != null) {
      socket.emit(
        'join',
        { email: user.email, room: 'notification' },
        (error) => {
          if (error) {
          }
        }
      );
    }
  }, [user]);

  useEffect(() => {
    if (socket != null) {
      socket.on('message', (message) => {
        if (message.user == user.email) {
          dispatch(getNotifications(user.email));
        }
      });
    }
  }, [user, socket]);

  const handleMarkAllAsRead = () => {};
  const handleRemoveAll = () => {
    const accessToken = window.localStorage.getItem('accessToken');
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/notification/refresh`,
        {
          email: user.email
        },
        {
          headers: { Editorization: accessToken }
        }
      )
      .then((response) => {
        if (response.data.type == 'success') {
          dispatch(getNotifications(user.email));
        }
      })
      .catch((error) => {});
  };
  const handleMarkAsRead = (id) => {
    const accessToken = window.localStorage.getItem('accessToken');
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/notification/setasread`,
        {
          id: id
        },
        {
          headers: { Editorization: accessToken }
        }
      )
      .then((response) => {
        if (response.data.type == 'success') {
          dispatch(getNotifications(user.email));
        }
      })
      .catch((error) => {});
  };
  const myScrollbar = {
    width: 400,
    height: 400,
  };

  return (
    <>
      <MIconButton
        ref={anchorRef}
        onClick={() => setOpen(true)}
        color={open ? 'primary' : 'default'}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Icon icon={bellFill} width={20} height={20} />
        </Badge>
      </MIconButton>

      <MenuPopover
        open={open}
        onClose={() => setOpen(false)}
        anchorEl={anchorRef.current}
        sx={{ width: 360 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You have {totalUnRead} unread messages
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title=" Mark all as read">
              <MIconButton color="primary" onClick={handleMarkAllAsRead}>
                <Icon icon={doneAllFill} width={20} height={20} />
              </MIconButton>
            </Tooltip>
          )}
        </Box>

        <Divider />

        <Scrollbar sx={{ height: { xs: 140, sm: 'auto' } }} style={myScrollbar}>
          <List
            disablePadding
            subheader={
              <ListSubheader
                disableSticky
                sx={{ py: 1, px: 2.5, typography: 'overline' }}
              >
                New
              </ListSubheader>
            }
            onClick={(e) => {
            }}
          >
            {notifications.map((notification) => {
              if (notification.isUnRead == 0) {
                return null;
              }
              return (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  handleMarkAsRead={handleMarkAsRead}
                />
              );
            })}
          </List>

          <List
            disablePadding
            subheader={
              <ListSubheader
                disableSticky
                sx={{ py: 1, px: 2.5, typography: 'overline' }}
              >
                Before that
              </ListSubheader>
            }
          >
            {notifications.map((notification) => {
              if (notification.isUnRead == 1) {
                return null;
              }
              return (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  handleMarkAsRead={handleMarkAsRead}
                />
              );
            })}
          </List>
        </Scrollbar>
        <Box sx={{ p: 1 }}>
          <Button
            fullWidth
            disableRipple
            component={RouterLink}
            to="#"
            onClick={handleRemoveAll}
          >
            Remove All
          </Button>
        </Box>
      </MenuPopover>
    </>
  );
}
