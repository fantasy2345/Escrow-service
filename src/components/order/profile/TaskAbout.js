import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { Grid } from '@material-ui/core';
import moment from 'moment';
import { useTheme } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import useAuth from 'src/hooks/useAuth';
// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
import {
  Box,
  Link,
  Card,
  Typography,
  CardHeader,
  makeStyles,
  CardContent
} from '@material-ui/core';
import Label from 'src/components/Label';
import { saveAs } from 'file-saver';
import filePdfFilled from '@iconify/icons-ant-design/file-pdf-filled';
import { Markup } from 'interweave';
import { getOrderAttach } from 'src/redux/slices/order';

// ----------------------------------------------------------------------

const IconStyle = styled(Icon)(({ theme }) => ({
  width: 20,
  height: 20,
  marginTop: 1,
  flexShrink: 0,
  marginRight: theme.spacing(2)
}));

const useStyles = makeStyles((theme) => ({
  link: {
    cursor: "pointer"
  }
}));

// ----------------------------------------------------------------------

TaskAbout.propTypes = {
  orderdetail: PropTypes.any,
  orderid: PropTypes.any,
  sx: PropTypes.object
};

const getDays = (duedate) => {
  var given = moment(duedate, 'MMM DD, YYYY');
  var current = moment().startOf('day');

  //Difference in number of days
  var dur = moment.duration(given.diff(current)).asDays();

  if (dur === 1) {
    return '1 day';
  } else if (dur > 0) {
    return dur + ' days';
  } else if (dur == 0) {
    return 'today';
  }
  return -1 * dur + ' days ago';
};

export default function TaskAbout({ orderdetail, orderid, sx }) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { user } = useAuth();
  const icon = <IconStyle icon={filePdfFilled} color="#006097" />;
  const { or_topic, or_description, or_deadline, or_status, or_price } = orderdetail;
  const classes = useStyles();
  const { orderattach } = useSelector((state) => state.order);

  let price = or_price;
  if(user.role == 2) {
    price = or_price * 0.9;
  }

  const downloadResult = (name, path) => {
    saveAs(path, name);
  };

  useEffect(() => {
    dispatch(getOrderAttach(orderid));
  }, [dispatch, orderid]);

  //

  return (
    <Card sx={{ mb: 3, ...sx }}>
      <CardHeader title="About" />

      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', mt: 2 }}>
              <Label>Task title</Label>
            </Box>
          </Grid>
          <Grid item xs={12} md={9}>
            <Box sx={{ display: 'flex', mt: 2 }}>
              <Typography component={'span'} variant="body2">
                <Markup content={or_topic} />
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', mt: 2 }}>
              <Label>Task description</Label>
            </Box>
          </Grid>
          <Grid item xs={12} md={9}>
            <Box sx={{ display: 'flex', mt: 2 }}>
              <Typography component={'span'} variant="body2">
                <Markup content={or_description} />
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', mt: 2 }}>
              <Label>Price</Label>
            </Box>
          </Grid>
          <Grid item xs={12} md={9}>
            <Box sx={{ display: 'flex', mt: 2 }}>
              <Typography component={'span'} variant="body2">
                {price} (BNB)
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', mt: 2 }}>
              <Label>Status</Label>
            </Box>
          </Grid>
          <Grid item xs={12} md={9}>
            <Box sx={{ display: 'flex', mt: 2 }}>
              <Label
                variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                color={(or_status === 'submitted' && 'error') || 'success'}
              >
                {or_status}
              </Label>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
