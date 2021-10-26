import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { Box, Card, TextField } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
// utils
import fakeRequest from '../../../utils/fakeRequest';
import useAuth from '../../../hooks/useAuth';
import axios from 'axios';

// ----------------------------------------------------------------------

AccountChangePassword.propTypes = {
  sx: PropTypes.object
};

export default function AccountChangePassword({ sx, ...other }) {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();

  const ChangePassWordSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Old Password is required'),
    newPassword: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('New Password is required'),
    confirmNewPassword: Yup.string().oneOf(
      [Yup.ref('newPassword'), null],
      'Passwords must match'
    )
  });

  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    },
    validationSchema: ChangePassWordSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const accessToken = window.localStorage.getItem('accessToken');

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/setup/updatepassword`,
          {
            oldPassword: values.oldPassword,
            newPassword: values.newPassword,
            email : user.email,
          },
          {
            headers: { Authorization: accessToken }
          }
        );
        setSubmitting(false);
        enqueueSnackbar('Save success', { variant: 'success' });
      } catch(e) {
        enqueueSnackbar('Something went wrong.', { variant: 'error' });
      }
      
    }
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <Card sx={{ p: 3, ...sx }} {...other}>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <TextField
            {...getFieldProps('oldPassword')}
            fullWidth
            autoComplete="on"
            type="password"
            label="Old Password"
            error={Boolean(touched.oldPassword && errors.oldPassword)}
            helperText={touched.oldPassword && errors.oldPassword}
            sx={{ mb: 3 }}
          />

          <TextField
            {...getFieldProps('newPassword')}
            fullWidth
            autoComplete="on"
            type="password"
            label="New Password"
            error={Boolean(touched.newPassword && errors.newPassword)}
            helperText={
              (touched.newPassword && errors.newPassword) ||
              'Password must be minimum 6+'
            }
            sx={{ mb: 3 }}
          />

          <TextField
            {...getFieldProps('confirmNewPassword')}
            fullWidth
            autoComplete="on"
            type="password"
            label="Confirm New Password"
            error={Boolean(
              touched.confirmNewPassword && errors.confirmNewPassword
            )}
            helperText={touched.confirmNewPassword && errors.confirmNewPassword}
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <LoadingButton
              type="submit"
              variant="contained"
              pending={isSubmitting}
            >
              Save Changes
            </LoadingButton>
          </Box>
        </Form>
      </FormikProvider>
    </Card>
  );
}
