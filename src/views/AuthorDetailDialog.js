import {
  useState,
  forwardRef,
  useRef,
  useEffect,
  useImperativeHandle
} from 'react';
// material
import {
  Grid,
  Button,
  Dialog,
  Rating,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@material-ui/core';
import Block from 'src/components/Block';
// ----------------------------------------------------------------------

function AuthorDetailDialog(props, ref) {
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState('paper');
  const [reviews, setReviews] = useState([]);

  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const descriptionElementRef = useRef(null);
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  useImperativeHandle(
    ref,
    () => ({
      handleShowModal(reviews) {
        setReviews(reviews);
        setScroll('paper');
        setOpen(true);
      }
    }),
    []
  );

  return (
    <div>
      <Dialog open={open} onClose={handleClose} scroll={scroll}>
        <DialogTitle>Reviews</DialogTitle>
        <DialogContent dividers={scroll === 'paper'}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            {reviews.length == 0 && "There is no review."}
            {reviews.map((review, index) => {
              return (
                <Block
                  key={index}
                  title=""
                  sx={{ mb: 3 }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                      <Rating
                        name="hover-feedback"
                        value={review.rating}
                        precision={0.5}
                        readOnly
                      />
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <Typography variant="h4" component={'span'}>
                        {review.description}
                      </Typography>
                    </Grid>
                  </Grid>
                </Block>
              );
            })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default forwardRef(AuthorDetailDialog);
