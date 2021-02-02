import React from "react";
import {
  Divider,
  Spin,
  Form,
  Input,
  Radio,
  Button,
  Row,
  Col,
  message
} from "antd";
import { Link } from "react-router-dom";

import axios from "../../../utils/axios";
import { formItemLayout, btn } from "../../../styles/component/formVariable";
import config from "../../../../config";
import { getAllRole } from "../../../service/userService";
import Notification from "../../../components/notifications/notifications";

const FormItem = Form.Item;
let errSubmit = false;

class UpdateUserRolePermission extends React.Component {
  state = {
    loadingPage: true,
    loading: false,
    role: [],
    selectedRole: []
  };

  componentWillMount() {
    this.getDetail();
  }

  setLoading(status) {
    setTimeout(() => {
      this.setState({ loadingPage: status });
    }, 1000);
  }

  getDetail = () => {
    const { form } = this.props;
    const { match } = this.props;
    const {
      params: { id }
    } = match;
    const { loadingPage } = this.state;
    const user = JSON.parse(window.localStorage.getItem("user"));
    const { access_token } = user.token;
    const apiPath = `${config.apiUrl}qredit/v1/group/detail/${id}`;
    axios({
      method: "get",
      url: apiPath,
      headers: { Authorization: "Bearer " + access_token }
    })
      .then(response => {
        const { data } = response;
        if (!data.data.clientRoles["boost-qredit-portal-dev"]) {
          data.data.clientRoles = {
            "boost-qredit-portal-dev": []
          };
        }
        getAllRole()
          .then(response => {
            let role = response.data.data.map(key => {
              if (key.name !== "uma_protection") {
                return {
                  id: key.id,
                  name: key.name
                };
              }
            });
            role = role.filter(function(element) {
              return element !== undefined;
            });
            let selectedRole = role.map(key => {
              if (
                data.data.clientRoles["boost-qredit-portal-dev"].includes(
                  key.name
                )
              ) {
                return {
                  id: key.id,
                  name: key.name
                };
              }
            });
            selectedRole = selectedRole.filter(function(element) {
              return element !== undefined;
            });
            this.setState({
              loadingPage: !loadingPage,
              role,
              selectedRole
            });
            form.setFieldsValue({
              name: data.data.name,
              description: data.data.attributes.description
                ? data.data.attributes.description[0]
                : ""
            });
          })
          .catch(error => {
            message.error(error, 4);
          });
      })
      .catch(err => {
        console.log("eror", err); /* eslint-disable-line no-console */
      });
  };

  handlePermission = value => {
    const selectedRole = [...this.state.selectedRole];
    let index = selectedRole.findIndex(x => x.name === value.target.name);
    if (index !== -1) {
      selectedRole.splice(index, 1);
    } else {
      const role = [...this.state.role];
      let index = role.findIndex(x => x.name === value.target.name);
      selectedRole.push(role[index]);
    }

    this.setState({
      selectedRole
    });
  };

  permissionValue = key => {
    const selectedRole = [...this.state.selectedRole];
    let index = selectedRole.findIndex(x => x.name === key);
    if (index === -1) {
      return 0;
    } else {
      return 1;
    }
  };

  handleSubmit = e => {
    const { match } = this.props;
    const {
      params: { id }
    } = match;
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
    const apiPath = `${config.apiUrl}qredit/v1/group/update/${id}`;
    validateFields((err, values) => {
      if (!err) {
        const payload = {
          id: id,
          name: values.name,
          attributes: {
            description: [values.description]
          },
          roles: this.state.selectedRole
        };
        axios({
          method: "put",
          url: apiPath,
          data: payload,
          headers: { Authorization: "Bearer " + access_token }
        })
          .then(() => {
            this.setState({ loading: false });
            Notification("success", "Success update role");
            history.push("/user-role");
          })
          .catch(() => {
            this.setState({ loading: false });
            Notification("error", "Oops! Can't update role");
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
          <h3 className="isoBoxTitle">Edit User Role</h3>
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
          <FormItem
            className="v-center"
            validateStatus={this.getErrorField("description") ? "error" : ""}
            help={this.getErrorField("description") || ""}
            label="Description"
            {...formItemLayout}
          >
            {getFieldDecorator("description", {
              rules: []
            })(<Input name="description" placeholder="Description" />)}
          </FormItem>
          <Divider>
            <h3>Permission</h3>
          </Divider>

          <FormItem
            className="v-center"
            label="User Role Permission"
            {...formItemLayout}
          >
            <Row>
              <Col xs={24} lg={6}>
                <Radio.Group
                  onChange={this.handlePermission}
                  value={this.permissionValue("GET_ROLE_PERMISSIONS")}
                  name="GET_ROLE_PERMISSIONS"
                >
                  <Radio.Button value={0}>No</Radio.Button>
                  <Radio.Button value={1}>Yes</Radio.Button>
                </Radio.Group>
              </Col>
              <div>
                <Col xs={24} lg={6}>
                  Add
                  <Radio.Group
                    onChange={this.handlePermission}
                    value={this.permissionValue("ADD_ROLE_PERMISSIONS")}
                    name="ADD_ROLE_PERMISSIONS"
                    className="permission-checkbox"
                  >
                    <Radio.Button value={0}>No</Radio.Button>
                    <Radio.Button value={1}>Yes</Radio.Button>
                  </Radio.Group>
                </Col>
                <Col xs={24} lg={6}>
                  Edit
                  <Radio.Group
                    onChange={this.handlePermission}
                    value={this.permissionValue("UPDATE_ROLE_PERMISSIONS")}
                    name="UPDATE_ROLE_PERMISSIONS"
                    className="permission-checkbox"
                  >
                    <Radio.Button value={0}>No</Radio.Button>
                    <Radio.Button value={1}>Yes</Radio.Button>
                  </Radio.Group>
                </Col>
                <Col xs={24} lg={6}>
                  Delete
                  <Radio.Group
                    onChange={this.handlePermission}
                    value={this.permissionValue("DELETE_ROLE_PERMISSIONS")}
                    name="DELETE_ROLE_PERMISSIONS"
                    className="permission-checkbox"
                  >
                    <Radio.Button value={0}>No</Radio.Button>
                    <Radio.Button value={1}>Yes</Radio.Button>
                  </Radio.Group>
                </Col>
              </div>
            </Row>
          </FormItem>
          <FormItem
            className="v-center"
            label="User Privilege"
            {...formItemLayout}
          >
            <Row>
              <Col xs={24} lg={6}>
                <Radio.Group
                  onChange={this.handlePermission}
                  value={this.permissionValue("GET_ALL_USER")}
                  name="GET_ALL_USER"
                >
                  <Radio.Button value={0}>No</Radio.Button>
                  <Radio.Button value={1}>Yes</Radio.Button>
                </Radio.Group>
              </Col>
              <div>
                <Col xs={24} lg={6}>
                  Add
                  <Radio.Group
                    onChange={this.handlePermission}
                    value={this.permissionValue("ADD_USER")}
                    name="ADD_USER"
                    className="permission-checkbox"
                  >
                    <Radio.Button value={0}>No</Radio.Button>
                    <Radio.Button value={1}>Yes</Radio.Button>
                  </Radio.Group>
                </Col>
                <Col xs={24} lg={6}>
                  Edit
                  <Radio.Group
                    onChange={this.handlePermission}
                    value={this.permissionValue("UPDATE_USER")}
                    name="UPDATE_USER"
                    className="permission-checkbox"
                  >
                    <Radio.Button value={0}>No</Radio.Button>
                    <Radio.Button value={1}>Yes</Radio.Button>
                  </Radio.Group>
                </Col>
                <Col xs={24} lg={6}>
                  Delete
                  <Radio.Group
                    onChange={this.handlePermission}
                    value={this.permissionValue("DELETE_USER")}
                    name="DELETE_USER"
                    className="permission-checkbox"
                  >
                    <Radio.Button value={0}>No</Radio.Button>
                    <Radio.Button value={1}>Yes</Radio.Button>
                  </Radio.Group>
                </Col>
              </div>
            </Row>
          </FormItem>
          <FormItem
            className="v-center"
            label="Application"
            {...formItemLayout}
          >
            <Radio.Group
              onChange={this.handlePermission}
              value={this.permissionValue("GET_APPLICATIONS")}
              name="GET_APPLICATIONS"
            >
              <Radio.Button value={0}>No</Radio.Button>
              <Radio.Button value={1}>Yes</Radio.Button>
            </Radio.Group>
          </FormItem>
          <FormItem
            className="v-center"
            label="Active Contracts Loan"
            {...formItemLayout}
          >
            <Radio.Group
              onChange={this.handlePermission}
              value={this.permissionValue("GET_ACTIVE_CONTRACT_LOAN")}
              name="GET_ACTIVE_CONTRACT_LOAN"
            >
              <Radio.Button value={0}>No</Radio.Button>
              <Radio.Button value={1}>Yes</Radio.Button>
            </Radio.Group>
          </FormItem>
          <FormItem className="v-center" label="Repayment" {...formItemLayout}>
            <Radio.Group
              onChange={this.handlePermission}
              value={this.permissionValue("GET_REPAYMENT")}
              name="GET_REPAYMENT"
            >
              <Radio.Button value={0}>No</Radio.Button>
              <Radio.Button value={1}>Yes</Radio.Button>
            </Radio.Group>
          </FormItem>
          <FormItem className="v-center" label="Watchlist" {...formItemLayout}>
            <Radio.Group
              onChange={this.handlePermission}
              value={this.permissionValue("GET_WATCHLIST")}
              name="GET_WATCHLIST"
            >
              <Radio.Button value={0}>No</Radio.Button>
              <Radio.Button value={1}>Yes</Radio.Button>
            </Radio.Group>
          </FormItem>
          <FormItem
            className="v-center"
            label="Transaction"
            {...formItemLayout}
          >
            <Radio.Group
              onChange={this.handlePermission}
              value={this.permissionValue("GET_TRANSACTION")}
              name="GET_TRANSACTION"
            >
              <Radio.Button value={0}>No</Radio.Button>
              <Radio.Button value={1}>Yes</Radio.Button>
            </Radio.Group>
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

const WrappedUpdateUserRolePermission = Form.create()(UpdateUserRolePermission);

export default WrappedUpdateUserRolePermission;
