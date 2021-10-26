import PropTypes from 'prop-types';
// material
import { Grid } from '@material-ui/core';
// utils
import AccountBillingInvoiceHistory from './AccountBillingInvoiceHistory';

// ----------------------------------------------------------------------

AccountBilling.propTypes = {
  invoices: PropTypes.array,
};

export default function AccountBilling({ invoices }) {

  return (
    <Grid container spacing={5}>
      <Grid item xs={12} md={8}>
        <AccountBillingInvoiceHistory invoices={invoices} />
      </Grid>
    </Grid>
  );
}
