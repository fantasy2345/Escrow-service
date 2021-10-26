import { filter } from 'lodash';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { Link as RouterLink } from 'react-router-dom';
import searchFill from '@iconify/icons-eva/search-fill';
import twitterFill from '@iconify/icons-eva/twitter-fill';
import linkedinFill from '@iconify/icons-eva/linkedin-fill';
import facebookFill from '@iconify/icons-eva/facebook-fill';
import { useDispatch, useSelector } from 'react-redux';
import instagramFilled from '@iconify/icons-ant-design/instagram-filled';
import Label from 'src/components/Label';
import { MButton } from 'src/components/@material-extend';
import { useTheme } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import {
  getOrderDetail,
  getAllEditors
} from 'src/redux/slices/order';

import axios from 'axios';
// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
import {
  Box,
  Grid,
  Card,
  Link,
  Avatar,
  makeStyles,
  Typography,
  OutlinedInput,
  InputAdornment
} from '@material-ui/core';
//
import SearchNotFound from '../../SearchNotFound';
import useAuth from 'src/hooks/useAuth';

// ----------------------------------------------------------------------


// ----------------------------------------------------------------------

const useStyles = makeStyles((theme) => ({
  award: {
    marginTop: '1rem'
  }
}));

const SOCIALS = [
  {
    name: 'Facebook',
    icon: <Icon icon={facebookFill} width={20} height={20} color="#1877F2" />
  },
  {
    name: 'Instagram',
    icon: <Icon icon={instagramFilled} width={20} height={20} color="#D7336D" />
  },
  {
    name: 'Linkedin',
    icon: <Icon icon={linkedinFill} width={20} height={20} color="#006097" />
  },
  {
    name: 'Twitter',
    icon: <Icon icon={twitterFill} width={20} height={20} color="#1C9CEA" />
  }
];

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  marginBottom: theme.spacing(5),
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter
  }),
  '&.Mui-focused': {
    width: 320,
    boxShadow: theme.customShadows.z8
  },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`
  }
}));

// ----------------------------------------------------------------------

function applyFilter(array, query) {
  let arr = array;
  if (query) {
    arr = filter(array, (_editor) => {
      if (
        _editor.display_name.toLowerCase().indexOf(query.toLowerCase()) !== -1
      ) {
        return true;
      } else {
        return false;
      }
    });
  }
  return arr;
}

EditorCard.propTypes = {
  editor: PropTypes.object,
  handleClickAward: PropTypes.func,
  awarded: PropTypes.bool
};

function EditorCard({ editor, handleClickAward, awarded }) {
  const classes = useStyles();
  const { display_name, qualification, skill, avartar } = editor;
  const avartarURL = process.env.REACT_APP_API_URL + '/' + avartar;
  const theme = useTheme();

  return (
    <Card
      sx={{
        py: 5,
        display: 'flex',
        position: 'relative',
        alignItems: 'center',
        flexDirection: 'column'
      }}
    >
      <Avatar
        alt={display_name}
        src={avartarURL}
        sx={{ width: 64, height: 64, mb: 3 }}
      />
      <Link
        to="#"
        variant="subtitle1"
        color="text.primary"
        component={RouterLink}
      >
        {display_name}
      </Link>
      <Grid container>
        <Grid item xs={12} md={3}></Grid>
        <Grid item xs={12} md={3}>
          <Box sx={{ display: 'flex', mt: 2 }}>
            <Label>Qualification</Label>
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
          <Box sx={{ display: 'flex', mt: 2 }}>
            <Typography component={'span'} variant="body2">
              {qualification != '' ? qualification : 'Not defined'}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={3}></Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12} md={3}></Grid>
        <Grid item xs={12} md={3}>
          <Box sx={{ display: 'flex', mt: 2 }}>
            <Label>Skill</Label>
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
          <Box sx={{ display: 'flex', mt: 2 }}>
            <Typography component={'span'} variant="body2">
              {skill != '' ? skill : 'Not defined'}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={3}></Grid>
      </Grid>
      {awarded == false && (
        <Box className={classes.award}>
          <MButton
            variant="contained"
            color="error"
            onClick={() => {
              handleClickAward(editor.email);
            }}
          >
            Award
          </MButton>
        </Box>
      )}
      {awarded == true && (
        <Box className={classes.award}>
          <Label
            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
            color={'success'}
          >
            Awarded
          </Label>
        </Box>
      )}
    </Card>
  );
}

OrderEditor.propTypes = {
  editors: PropTypes.array,
  awardedEditor: PropTypes.any,
  orderId: PropTypes.any,
  findEditors: PropTypes.string,
  onfindEditors: PropTypes.func,
  topic: PropTypes.any,
  sx: PropTypes.object
};

export default function OrderEditor({
  editors,
  awardedEditor,
  findEditors,
  onfindEditors,
  orderId,
  topic,
  sx
}) {
  const editorFiltered = applyFilter(editors, findEditors);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { socket } = useSelector((state) => state.notifications);
  
  const isNotFound = editorFiltered.length === 0;

  const handleClickAward = (email) => {
    // ***** set Awarded ****** //
    const accessToken = window.localStorage.getItem('accessToken');
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/order/setordereditor`,
        {
          id: orderId,
          email: email
        },
        {
          headers: { Editorization: accessToken }
        }
      )
      .then((response) => {
        if(response.data.type == "success") {
          socket.emit('sendMessage', {user: email, message: `congratulations, you have awarded to "${topic}"`, type: "order_shipped"}, () => {});
          enqueueSnackbar('Successfully awarded!', { variant: 'success' });
          dispatch(getOrderDetail(orderId));
        }
      })
      .catch((error) => {
        
      });
  };

  return (
    <Box sx={{ mt: 5, ...sx }}>
      <Typography component={'p'} variant="h4" sx={{ mb: 3 }}>
        editors
      </Typography>

      <SearchStyle
        value={findEditors}
        onChange={onfindEditors}
        placeholder="Find editors..."
        startAdornment={
          <InputAdornment position="start">
            <Box
              component={Icon}
              icon={searchFill}
              sx={{ color: 'text.disabled' }}
            />
          </InputAdornment>
        }
      />

      <Grid container spacing={3}>
        {editorFiltered.map((editor) => {
          if (awardedEditor != null && awardedEditor != '') {
            if (awardedEditor === editor.email) {
              return (
                <Grid key={editor.id} item xs={12} md={4}>
                  <EditorCard
                    handleClickAward={handleClickAward}
                    editor={editor}
                    awarded={true}
                  />
                </Grid>
              );
            }
          } else {
            return (
              <Grid key={editor.id} item xs={12} md={4}>
                <EditorCard
                  handleClickAward={handleClickAward}
                  editor={editor}
                  awarded={false}
                />
              </Grid>
            );
          }
        })}
      </Grid>

      {isNotFound && (
        <Box sx={{ mt: 5 }}>
          <SearchNotFound searchQuery={findEditors} />
        </Box>
      )}
    </Box>
  );
}
