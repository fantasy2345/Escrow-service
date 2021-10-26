import { useState, useRef } from 'react';
// material
import {
  Box,
  Step,
  Paper,
  Button,
  Stepper,
  StepLabel,
  Typography
} from '@material-ui/core';
import axios from 'axios';
import OrderDetail from './OrderDetail';
import Wallet from './Wallet';
import useAuth from 'src/hooks/useAuth';
import { useSnackbar } from 'notistack';
import { Icon } from '@iconify/react';
import closeFill from '@iconify/icons-eva/close-fill';

import { useHistory } from 'react-router-dom';
import { MIconButton } from 'src/components/@material-extend';
import { LoadingButton } from '@material-ui/lab';
// ----------------------------------------------------------------------

const steps = ['Order detail', 'Payment'];

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
  value = Math[type](+(value[0] + 'e' + (value[1] ? +value[1] - exp : -exp)));
  // Shift back
  value = value.toString().split('e');
  return +(value[0] + 'e' + (value[1] ? +value[1] + exp : exp));
};

export default function OrderStepper() {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [param, setParam] = useState({});
  const [skipped, setSkipped] = useState(new Set());
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const orderWalletRef = useRef();
  const orderDetailRef = useRef();

  const isStepOptional = (step) => step === 10;

  const isStepSkipped = (step) => skipped.has(step);

  const getOrderParam = (json) => {
    setParam(Object.assign(param, json));
  };

  const handleNext = () => {
    let newSkipped = skipped;
    switch (activeStep) {
      case 0:
        orderDetailRef.current.handleNext().then((errors) => {
          if (Object.keys(errors).length == 0) {
            if (isStepSkipped(activeStep)) {
              newSkipped = new Set(newSkipped.values());
              newSkipped.delete(activeStep);
            }

            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            setSkipped(newSkipped);
            return true;
          } else {
            return false;
          }
        });
        break;
      case 1:
        setLoading(true);
        orderWalletRef.current
          .handleNext()
          .then((errors) => {
            if (Object.keys(errors).length == 0) {
              if (orderWalletRef.current.connectWallet()) {
                setParam(Object.assign(param, { client_email: user.email }));
                const accessToken = window.localStorage.getItem('accessToken');

                const formData = new FormData();
                param.files.forEach((file, index) => {
                  formData.append('file' + index, file);
                });
                formData.append('description', param.description);
                formData.append('topic', param.topic);
                formData.append('price', param.price);
                formData.append('sellerEmail', param.sellerEmail);
                formData.append('buyerEmail', user.email);
                formData.append('client_name', user.displayName);
                formData.append('client_avatar', user.photoURL);

                axios
                  .post(
                    `${process.env.REACT_APP_API_URL}/order/create`,
                    formData,
                    {
                      headers: {
                        Authorization: accessToken,
                        'Content-Type': 'multipart/form-data'
                      }
                    }
                  )
                  .then((response) => {
                    console.log("response", response)
                    orderWalletRef.current.deposit(response.data.data)
                  })
                  .catch(() => {
                    setLoading(false);
                  });
              } else {
                enqueueSnackbar('Please deposit the funds to the site.', {
                  variant: 'info',
                  action: (key) => (
                    <MIconButton
                      size="small"
                      onClick={() => closeSnackbar(key)}
                    >
                      <Icon icon={closeFill} />
                    </MIconButton>
                  )
                });
                setLoading(false);
                return false;
              }
              return true;
            } else {
              setLoading(false);
              return false;
            }
          })
          .catch(() => {
            setLoading(false);
          });
        break;
      default:
        break;
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <OrderDetail
            ref={orderDetailRef}
            getOrderParam={getOrderParam}
            param={param}
          />
        );
      case 1:
        return (
          <Wallet
            ref={orderWalletRef}
            getOrderParam={getOrderParam}
            closeLoading={() => {setLoading(false)}}
            param={param}
          />
        );
      default:
        return 'Unknown step';
    }
  }

  return (
    <>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <>
          <Paper sx={{ p: 3, my: 3, minHeight: 120, bgcolor: 'grey.50012' }}>
            <Typography sx={{ my: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
          </Paper>

          <Box sx={{ display: 'flex' }}>
            <Box sx={{ flexGrow: 1 }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </>
      ) : (
        <>
          <Paper sx={{ p: 3, my: 3, minHeight: 120, bgcolor: 'grey.50012' }}>
            {getStepContent(activeStep)}
          </Paper>

          <Box sx={{ display: 'flex' }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flexGrow: 1 }} />
            {activeStep !== steps.length - 1 && (
              <Button variant="contained" onClick={handleNext}>
                Next
              </Button>
            )}
            {activeStep === steps.length - 1 && (
              <LoadingButton
                variant="contained"
                pending={loading}
                onClick={handleNext}
              >
                Finish
              </LoadingButton>
            )}
          </Box>
        </>
      )}
    </>
  );
}
