import axios from "axios";

export const getCategoryType = () => {
  const user = JSON.parse(window.localStorage.getItem("user"));
  const { access_token } = user.token;
  const URL = `${process.env.REACT_APP_SERVER_API}qredit/v1/lender/list/qredit`;
  const options = {
    headers: {
      Authorization: "Bearer " + access_token
    }
  };
  return new Promise((resolve, reject) => {
    axios
      .get(URL, options)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(new Error("Something wrong!"));
      });
  });
};

export const getCompany = categoryType => {
  const user = JSON.parse(window.localStorage.getItem("user"));
  const { access_token } = user.token;
  const URL = `${process.env.REACT_APP_SERVER_API}qredit/v1/lender/list/${categoryType}`;
  const options = {
    headers: {
      Authorization: "Bearer " + access_token
    }
  };
  return new Promise((resolve, reject) => {
    axios
      .get(URL, options)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(new Error("Something wrong!"));
      });
  });
};
