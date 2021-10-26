import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
// material
import { List } from '@material-ui/core';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
//
import ChatConversationItem from './ChatConversationItem';
import useAuth from 'src/hooks/useAuth';
// ----------------------------------------------------------------------

ChatConversationList.propTypes = {
  conversations: PropTypes.object,
  isOpenSidebar: PropTypes.bool,
  activeConversationId: PropTypes.string
};

export default function ChatConversationList({
  conversations,
  isOpenSidebar,
  activeConversationId,
  ...other
}) {
  const history = useHistory();
  const { user } = useAuth();
  const handleSelectConversation = (conversationId) => {
    let conversationKey = '';
    const conversation = conversations.byId[conversationId];
    if (conversation.type === 'GROUP') {
      conversationKey = conversation.id;
    } else {
      const otherParticipant = conversation.participants.find(
        (participant) =>
          participant.id !== user.email
      );
      conversationKey = otherParticipant.id;
    }
    history.push(`${PATH_DASHBOARD.chat.root}/${conversationKey}`);
  };

  return (
    <List disablePadding {...other}>
      {conversations.allIds.map((conversationId, index) => (
        <ChatConversationItem
          key={conversationId}
          isOpenSidebar={isOpenSidebar}
          conversation={conversations.byId[conversationId]}
          isSelected={activeConversationId === conversationId}
          onSelectConversation={() => handleSelectConversation(conversationId)}
        />
      ))}
    </List>
  );
}
