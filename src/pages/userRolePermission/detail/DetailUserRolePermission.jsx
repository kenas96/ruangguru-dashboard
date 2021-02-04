import React from "react";
import PropTypes from "prop-types";
import { Col, Row, Spin, Button, Collapse, Tag } from "antd";
import { Link } from "react-router-dom";

import axios from "../../../utils/axios";

const { Panel } = Collapse;

class DetailUserRolePermission extends React.Component {
  state = {
    loading: true,
    data: {
      attributes: {
        description: []
      },
      clientRoles: {
        "boost-qredit-portal-dev": []
      }
    }
  };

  static propTypes = {
    match: PropTypes.instanceOf(Object)
  };

  componentWillMount() {
    this.getDetail();
  }

  getDetail = () => {
    const { match } = this.props;
    const {
      params: { id }
    } = match;
    const user = JSON.parse(window.localStorage.getItem("user"));
    const { access_token } = user.token;
    const apiPath = `${process.env.REACT_APP_SERVER_API}qredit/v1/group/detail/${id}`;
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
        this.setState({
          data: data.data,
          loading: false
        });
      })
      .catch(err => {
        console.log("eror", err); /* eslint-disable-line no-console */
      });
  };

  render() {
    const { loading, data } = this.state;

    const loadingView = (
      <div>
        <center>
          <Spin />
        </center>
      </div>
    );

    const view = (
      <div>
        <div className="iso__detail">
          <div className="iso__detail-heading">
            <p className="iso-heading-label">Detail User Role Permission</p>
          </div>
          <Collapse defaultActiveKey={["0", "1"]}>
            <Panel header="USER ROLE INFORMATION">
              <Row className="row__style">
                <Col xs={24} lg={6}>
                  Role Name
                </Col>
                <Col xs={24} lg={17}>
                  <strong>{data.name}</strong>
                </Col>
              </Row>
              <Row className="row__style">
                <Col xs={24} lg={6}>
                  Description
                </Col>
                <Col xs={24} lg={17}>
                  <strong>
                    {data.attributes.description
                      ? data.attributes.description[0]
                      : "-"}
                  </strong>
                </Col>
              </Row>
            </Panel>

            <Panel header="PERMISSION">
              <Row className="row__style">
                <Col xs={24} lg={4}>
                  User Role Permission
                </Col>
                <Col xs={24} lg={4}>
                  {data.clientRoles["boost-qredit-portal-dev"].includes(
                    "GET_ROLE_PERMISSIONS"
                  ) ? (
                    <Tag color="#009102">YES</Tag>
                  ) : (
                    <Tag color="#b50000">NO</Tag>
                  )}
                </Col>
                <Col xs={24} lg={1}>
                  Add
                </Col>
                <Col xs={24} lg={4}>
                  {data.clientRoles["boost-qredit-portal-dev"].includes(
                    "ADD_ROLE_PERMISSIONS"
                  ) ? (
                    <Tag color="#009102">YES</Tag>
                  ) : (
                    <Tag color="#b50000">NO</Tag>
                  )}
                </Col>
                <Col xs={24} lg={1}>
                  Edit
                </Col>
                <Col xs={24} lg={4}>
                  {data.clientRoles["boost-qredit-portal-dev"].includes(
                    "UPDATE_ROLE_PERMISSIONS"
                  ) ? (
                    <Tag color="#009102">YES</Tag>
                  ) : (
                    <Tag color="#b50000">NO</Tag>
                  )}
                </Col>
                <Col xs={24} lg={1}>
                  Delete
                </Col>
                <Col xs={24} lg={4}>
                  {data.clientRoles["boost-qredit-portal-dev"].includes(
                    "DELETE_ROLE_PERMISSIONS"
                  ) ? (
                    <Tag color="#009102">YES</Tag>
                  ) : (
                    <Tag color="#b50000">NO</Tag>
                  )}
                </Col>
              </Row>
              <Row className="row__style">
                <Col xs={24} lg={4}>
                  User Privilege
                </Col>
                <Col xs={24} lg={4}>
                  {data.clientRoles["boost-qredit-portal-dev"].includes(
                    "GET_ALL_USER"
                  ) ? (
                    <Tag color="#009102">YES</Tag>
                  ) : (
                    <Tag color="#b50000">NO</Tag>
                  )}
                </Col>
                <Col xs={24} lg={1}>
                  Add
                </Col>
                <Col xs={24} lg={4}>
                  {data.clientRoles["boost-qredit-portal-dev"].includes(
                    "ADD_USER"
                  ) ? (
                    <Tag color="#009102">YES</Tag>
                  ) : (
                    <Tag color="#b50000">NO</Tag>
                  )}
                </Col>
                <Col xs={24} lg={1}>
                  Edit
                </Col>
                <Col xs={24} lg={4}>
                  {data.clientRoles["boost-qredit-portal-dev"].includes(
                    "UPDATE_USER"
                  ) ? (
                    <Tag color="#009102">YES</Tag>
                  ) : (
                    <Tag color="#b50000">NO</Tag>
                  )}
                </Col>
                <Col xs={24} lg={1}>
                  Delete
                </Col>
                <Col xs={24} lg={4}>
                  {data.clientRoles["boost-qredit-portal-dev"].includes(
                    "DELETE_USER"
                  ) ? (
                    <Tag color="#009102">YES</Tag>
                  ) : (
                    <Tag color="#b50000">NO</Tag>
                  )}
                </Col>
              </Row>
              <Row className="row__style">
                <Col xs={24} lg={4}>
                  Application
                </Col>
                <Col xs={24} lg={4}>
                  {data.clientRoles["boost-qredit-portal-dev"].includes(
                    "GET_APPLICATIONS"
                  ) ? (
                    <Tag color="#009102">YES</Tag>
                  ) : (
                    <Tag color="#b50000">NO</Tag>
                  )}
                </Col>
              </Row>
              <Row className="row__style">
                <Col xs={24} lg={4}>
                  Active Contracts Loan
                </Col>
                <Col xs={24} lg={4}>
                  {data.clientRoles["boost-qredit-portal-dev"].includes(
                    "GET_ACTIVE_CONTRACT_LOAN"
                  ) ? (
                    <Tag color="#009102">YES</Tag>
                  ) : (
                    <Tag color="#b50000">NO</Tag>
                  )}
                </Col>
              </Row>
              <Row className="row__style">
                <Col xs={24} lg={4}>
                  Repayment
                </Col>
                <Col xs={24} lg={4}>
                  {data.clientRoles["boost-qredit-portal-dev"].includes(
                    "GET_REPAYMENT"
                  ) ? (
                    <Tag color="#009102">YES</Tag>
                  ) : (
                    <Tag color="#b50000">NO</Tag>
                  )}
                </Col>
              </Row>
              <Row className="row__style">
                <Col xs={24} lg={4}>
                  Watchlist
                </Col>
                <Col xs={24} lg={4}>
                  {data.clientRoles["boost-qredit-portal-dev"].includes(
                    "GET_WATCHLIST"
                  ) ? (
                    <Tag color="#009102">YES</Tag>
                  ) : (
                    <Tag color="#b50000">NO</Tag>
                  )}
                </Col>
              </Row>
              <Row className="row__style">
                <Col xs={24} lg={4}>
                  Transaction
                </Col>
                <Col xs={24} lg={4}>
                  {data.clientRoles["boost-qredit-portal-dev"].includes(
                    "GET_TRANSACTION"
                  ) ? (
                    <Tag color="#009102">YES</Tag>
                  ) : (
                    <Tag color="#b50000">NO</Tag>
                  )}
                </Col>
              </Row>
            </Panel>
          </Collapse>
        </div>
        <Link to={{ pathname: "/user-role" }} title="back">
          <Button htmlType="button" className="btn-back">
            Back
          </Button>
        </Link>
      </div>
    );

    return <div>{loading ? loadingView : view}</div>;
  }
}

export default DetailUserRolePermission;
