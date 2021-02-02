import axios from 'axios';
import config from '../../config';
import Notification from '../components/notifications/notifications';

const uploadImageTypes = {
  UPLOAD_IMAGE_REQUEST: 'UPLOAD_IMAGE_REQUEST',
  UPLOAD_IMAGE_SUCCESS: 'UPLOAD_IMAGE_SUCCESS',
  UPLOAD_IMAGE_ERROR: 'UPLOAD_IMAGE_ERROR',
  UPLOAD_IMAGE_RESET: 'UPLOAD_IMAGE_RESET'
};

const uploadImage = {
  requestUpload: () => ({
    type: uploadImageTypes.UPLOAD_IMAGE_REQUEST
  }),
  successUpload: payload => ({
    type: uploadImageTypes.UPLOAD_IMAGE_SUCCESS,
    payload
  }),
  errorUpload: error => ({
    type: uploadImageTypes.UPLOAD_IMAGE_ERROR,
    error
  }),
  resetUpload: () => ({
    type: uploadImageTypes.UPLOAD_IMAGE_RESET
  })
};

const fetchUploadImage = (fileImage) => {
  return (dispatch) => {
    dispatch(uploadImage.requestUpload());

    const formData = new FormData();
    formData.append('image', fileImage);
    formData.append('imageName', 'inbox_image');

    const options = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };

    axios.post(`${config.apiUrl}utils/upload`, formData, options)
      .then(({ data }) => {
        const imageUrl = `${data.baseUrl}/${data.imageName}`;
        dispatch(uploadImage.successUpload(imageUrl));
        Notification('success', 'Upload image success');
      })
      .catch((err) => {
        dispatch(uploadImage.errorUpload(err));
        Notification('error', 'Upload image failed! Try again.');
      });
  };
};

const resetUploadImage = () => {
  return (dispatch) => {
    dispatch(uploadImage.resetUpload());
  };
};

const upload = {
  uploadImageTypes,
  fetchUploadImage,
  resetUploadImage
};

export default upload;
