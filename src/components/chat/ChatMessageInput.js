import faker from 'faker';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import micFill from '@iconify/icons-eva/mic-fill';
import roundSend from '@iconify/icons-ic/round-send';
import attach2Fill from '@iconify/icons-eva/attach-2-fill';
import roundAddPhotoAlternate from '@iconify/icons-ic/round-add-photo-alternate';
import axios from 'axios';
// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
import useAuth from 'src/hooks/useAuth';
import {
  Box,
  Input,
  Divider,
  IconButton,
  InputAdornment
} from '@material-ui/core';
//
import EmojiPicker from '../EmojiPicker';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  minHeight: 56,
  display: 'flex',
  position: 'relative',
  alignItems: 'center',
  paddingLeft: theme.spacing(2)
}));

// ----------------------------------------------------------------------

ChatMessageInput.propTypes = {
  disabled: PropTypes.bool,
  conversationId: PropTypes.string,
  conversationkey: PropTypes.string,
  onSend: PropTypes.func
};

export default function ChatMessageInput({
  disabled,
  conversationId,
  conversationkey,
  onSend,
  ...other
}) {
  const fileInputRef = useRef(null);
  const { user } = useAuth();
  const [message, setMessage] = useState('');

  const handleAttach = () => {
    fileInputRef.current.click();
  };

  const handleChangeMessage = (event) => {
    setMessage(event.target.value);
  };

  const handleKeyUp = (event) => {
    if (event.key === 'Enter' || event.keyCode === 13) {
      handleSend();
    }
  };

  const handleSend = () => {
    if (!message) {
      return '';
    }
    if (onSend) {
      onSend({
        conversationId,
        id: faker.datatype.uuid(),
        con_message: message,
        contentType: 'text',
        con_attach_path: '',
        con_attach_name: '',
        con_created: new Date(),
        con_from: user.email,
        con_to: conversationkey
      });
    }
    return setMessage('');
  };

  return (
    <RootStyle {...other}>
      <Input
        disabled={disabled}
        fullWidth
        value={message}
        disableUnderline
        onKeyUp={handleKeyUp}
        onChange={handleChangeMessage}
        placeholder="Type a message"
        endAdornment={
          <Box>
            <IconButton size="small" onClick={handleAttach}>
              <Icon icon={attach2Fill} width={24} height={24} />
            </IconButton>
          </Box>
        }
        sx={{ height: '100%' }}
      />

      <Divider orientation="vertical" flexItem />

      <IconButton
        color="primary"
        disabled={!message}
        onClick={handleSend}
        sx={{ mx: 1 }}
      >
        <Icon icon={roundSend} width={24} height={24} />
      </IconButton>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={(e) => {
          const formData = new FormData();
          formData.append('file', e.target.files[0]);
          // formData.append('upload_preset', CLOUDINARY_PRESET);
          // formData.append('api_key', CLOUDINARY_KEY);
          return axios
            .post(`${process.env.REACT_APP_API_URL}/upload/file`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            })
            .then((response) => {
              const { data } = response;
              onSend({
                conversationId,
                id: faker.datatype.uuid(),
                con_message: data.data.con_attach_name + ' uploaded!',
                contentType: 'text',
                con_attach_path: data.data.con_attach_path,
                con_attach_name: data.data.con_attach_name,
                con_created: new Date(),
                con_from: user.email,
                con_to: conversationkey
              });
            });
        }}
      />
    </RootStyle>
  );
}
