import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  isEmpty,
  isLoaded,
  useFirebase,
  useFirestore
} from 'react-redux-firebase';
import axios from 'axios';
// redux
import {
  login,
  register,
  logout,
  profileUpdate
} from '../redux/slices/authJwt';

// ----------------------------------------------------------------------

useAuth.propTypes = {
  method: PropTypes.oneOf(['jwt', 'firebase'])
};

export default function useAuth(method = 'jwt') {
  // Firebase Auth
  const firebase = useFirebase();
  const firestore = useFirestore();
  const { auth, profile } = useSelector((state) => state.firebase);

  // JWT Auth
  const dispatch = useDispatch();
  const { user, isLoading, isAuthenticated } = useSelector(
    (state) => state.authJwt
  );

  // JWT Auth
  if (method === 'jwt') {
    return {
      method: 'jwt',
      user,
      isLoading,
      isAuthenticated,

      login: ({ email, password }) =>
        dispatch(
          login({
            email,
            password
          })
        ),

      register: ({ email, password, firstName, lastName, role }) =>
        dispatch(
          register({
            email,
            password,
            firstName,
            lastName,
            role
          })
        ),

      logout: () => dispatch(logout()),

      resetPassword: () => {},

      updateProfile: ({
        displayName,
        email,
        phoneNumber,
        walletAddress,
        country,
        photoURL
      }) => {
        dispatch(
          profileUpdate({
            displayName,
            email,
            walletAddress,
            country,
            photoURL
          })
        )
      }
        
    };
  }

  // Firebase Auth
  return {
    method: 'firebase',
    user: {
      displayName: auth.displayName || profile.displayName || '',
      email: auth.email || '',
      photoURL: auth.photoURL || profile.photoURL || '',
      phoneNumber: auth.phoneNumber || profile.phoneNumber || '',
      country: profile.country || '',
      address: profile.address || '',
      state: profile.state || '',
      city: profile.city || '',
      zipCode: profile.zipCode || '',
      about: profile.about || '',
      role: profile.role || '',
      isPublic: profile.isPublic || false
    },
    isLoading: !isLoaded(auth),
    isAuthenticated: !isEmpty(auth),

    login: ({ email, password }) =>
      firebase.login({
        email,
        password
      }),
    loginWithGoogle: () =>
      firebase.login({ provider: 'google', type: 'popup' }),

    loginWithFaceBook: () =>
      firebase.login({ provider: 'facebook', type: 'popup' }),

    loginWithTwitter: () =>
      firebase.login({ provider: 'twitter', type: 'popup' }),

    register: ({ email, password, firstName, lastName }) =>
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((res) => {
          firestore
            .collection('users')
            .doc(res.user.uid)
            .set({
              uid: res.user.uid,
              email,
              displayName: `${firstName} ${lastName}`
            });
        }),

    logout: () => firebase.logout(),

    resetPassword: (email) => firebase.resetPassword(email),

    updateProfile: ({
      // displayName,
      photoURL,
      // phoneNumber,
      country
      // state,
      // city,
      // address,
      // zipCode,
      // about,
      // isPublic
    }) =>
      firebase.updateProfile({}).then((res) => {
        firestore.collection('users').doc(res.id).set(
          {
            // displayName,
            photoURL,
            // phoneNumber,
            country
            // state,
            // city,
            // address,
            // zipCode,
            // about,
            // isPublic
          },
          { merge: true }
        );
      })
  };
}
