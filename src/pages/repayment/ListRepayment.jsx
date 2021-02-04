import React from "react";
import {
  Table,
  Button,
  DatePicker,
  Select,
  Row,
  Col,
  TimePicker,
  message
} from "antd";
import get from "lodash/get";

import axios from "../../utils/axios";
import { currencyFormatter } from "../../utils/helpers";
import { getCategoryType, getCompany } from "../../service/lenderService";
import {
  convertDateToEpoch,
  unixFormatDateTimeStripe,
  unixFormatDateStripe,
  unixFormatDateTime,
  unixFormatDateShort
} from "../../utils/DateUtils";
import { Constants } from "../../utils/Constants";

const { Option } = Select;

class ListRepayment extends React.Component {
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
    selectedColumn: [],
    categoryType: [],
    lender: [],
    downloadRow: []
  };

  componentDidMount() {
    this.fetch();
    this.getDataCategory();
  }

  getDataCategory() {
    getCategoryType()
      .then(({ data }) => {
        const categoryType = get(data, "data", []);
        this.setState({
          categoryType
        });
      })
      .catch(error => {
        message.error(error, 4);
      });
  }

  getDataCompany(categoryType) {
    getCompany(categoryType)
      .then(({ data }) => {
        const lender = get(data, "data", []);
        this.setState({
          lender
        });
      })
      .catch(error => {
        message.error(error, 4);
      });
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

  handleCategoryType = (value, searchKey) => {
    this.getDataCompany(value);
    this.handleCriteria(value, searchKey);
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
    const apiPath = `${process.env.REACT_APP_SERVER_API}qredit/v1/repayment/list`;
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
        pagination.total = data.count;
        pagination.pages = Math.ceil(data.count / pagination.pageSize);
        const repayment = data.rows.map((key, index) => {
          return {
            key: key.id,
            merchant_id: key.client_id,
            merchant_name: key.name,
            contract_number: key.contract_number,
            category_type: key.lender_type.toLowerCase(),
            lender: key.company_name,
            date: unixFormatDateTime(key.sign_in_date),
            due_date: unixFormatDateShort(key.due_date_payment),
            tenor: key.term_day.toLowerCase(),
            loan_amount: currencyFormatter(key.loan_amount),
            disbursement_amount: currencyFormatter(key.disbursement_amount),
            repayment_date: unixFormatDateShort(key.repayment_date),
            penalty_day: key.penalty_day,
            payment_amount: currencyFormatter(key.payment_amount),
            penalty_amount: currencyFormatter(key.penalty_amount),
            total_payment_amount: currencyFormatter(key.total_payment_amount),
            repayment_period: key.repayment_period,
            settlment_status: key.settlment_status
              ? key.settlment_status.toLowerCase()
              : "-",
            index: index + 1 + (pagination.current - 1) * pagination.pageSize
          };
        });
        this.setState({
          loading: false,
          data: repayment,
          pagination
        });
      })
      .catch(err => {
        console.log(err); /* eslint-disable-line no-console */
      });
  };

  disabledStartDate = startValue => {
    const { endValue } = this.state;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
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
    if (this.state.downloadRow.length === 0) {
      message.warning("Please choose data row first!");
    } else {
      const user = JSON.parse(window.localStorage.getItem("user"));
      const { access_token } = user.token;
      const apiPath = `${process.env.REACT_APP_SERVER_API}qredit/v1/repayment/update/settlement`;
      let selectedColumnKey = [];
      let selectedColumn = [
        "index",
        "merchant_name",
        "category_type",
        "lender",
        "loan_amount",
        "repayment_date",
        "penalty_day",
        "payment_amount",
        "total_payment_amount",
        "repayment_period"
      ];

      if (this.state.selectedColumn.length > 0) {
        selectedColumn = this.state.selectedColumn;
      }

      selectedColumn.map(data => {
        let index = Constants.keyValueSettlement.findIndex(
          x => x.value === data
        );
        if (index !== -1) {
          selectedColumnKey.push(Constants.keyValueSettlement[index].key);
        }
      });

      if (selectedColumnKey.length > 9) {
        message.warning("Maximum data column is 9!");
      } else {
        axios({
          method: "post",
          url: apiPath,
          responseType: "blob",
          headers: { Authorization: "Bearer " + access_token },
          data: {
            repaymentList: this.state.downloadRow,
            columnList: selectedColumnKey
          }
        })
          .then(response => {
            const date = unixFormatDateStripe(Date.now());
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `Settlement-${date}.pdf`);
            document.body.appendChild(link);
            link.click();
          })
          .catch(error => {
            const errMsg = get(error, "response.status", null);
            if (errMsg === 400) {
              message.error("Error! Data does not exist!");
            } else {
              message.error("Internal server error!");
            }
          });
      }
    }
  };

  render() {
    const {
      data,
      pagination,
      loading,
      endOpen,
      startValue,
      endValue,
      selectedColumn,
      categoryType,
      lender
    } = this.state;
    let columns = [
      {
        title: "No",
        dataIndex: "index",
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
        title: "Contract No",
        dataIndex: "contract_number",
        show: false
      },
      {
        title: "Category Type",
        dataIndex: "category_type",
        show: true
      },
      {
        title: "Lender",
        dataIndex: "lender",
        show: true
      },
      {
        title: "Applied Date",
        dataIndex: "date",
        show: false
      },
      {
        title: "Due Date",
        dataIndex: "due_date",
        show: false
      },
      {
        title: "Tenor",
        dataIndex: "tenor",
        show: false
      },
      {
        title: "Loan Approve",
        dataIndex: "loan_amount",
        show: true
      },
      {
        title: "Loan Disbursement",
        dataIndex: "disbursement_amount",
        show: false
      },
      {
        title: "Repayment Date",
        dataIndex: "repayment_date",
        show: true,
        render: (text, record) =>
          record.repayment_period === "On Period" ? (
            <b style={{ color: "green" }}>{record.repayment_date}</b>
          ) : record.repayment_period === "Grace Period" ? (
            <b style={{ color: "orange" }}>{record.repayment_date}</b>
          ) : (
            <b style={{ color: "red" }}>{record.repayment_date}</b>
          )
      },
      {
        title: "Day Past Due",
        dataIndex: "penalty_day",
        show: true,
        render: (text, record) =>
          record.repayment_period === "On Period" ? (
            <b>-</b>
          ) : record.repayment_period === "Grace Period" ? (
            <b style={{ color: "orange" }}>
              {Math.abs(record.penalty_day)} Days
            </b>
          ) : (
            <b style={{ color: "red" }}>{Math.abs(record.penalty_day)} Days</b>
          )
      },
      {
        title: "Repayment Amount",
        dataIndex: "payment_amount",
        show: true
      },
      {
        title: "Penalty Amount",
        dataIndex: "penalty_amount",
        show: false
      },
      {
        title: "Total Repayment",
        dataIndex: "total_payment_amount",
        show: true,
        render: (text, record) => (
          <b style={{ color: "green" }}>{record.total_payment_amount}</b>
        )
      },
      {
        title: "Repayment Status",
        dataIndex: "repayment_period",
        show: true,
        render: (text, record) =>
          record.repayment_period === "On Period" ? (
            <b style={{ color: "green" }}>On Period</b>
          ) : record.repayment_period === "Grace Period" ? (
            <b style={{ color: "orange" }}>Grace Period</b>
          ) : (
            <b style={{ color: "red" }}>On Penalty</b>
          )
      },
      {
        title: "Transfer Status",
        dataIndex: "settlment_status",
        show: false,
        render: (text, record) => <span>{record.settlment_status}</span>
      }
    ];

    const defaultColumn = [
      "index",
      "merchant_name",
      "category_type",
      "lender",
      "loan_amount",
      "repayment_date",
      "penalty_day",
      "payment_amount",
      "total_payment_amount",
      "repayment_period"
    ];

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState(state => {
          const downloadRow = selectedRowKeys;
          return {
            downloadRow
          };
        });
      },
      getCheckboxProps: record => ({
        disabled: record.name === "Disabled",
        name: record.name
      })
    };

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
            <h2>Repayment</h2>
          </Col>
        </Row>
        <Row gutter={16} style={{ paddingTop: "20px", fontSize: "12px" }}>
          <Col span={9}>
            <div className="btn__wrapper">
              <h4 style={{ marginTop: "5px" }}>Category Type: </h4>
              <Select
                allowClear
                showSearch
                style={{ width: "60%" }}
                placeholder="Category Type"
                onChange={event =>
                  this.handleCategoryType(event, "categoryType")
                }
              >
                {categoryType.map(data => (
                  <Option key={Math.random()} value={data.lenderType}>
                    {data.lenderType}
                  </Option>
                ))}
              </Select>
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
              <h4 style={{ marginTop: "5px" }}>Lender: </h4>
              <Select
                allowClear
                showSearch
                style={{ width: "60%" }}
                placeholder="Lender"
                onChange={event => this.handleCriteria(event, "lenderType")}
              >
                {lender.map(data => (
                  <Option key={Math.random()} value={data.companyName}>
                    {data.companyName}
                  </Option>
                ))}
              </Select>
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
          <Col span={9}>
            <div className="btn__wrapper">
              <h4 style={{ marginTop: "5px" }}>Repayment Period: </h4>
              <Select
                allowClear
                showSearch
                style={{ width: "60%" }}
                placeholder="Repayment Period"
                onChange={event =>
                  this.handleCriteria(event, "repaymentPeriod")
                }
              >
                {Constants.repaymentPeriod.map(data => (
                  <Option key={Math.random()} value={data.value}>
                    {data.name}
                  </Option>
                ))}
              </Select>
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
                  Settlement
                </Button>
              </div>
            </div>
          </Col>
        </Row>
        <div className="table-wrapper">
          <Table
            rowSelection={{
              type: "checkbox",
              ...rowSelection
            }}
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

export default ListRepayment;
