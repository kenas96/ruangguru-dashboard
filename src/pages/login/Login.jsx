import React from "react";
import PropTypes from "prop-types";
import { Form, Icon, Input, Button } from "antd";
import { connect } from "react-redux";
import { auth } from "../../actions";
import Logo from "../../assets/image/logo.png";

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
    password: "",
    contact: "kenas.dermawan@gmail.com"
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
        email,
        password
      };
      fetchLogin(payload);
    });
  };

  contactMail = () => {
    window.location.href = "mailto:" + this.state.contact;
  };

  render() {
    const {
      form: { getFieldsError, getFieldDecorator },
      loading
    } = this.props;
    const { showPassword, contact } = this.state;

    const view = (
      <div className="isoLoginContent">
        <div className="logoWrapper">
          <img alt="logo" src={Logo} className="logo-login" />
        </div>
        <div className="titleWrapper">RUANG GURU DASHBOARD</div>
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
                      style={{ color: "rgba(0, 0, 0, 0.25)" }}
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
                      style={{ color: "rgba(0, 0, 0, 0.25)" }}
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
              Please contact <a onClick={this.contactMail}>{contact}</a>
            </FormItem>
          </Form>
        </div>
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
