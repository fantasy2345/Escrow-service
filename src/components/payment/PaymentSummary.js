import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import shieldFill from '@iconify/icons-eva/shield-fill';
// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { Box, Switch, Divider, Typography } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
//
import Label from '../Label';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
  [theme.breakpoints.up('md')]: {
    height: 'calc(100% - 16px)',
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(5),
    borderRadius: theme.shape.borderRadiusMd,
    backgroundColor:
      theme.palette.grey[theme.palette.mode === 'light' ? 200 : 700]
  },
  [theme.breakpoints.up('lg')]: {
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5)
  }
}));

const RowStyles = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(2.5)
}));

// ----------------------------------------------------------------------

PaymentSummary.propTypes = {
  price: PropTypes.any,
  formik: PropTypes.object
};

export default function PaymentSummary({ price, formik }) {
  const {  isSubmitting } = formik;
  return (
    <RootStyle>
      <Typography variant="subtitle1" sx={{ mb: 5 }}>
        Summary
      </Typography>

      <Box sx={{ mb: 2.5, display: 'flex', justifyContent: 'flex-end' }}>
        <Typography sx={{ color: 'text.secondary' }}>$</Typography>
        <Typography variant="h2" sx={{ mx: 1 }}>
          {price}
        </Typography>
      </Box>

      <Divider sx={{ borderStyle: 'dashed', mb: 1 }} />

      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        * Plus applicable taxes
      </Typography>

      <Box sx={{ mt: 5, mb: 3 }}>
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          pending={isSubmitting}
        >
          Pay
        </LoadingButton>
      </Box>

      <Box sx={{ textAlign: 'center' }}>
        <Typography
          variant="subtitle2"
          sx={{
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box
            component={Icon}
            icon={shieldFill}
            sx={{ width: 20, height: 20, mr: 1, color: 'primary.main' }}
          />
          Secure credit card payment
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          This is a secure 128-bit SSL encrypted payment
        </Typography>
      </Box>
    </RootStyle>
  );
}
