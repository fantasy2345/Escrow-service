import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { Link as RouterLink } from 'react-router-dom';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
// material
import { Box, Link, Button, Typography } from '@material-ui/core';
// utils
import { fDate } from '../../../utils/formatTime';
import { fCurrency } from '../../../utils/formatNumber';

// ----------------------------------------------------------------------

AccountBillingInvoiceHistory.propTypes = {
  invoices: PropTypes.array
};

export default function AccountBillingInvoiceHistory({ invoices }) {
  return (
    <>
      <Typography variant="subtitle1" sx={{ mb: 3 }}>
        Billing History
      </Typography>
      <Box
          sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}
        >
          <Typography variant="body2" sx={{ minWidth: 160 }}>
            Order ID
          </Typography>
          <Typography variant="body2" sx={{ minWidth: 160 }}>
            Date
          </Typography>
          <Typography variant="body2">Amount</Typography>
          <Typography variant="body2" sx={{ minWidth: 160 }}>
            Payer ID
          </Typography>
        </Box>
      {invoices.length == 0 && "There is no billing history."}
      {invoices.map((invoice) => (
        <Box
          key={invoice.id}
          sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}
        >
          <Typography variant="body2" sx={{ minWidth: 160 }}>
            {invoice.order_id}
          </Typography>
          <Typography variant="body2" sx={{ minWidth: 160 }}>
            {fDate(invoice.date)}
          </Typography>
          <Typography variant="body2">{fCurrency(invoice.amount)}</Typography>
          <Typography variant="body2" sx={{ minWidth: 160 }}>
            {invoice.payer_id}
          </Typography>
        </Box>
      ))}
    </>
  );
}
