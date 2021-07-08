import React from "react";
import PropTypes from "prop-types";
import { Col, Row, Spin, Button, Collapse, Form, Checkbox, Input } from "antd";
import { Link } from "react-router-dom";
import axios from "../../../utils/axios";
import { Regex } from "../../../utils/Regex";
import { formItemLayout, btn } from "../../../styles/component/formVariable";
import Notification from "../../../components/notifications/notifications";

const { Panel } = Collapse;
const FormItem = Form.Item;
let errSubmit = false;

class DetailSubscribedUser extends React.Component {
  state = {
    loading: true,
    data: {
      user: {},
      packages: []
    }
  };

  static propTypes = {
    match: PropTypes.instanceOf(Object)
  };

  componentWillMount() {
    this.getDetail();
  }

  getDetail = () => {
    const { match, history } = this.props;
    const {
      params: { id }
    } = match;
    const apiPath = `${process.env.REACT_APP_SERVER_API}rg-package-dummy?userId=${id}`;
    axios({
      method: "get",
      url: apiPath
    })
      .then(response => {
        const { data } = response;
        const dataPackages = data.packages.map(key => {
          return {
            ...key,
            assignPrize: false
          };
        });
        data.packages = dataPackages;
        this.setState({
          data: data,
          loading: false
        });
      })
      .catch(error => {
        const { response } = error;
        if (response.status === 404) {
          Notification("error", "User Not Found");
        } else if (response.status === 400) {
          Notification(
            "warning",
            "User Not Subscribed to Any Product Packages"
          );
        } else {
          Notification("error", "Internal Serve Error");
        }
        history.push("/user");
        this.setState({ loading: false });
      });
  };

  handlePrizeAssign(e, packageSerial) {
    const updatedData = this.state.data;
    let index = updatedData.packages.findIndex(
      x => x.packageSerial === packageSerial
    );
    updatedData.packages[index].assignPrize = e.target.checked;
    this.setState({ data: updatedData });
  }

  handleCheckboxContact = e => {
    const {
      form: { setFieldsValue }
    } = this.props;
    if (e.target.checked) {
      setFieldsValue({
        name: this.state.data.user.userName,
        phone: this.state.data.user.userPhoneNumber
      });
    }
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

    validateFields((err, values) => {
      if (!err) {
        Notification(
          "success",
          "Successed assign Prize to " + this.state.data.user.userName
        );
        history.push("/user");
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
    const { loading, data } = this.state;
    const loadingView = (
      <div>
        <center>
          <Spin />
        </center>
      </div>
    );
    const view = (
      <Form onSubmit={this.handleSubmit}>
        <div className="iso__detail">
          <div className="iso__detail-heading">
            <p className="iso-heading-label">Assign Prize</p>
          </div>
          <Collapse defaultActiveKey={["0", "1", "2"]}>
            <Panel header="DETAIL USER">
              <Row className="row__style">
                <Col xs={24} lg={6}>
                  ID
                </Col>
                <Col xs={24} lg={17}>
                  <b>{data.user.userId}</b>
                </Col>
              </Row>
              <Row className="row__style">
                <Col xs={24} lg={6}>
                  Name
                </Col>
                <Col xs={24} lg={17}>
                  <b>{data.user.userName}</b>
                </Col>
              </Row>
              <Row className="row__style">
                <Col xs={24} lg={6}>
                  Email
                </Col>
                <Col xs={24} lg={17}>
                  <b>{data.user.userEmail}</b>
                </Col>
              </Row>
              <Row className="row__style">
                <Col xs={24} lg={6}>
                  Phone Number
                </Col>
                <Col xs={24} lg={17}>
                  <b>{data.user.userPhoneNumber}</b>
                </Col>
              </Row>
            </Panel>

            <Panel header="DETAIL PACKAGE(S)">
              <Row className="row__style">
                <Col xs={24} lg={8}>
                  <b>Package Name</b>
                </Col>
                <Col xs={24} lg={4}>
                  <b>Package Serial</b>
                </Col>
                <Col xs={24} lg={4}>
                  <b>Package Tag</b>
                </Col>
                <Col xs={24} lg={4}>
                  <b>Order Status</b>
                </Col>
                <Col xs={24} lg={4}>
                  <b>Available Prize</b>
                </Col>
              </Row>
              {data.packages.map(data => (
                <Row className="row__style" key={Math.random()}>
                  <Col xs={24} lg={8}>
                    <b>{data.packageName}</b>
                  </Col>
                  <Col xs={24} lg={4}>
                    <span className="labelTag green">{data.packageSerial}</span>
                  </Col>
                  <Col xs={24} lg={4}>
                    <span className="labelTag blue"> {data.packageTag}</span>
                  </Col>
                  <Col xs={24} lg={4}>
                    {data.orderStatus === "SUCCEED" ? (
                      <b style={{ color: "green" }}>Succeed</b>
                    ) : data.orderStatus === "IN_PROGRESS" ? (
                      <b style={{ color: "orange" }}>In Progress</b>
                    ) : (
                      <b style={{ color: "blue" }}>Waiting for Payment</b>
                    )}
                  </Col>
                  <Col xs={24} lg={4}>
                    <Checkbox
                      checked={data.assignPrize}
                      onChange={event =>
                        this.handlePrizeAssign(event, data.packageSerial)
                      }
                    >
                      {data.packageTag === "englishacademy" ? (
                        <b>Shoes</b>
                      ) : data.packageTag === "skillacademy" ? (
                        <b>Bag</b>
                      ) : (
                        <b>Pencils</b>
                      )}
                    </Checkbox>
                  </Col>
                </Row>
              ))}
            </Panel>
            <Panel header="DETAIL DELIVERY">
              <FormItem
                className="v-center"
                validateStatus={this.getErrorField("address") ? "error" : ""}
                help={this.getErrorField("address") || ""}
                label="Delivery Address"
                {...formItemLayout}
              >
                {getFieldDecorator("address", {
                  rules: [{ required: true, message: "Field is required!" }]
                })(<Input name="address" placeholder="Delivery Address" />)}
              </FormItem>

              <FormItem
                className="v-center"
                validateStatus={this.getErrorField("name") ? "error" : ""}
                help={this.getErrorField("name") || ""}
                label="Contact Person"
                {...formItemLayout}
              >
                {getFieldDecorator("name", {
                  rules: [{ required: true, message: "Field is required!" }]
                })(<Input name="name" placeholder="Contact Person" />)}
              </FormItem>

              <FormItem
                className="v-center"
                validateStatus={this.getErrorField("phone") ? "error" : ""}
                help={this.getErrorField("phone") || ""}
                label="Contact Number"
                {...formItemLayout}
              >
                {getFieldDecorator("phone", {
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
                })(<Input name="phone" placeholder="Contact Number" />)}
              </FormItem>
              <Row className="row__style" style={{ textAlign: "center" }}>
                <Col xs={24} lg={17}>
                  <Checkbox onChange={this.handleCheckboxContact}>
                    Contact same as User Data
                  </Checkbox>
                </Col>
              </Row>
            </Panel>
          </Collapse>
        </div>
        <FormItem {...btn}>
          <Link to={{ pathname: "/user" }} title="back">
            <Button htmlType="button" className="btn-back">
              Back
            </Button>
          </Link>
          <Button
            type="primary"
            htmlType="submit"
            className="update-form-button"
            style={{ marginLeft: "10px" }}
          >
            Assign Prize
          </Button>
        </FormItem>
      </Form>
    );

    return <div>{loading ? loadingView : view}</div>;
  }
}

const WrappedDetailSubscribedUser = Form.create()(DetailSubscribedUser);

export default WrappedDetailSubscribedUser;
