import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Form, Icon, Input, Button, Modal } from "antd";
import { connect } from "react-redux";
import Notifications from "../../components/notifications/notifications";
import { auth } from "../../actions";
import Color from "../../utils/color";
import Logo from "../../assets/image/logoboost.png";

const FormItem = Form.Item;

class Login extends React.Component {
  static propTypes = {
    form: PropTypes.instanceOf(Object),
    loading: PropTypes.bool,
    error: PropTypes.instanceOf(Object),
    fetchLogin: PropTypes.func
  };

  state = {
    isRecover: false,
    isForgot: false,
    showPassword: false,
    email: "",
    password: ""
  };

  componentDidMount() {
    const {
      form: { validateFields }
    } = this.props;
    validateFields();
  }

  viewPassToggle = () => {
    const { showPassword } = this.state;
    this.setState({
      showPassword: !showPassword
    });
  };

  forgotPasswordToogle = () => {
    const { isForgot } = this.state;
    this.setState({
      isForgot: !isForgot
    });
  };

  forgotPasswordToogleReset = () => {
    this.setState({ isForgot: false });
  };

  recoverHandle = () => {
    this.setState({ isRecover: true });
  };

  backHandle = () => {
    this.setState({ isRecover: false, isForgot: false });
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  hasErrors = fieldsError => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  };

  getErrorField = fieldName => {
    const {
      form: { isFieldTouched, getFieldError },
      error
    } = this.props;
    const validateFields =
      isFieldTouched(fieldName) && getFieldError(fieldName);
    if (fieldName === "email") {
      const validateAPI = error && "Invalid email or password";
      return validateFields || validateAPI;
    }
    return validateFields;
  };

  handleSubmit = e => {
    e.preventDefault();
    const {
      form: { validateFields },
      fetchLogin
    } = this.props;
    const { email, password } = this.state;
    validateFields(() => {
      const payload = {
        email: email.toLowerCase(),
        password
      };
      fetchLogin(payload);
    });
  };

  showNotif = () => {
    Notifications("error", "email and password did not match");
  };

  render() {
    const {
      form: { getFieldsError, getFieldDecorator },
      loading
    } = this.props;
    const { showPassword, isForgot, isRecover } = this.state;

    const view = (
      <div className="isoLoginContent">
        <div className="logoWrapper">
          <img alt="logo" src={Logo} className="logo-login" />
        </div>
        <div className="titleWrapper">BOOST QREDIT PORTAL</div>
        <div className="isoLogoWrapper">
          <Form onSubmit={this.handleSubmit} className="form-login">
            <FormItem
              validateStatus={this.getErrorField("email") ? "error" : ""}
              help={this.getErrorField("email") || ""}
            >
              {getFieldDecorator("email", {
                rules: [{ required: true, message: "Please input your Email!" }]
              })(
                <Input
                  name="email"
                  onChange={this.handleChange}
                  prefix={
                    <Icon
                      type="mail"
                      style={{ color: Color.BLACK_TRANSPARENT }}
                    />
                  }
                  placeholder="Email"
                />
              )}
            </FormItem>
            <FormItem
              validateStatus={this.getErrorField("password") ? "error" : ""}
              help={this.getErrorField("password") || ""}
            >
              {getFieldDecorator("password", {
                rules: [
                  { required: true, message: "Please input your Password!" }
                ]
              })(
                <Input
                  name="password"
                  onChange={this.handleChange}
                  prefix={
                    <Icon
                      type="lock"
                      style={{ color: Color.BLACK_TRANSPARENT }}
                    />
                  }
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  addonAfter={
                    <Icon
                      type="eye"
                      onClick={this.viewPassToggle}
                      style={{ cursor: "pointer" }}
                    />
                  }
                />
              )}
            </FormItem>
            <FormItem style={{ marginBottom: 15 }}>
              <a style={{ float: "right" }} onClick={this.forgotPasswordToogle}>
                Forgot password?
              </a>
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                className="loginButton"
                loading={loading}
                onClick={this.handleSubmit}
                disabled={this.hasErrors(getFieldsError())}
              >
                SIGN IN
              </Button>
            </FormItem>
            <FormItem style={{ textAlign: "center" }}>
              Having trouble signing in?
              <br />
              Please contact <a>customercare@myboost.id</a>
            </FormItem>
          </Form>
        </div>

        <Modal
          title="Recover Password"
          visible={isForgot}
          onCancel={this.forgotPasswordToogle}
          width="500"
          footer={null}
        >
          <div style={{ padding: "0px 55px", textAlign: "center" }}>
            <img
              alt="logo"
              src="../../assets/image/logoboost.png"
              className="logo-modal"
            />

            <div style={{ padding: "30px 0px 10px 0px", fontWeight: "bold" }}>
              {!isRecover && (
                <p>
                  {/* Please enter the email address you used to create your
                  account, and we will send you a link to reset your password. */}
                  <br />
                  <h2>Silahkan menghubungi Tech Ops.</h2>
                  <br />
                </p>
              )}
              {/* {isRecover && (
                <p>
                  Thank you. <br />A temporary password has been sent to your
                  registered email address.
                </p>
              )} */}
            </div>
            {/* {!isRecover && (
              <Form
                onSubmit={this.handleSubmit}
                style={{ padding: "10px 0px" }}
              >
                <FormItem
                  validateStatus={this.getErrorField("email") ? "error" : ""}
                  help={this.getErrorField("email") || ""}
                >
                  {getFieldDecorator("email", {
                    rules: [
                      { required: true, message: "Please input your Email!" }
                    ]
                  })(
                    <Input
                      name="email"
                      onChange={this.handleChange}
                      placeholder="Email Address"
                    />
                  )}
                </FormItem>
                <FormItem>
                  <Button
                    type="primary"
                    loading={loading}
                    onClick={this.recoverHandle}
                  >
                    RECOVER
                  </Button>
                </FormItem>
              </Form>
            )} */}
            {/* {isRecover && (
              <Button
                type="primary"
                loading={loading}
                onClick={this.backHandle}
              >
                RETURN TO LOGIN PAGE
              </Button>
            )} */}
          </div>
        </Modal>
      </div>
    );
    return <React.Fragment>{view}</React.Fragment>;
  }
}

const mapStateToProps = state => {
  const { isLogin, loading, error } = state.auth;
  return {
    isLogin,
    loading,
    error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchLogin: data => dispatch(auth.fetchLogin(data))
  };
};

const WrappedNormalLoginForm = Form.create()(Login);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WrappedNormalLoginForm);
