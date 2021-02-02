import React from "react";
import { Spin, Form, Input, Button } from "antd";
import { Link } from "react-router-dom";

import axios from "../../../utils/axios";
import { formItemLayout, btn } from "../../../styles/component/formVariable";
import config from "../../../../config";
import Notification from "../../../components/notifications/notifications";

const FormItem = Form.Item;
let errSubmit = false;

class CreateUserRolePermission extends React.Component {
  state = {
    loadingPage: true,
    loading: false
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
    const apiPath = `${config.apiUrl}qredit/v1/group/create`;

    validateFields((err, values) => {
      if (!err) {
        const payload = {
          name: values.name
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
            Notification("success", "Success create role");
            history.push("/user-role");
          })
          .catch(err => {
            this.setState({ loading: false });
            Notification("error", "Oops! Can't create role");
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
    const { loadingPage, loading } = this.state;

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
          <h3 className="isoBoxTitle">Add User Role Permission</h3>
        </div>
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            className="v-center"
            validateStatus={this.getErrorField("name") ? "error" : ""}
            help={this.getErrorField("name") || ""}
            label="Role Name"
            {...formItemLayout}
          >
            {getFieldDecorator("name", {
              rules: [{ required: true, message: "Field is required!" }]
            })(<Input name="name" placeholder="Role Name" />)}
          </FormItem>
          <FormItem {...btn}>
            <Link to={{ pathname: "/user-role" }} title="back">
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

const WrappedCreateUserRolePermission = Form.create()(CreateUserRolePermission);

export default WrappedCreateUserRolePermission;
