import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
// material
import {
  Box,
  Card,
  Button,
  TextField,
  Rating,
  CardContent
} from '@material-ui/core';
import Block from 'src/components/Block';
import { getOrderDetail } from 'src/redux/slices/order';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { MIconButton } from 'src/components/@material-extend';
import closeFill from '@iconify/icons-eva/close-fill';
import { Icon } from '@iconify/react';
import { useDispatch, useSelector } from 'react-redux';

import { getReviewByEmail } from 'src/redux/slices/order';
// ----------------------------------------------------------------------

ReviewPostInput.propTypes = {
  orderdetail: PropTypes.any,
  sx: PropTypes.object
};

const labels = {
  0.5: 'Useless',
  1: 'Useless+',
  1.5: 'Poor',
  2: 'Poor+',
  2.5: 'Ok',
  3: 'Ok+',
  3.5: 'Good',
  4: 'Good+',
  4.5: 'Excellent',
  5: 'Excellent+'
};

export default function ReviewPostInput({ orderdetail, sx, ...other }) {
  const fileInputRef = useRef(null);
  const { review } = useSelector((state) => state.order);

  const rat_ini = review.length != 0 ? review[0].rating : 0;
  const des_ini = review.length != 0 ? review[0].description : '';

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState();
  const [hover, setHover] = useState(-1);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getReviewByEmail(orderdetail.author_email, orderdetail.id));
  }, [dispatch, orderdetail.author_email, orderdetail.id]);

  useEffect(() => {
    setRating(rat_ini);
  }, [rat_ini]);

  useEffect(() => {
    setDescription(des_ini);
  }, [des_ini]);

  const handlePost = () => {
    const accessToken = window.localStorage.getItem('accessToken');
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/order/review`,
        {
          id: orderdetail.id,
          rating: rating,
          description: description,
          user_email: orderdetail.author_email
        },
        {
          headers: { Authorization: accessToken }
        }
      )
      .then(() => {
        enqueueSnackbar('Review has set successfully.', {
          variant: 'success',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
        if (orderdetail.id != null && orderdetail.id != '')
          dispatch(getOrderDetail(orderdetail.id));
      })
      .catch((error) => {
      });
  };

  return (
    <Card sx={{ mb: 3, ...sx }} {...other}>
      <CardContent>
        <Block title="Please leave the feedback" sx={{ mb: 3 }}>
          <Rating
            name="hover-feedback"
            value={rating}
            precision={0.5}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
            onChangeActive={(event, newHover) => {
              setHover(newHover);
            }}
            size="large"
            readOnly={orderdetail.review_id != null}
          />
          {rating !== null && (
            <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : rating]}</Box>
          )}
        </Block>

        <TextField
          multiline
          fullWidth
          rows={4}
          mt={8}
          value={description}
          onChange={(event) => {
            setDescription(event.target.value);
          }}
          placeholder="Share what you are thinking about the author here..."
          sx={{
            '& fieldset': {
              borderWidth: `1px !important`,
              borderColor: (theme) => `${theme.palette.grey[500_32]} !important`
            }
          }}
          inputProps={{ readOnly: orderdetail.review_id != null }}
        />
        {orderdetail.review_id == null && (
          <Box
            sx={{
              mt: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Button variant="contained" onClick={handlePost}>
              Post
            </Button>
          </Box>
        )}
      </CardContent>
      <input ref={fileInputRef} type="file" style={{ display: 'none' }} />
    </Card>
  );
}
