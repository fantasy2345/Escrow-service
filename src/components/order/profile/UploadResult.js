import PropTypes from 'prop-types';
// material
import { Card, CardContent } from '@material-ui/core';
import { spacing } from '@material-ui/system';
// utils
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllAuthors,
  getOrderDetail,
  getOrderResult
} from 'src/redux/slices/order';
import {
  UploadMultiFile
} from '../../upload';
import axios from 'axios';
import { MIconButton } from 'src/components/@material-extend';
import closeFill from '@iconify/icons-eva/close-fill';
import { Icon } from '@iconify/react';
// ----------------------------------------------------------------------

UploadResult.propTypes = {
  orderdetail: PropTypes.any,
  sx: PropTypes.object
};


export default function UploadResult({ orderdetail, sx }) {
  const dispatch = useDispatch();
  const [files, setFiles] = useState([]);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const onSubmit = () => {
    const accessToken = window.localStorage.getItem('accessToken');

    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append('file' + index, file);
    });
    formData.append('orderId', orderdetail.id);

    axios
      .post(`${process.env.REACT_APP_API_URL}/upload/result`, formData, {
        headers: {
          Authorization: accessToken,
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => {
        dispatch(getOrderResult(orderdetail.id));
        enqueueSnackbar('Login success', {
          variant: 'success',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
      })
      .catch((error) => {
      });
  };

  return (
    <Card sx={{ mb: 3, ...sx }} >
      <CardContent>
        <UploadMultiFile value={files} onChange={setFiles} onSubmit={onSubmit} uploadButtonDisable={false}/>
      </CardContent>
    </Card>
  );
}
