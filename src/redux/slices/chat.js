import { createSlice } from '@reduxjs/toolkit';
// utils
import axiosInstance from '../../utils/axios';
import axios from 'axios';

import objFromArray from '../../utils/objFromArray';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  contacts: { byId: {}, allIds: [] },
  conversations: { byId: {}, allIds: [] },
  activeConversationId: null,
  participants: [],
  recipients: []
};

const slice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET CONTACT SSUCCESS
    getContactsSuccess(state, action) {
      const contacts = action.payload;

      state.contacts.byId = objFromArray(contacts);
      state.contacts.allIds = Object.keys(state.contacts.byId);
    },

    // GET CONVERSATIONS
    getConversationsSuccess(state, action) {
      const conversations = action.payload;
      let test = objFromArray(conversations);
      state.conversations.byId = test;
      
      state.conversations.allIds = Object.keys(state.conversations.byId);
    },

    // GET CONVERSATION
    getConversationSuccess(state, action) {
      const conversation = action.payload;

      if (conversation) {
        state.conversations.byId[conversation.id] = conversation;
        state.activeConversationId = conversation.id;
        if (!state.conversations.allIds.includes(conversation.id)) {
          state.conversations.allIds.push(conversation.id);
        }
      } else {
        state.activeConversationId = null;
      }
    },

    // ON SEND MESSAGE
    onSendMessage(state, action) {
      const conversation = action.payload;
      const {
        conversationId,
        id,
        con_message,
        contentType,
        con_attach_path,
        con_attach_name,
        con_created,
        con_from,
      } = conversation;

      const newMessage = {
        conversationId,
        id,
        con_message,
        contentType,
        con_attach_path,
        con_attach_name,
        con_created,
        con_from,
      };

      state.conversations.byId[conversationId].messages.push(newMessage);
    },

    markConversationAsReadSuccess(state, action) {
      const { conversationId } = action.payload;
      const conversation = state.conversations.byId[conversationId];
      if (conversation) {
        conversation.unreadCount = 0;
      }
    },

    // GET PARTICIPANTS
    getParticipantsSuccess(state, action) {
      const participants = action.payload;
      state.participants = participants;
    },

    // RESET ACTIVE CONVERSATION
    resetActiveConversation(state) {
      state.activeConversationId = null;
    },

    addRecipients(state, action) {
      const recipients = action.payload;
      state.recipients = recipients;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const {
  addRecipients,
  onSendMessage,
  resetActiveConversation
} = slice.actions;

// ----------------------------------------------------------------------

export function getContacts(user) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      // const response = await axiosInstance.get('/api/chat/contacts');
      const accessToken = window.localStorage.getItem('accessToken');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/conversation/getcontacts`,
        {
          role: user.role
        },
        {
          headers: { Authorization: accessToken }
        }
      );
      dispatch(slice.actions.getContactsSuccess(response.data.contacts));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getConversations(user) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response1 = await axiosInstance.get('/api/chat/conversations');
      const accessToken = window.localStorage.getItem('accessToken');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/conversation/getconversations`,
        {
          from: user.email,
          role: user.role,
        },
        {
          headers: { Authorization: accessToken }
        }
      );
      dispatch(
        slice.actions.getConversationsSuccess(response.data.conversations)
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getConversation(from, conversationKey) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const accessToken = window.localStorage.getItem('accessToken');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/conversation/getconversation`,
        {
          from: from,
          to: conversationKey,
        },
        {
          headers: { Authorization: accessToken }
        }
      );
      dispatch(
        slice.actions.getConversationSuccess(response.data.conversation)
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function markConversationAsRead(from, conversationKey, conversationId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      // await axiosInstance.get('/api/chat/conversation/mark-as-seen', {
      //   params: { conversationId }
      // });
      const accessToken = window.localStorage.getItem('accessToken');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/conversation/markasseen`,
        {
          from,
          to : conversationKey,
        },
        {
          headers: { Authorization: accessToken }
        }
      );
      dispatch(slice.actions.markConversationAsReadSuccess({ conversationId }));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getParticipants(conversationKey) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const accessToken = window.localStorage.getItem('accessToken');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/conversation/getparticipants`,
        {
          conversationkey : conversationKey,
        },
        {
          headers: { Authorization: accessToken }
        }
      );
      dispatch(
        slice.actions.getParticipantsSuccess(response.data.participants)
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
