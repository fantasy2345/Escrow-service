import * as Yup from 'yup';
import { useState, forwardRef, useImperativeHandle } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
// material
import { Grid, TextField } from '@material-ui/core';
import { QuillEditor } from 'src/components/editor';
import {
  UploadMultiFile
} from 'src/components/upload';

// ----------------------------------------------------------------------

function extend(target) {
  var sources = [].slice.call(arguments, 1);
  sources.forEach(function (source) {
    for (var prop in source) {
      target[prop] = source[prop];
    }
  });
  return target;
}

function getOrderDetailParam() {
  return extend({}, {});
}

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
  }
}));

const OrderDetail = forwardRef((props, ref) => {
  const { getOrderParam,param } = props;
  const classes = useStyles();

  const [description, setDescription] = useState(param.description == null? '': param.description);


  useImperativeHandle(
    ref,
    () => ({
      async handleNext() {
        handleSubmit();
        return await formik.validateForm();
      }
    }),
    []
  );

  const LoginSchema = Yup.object().shape({
    topic: Yup.string().required('Topic is required')
  });

  const formik = useFormik({
    initialValues: {
      topic: param.topic == null? '': param.topic
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, { setErrors, setSubmitting, resetForm }) => {
      try {
        getOrderParam(
          Object.assign(values, {
            description: description,
            files: files
          })
        );
      } catch (error) {
        console.error(error);
        resetForm();
      }
    }
  });

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  const [files, setFiles] = useState(param.files == null? []: param.files);
  const onSubmit = () => {
    alert("A")
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <TextField
              fullWidth
              type={'text'}
              label="Topic"
              {...getFieldProps('topic')}
              error={Boolean(touched.topic && errors.topic)}
              helperText={touched.topic && errors.topic}
              sx={{ mb: 3 }}
              md={2}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <QuillEditor
              simple
              id="simple-editor"
              value={description}
              onChange={(value) => setDescription(value)}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <UploadMultiFile
              value={files}
              onChange={setFiles}
              onSubmit={onSubmit}
              uploadButtonDisable
            />
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
})

OrderDetail.propTypes = {
  getOrderParam: PropTypes.func,
  param: PropTypes.any,
};

export default OrderDetail;
