import PropTypes from 'prop-types';
// material
//
import TaskAbout from './TaskAbout';
import TaskResult from './TaskResult';
import { useSnackbar } from 'notistack';
import useAuth from 'src/hooks/useAuth';
import { useState } from 'react';
import axios from 'axios';
import { Grid, Button, Box, makeStyles } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetail } from 'src/redux/slices/order';
import { useHistory } from 'react-router-dom';
import { MIconButton } from 'src/components/@material-extend';
import { Icon } from '@iconify/react';
import closeFill from '@iconify/icons-eva/close-fill';
import { LoadingButton } from '@material-ui/lab';
import { useEffect } from 'react';
import Web3 from 'web3';
import escrowABI from 'src/views/neworder/escrowABI';
// ----------------------------------------------------------------------

Task.propTypes = {
  orderresult: PropTypes.any,
  orderdetail: PropTypes.any,
  orderid: PropTypes.any
};

const useStyles = makeStyles((theme) => ({
  Upload: {
    marginTop: '10rem'
  }
}));

export default function Task(props) {
  const { orderresult, orderdetail, orderid } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const { user } = useAuth();
  const history = useHistory();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { socket } = useSelector((state) => state.notifications);
  const [loadingDispute, setLoadingDispute] = useState(false);
  const [loadingRelease, setLoadingRelease] = useState(false);
  const [loadingRefund, setLoadingRefund] = useState(false);

  const [userAccount, setUserAccount] = useState('');
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

  const onDisputeProject = () => {
    setLoadingDispute(true);
    const accessToken = window.localStorage.getItem('accessToken');
    axios
      .post(`${process.env.REACT_APP_API_URL}/order/dispute`, {
        headers: { Authorization: accessToken }
      })
      .then(() => {
        enqueueSnackbar('Successfully sent the dispute request.', {
          variant: 'success',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
        setLoadingDispute(false);
      })
      .catch((error) => {
        setLoadingDispute(false);
      });
  };

  const onCloseProject = () => {
    setLoadingRelease(true);
    //***********************/
    let escrowAddress = '0x2869351090e3A85d18a09B348c86FFf32FeF9749';
    const escrowIns = new web3.eth.Contract(escrowABI, escrowAddress);

    try {
      escrowIns.methods
        .release(orderdetail.id)
        .send({
          from: userAccount
        })
        .on('receipt', function (receipt) {
          console.log('receipt', receipt);
          const accessToken = window.localStorage.getItem('accessToken');

          axios
            .post(
              `${process.env.REACT_APP_API_URL}/order/complete`,
              {
                email: user.email,
                id: orderdetail.id,
                or_sellerEmail: orderdetail.or_sellerEmail
              },
              {
                headers: { Authorization: accessToken }
              }
            )
            .then(() => {
              socket.emit(
                'sendMessage',
                {
                  user: user.email,
                  message: `Your project, ${orderdetail.or_topic} have finished.`,
                  type: 'order_placed'
                },
                () => {}
              );
              dispatch(getOrderDetail(orderdetail.id));
              setLoadingRelease(false);
            })
            .catch((error) => {
              console.log(error);
              setLoadingRelease(false);
            });
        })
        .on('error', function (error) {
          console.log(error);
          setLoadingRelease(false);
        });
    } catch (e) {
      setLoadingRelease(false);
      console.log('e', e);
    }
    //***********************/
  };

  const onRefundProject = () => {
    setLoadingRefund(true);
    try {
      let escrowAddress = '0x2869351090e3A85d18a09B348c86FFf32FeF9749';
      const escrowIns = new web3.eth.Contract(escrowABI, escrowAddress);
      escrowIns.methods
        .refund(orderdetail.id)
        .send({
          from: userAccount
        })
        .on('receipt', function (receipt) {
          const accessToken = window.localStorage.getItem('accessToken');
          axios
            .post(
              `${process.env.REACT_APP_API_URL}/order/cancel`,
              {
                id: orderdetail.id,
                or_buyerEmail: orderdetail.or_buyerEmail,
                email: user.email,
                price: orderdetail.or_price
              },
              {
                headers: { Authorization: accessToken }
              }
            )
            .then((response) => {
              console.log(response)
              socket.emit(
                'sendMessage',
                {
                  user: user.email,
                  message: `Your project, ${orderdetail.or_topic} have canceled.`,
                  type: 'order_shipped'
                },
                () => {}
              );
              enqueueSnackbar('Successfully canceled the project.', {
                variant: 'success',
                action: (key) => (
                  <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                    <Icon icon={closeFill} />
                  </MIconButton>
                )
              });
              history.push('/dashboard/order/buyerorderlist');
              setLoadingRefund(false);
            })
            .catch((error) => {
              setLoadingRefund(false);
              console.log(error)
            });
        })
        .on('error', function (error) {
          console.log(error);
          setLoadingRefund(false);
        });
    } catch (e) {
      setLoadingRefund(false);
      console.log('e', e);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <TaskResult orderresult={orderresult} orderid={orderid} />
      </Grid>

      <Grid item xs={12} md={6}>
        <TaskAbout orderdetail={orderdetail} orderid={orderid} />
        <Box justifyContent="space-between" display="flex">
          {((user.role === 0 && orderdetail.or_status == 'pending') ||
            (user.role === 3 &&
              orderdetail.or_status == 'pending' &&
              user.email === orderdetail.or_buyerEmail)) && (
            <LoadingButton
              pending={loadingRelease}
              variant="contained"
              onClick={onCloseProject}
            >
              Release Funds
            </LoadingButton>
          )}
          {((user.role === 0 && orderdetail.or_status == 'pending') ||
            (user.role === 3 &&
              orderdetail.or_status == 'pending' &&
              user.email !== orderdetail.or_buyerEmail)) && (
            <LoadingButton
              pending={loadingRefund}
              variant="contained"
              onClick={onRefundProject}
            >
              Refund
            </LoadingButton>
          )}
          {user.role !== 0 && orderdetail.or_status == 'pending' && (
            <LoadingButton
              pending={loadingDispute}
              variant="contained"
              onClick={onDisputeProject}
            >
              Dispute
            </LoadingButton>
          )}
        </Box>
      </Grid>
    </Grid>
  );
}
