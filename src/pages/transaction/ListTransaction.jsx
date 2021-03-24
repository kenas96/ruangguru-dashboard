import React from "react";
import {
  Input,
  Table,
  Button,
  DatePicker,
  Select,
  Row,
  Col,
  TimePicker
} from "antd";
import get from "lodash/get";

import axios from "../../utils/axios";
import { currencyFormatter } from "../../utils/helpers";
import {
  convertDateToEpoch,
  unixFormatDateTimeStripe,
  unixFormatDate,
  unixFormatDateStripe
} from "../../utils/DateUtils";

const { Option } = Select;

class ListTransaction extends React.Component {
  state = {
    data: [],
    pagination: {
      total: 0,
      current: 1,
      pages: 1,
      pageSize: 10
    },
    loading: false,
    endValue: null,
    startValue: null,
    endOpen: false,
    searchCriteria: [],
    selectedColumn: []
  };

  componentDidMount() {
    this.fetch();
  }

  handleTableChange = (pagination, filter, sorter) => {
    setTimeout(() => {
      const { pagination: pageState } = this.state;
      const pager = {
        ...pageState,
        current: pagination.current
      };
      this.setState(
        {
          pagination: pager
        },
        () => {
          this.fetch();
        }
      );
    }, 400);
  };

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

  handleColumn = value => {
    this.setState(state => {
      const selectedColumn = value;
      return {
        selectedColumn
      };
    });
  };

  fetch = () => {
    const {
      pagination: { current, pageSize },
      searchCriteria
    } = this.state;

    let params = {
      page: current,
      limit: pageSize
    };
    searchCriteria.map(item => {
      params[item.name] = item.value;
    });

    const user = JSON.parse(window.localStorage.getItem("user"));
    const { access_token } = user.token;
    const apiPath = `${process.env.REACT_APP_SERVER_API}qredit/v1/transaction/list`;
    this.setState({ loading: true });
    axios({
      method: "get",
      url: apiPath,
      params: {
        ...params
      },
      headers: { Authorization: `Bearer ${access_token}` }
    })
      .then(response => {
        const { pagination } = this.state;
        const data = get(response, "data.data", []);
        pagination.total = parseInt(data.count);
        pagination.pages = Math.ceil(
          parseInt(data.count) / pagination.pageSize
        );
        const transaction = data.rows.map((key, index) => {
          return {
            key: index + 1 + (pagination.current - 1) * pagination.pageSize,
            transaction_date: unixFormatDate(key.transaction_date),
            transaction_reference: key.transaction_reference,
            merchant_id: key.merchant_id,
            merchant_name: key.merchant_name,
            msisdn: key.msisdn,
            amount: currencyFormatter(key.amount),
            description: key.reason.replace("Pembayaran Produk ", "P"),
            index: index + 1 + (pagination.current - 1) * pagination.pageSize
          };
        });
        this.setState({
          loading: false,
          data: transaction,
          pagination
        });
      })
      .catch(err => {
        console.log(err); /* eslint-disable-line no-console */
      });
  };

  disabledEndDate = endValue => {
    const { startValue } = this.state;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  onStartChange = (value, valueString) => {
    const date = convertDateToEpoch(value);
    const convertedDate = unixFormatDateTimeStripe(date);
    this.setState({
      startValue: convertedDate
    });
    this.handleCriteria(convertedDate, "from");
  };

  onEndChange = (value, valueString) => {
    const date = convertDateToEpoch(value);
    const convertedDate = unixFormatDateTimeStripe(date);
    this.setState({
      endValue: convertedDate
    });
    this.handleCriteria(convertedDate, "to");
  };

  handleStartOpenChange = open => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  };

  handleEndOpenChange = open => {
    this.setState({ endOpen: open });
  };

  onStartTimeChange = (value, valueString) => {
    var date = new Date(this.state.startValue);
    date.setHours(
      valueString[0] + valueString[1],
      valueString[3] + valueString[4],
      0
    );
    this.handleCriteria(unixFormatDateTimeStripe(date), "from");
  };

  onEndTimeChange = (value, valueString) => {
    var date = new Date(this.state.endValue);
    date.setHours(
      valueString[0] + valueString[1],
      valueString[3] + valueString[4],
      0
    );
    this.handleCriteria(unixFormatDateTimeStripe(date), "to");
  };

  download = () => {
    const { searchCriteria } = this.state;
    let params = {};

    searchCriteria.map(item => {
      params[item.name] = item.value;
    });

    const user = JSON.parse(window.localStorage.getItem("user"));
    const { access_token } = user.token;
    const apiPath = `${process.env.REACT_APP_SERVER_API}qredit/v1/transaction/list/download`;
    this.setState({ loading: true });
    axios({
      method: "post",
      url: apiPath,
      responseType: "blob",
      headers: { Authorization: "Bearer " + access_token },
      data: {
        from: params.from,
        to: params.to,
        merchantName: params.merchantName,
        msisdn: params.msisdn
      }
    })
      .then(response => {
        this.setState({ loading: false });
        const date = unixFormatDateStripe(Date.now());
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Transaction-${date}.xls`);
        document.body.appendChild(link);
        link.click();
      })
      .catch(error => {
        this.setState({ loading: false });
        const errMsg = get(error, "response.status", null);
        if (errMsg === 400) {
          message.error("Error! Data does not exist!");
        } else {
          message.error("Internal server error!");
        }
      });
  };

  render() {
    const {
      data,
      pagination,
      loading,
      endOpen,
      startValue,
      endValue,
      selectedColumn
    } = this.state;

    let columns = [
      {
        title: "No",
        dataIndex: "index",
        show: true
      },
      {
        title: "Transaction Date",
        dataIndex: "transaction_date",
        show: true
      },
      {
        title: "Transaction Ref. No.",
        dataIndex: "transaction_reference",
        show: true
      },
      {
        title: "Merchant ID",
        dataIndex: "merchant_id",
        show: false
      },
      {
        title: "Merchant Name",
        dataIndex: "merchant_name",
        show: true
      },
      {
        title: "MSISDN",
        dataIndex: "msisdn",
        show: true
      },
      {
        title: "Nominal Transaction",
        dataIndex: "amount",
        show: true,
        render: (text, record) => <b>{record.amount}</b>
      },
      {
        title: "Description",
        dataIndex: "description",
        show: true,
        render: (text, record) => <b>{record.description}</b>
      }
    ];

    const defaultColumn = [
      "index",
      "transaction_date",
      "transaction_reference",
      "merchant_name",
      "msisdn",
      "amount",
      "description"
    ];

    if (selectedColumn.length) {
      columns.map(item => {
        if (selectedColumn.includes(item.dataIndex)) {
          item.show = true;
        } else {
          item.show = false;
        }
      });
    }

    return (
      <div>
        <Row gutter={16}>
          <Col span={12}>
            <h2>Transaction</h2>
          </Col>
        </Row>
        <Row gutter={16} style={{ paddingTop: "20px", fontSize: "12px" }}>
          <Col span={9}>
            <div className="btn__wrapper">
              <h4 style={{ marginTop: "5px" }}>Merchant Name: </h4>
              <Input
                style={{ width: "60%" }}
                placeholder="Merchant Name"
                onChange={event =>
                  this.handleCriteria(event.target.value, "merchantName")
                }
              />
            </div>
          </Col>
          <Col span={6}>
            <div className="btn__wrapper">
              <h4 style={{ marginTop: "5px" }}>Start Date: </h4>
              <DatePicker
                name="startDate"
                className="date_picker--position"
                style={{ width: "60%" }}
                size="medium"
                format="DD/MM/YYYY"
                placeholder="Start Date"
                onChange={this.onStartChange}
                onOpenChange={this.handleStartOpenChange}
              />
            </div>
          </Col>
          <Col span={6}>
            <div className="btn__wrapper">
              <h4 style={{ marginTop: "5px" }}>End Date: </h4>
              <DatePicker
                name="endDate"
                className="date_picker--position"
                style={{ width: "60%" }}
                disabledDate={this.disabledEndDate}
                size="medium"
                format="DD/MM/YYYY "
                placeholder="End Date"
                onChange={this.onEndChange}
                open={endOpen}
                onOpenChange={this.handleEndOpenChange}
              />
            </div>
          </Col>
          <Col span={9}>
            <div className="btn__wrapper">
              <h4 style={{ marginTop: "5px" }}>MSISDN: </h4>
              <Input
                style={{ width: "60%" }}
                placeholder="MSISDN"
                onChange={event =>
                  this.handleCriteria(event.target.value, "msisdn")
                }
              />
            </div>
          </Col>
          <Col span={6}>
            <div className="btn__wrapper">
              <h4 style={{ marginTop: "5px" }}>Start Time: </h4>
              <TimePicker
                format={"HH:mm"}
                placeholder="Start Time"
                size="medium"
                className="date_picker--position"
                style={{ width: "60%" }}
                disabled={!startValue}
                onChange={this.onStartTimeChange}
              />
            </div>
          </Col>
          <Col span={6}>
            <div className="btn__wrapper">
              <h4 style={{ marginTop: "5px" }}>End Time: </h4>
              <TimePicker
                format={"HH:mm"}
                placeholder="End Time"
                size="medium"
                className="date_picker--position"
                style={{ width: "60%" }}
                disabled={!endValue}
                onChange={this.onEndTimeChange}
              />
            </div>
          </Col>
        </Row>
        <Row gutter={16} style={{ padding: "5px 0px", fontSize: "12px" }}>
          <Col span={9}>
            <div className="btn__wrapper">
              <h4 style={{ marginTop: "5px" }}>Customize Column: </h4>
              <Select
                mode="multiple"
                style={{ width: "60%" }}
                placeholder="Customize Column"
                defaultValue={defaultColumn}
                onChange={event => this.handleColumn(event)}
                className="dont-show"
              >
                {columns.map(data => (
                  <Option key={Math.random()} value={data.dataIndex}>
                    {data.title}
                  </Option>
                ))}
              </Select>
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
                <Button
                  type="primary"
                  icon="download"
                  style={{ marginRight: "10px" }}
                  onClick={this.download}
                >
                  Download
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        <div className="table-wrapper">
          <Table
            className="table"
            columns={columns.filter(col => col.show === true)}
            dataSource={data}
            pagination={pagination}
            loading={loading}
            onChange={this.handleTableChange}
          />
        </div>
      </div>
    );
  }
}

export default ListTransaction;
