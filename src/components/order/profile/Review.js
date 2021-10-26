import PropTypes from 'prop-types';
// material
//
import ReviewPostInput from './ReviewPostInput';
import {
  Grid,
  makeStyles
} from '@material-ui/core';

// ----------------------------------------------------------------------

Review.propTypes = {
  orderresult: PropTypes.any,
  orderdetail: PropTypes.any
};

const useStyles = makeStyles((theme) => ({
  Upload: {
    marginTop: '10rem',
  }
}));

export default function Review({ orderresult, orderdetail }) {

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <ReviewPostInput orderdetail={orderdetail} />
      </Grid>
    </Grid>
  );
}
