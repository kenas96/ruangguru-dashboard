import React from "react";
import { Spin, Form, Icon, Input, Button } from "antd";
import { formItemLayout, btn } from "../../styles/component/formVariable";
import Color from "../../utils/color";

const FormItem = Form.Item;

class ChangePassword extends React.Component {
  state = {
    loadingPage: true,
    loading: false,
    passwordOldVisibility: false,
    passwordNewVisibility: false,
    passwordConfVisibility: false,
    password: "",
    passwordNew: "",
    passwordConfirm: ""
  };

  componentDidMount() {
    // To disabled submit button at the beginning.
    const {
      form: { validateFields }
    } = this.props;
    validateFields();
    const { match } = this.props;
    const {
      params: { key }
    } = match;
    this.setState({ password: key });
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

  handleSubmit = e => {};

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

  render() {
    const {
      form: { getFieldsError, getFieldDecorator }
    } = this.props;
    const {
      passwordOldVisibility,
      passwordNewVisibility,
      passwordConfVisibility,
      loadingPage,
      loading,
      password
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
          <FormItem label="Current Password" {...formItemLayout}>
            <Input
              // prefix={
              //   <Icon type="lock" style={{ color: Color.BLACK_TRANSPARENT }} />
              // }
              value={password}
              disabled
              addonAfter={
                <Icon
                  id="passwordOldVisibility"
                  type="eye"
                  onClick={this.viewPassTogglePass}
                  style={{ cursor: "pointer" }}
                />
              }
            />
          </FormItem>
          <FormItem
            validateStatus={
              this.getErrorField("password current") ? "error" : ""
            }
            help={this.getErrorField("password current") || ""}
            label="New Password"
            {...formItemLayout}
          >
            {getFieldDecorator("password current", {
              rules: [{ required: true, message: "Please input new Password!" }]
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
          <FormItem
            validateStatus={
              this.getErrorField("password confirmation") ? "error" : ""
            }
            help={this.getErrorField("password confirmation") || ""}
            label="Confirm Password"
            {...formItemLayout}
          >
            {getFieldDecorator("password confirmation", {
              rules: [
                {
                  required: true,
                  message: "Please input  Password confirmation!"
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
          <FormItem {...btn}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              onClick={this.enterLoading}
              disabled={this.hasErrors(getFieldsError())}
              className="update-form-button"
            >
              Update
            </Button>
          </FormItem>
        </Form>
      </div>
    );

    return <div>{loadingPage ? loadingView : view}</div>;
  }
}

const WrappedChangePasswordForm = Form.create()(ChangePassword);

export default WrappedChangePasswordForm;
