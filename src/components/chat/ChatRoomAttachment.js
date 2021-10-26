import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { uniq, flatten } from 'lodash';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { Box, Button, Divider, Collapse, Typography } from '@material-ui/core';
// utils
import { fDateTime } from '../../utils/formatTime';

import { saveAs } from 'file-saver';
import { getFileFullName, getConversationFileThumb } from '../../utils/getFileFormat';
//
import Scrollbar from '../Scrollbar';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  height: '100%',
  display: 'flex',
  overflow: 'hidden',
  flexDirection: 'column',
  paddingBottom: theme.spacing(2)
}));

const FileItemStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginTop: theme.spacing(2),
  padding: theme.spacing(0, 2.5)
}));

const FileThumbStyle = styled('div')(({ theme }) => ({
  width: 40,
  height: 40,
  flexShrink: 0,
  display: 'flex',
  overflow: 'hidden',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.grey[500_16],
  '& img': { width: '100%', height: '100%' },
  '& svg': { width: 24, height: 24 }
}));

const CollapseButtonStyle = styled(Button)(({ theme }) => ({
  ...theme.typography.overline,
  height: 40,
  flexShrink: 0,
  borderRadius: 0,
  padding: theme.spacing(1, 2),
  justifyContent: 'space-between',
  color: theme.palette.text.disabled
}));

// ----------------------------------------------------------------------

AttachmentItem.propTypes = {
  file: PropTypes.object,
};

function AttachmentItem({ file }) {
  return (
    <FileItemStyle key={file.id}>
      <FileThumbStyle>{getConversationFileThumb(file.con_attach_name, file.con_attach_path)}</FileThumbStyle>
      <Box sx={{ ml: 1.5, maxWidth: 150 }}>
        <Typography variant="body2" noWrap>
          {file.con_attach_name}
        </Typography>
      </Box>
    </FileItemStyle>
  );
}

ChatRoomAttachment.propTypes = {
  conversation: PropTypes.object.isRequired,
  isCollapse: PropTypes.bool,
  onCollapse: PropTypes.func
};

export default function ChatRoomAttachment({
  conversation,
  isCollapse,
  onCollapse,
  ...other
}) {
  let totalAttachment = 0;
  conversation.messages.map((item) => {
    if(item.con_attach_path != "") {
      totalAttachment += 1;
    }
  });

  const download = (path, name) => {
    saveAs(process.env.REACT_APP_API_URL + "/" + path, name);
  };

  return (
    <RootStyle {...other}>
      <CollapseButtonStyle
        fullWidth
        color="inherit"
        onClick={onCollapse}
        endIcon={
          <Icon
            icon={isCollapse ? arrowIosDownwardFill : arrowIosForwardFill}
            width={16}
            height={16}
          />
        }
      >
        attachment ({totalAttachment})
      </CollapseButtonStyle>

      {!isCollapse && <Divider />}

      <Scrollbar>
        <Collapse in={isCollapse}>
          {conversation.messages.map((file, index) => {
            if(file.con_attach_path == "") {
              return null;
            }
            return (
            <div key={file.id}>
              <Box
                onClick={() => {
                  download(file.con_attach_path, file.con_attach_name);
                }}
              >
                <AttachmentItem key={file.id} file={file} />
              </Box>
            </div>
          )})}
        </Collapse>
      </Scrollbar>
    </RootStyle>
  );
}
