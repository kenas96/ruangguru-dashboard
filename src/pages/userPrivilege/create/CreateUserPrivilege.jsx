import React from "react";
import { Spin, Form, Input, Button, Select } from "antd";
import { Link } from "react-router-dom";
import get from "lodash/get";

import axios from "../../../utils/axios";
import { formItemLayout, btn } from "../../../styles/component/formVariable";
import { Regex } from "../../../utils/Regex";
import { getAllGroup } from "../../../service/userService";
import Notification from "../../../components/notifications/notifications";

const FormItem = Form.Item;
const { Option } = Select;
let errSubmit = false;

class CreateUserPrivilege extends React.Component {
  state = {
    loadingPage: true,
    loading: false,
    group: []
  };

  componentDidMount() {
    // To disabled submit button at the beginning.
    const {
      form: { validateFields }
    } = this.props;
    validateFields();
    this.getDataGroup();
    this.setLoading(false);
  }

  getDataGroup() {
    getAllGroup()
      .then(({ data }) => {
        const group = get(data, "data", []);
        this.setState({
          group
        });
      })
      .catch(error => {
        message.error(error, 4);
      });
  }

  setLoading(status) {
    setTimeout(() => {
      this.setState({ loadingPage: status });
    }, 1000);
  }

  handleReset = () => {
    const {
      form: { resetFields }
    } = this.props;
    resetFields();
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
    const { access_token } = user.token;
    const apiPath = `${process.env.REACT_APP_SERVER_API}qredit/v1/user/add-user`;
    validateFields((err, values) => {
      if (!err) {
        const payload = {
          username: values.name,
          firstName: values.name,
          email: values.email,
          enabled: true,
          emailVerified: true,
          attributes: {
            phoneNumber: [values.phoneNumber]
          },
          groupId: values.role
        };
        axios({
          method: "post",
          url: apiPath,
          data: payload,
          headers: { Authorization: "Bearer " + access_token }
        })
          .then(() => {
            this.setState({ loading: false });
            this.handleReset();
            Notification("success", "Success create user");
            history.push("/user");
          })
          .catch(err => {
            this.setState({ loading: false });
            Notification("error", "Oops! Can't create user");
          });
      } else {
        errSubmit = true;
        this.setState({ loading: false });
        Notification("error", "Please complete the fields");
      }
    });
  };

  hasErrors = fieldsError => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  };

  getErrorField = fieldName => {
    const {
      form: { isFieldTouched, getFieldError }
    } = this.props;
    let fieldTouched = isFieldTouched(fieldName);
    if (errSubmit) {
      fieldTouched = true;
    }
    const fieldErr = getFieldError(fieldName);
    return fieldTouched && fieldErr;
  };

  render() {
    const {
      form: { getFieldDecorator }
    } = this.props;
    const { loadingPage, loading, group } = this.state;

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
          <h3 className="isoBoxTitle">Add User</h3>
        </div>
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            className="v-center"
            label="User Role"
            validateStatus={this.getErrorField("role") ? "error" : ""}
            help={this.getErrorField("role") || ""}
            {...formItemLayout}
          >
            {getFieldDecorator("role", {
              rules: [
                {
                  required: true,
                  message: "Field is required!"
                }
              ]
            })(
              <Select
                allowClear
                showSearch
                style={{ width: "100%" }}
                placeholder="Select User Role"
              >
                {group.map(data => (
                  <Option key={Math.random()} value={data.id}>
                    {data.name}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem
            className="v-center"
            validateStatus={this.getErrorField("name") ? "error" : ""}
            help={this.getErrorField("name") || ""}
            label="Name"
            {...formItemLayout}
          >
            {getFieldDecorator("name", {
              rules: [{ required: true, message: "Field is required!" }]
            })(<Input name="name" placeholder="Name" />)}
          </FormItem>
          <FormItem
            className="v-center"
            validateStatus={this.getErrorField("email") ? "error" : ""}
            help={this.getErrorField("email") || ""}
            label="Email"
            {...formItemLayout}
          >
            {getFieldDecorator("email", {
              rules: [
                {
                  required: true,
                  message: "Field is required!"
                },
                {
                  pattern: Regex.REGEX_EMAIL,
                  message: "Incorrect email format!"
                }
              ]
            })(<Input name="email" placeholder="Email" />)}
          </FormItem>
          <FormItem
            className="v-center"
            validateStatus={this.getErrorField("phoneNumber") ? "error" : ""}
            help={this.getErrorField("phoneNumber") || ""}
            label="Phone No."
            {...formItemLayout}
          >
            {getFieldDecorator("phoneNumber", {
              rules: [
                {
                  required: true,
                  message: "Field is required!"
                },
                {
                  pattern: Regex.REGEX_NUMBER_ONLY,
                  message: "Must be number!"
                }
              ]
            })(<Input name="phoneNumber" placeholder="Phone No." />)}
          </FormItem>

          <FormItem {...btn}>
            <Link to={{ pathname: "/user" }} title="back">
              <Button htmlType="button" className="btn-back">
                Cancel
              </Button>
            </Link>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="update-form-button"
              style={{ marginLeft: "10px" }}
            >
              Save
            </Button>
          </FormItem>
        </Form>
      </div>
    );
    return <div>{loadingPage ? loadingView : view}</div>;
  }
}

const WrappedCreateUserPrivilege = Form.create()(CreateUserPrivilege);

export default WrappedCreateUserPrivilege;
