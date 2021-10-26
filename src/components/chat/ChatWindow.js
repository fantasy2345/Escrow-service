import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams, useLocation } from 'react-router-dom';
// material
import { Box, Divider } from '@material-ui/core';
// redux
import {
  addRecipients,
  onSendMessage,
  getConversation,
  getParticipants,
  markConversationAsRead,
  resetActiveConversation,
  getConversations
} from '../../redux/slices/chat';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
//
import ChatRoom from './ChatRoom';
import ChatMessageList from './ChatMessageList';
import ChatMessageInput from './ChatMessageInput';
import useAuth from 'src/hooks/useAuth';

import io from 'socket.io-client';

// ----------------------------------------------------------------------

const conversationSelector = (state) => {
  const { conversations, activeConversationId } = state.chat;
  const conversation = conversations.byId[activeConversationId];
  if (conversation) {
    return conversation;
  }
  return {
    id: null,
    messages: [],
    participants: [],
    unreadMessages: 0
  };
};

const ENDPOINT = process.env.REACT_APP_API_URL;
let socket;

export default function ChatWindow() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { pathname } = useLocation();
  const { conversationKey } = useParams();
  const { user } = useAuth();

  const { participants, activeConversationId } = useSelector(
    (state) => state.chat
  );
  const conversation = useSelector((state) => conversationSelector(state));
  const mode = conversationKey ? 'DETAIL' : 'COMPOSE';

  const displayParticipants = participants.filter(
    (item) => item.id !== user.email
  );

  useEffect(() => {
    const getDetails = async () => {
      dispatch(getParticipants(conversationKey));
      try {
        dispatch(getConversation(user.email, conversationKey));
      } catch (error) {
        console.error(error);
        history.push(PATH_DASHBOARD.chat.new);
      }
    };
    if (conversationKey) {
      getDetails();
    } else if (activeConversationId) {
      dispatch(resetActiveConversation());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationKey]);

  useEffect(() => {
    if (conversationKey) {
      dispatch(
        markConversationAsRead(
          user.email,
          conversationKey,
          activeConversationId
        )
      );
    }
  }, [dispatch, activeConversationId]);

  const handleAddRecipient = (recipient) => {
    dispatch(addRecipients(recipient));
  };

  useEffect(() => {
    socket = io(ENDPOINT);

    socket.emit(
      'join',
      { email: user.email, room: 'conversation' },
      (error) => {
        if (error) {
        }
      }
    );
  }, [ENDPOINT, user]);

  useEffect(() => {
    socket.on('message', (message) => {
      if (message.user == user.email) {
        dispatch(getConversations(user));
      }
    });
  }, [user]);

  const handleSendMessage = async (value) => {
    try {
      socket.emit('sendMessage', value, () => {});
      dispatch(onSendMessage(value));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', flexGrow: 1, flexDirection: 'column' }}>
          <ChatMessageList conversation={conversation} />

          <Divider />

          <ChatMessageInput
            conversationId={activeConversationId}
            conversationkey={conversationKey}
            onSend={handleSendMessage}
            disabled={pathname === PATH_DASHBOARD.chat.new}
          />
        </Box>

        {mode === 'DETAIL' && (
          <ChatRoom
            conversation={conversation}
            participants={displayParticipants}
          />
        )}
      </Box>
    </Box>
  );
}
