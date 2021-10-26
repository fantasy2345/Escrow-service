import * as Yup from 'yup';
import { useState, forwardRef, useImperativeHandle } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { MIconButton } from 'src/components/@material-extend';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import closeFill from '@iconify/icons-eva/close-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import Web3 from 'web3';
import escrowABI from './escrowABI';
// material
import {
  Box,
  RadioGroup,
  Radio,
  FormControlLabel,
  Grid,
  InputAdornment,
  TextField
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
// ----------------------------------------------------------------------

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '100%'
  },
  lineSpacing: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '40%'
  },
  walletConnectBtn: {
    display: 'flex',
    justifyContent: 'center'
  },
  option: {
    display: 'flex',
    justifyContent: 'space-evenly'
  }
}));

const Wallet = forwardRef((props, ref) => {
  const { getOrderParam, closeLoading, param } = props;
  const classes = useStyles();
  const [wallet, setWallet] = useState(false);
  const [isloading, setSetLoading] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const history = useHistory();
  const [userAccount, setUserAccount] = useState('');
  const [sellerAccount, setSellerAccount] = useState('');
  const [escrowInstance, setEscrowInstance] = useState(null);

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
    let escrowAddress = '0x2869351090e3A85d18a09B348c86FFf32FeF9749';
    setEscrowInstance(new web3.eth.Contract(escrowABI, escrowAddress));

    setInterval(function () {
      // Check if account has changed
      web3.eth.getAccounts(function (err, accounts) {
        if (err != null) {
          alert('Error retrieving accounts.');
          return;
        }
        if (accounts.length == 0) {
          alert(
            'No account found! Make sure the Ethereum client is configured properly.'
          );
          return;
        }
        const temp = accounts[0];
        setUserAccount(temp);
        web3.eth.defaultAccount = temp;
      });
    }, 100);
  }, []);

  const decimalAdjust = (type, value, exp) => {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }

  useImperativeHandle(ref, () => ({
    async handleNext() {
      handleSubmit();
      return await formik.validateForm();
    },
    connectWallet() {
      return wallet;
    },
    deposit(orderId) {
      /***
       * Web3JS
       * call to createOrder (smart contract)
       */
      let escrowAddress = '0x2869351090e3A85d18a09B348c86FFf32FeF9749';
      const escrowIns = new web3.eth.Contract(escrowABI, escrowAddress);
      
      let price = web3.utils.toWei(getFieldProps('price').value, 'ether')
      console.log("price", price)
      if (value !== "seller") {
        price = Math.floor(parseInt(price) * 1.05).toString()
      }

      console.log("price", price)

      try {
        escrowIns.methods
          .createOrder(
            userAccount,
            sellerAccount,
            value === 'seller' ? 0 : 1,
            web3.utils.toWei(getFieldProps('price').value, 'ether'),
            price,
            orderId
          )
          .send({
            from: userAccount,
            value: price,
          })
          .on('receipt', function (receipt) {
            console.log('receipt', receipt);
            if (receipt.status) {
              closeLoading();
              history.push('/dashboard/order/buyerorderlist');
              enqueueSnackbar('Order reserved successfully.', {
                variant: 'success',
                action: (key) => (
                  <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                    <Icon icon={closeFill} />
                  </MIconButton>
                )
              });
            } else {
              const accessToken = window.localStorage.getItem('accessToken');

              const formData = new FormData();
              formData.append('id', orderId);

              axios
                .post(
                  `${process.env.REACT_APP_API_URL}/order/delete/id`,
                  formData,
                  {
                    headers: {
                      Authorization: accessToken,
                      'Content-Type': 'multipart/form-data'
                    }
                  }
                )
                .then(() => {
                  closeLoading();
                  enqueueSnackbar('Failed to create the order.', {
                    variant: 'error',
                    action: (key) => (
                      <MIconButton
                        size="small"
                        onClick={() => closeSnackbar(key)}
                      >
                        <Icon icon={closeFill} />
                      </MIconButton>
                    )
                  });
                })
                .catch(() => {
                  closeLoading();
                  enqueueSnackbar('Failed to create the order.', {
                    variant: 'error',
                    action: (key) => (
                      <MIconButton
                        size="small"
                        onClick={() => closeSnackbar(key)}
                      >
                        <Icon icon={closeFill} />
                      </MIconButton>
                    )
                  });
                });
            }
          })
          .on('error', function (error) {
            closeLoading();
            console.log('Aerror', error.message);
          });
      } catch (e) {
        closeLoading();
        console.log('e', e);
      }
    }
  }));

  const WalletSchema = Yup.object().shape({
    price: Yup.string().required('Price is required'),
    sellerEmail: Yup.string()
      .email('Email must be a valid email address')
      .required('sellerEmail is required')
  });

  const formik = useFormik({
    initialValues: {
      price: param.price == null ? '0.0' : param.price,
      sellerEmail:
        param.sellerEmail == null ? '' : param.sellerEmail
    },
    validationSchema: WalletSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        getOrderParam(Object.assign(values));
      } catch (error) {
        console.error(error);
        resetForm();
      }
    }
  });

  const {
    errors,
    touched,
    handleSubmit,
    getFieldProps,
    setFieldValue
  } = formik;

  const onChange = (e) => {
    var rgx = /^[0-9]*\.?[0-9]*$/;
    if (e.target.value === '' || rgx.test(e.target.value)) {
      setFieldValue('price', e.target.value);
      return e.target.value;
    } else {
      console.log('xxxx');
    }
  };

  const [value, setValue] = useState('seller');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const onHandleWalletConnect = () => {
    const accessToken = window.localStorage.getItem('accessToken');

    const formData = new FormData();
    formData.append('email', getFieldProps('sellerEmail').value);
    setSetLoading(true);

    axios
      .post(`${process.env.REACT_APP_API_URL}/setup/getuser`, formData, {
        headers: {
          Authorization: accessToken,
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => {
        if (response.data.type === 'success') {
          if (
            response.data.user.walletAddress === '' ||
            response.data.user.walletAddress === null
          ) {
            enqueueSnackbar("Seller didn't input the wallet address.", {
              variant: 'error',
              action: (key) => (
                <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                  <Icon icon={closeFill} />
                </MIconButton>
              )
            });
          } else {
            setWallet(true);
            setSellerAccount(response.data.user.walletAddress);
            enqueueSnackbar('Connected to your wallet successfully.', {
              variant: 'success',
              action: (key) => (
                <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                  <Icon icon={closeFill} />
                </MIconButton>
              )
            });
          }
        } else {
          enqueueSnackbar('Seller email is not correct.', {
            variant: 'error',
            action: (key) => (
              <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} />
              </MIconButton>
            )
          });
        }
        setSetLoading(false);
      })
      .catch(() => {
        enqueueSnackbar('Seller email is not correct.', {
          variant: 'error',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
        setSetLoading(false);
      });
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={6} md={6}>
            <TextField
              fullWidth
              type={'text'}
              label="Price"
              {...getFieldProps('price')}
              error={Boolean(touched.price && errors.price)}
              helperText={touched.price && errors.price}
              onChange={onChange}
              sx={{ mb: 3 }}
              md={2}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">BNB</InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={6} md={6}>
            <TextField
              fullWidth
              type={'text'}
              label="Seller Email"
              {...getFieldProps('sellerEmail')}
              error={Boolean(touched.sellerEmail && errors.sellerEmail)}
              helperText={touched.sellerEmail && errors.sellerEmail}
              sx={{ mb: 3 }}
              md={2}
            />
          </Grid>
          <Grid item xs={12} md={12} className={classes.option}>
            <RadioGroup row value={value} onChange={handleChange}>
              <FormControlLabel
                value="seller"
                control={<Radio />}
                label="The seller pays the fee of the escrow site."
              />
              <FormControlLabel
                value="both"
                control={<Radio size="small" />}
                label="Both buyer and seller pay the fee of the escrow site."
              />
            </RadioGroup>
          </Grid>
          <Grid item xs={12} md={12} className={classes.walletConnectBtn}>
            <LoadingButton
              size="large"
              variant="contained"
              className="walletConnectBtn"
              disabled={wallet}
              onClick={() => {
                onHandleWalletConnect();
              }}
              pending={isloading}
            >
              {wallet === false ? 'Connect' : 'Connected'}
            </LoadingButton>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
});

Wallet.propTypes = {
  getOrderParam: PropTypes.func,
  closeLoading: PropTypes.func,
  param: PropTypes.any
};

export default Wallet;
