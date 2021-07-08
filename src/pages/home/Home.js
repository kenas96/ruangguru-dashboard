import React from "react";
import { Card, Table, message, Row, Col } from "antd";
import get from "lodash/get";

import axios from "../../utils/axios";
import { currencyFormatter } from "../../utils/helpers";
import { unixFormatDate, unixFormatDateTime } from "../../utils/DateUtils";
import styles from "./Home.style";

class Home extends React.Component {
  state = {
    loadingContractList: false,
    loadingTopTenDueDate: false,
    contractList: [],
    topTenDueDate: [],
    availableLoan: 0,
    loanDisbursement: 0,
    repaymentTotal: 0,
    repaymentTotalOnPeriod: 0,
    repaymentGracePeriod: 0,
    repaymentOnPenalty: 0
  };

  componentDidMount() {
    // this.getContractList();
    // this.getTopTenDueDate();
    // this.getAvailableLoan();
    // this.getLoanDisbursement();
    // this.getRepaymentTotal();
    // this.getRepaymentTotalOnPeriod();
    // this.getRepaymentGracePeriod();
    // this.getRepaymentOnPenalty();
  }

  getContractList = () => {
    const user = JSON.parse(window.localStorage.getItem("user"));
    const { access_token } = user.token;
    const apiPath = `${process.env.REACT_APP_SERVER_API}qredit/v1/contract/list/approved`;
    this.setState({ loadingContractList: true });
    axios({
      method: "get",
      url: apiPath,
      headers: { Authorization: `Bearer ${access_token}` }
    })
      .then(response => {
        const data = get(response, "data.data", []);
        const contracts = data.map((key, index) => {
          return {
            key: key.id,
            merchant_name: key.customer.name,
            lender: key.product.lender.name,
            date: unixFormatDateTime(key.createdAt),
            max_loan: currencyFormatter(key.product.loan.amount),
            status_scoring: key.status_scoring,
            index: index + 1
          };
        });
        this.setState({
          loadingContractList: false,
          contractList: contracts
        });
      })
      .catch(err => {
        console.log(err); /* eslint-disable-line no-console */
      });
  };

  getTopTenDueDate = () => {
    const user = JSON.parse(window.localStorage.getItem("user"));
    const { access_token } = user.token;
    const apiPath = `${process.env.REACT_APP_SERVER_API}qredit/v1/contract/list/topTen/dueDate`;
    this.setState({ loadingTopTenDueDate: true });
    axios({
      method: "get",
      url: apiPath,
      headers: { Authorization: `Bearer ${access_token}` }
    })
      .then(response => {
        const data = get(response, "data.data", []);
        const topTenDueDate = data.map((key, index) => {
          return {
            key: key.repaymentId,
            name: key.name,
            due_date_payment: unixFormatDate(key.due_date_payment),
            totalDay: key.totalDay,
            index: index + 1
          };
        });

        this.setState({
          loadingTopTenDueDate: false,
          topTenDueDate: topTenDueDate
        });
      })
      .catch(err => {
        console.log(err); /* eslint-disable-line no-console */
      });
  };

  getAvailableLoan = () => {
    const user = JSON.parse(window.localStorage.getItem("user"));
    const { access_token } = user.token;
    const apiPath = `${process.env.REACT_APP_SERVER_API}qredit/v1/disbursement/total/available/today`;
    axios({
      method: "get",
      url: apiPath,
      headers: { Authorization: `Bearer ${access_token}` }
    })
      .then(response => {
        let data = get(response, "data.data.total", 0);
        if (!data) {
          data = 0;
        }
        this.setState({
          availableLoan: data
        });
      })
      .catch(err => {
        console.log(err); /* eslint-disable-line no-console */
      });
  };

  getLoanDisbursement = () => {
    const user = JSON.parse(window.localStorage.getItem("user"));
    const { access_token } = user.token;
    const apiPath = `${process.env.REACT_APP_SERVER_API}qredit/v1/disbursement/total/amount/disbursed`;
    axios({
      method: "get",
      url: apiPath,
      headers: { Authorization: `Bearer ${access_token}` }
    })
      .then(response => {
        let data = get(response, "data.data.total", 0);
        if (!data) {
          data = 0;
        }
        this.setState({
          loanDisbursement: data
        });
      })
      .catch(err => {
        console.log(err); /* eslint-disable-line no-console */
      });
  };

  getRepaymentTotal = () => {
    const user = JSON.parse(window.localStorage.getItem("user"));
    const { access_token } = user.token;
    const apiPath = `${process.env.REACT_APP_SERVER_API}qredit/v1/repayment/total/amount`;
    axios({
      method: "get",
      url: apiPath,
      headers: { Authorization: `Bearer ${access_token}` }
    })
      .then(response => {
        let data = get(response, "data.data.total", 0);
        if (!data) {
          data = 0;
        }
        this.setState({
          repaymentTotal: data
        });
      })
      .catch(err => {
        console.log(err); /* eslint-disable-line no-console */
      });
  };

  getRepaymentTotalOnPeriod = () => {
    const user = JSON.parse(window.localStorage.getItem("user"));
    const { access_token } = user.token;
    const apiPath = `${process.env.REACT_APP_SERVER_API}qredit/v1/repayment/total/amount/onperiod`;
    axios({
      method: "get",
      url: apiPath,
      headers: { Authorization: `Bearer ${access_token}` }
    })
      .then(response => {
        let data = get(response, "data.data.total", 0);
        if (!data) {
          data = 0;
        }
        this.setState({
          repaymentTotalOnPeriod: data
        });
      })
      .catch(err => {
        console.log(err); /* eslint-disable-line no-console */
      });
  };

  getRepaymentGracePeriod = () => {
    const user = JSON.parse(window.localStorage.getItem("user"));
    const { access_token } = user.token;
    const apiPath = `${process.env.REACT_APP_SERVER_API}qredit/v1/repayment/total/amount/gracePeriod`;
    axios({
      method: "get",
      url: apiPath,
      headers: { Authorization: `Bearer ${access_token}` }
    })
      .then(response => {
        let data = get(response, "data.data.total", 0);
        if (!data) {
          data = 0;
        }
        this.setState({
          repaymentGracePeriod: data
        });
      })
      .catch(err => {
        console.log(err); /* eslint-disable-line no-console */
      });
  };

  getRepaymentOnPenalty = () => {
    const user = JSON.parse(window.localStorage.getItem("user"));
    const { access_token } = user.token;
    const apiPath = `${process.env.REACT_APP_SERVER_API}qredit/v1/repayment/total/amount/penalty`;
    axios({
      method: "get",
      url: apiPath,
      headers: { Authorization: `Bearer ${access_token}` }
    })
      .then(response => {
        let data = get(response, "data.data.total", 0);
        if (!data) {
          data = 0;
        }
        this.setState({
          repaymentOnPenalty: data
        });
      })
      .catch(err => {
        console.log(err); /* eslint-disable-line no-console */
      });
  };

  error = () => {
    message.error("Internal server error");
  };

  render() {
    const {
      loadingContractList,
      loadingTopTenDueDate,
      contractList,
      topTenDueDate,
      availableLoan,
      loanDisbursement,
      repaymentTotal,
      repaymentTotalOnPeriod,
      repaymentGracePeriod,
      repaymentOnPenalty
    } = this.state;

    const columnsContractList = [
      {
        title: "No",
        dataIndex: "index"
      },
      {
        title: "Merchant Name",
        dataIndex: "merchant_name"
      },
      {
        title: "Lender",
        dataIndex: "lender"
      },
      {
        title: "Date/Time Added",
        dataIndex: "date"
      },
      {
        title: "Max. Loan",
        dataIndex: "max_loan"
      },
      {
        title: "Scoring Status",
        dataIndex: "status_scoring",
        render: (text, record) =>
          record.status_scoring === "Approved" ? (
            <b style={{ color: "green" }}>{record.status_scoring}</b>
          ) : (
            <b style={{ color: "red" }}>{record.status_scoring}</b>
          )
      }
    ];

    const columnsTopTenDueDate = [
      {
        title: "No",
        dataIndex: "index"
      },
      {
        title: "Merchant Name",
        dataIndex: "name"
      },
      {
        title: "Due Date",
        dataIndex: "due_date_payment"
      },
      {
        title: "Day Past Due",
        dataIndex: "totalDay",
        render: (text, record) =>
          record.totalDay <= 30 ? (
            <b style={{ color: "orange" }}>{record.totalDay} Days</b>
          ) : (
            <b style={{ color: "red" }}>{record.totalDay} Days</b>
          )
      }
    ];
    return (
      <div>
        <Row gutter={16}>
          <Col span={12}>
            <h2>Portfolio Summary</h2>
          </Col>
        </Row>
        <Row gutter={4}>
          {/* <Col span={4}>
            <Card title="Available Loan" bodyStyle={{ padding: 5 }}>
              <label style={styles.cardContentGreen}>
                {currencyFormatter(availableLoan)}
              </label>
            </Card>
          </Col>
          <Col span={4}>
            <Card
              title="Total number of loans disbursed"
              bodyStyle={{ padding: 5 }}
            >
              <label style={styles.cardContentGreen}>
                {currencyFormatter(loanDisbursement)}
              </label>
            </Card>
          </Col>
          <Col span={4}>
            <Card title="Repayment Amount" bodyStyle={{ padding: 5 }}>
              <label style={styles.cardContentGreen}>
                {currencyFormatter(repaymentTotal)}
              </label>
            </Card>
          </Col>
          <Col span={4}>
            <Card title="On Period Amount" bodyStyle={{ padding: 5 }}>
              <label style={styles.cardContentGreen}>
                {currencyFormatter(repaymentTotalOnPeriod)}
              </label>
            </Card>
          </Col>
          <Col span={4}>
            <Card title="On Grace Period Amount" bodyStyle={{ padding: 5 }}>
              <label style={styles.cardContentYellow}>
                {currencyFormatter(repaymentGracePeriod)}
              </label>
            </Card>
          </Col>
          <Col span={4}>
            <Card title="On Penalty Amount" bodyStyle={{ padding: 5 }}>
              <label style={styles.cardContentRed}>
                {currencyFormatter(repaymentOnPenalty)}
              </label>
            </Card>
          </Col> */}
        </Row>
        <Row gutter={16} style={styles.tableHead}>
          {/* <Col span={14}>
            <h2>Approved Merchant Loans</h2>
            <div className="table-wrapper">
              <Table
                className="table"
                columns={columnsContractList}
                dataSource={contractList}
                pagination={false}
                loading={loadingContractList}
              />
            </div>
          </Col>
          <Col span={10}>
            <h2>Consolidate Repayment Schedule</h2>
            <div className="table-wrapper">
              <Table
                className="table"
                columns={columnsTopTenDueDate}
                dataSource={topTenDueDate}
                pagination={false}
                loading={loadingTopTenDueDate}
              />
            </div>
          </Col> */}
        </Row>
      </div>
    );
  }
}

export default Home;
