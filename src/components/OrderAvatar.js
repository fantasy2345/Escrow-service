// hooks
import useAuth from '../hooks/useAuth';
//
import { MAvatar } from './@material-extend';
import createAvatar from '../utils/createAvatar';
import PropTypes from 'prop-types';

// ----------------------------------------------------------------------
OrderAvatar.propTypes = {
  authUser: PropTypes.any
};

export default function OrderAvatar({authUser,  ...other }) {
  const { user } = useAuth();

  return (
    <MAvatar
      src={authUser.client_avatar}
      alt={authUser.client_name}
      color={authUser.client_avatar ? 'default' : createAvatar(authUser.client_name).color}
      {...other}
    >
      {createAvatar(authUser.client_name).name}
    </MAvatar>
  );
}
