import * as Yup from 'yup';

import { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { useHistory } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { Box, OutlinedInput, FormHelperText } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

import PropTypes from 'prop-types';
import axios from 'axios';

// ----------------------------------------------------------------------

// eslint-disable-next-line consistent-return
function maxLength(object) {
  if (object.target.value.length > object.target.maxLength) {
    return (object.target.value = object.target.value.slice(
      0,
      object.target.maxLength
    ));
  }
}

VerifyCodeForm.propTypes = {
  email: PropTypes.string
};

export default function VerifyCodeForm(props) {
  const { email } = props;
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  const VerifyCodeSchema = Yup.object().shape({
    code1: Yup.number().required('Code is required'),
    code2: Yup.number().required('Code is required'),
    code3: Yup.number().required('Code is required'),
    code4: Yup.number().required('Code is required'),
    code5: Yup.number().required('Code is required'),
    code6: Yup.number().required('Code is required')
  });

  const formik = useFormik({
    initialValues: {
      code1: '',
      code2: '',
      code3: '',
      code4: '',
      code5: '',
      code6: ''
    },
    validationSchema: VerifyCodeSchema,
    onSubmit: async (values) => {
      const verifyCode =
        values.code1.toString() +
        values.code2.toString() +
        values.code3.toString() +
        values.code4.toString() +
        values.code5.toString() +
        values.code6.toString();
      try {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/setup/verify`, {
            email: email,
            verifyCode: verifyCode
          }
        );

        enqueueSnackbar('Verify success', { variant: 'success' });
        history.push(PATH_DASHBOARD.root);
      } catch (error) {
        enqueueSnackbar('Verify failed', { variant: 'error' });
      }
    }
  });

  const {
    values,
    errors,
    isValid,
    touched,
    isSubmitting,
    handleSubmit,
    getFieldProps
  } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          {Object.keys(values).map((item) => (
            <Box key={item} sx={{ mx: 1 }}>
              <OutlinedInput
                {...getFieldProps(item)}
                type="number"
                placeholder="-"
                onInput={maxLength}
                error={Boolean(touched[item] && errors[item])}
                inputProps={{
                  maxLength: 1,
                  sx: {
                    padding: 0,
                    textAlign: 'center',
                    width: { xs: 36, sm: 56 },
                    height: { xs: 36, sm: 56 }
                  }
                }}
              />
            </Box>
          ))}
        </Box>

        <FormHelperText error={!isValid} style={{ textAlign: 'right' }}>
          {!isValid && 'Code is required'}
        </FormHelperText>

        <Box sx={{ mt: 3 }}>
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            pending={isSubmitting}
          >
            Verify
          </LoadingButton>
        </Box>
      </Form>
    </FormikProvider>
  );
}
