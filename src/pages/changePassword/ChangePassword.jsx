import React from "react";
import { Spin, Form, Icon, Input, Button, Row, Col } from "antd";
import get from "lodash/get";

import axios from "../../utils/axios";
import { formItemLayout, btn } from "../../styles/component/formVariable";
import Color from "../../utils/color";
import Notification from "../../components/notifications/notifications";

const FormItem = Form.Item;

class ChangePassword extends React.Component {
  state = {
    loadingPage: true,
    loading: false,
    passwordOldVisibility: false,
    passwordNewVisibility: false,
    passwordConfVisibility: false
  };

  componentDidMount() {
    // To disabled submit button at the beginning.
    const {
      form: { validateFields }
    } = this.props;
    validateFields();
    this.setLoading(false);
  }

  setLoading(status) {
    setTimeout(() => {
      this.setState({ loadingPage: status });
    }, 1000);
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.setState({
      loading: true
    });
    const {
      form: { validateFields },
      history
    } = this.props;
    const user = JSON.parse(window.localStorage.getItem("user"));
    const { token, info } = user;
    const apiPath = `${process.env.REACT_APP_SERVER_API}qredit/v1/user/change-password`;

    validateFields((err, values) => {
      if (!err) {
        const payload = {
          username: info.name,
          oldPassword: values.currentPassword,
          newPassword: values.password,
          userId: info.sub
        };
        axios({
          method: "post",
          url: apiPath,
          data: payload,
          headers: { Authorization: "Bearer " + token.access_token }
        })
          .then(() => {
            console.log("ok");
            this.setState({ loading: false });
            Notification("success", "Password Successfuly Changed");
            history.push("/");
          })
          .catch(error => {
            this.setState({ loading: false });
            const errMsg = get(error, "response.data.errors.message", null);
            if (errMsg.error.error === "invalid_grant") {
              Notification("warning", "Your current password incorrect");
            } else {
              Notification("error", errMsg.error.error.error_description);
            }
          });
      } else {
        this.setState({ loading: false });
        Notification("error", "Please complete the fields");
      }
    });
  };

  viewPassTogglePass = e => {
    const { [e.target.id]: currValue } = this.state;
    this.setState({
      [e.target.id]: !currValue
    });
  };

  enterLoading = () => {
    this.setState({
      loading: true
    });
  };

  hasErrors = fieldsError => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  };

  getErrorField = fieldName => {
    const {
      form: { isFieldTouched, getFieldError }
    } = this.props;
    return isFieldTouched(fieldName) && getFieldError(fieldName);
  };

  checkPassword = (rule, value, callback) => {
    const {
      form: { getFieldValue }
    } = this.props;
    if (value && value !== getFieldValue("password")) {
      callback(" Password missmatch!");
    } else {
      callback();
    }
  };

  render() {
    const {
      form: { getFieldsError, getFieldDecorator }
    } = this.props;
    const {
      passwordOldVisibility,
      passwordNewVisibility,
      passwordConfVisibility,
      loadingPage,
      loading
    } = this.state;

    const loadingView = (
      <div>
        <center>
          <Spin />
        </center>
      </div>
    );

    const view = (
      <div>
        <div>
          <h3 className="isoBoxTitle">Change Password</h3>
        </div>
        <Form onSubmit={this.handleSubmit}>
          <Row gutter={16}>
            <Col span={4}></Col>
            <Col span={16}>
              <FormItem
                validateStatus={
                  this.getErrorField("currentPassword") ? "error" : ""
                }
                help={this.getErrorField("currentPassword") || ""}
                label="Current Password"
                {...formItemLayout}
              >
                {getFieldDecorator("currentPassword", {
                  rules: [
                    {
                      required: true,
                      message: "Please input current password!"
                    },
                    {
                      min: 8,
                      message: "Minimum 8 characters!"
                    },
                    {
                      max: 12,
                      message: "Maximum 12 characters!"
                    }
                  ]
                })(
                  <Input
                    name="currentPassword"
                    prefix={
                      <Icon
                        type="lock"
                        style={{ color: Color.BLACK_TRANSPARENT }}
                      />
                    }
                    type={passwordOldVisibility ? "text" : "password"}
                    placeholder="Current Password"
                    addonAfter={
                      <Icon
                        id="passwordOldVisibility"
                        type="eye"
                        onClick={this.viewPassTogglePass}
                        style={{ cursor: "pointer" }}
                      />
                    }
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={4}></Col>
            <Col span={16}>
              <FormItem
                validateStatus={this.getErrorField("password") ? "error" : ""}
                help={this.getErrorField("password") || ""}
                label="New Password"
                {...formItemLayout}
              >
                {getFieldDecorator("password", {
                  rules: [
                    {
                      required: true,
                      message: "Please input new Password!"
                    },
                    {
                      min: 8,
                      message: "Minimum 8 characters!"
                    },
                    {
                      max: 12,
                      message: "Maximum 12 characters!"
                    }
                  ]
                })(
                  <Input
                    name="passwordNew"
                    onChange={this.handleChange}
                    prefix={
                      <Icon
                        type="lock"
                        style={{ color: Color.BLACK_TRANSPARENT }}
                      />
                    }
                    type={passwordNewVisibility ? "text" : "password"}
                    placeholder="New Password"
                    addonAfter={
                      <Icon
                        id="passwordNewVisibility"
                        type="eye"
                        onClick={this.viewPassTogglePass}
                        style={{ cursor: "pointer" }}
                      />
                    }
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={4}></Col>
            <Col span={16}>
              <FormItem
                validateStatus={
                  this.getErrorField("passwordConfirmation") ? "error" : ""
                }
                help={this.getErrorField("passwordConfirmation") || ""}
                label="Confirm Password"
                {...formItemLayout}
              >
                {getFieldDecorator("passwordConfirmation", {
                  rules: [
                    {
                      required: true,
                      message: "Please input Password confirmation!"
                    },
                    {
                      validator: this.checkPassword
                    }
                  ]
                })(
                  <Input
                    name="passwordConfirm"
                    onChange={this.handleChange}
                    prefix={
                      <Icon
                        type="lock"
                        style={{ color: Color.BLACK_TRANSPARENT }}
                      />
                    }
                    type={passwordConfVisibility ? "text" : "password"}
                    placeholder="Comfirm Password"
                    addonAfter={
                      <Icon
                        id="passwordConfVisibility"
                        type="eye"
                        onClick={this.viewPassTogglePass}
                        style={{ cursor: "pointer" }}
                      />
                    }
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={5}></Col>
            <Col span={16}>
              <FormItem {...btn}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  onClick={this.enterLoading}
                  disabled={this.hasErrors(getFieldsError())}
                  className="update-form-button"
                >
                  SAVE
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    );

    return <div>{loadingPage ? loadingView : view}</div>;
  }
}

const WrappedChangePasswordForm = Form.create()(ChangePassword);

export default WrappedChangePasswordForm;
