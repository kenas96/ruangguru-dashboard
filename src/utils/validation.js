export const inputMinTitle = (rule, value, callback) => {
  if (value.length < 7 && value !== '') {
    callback('minimum character 7');
  }
  callback();
};

export const inputMinDescription = (rule, value, callback) => {
  if (value.length < 7 && value !== '') {
    callback('minimum character 7');
  }
  callback();
};

export const inputMinButtonName = (rule, value, callback) => {
  if (value.length < 7 && value !== '') {
    callback('minimum character 7');
  }
  callback();
};

export const inputMaxTitle = (rule, value = '', callback) => {
  if (value.length > 25) {
    callback('maximum character 25');
  }
  callback();
};

export const inputMaxDescription = (rule, value = '', callback) => {
  if (value.length > 40) {
    callback('maximum character 40');
  }
  callback();
};

export const inputMaxButtonName = (rule, value = '', callback) => {
  if (value.length > 10) {
    callback('maximum character 10');
  }
  callback();
};

export const validationString = (rule, value, callback) => {
  const regex = /[0-9]/gi;
  if (value.match(regex)) {
    callback('must be string');
  }
  callback();
};
