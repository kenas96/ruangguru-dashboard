import React from "react";
import {
  Input,
  Table,
  Button,
  Icon,
  Divider,
  Row,
  Col,
  message,
  Modal
} from "antd";
import { Link } from "react-router-dom";
import get from "lodash/get";

import axios from "../../../utils/axios";

const { confirm } = Modal;
let permission = {};

class ListUserRolePermission extends React.Component {
  state = {
    data: [],
    loading: false,
    searchCriteria: []
  };

  componentDidMount() {
    this.fetch();
  }

  handleCriteria = (value, searchKey) => {
    const updatedCriteria = {
      name: searchKey,
      value: value
    };

    this.setState(state => {
      const searchCriteria = [...state.searchCriteria, updatedCriteria];
      return {
        searchCriteria
      };
    });
  };

  handleSearch = () => {
    this.fetch();
  };

  fetch = () => {
    const { searchCriteria } = this.state;
    let params = {
      first: 0,
      max: 50
    };
    searchCriteria.map(item => {
      params[item.name] = item.value;
    });

    const user = JSON.parse(window.localStorage.getItem("user"));
    const { access_token } = user.token;
    const apiPath = `${process.env.REACT_APP_SERVER_API}qredit/v1/group/list`;
    this.setState({ loading: true });
    const roles = user.info.resource_access["boost-qredit-portal-dev"].roles;
    roles.map(key => {
      permission[key] = 1;
    });
    axios({
      method: "get",
      url: apiPath,
      params: {
        ...params
      },
      headers: { Authorization: `Bearer ${access_token}` }
    })
      .then(response => {
        const data = get(response, "data.data", []);
        const role = data.map((key, index) => {
          return {
            key: key.id,
            name: key.name,
            path: key.path,
            index: index + 1
          };
        });
        this.setState({
          loading: false,
          data: role
        });
      })
      .catch(err => {
        console.log(err); /* eslint-disable-line no-console */
      });
  };

  delete = id => {
    const user = JSON.parse(window.localStorage.getItem("user"));
    const { access_token } = user.token;
    const apiPath = `${process.env.REACT_APP_SERVER_API}qredit/v1/group/delete/${id}`;

    axios({
      method: "delete",
      url: apiPath,
      data: {},
      headers: { Authorization: "Bearer " + access_token }
    })
      .then(({ data }) => {
        this.success();
        this.fetch();
      })
      .catch(err => {
        this.error();
        console.log(err); /* eslint-disable-line no-console */
      });
  };

  showDeleteConfirm = id => {
    const deleteUser = this.delete;
    confirm({
      title: "Are you sure delete this role?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deleteUser(id);
      },
      onCancel: () => {}
    });
  };

  success = () => {
    message.success("Success delete role");
  };

  error = () => {
    message.error("Internal server error");
  };

  render() {
    const delStyle = {
      cursor: "pointer",
      color: "red"
    };
    const { data, loading } = this.state;
    const columns = [
      {
        title: "No",
        dataIndex: "index"
      },
      {
        title: "Role Name",
        dataIndex: "name"
      },
      {
        title: "Action",
        dataIndex: "action",
        render: (text, record) => (
          <span>
            <Link
              to={{
                pathname: `user-role/detail/${record.key}/`
              }}
              title="Detail"
            >
              <Icon type="eye" />
              <Divider type="vertical" />
            </Link>
            {permission.UPDATE_ROLE_PERMISSIONS == 1 && (
              <Link
                to={{
                  pathname: `user-role/edit/${record.key}/`
                }}
                title="Edit"
              >
                <Icon type="edit" />
                <Divider type="vertical" />
              </Link>
            )}
            {permission.DELETE_ROLE_PERMISSIONS == 1 && (
              <span
                style={delStyle}
                title="Delete"
                role="presentation"
                tabIndex="-1"
                onClick={() => this.showDeleteConfirm(record.key)}
              >
                <Icon type="delete" />
              </span>
            )}
          </span>
        )
      }
    ];
    return (
      <div>
        <Row gutter={16}>
          <Col span={12}>
            <h2>User Role Permission</h2>
          </Col>
        </Row>
        <Row gutter={16} style={{ paddingTop: "20px", fontSize: "12px" }}>
          <Col span={9}>
            <div className="btn__wrapper">
              <h4 style={{ marginTop: "5px" }}>Role Name: </h4>
              <Input
                style={{ width: "60%" }}
                placeholder="Role Name"
                onChange={event =>
                  this.handleCriteria(event.target.value, "search")
                }
              />
            </div>
          </Col>
          <Col span={9}>
            <div className="btn__wrapper">
              <div className="btn__wrapper--right">
                <Button
                  type="primary"
                  icon="search "
                  style={{ marginRight: "10px" }}
                  onClick={this.handleSearch}
                >
                  Filter
                </Button>
                {permission.ADD_ROLE_PERMISSIONS == 1 && (
                  <Link to="/create-user-role">
                    <Button
                      type="ghost"
                      htmlType="submit"
                      className="btn-success"
                      icon="plus-circle"
                    >
                      Add New
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </Col>
        </Row>

        <div className="table-wrapper">
          <Table
            className="table-user"
            columns={columns}
            dataSource={data}
            pagination={false}
            loading={loading}
            onChange={this.handleTableChange}
          />
        </div>
      </div>
    );
  }
}

export default ListUserRolePermission;
