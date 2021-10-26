import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import filePdfFilled from '@iconify/icons-ant-design/file-pdf-filled';
// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { Box, Link, Card, CardHeader, CardContent, makeStyles } from '@material-ui/core';
import { saveAs } from 'file-saver';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getOrderAttach } from 'src/redux/slices/order';
// ----------------------------------------------------------------------

const IconStyle = styled(Icon)(({ theme }) => ({
  width: 20,
  height: 20,
  marginTop: 1,
  flexShrink: 0,
  marginRight: theme.spacing(2)
}));


const useStyles = makeStyles((theme) => ({
  link: {
    cursor: "pointer"
  }
}));

// ----------------------------------------------------------------------

TaskResult.propTypes = {
  orderresult: PropTypes.any,
  orderid: PropTypes.any
};

export default function TaskResult({ orderresult, orderid, ...other }) {
  const icon = <IconStyle icon={filePdfFilled} color="#006097" />;
  const classes = useStyles();
  const dispatch = useDispatch();
  const downloadResult = (name, path) => {
    saveAs(path, name);
  }

  const { orderattach } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getOrderAttach(orderid));
  }, [dispatch, orderid]);

  return (
    <Card {...other} sx={{ mb: 3 }}>
      <CardHeader title="Order Attachment" />
      <CardContent>
        {orderattach.length == 0 ? "There is no order attachment.": ""}
        {orderattach.map((link, index) => {
          const downPath = process.env.REACT_APP_API_URL + "/" + link.filepath;
          return (
            <Box
              key={index}
              sx={{
                display: 'flex',
                '&:not(:first-child)': { mt: 2 }
              }}
            >
              {icon}
              <Link
                variant="body2"
                color="text.primary"
                onClick={() => downloadResult(link.filename, downPath)}
                className={classes.link}
                noWrap
              >
                {link.filename}
              </Link>
            </Box>
          );
        })}
      </CardContent>
    </Card>
  );
}
