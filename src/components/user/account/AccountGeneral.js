import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import {
  Box,
  Grid,
  Card,
  Switch,
  TextField,
  CardContent,
  FormControlLabel
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
import { UploadAvatar } from '../../upload';
//
import countries from './countries';
import { useEffect } from 'react';
import Web3 from 'web3';
import escrowABI from 'src/views/neworder/escrowABI';
import { useState } from 'react';
// ----------------------------------------------------------------------

export default function AccountGeneral() {
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar } = useSnackbar();
  const { user, updateProfile } = useAuth();
  const [userAccount, setUserAccount] = useState('');

  const UpdateUserSchema = Yup.object().shape({
    displayName: Yup.string().required('Name is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      displayName: user.displayName,
      email: user.email,
      walletAddress: user.walletAddress == undefined ? '' : user.walletAddress,
      country: user.country == undefined ? '' : user.country,
      photoURL: user.photoURL
    },

    validationSchema: UpdateUserSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        await updateProfile({ ...values });

        enqueueSnackbar('Update success', { variant: 'success' });
        if (isMountedRef.current) {
          setSubmitting(false);
        }
      } catch (error) {
        if (isMountedRef.current) {
          setErrors({ afterSubmit: error.code });
          setSubmitting(false);
        }
      }
    }
  });

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleSubmit,
    getFieldProps,
    setFieldValue
  } = formik;

  const [loadingWithdraw, setLoadingWithdraw] = useState(false);

  useEffect(async () => {
    if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      try {
        // ask user for permission
        await ethereum.enable();
        // user approved permission
      } catch (error) {
        // user rejected permission
        console.log('user rejected permission');
      }
    } else if (window.web3) {
      window.web3 = new Web3(web3.currentProvider);
      // no need to ask for permission
    } else {
      enqueueSnackbar('Please install the metamask.', {
        variant: 'error',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
      history.push('/dashboard/useraccount');
      return;
    }

    setInterval(function () {
      // Check if account has changed
      web3.eth.getAccounts(function (err, accounts) {
        if (err != null) {
          enqueueSnackbar('Error retrieving accounts.', { variant: 'error' });
          return;
        }
        if (accounts.length == 0) {
          enqueueSnackbar(
            'No account found! Make sure the Ethereum client is configured properly.',
            { variant: 'error' }
          );
          return;
        }
        const temp = accounts[0];
        setUserAccount(temp);
        web3.eth.defaultAccount = temp;
      });
    }, 100);
  }, []);

  const onWithdrawFunds = () => {
    setLoadingWithdraw(true);
    //***********************/
    let escrowAddress = '0x2869351090e3A85d18a09B348c86FFf32FeF9749';
    const escrowIns = new web3.eth.Contract(escrowABI, escrowAddress);

    try {
      // escrowIns.methods
      // .transferOwnership("0xE044ac9691fa801D7794db48b5A062c7Fb23D297")
      // .send({
      //   from: userAccount
      // })
      // .on('receipt', function (receipt) {
      //   console.log('receipt', receipt);
      //   enqueueSnackbar('Successfully withdrawed to your address.', {
      //     variant: 'success'
      //   });
      //   setLoadingWithdraw(false);
      // })
      // .on('error', function (error) {
      //   console.log(error);
      //   enqueueSnackbar('Failed for withdraw.', { variant: 'error' });
      //   setLoadingWithdraw(false);
      // });
      escrowIns.methods
        .withdraw()
        .send({
          from: userAccount
        })
        .on('receipt', function (receipt) {
          console.log('receipt', receipt);
          enqueueSnackbar('Successfully withdrawed to your address.', {
            variant: 'success'
          });
          setLoadingWithdraw(false);
        })
        .on('error', function (error) {
          console.log(error);
          enqueueSnackbar('Failed for withdraw.', { variant: 'error' });
          setLoadingWithdraw(false);
        });
    } catch (e) {
      setLoadingWithdraw(false);
      enqueueSnackbar('Failed for withdraw.', { variant: 'error' });
      console.log('e', e);
    }
    //***********************/
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <Box
                sx={{
                  my: 10,
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column'
                }}
              >
                <UploadAvatar
                  value={values.photoURL}
                  onChange={(value) => {
                    setFieldValue('photoURL', value);
                  }}
                />
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      disabled={user.email === 'nikola.pavlovicn@gmail.com'} // You can remove this
                      fullWidth
                      label="Name"
                      {...getFieldProps('displayName')}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      disabled
                      label="Email Address"
                      {...getFieldProps('email')}
                    />
                  </Grid>

                  {user.role !== 0 && (
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Wallet Address"
                        fullWidth
                        {...getFieldProps('walletAddress')}
                      />
                    </Grid>
                  )}

                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      label="Country"
                      placeholder="Country"
                      {...getFieldProps('country')}
                      SelectProps={{ native: true }}
                      error={Boolean(touched.country && errors.country)}
                      helperText={touched.country && errors.country}
                    >
                      <option value="" />
                      {countries.map((option) => (
                        <option key={option.code} value={option.label}>
                          {option.label}
                        </option>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
                <Box
                  sx={{
                    mt: 3,
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}
                >
                  {(user.role === 0) &&
                  (
                    <LoadingButton
                      variant="contained"
                      pending={loadingWithdraw}
                      onClick={onWithdrawFunds}
                    >
                      Withdraw Funds
                    </LoadingButton>
                  )}
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    pending={isSubmitting}
                  >
                    Save Changes
                  </LoadingButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
