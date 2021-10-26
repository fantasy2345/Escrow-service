import PropTypes from 'prop-types';
import { formatDistanceToNowStrict } from 'date-fns';
// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { Avatar, Box, makeStyles, Typography } from '@material-ui/core';
import useAuth from 'src/hooks/useAuth';
// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(3)
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 320,
  padding: theme.spacing(1.5),
  marginTop: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.neutral
}));

const InfoStyle = styled(Typography)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(0.75),
  color: theme.palette.text.secondary
}));

const MessageImgStyle = styled('img')(({ theme }) => ({
  height: 200,
  minWidth: 296,
  width: '100%',
  cursor: 'pointer',
  objectFit: 'cover',
  borderRadius: theme.shape.borderRadius,
}));

const useStyles = makeStyles((theme) => ({
  words: {
    wordBreak: "break-word"
  }
}));

// ----------------------------------------------------------------------

ChatMessageItem.propTypes = {
  message: PropTypes.object.isRequired,
  conversation: PropTypes.object.isRequired,
  onOpenLightbox: PropTypes.func
};

export default function ChatMessageItem({
  message,
  conversation,
  onOpenLightbox,
  ...other
}) {
  const { user } = useAuth();
  const classes = useStyles();
  const sender = conversation.participants.find(
    (participant) => participant.id === message.con_from
  );

  const senderDetails =
    message.con_from === user.email
      ? { type: 'me' }
      : { avatar: sender.avatar, name: sender.name };

  const isMe = senderDetails.type === 'me';
  // const isImage = message.contentType === 'image';
  const isImage = false;
  const firstName = senderDetails.name && senderDetails.name.split(' ')[0];

  return (
    <RootStyle {...other}>
      <Box
        sx={{
          display: 'flex',
          ...(isMe && {
            ml: 'auto'
          })
        }}
        className={classes.words}
      >
        {senderDetails.type !== 'me' && (
          <Avatar
            alt={senderDetails.name}
            src={`${process.env.REACT_APP_API_URL}/${senderDetails.avatar}`}
            sx={{ width: 32, height: 32 }}
          />
        )}

        <Box sx={{ ml: 2 }}>
          <InfoStyle
            noWrap
            variant="caption"
            sx={{ ...(isMe && { justifyContent: 'flex-end' }) }}
          >
            {!isMe && `${firstName},`}&nbsp;
            
          </InfoStyle>

          <ContentStyle
            sx={{
              ...(isMe && {
                color: 'grey.800',
                bgcolor: 'primary.lighter'
              })
            }}
          >
            <Typography variant="body2">{message.con_message}</Typography>
          </ContentStyle>
        </Box>
      </Box>
    </RootStyle>
  );
}
