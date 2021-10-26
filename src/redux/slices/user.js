import { map } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axiosInstance from '../../utils/axios';
import axios from 'axios';
// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  myProfile: null,
  posts: [],
  users: [],
  userList: [],
  customerList: [],
  editorList: [],
  authorList: [],
  orderList: [],
  followers: [],
  friends: [],
  gallery: [],
  cards: null,
  addressBook: [],
  invoices: [],
  notifications: null
};

const slice = createSlice({
  name: 'user',
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

    // GET PROFILE
    getProfileSuccess(state, action) {
      state.isLoading = false;
      state.myProfile = action.payload;
    },

    // GET POSTS
    getPostsSuccess(state, action) {
      state.isLoading = false;
      state.posts = action.payload;
    },

    // GET USERS
    getUsersSuccess(state, action) {
      state.isLoading = false;
      state.users = action.payload;
    },

    // GET FOLLOWERS
    getFollowersSuccess(state, action) {
      state.isLoading = false;
      state.followers = action.payload;
    },

    // ON TOGGLE FOLLOW
    onToggleFollow(state, action) {
      const followerId = action.payload;

      const handleToggle = map(state.followers, (follower) => {
        if (follower.id === followerId) {
          return {
            ...follower,
            isFollowed: !follower.isFollowed
          };
        }
        return follower;
      });

      state.followers = handleToggle;
    },

    // GET FRIENDS
    getFriendsSuccess(state, action) {
      state.isLoading = false;
      state.friends = action.payload;
    },

    // GET GALLERY
    getGallerySuccess(state, action) {
      state.isLoading = false;
      state.gallery = action.payload;
    },

    // GET MANAGE USERS
    getUserListSuccess(state, action) {
      state.isLoading = false;
      state.userList = action.payload;
    },

    // GET CUSTOMER USERS
    getCustomerListSuccess(state, action) {
      state.isLoading = false;
      state.customerList = action.payload;
    },

    // GET CUSTOMER USERS
    getEditorListSuccess(state, action) {
      state.isLoading = false;
      state.editorList = action.payload;
    },

    // GET ORDER LIST
    getOrderListSuccess(state, action) {
      state.isLoading = false;
      state.orderList = action.payload;
    },

    // GET CUSTOMER USERS
    getAuthorListSuccess(state, action) {
      state.isLoading = false;
      state.authorList = action.payload;
    },

    // GET CARDS
    getCardsSuccess(state, action) {
      state.isLoading = false;
      state.cards = action.payload;
    },

    // GET ADDRESS BOOK
    getAddressBookSuccess(state, action) {
      state.isLoading = false;
      state.addressBook = action.payload;
    },

    // GET INVOICES
    getInvoicesSuccess(state, action) {
      state.isLoading = false;
      state.invoices = action.payload;
    },

    // GET NOTIFICATIONS
    getNotificationsSuccess(state, action) {
      state.isLoading = false;
      state.notifications = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { onToggleFollow } = slice.actions;

// ----------------------------------------------------------------------

export function getProfile() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axiosInstance.get('/api/user/profile');
      dispatch(slice.actions.getProfileSuccess(response.data.profile));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getPosts() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axiosInstance.get('/api/user/posts');
      dispatch(slice.actions.getPostsSuccess(response.data.posts));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getFollowers() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axiosInstance.get('/api/user/social/followers');
      dispatch(slice.actions.getFollowersSuccess(response.data.followers));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getFriends() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axiosInstance.get('/api/user/social/friends');
      dispatch(slice.actions.getFriendsSuccess(response.data.friends));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getGallery() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axiosInstance.get('/api/user/social/gallery');
      dispatch(slice.actions.getGallerySuccess(response.data.gallery));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getUserList() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axiosInstance.get('/api/user/manage-users');
      dispatch(slice.actions.getUserListSuccess(response.data.users));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getEditorList() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const accessToken = window.localStorage.getItem('accessToken');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/setup/getallusersbyrole`,{
          role: 1
        },
        {
          headers: { Authorization: accessToken }
        }
      );

      dispatch(slice.actions.getEditorListSuccess(response.data.user));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getCustomerList() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const accessToken = window.localStorage.getItem('accessToken');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/setup/getallusersbyrole`,{
          role: 3
        },
        {
          headers: { Authorization: accessToken }
        }
      );

      dispatch(slice.actions.getCustomerListSuccess(response.data.user));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getAllOrderList() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const accessToken = window.localStorage.getItem('accessToken');

      let response = await axios.post(
        `${process.env.REACT_APP_API_URL}/order/allorder`,
        {
          headers: { Authorization: accessToken }
        }
      );

      dispatch(slice.actions.getOrderListSuccess(response.data.order));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getOrderList(role) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const accessToken = window.localStorage.getItem('accessToken');
      let response = await axios.post(
        `${process.env.REACT_APP_API_URL}/order/myorder`,
        {
          role: role
        },
        {
          headers: { Authorization: accessToken }
        }
      );
      dispatch(slice.actions.getOrderListSuccess(response.data.order));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getAuthorList() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const accessToken = window.localStorage.getItem('accessToken');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/setup/getallusersbyrole`,{
          role: 2
        },
        {
          headers: { Authorization: accessToken }
        }
      );

      dispatch(slice.actions.getAuthorListSuccess(response.data.user));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getCards() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axiosInstance.get('/api/user/account/cards');
      dispatch(slice.actions.getCardsSuccess(response.data.cards));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getAddressBook() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axiosInstance.get(
        '/api/user/account/address-book'
      );
      dispatch(slice.actions.getAddressBookSuccess(response.data.addressBook));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getNotifications() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axiosInstance.get(
        '/api/user/account/notifications-settings'
      );
      dispatch(
        slice.actions.getNotificationsSuccess(response.data.notifications)
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getUsers() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axiosInstance.get('/api/user/all');
      dispatch(slice.actions.getUsersSuccess(response.data.users));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
