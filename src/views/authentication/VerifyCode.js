import { Icon } from '@iconify/react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { Box, Button, Link, Container, Typography } from '@material-ui/core';
// routes
import { PATH_AUTH } from '../../routes/paths';

import { useSnackbar } from 'notistack';
// components
import Page from '../../components/Page';
import Logo from '../../components/Logo';
import { VerifyCodeForm } from '../../components/authentication/verify-code';
import axios from 'axios';
// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  padding: theme.spacing(12, 0)
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  left: 0,
  width: '100%',
  position: 'absolute',
  padding: theme.spacing(3),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(5)
  }
}));

// ----------------------------------------------------------------------

export default function VerifyCode() {
  const { email } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const resendCode = () => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/setup/send/verify/code`, {
        email: email
      })
      .then((response) => {
        enqueueSnackbar('Sent the verify code', { variant: 'success' });
      })
      .catch((err) => {
        enqueueSnackbar('Something went wrong!', { variant: 'error' });
      });
  };

  return (
    <RootStyle title="Verify | Minimal UI">
      <HeaderStyle>
        <RouterLink to="/">
          <Logo />
        </RouterLink>
      </HeaderStyle>

      <Container>
        <Box sx={{ maxWidth: 480, mx: 'auto' }}>
          <Button
            size="small"
            component={RouterLink}
            to={PATH_AUTH.login}
            startIcon={<Icon icon={arrowIosBackFill} width={20} height={20} />}
            sx={{ mb: 3 }}
          >
            Back
          </Button>

          <Typography variant="h3" gutterBottom>
            Please check your email!
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            We have emailed a 6-digit confirmation code to acb@domain, please
            enter the code in below box to verify your email.
          </Typography>

          <Box sx={{ mt: 5, mb: 3 }}>
            <VerifyCodeForm email={email} />
          </Box>

          <Typography variant="body2" align="center">
            Don’t have a code? &nbsp;
            <Link variant="subtitle2" underline="none" onClick={resendCode}>
              Resend code
            </Link>
          </Typography>
        </Box>
      </Container>
    </RootStyle>
  );
}
