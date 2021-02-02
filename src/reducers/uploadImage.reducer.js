import { uploadImage } from '../actions';

const initialState = {
  loadingUploadImage: false,
  dataUploadImage: null,
  errorUploadImage: null
};

const uploadImages = (state = initialState, action) => {
  const { uploadImageTypes } = uploadImage;
  switch (action.type) {
    case uploadImageTypes.UPLOAD_IMAGE_REQUEST: {
      return {
        ...state,
        loadingUploadImage: true
      };
    }
    case uploadImageTypes.UPLOAD_IMAGE_SUCCESS: {
      return {
        ...state,
        loadingUploadImage: false,
        dataUploadImage: action.payload
      };
    }
    case uploadImageTypes.UPLOAD_IMAGE_ERROR: {
      return {
        ...state,
        loadingUploadImage: false,
        errorUploadImage: action.error
      };
    }
    case uploadImageTypes.UPLOAD_IMAGE_RESET: {
      return {
        ...state,
        loadingUploadImage: false,
        dataUploadImage: null,
        errorUploadImage: null
      };
    }
    default: {
      return state;
    }
  }
};

export default uploadImages;
