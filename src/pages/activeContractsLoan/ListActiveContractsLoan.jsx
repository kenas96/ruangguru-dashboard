import React from "react";
import { Row, Col, message, Tabs, Tag, Tooltip } from "antd";
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
import Contracts from "../../components/contracts/Contracts";
import { Constants } from "../../utils/Constants";

const { TabPane } = Tabs;

class ListActiveContractsLoan extends React.Component {
  state = {
    data: [],
    dataActive: [],
    dataRenewal: [],
    pagination: {
      total: 0,
      current: 1,
      pages: 1,
      pageSize: 10
    },
    paginationActive: {
      total: 0,
      current: 1,
      pages: 1,
      pageSize: 10
    },
    paginationRenewal: {
      total: 0,
      current: 1,
      pages: 1,
      pageSize: 10
    },
    loading: false,
    loadingActive: false,
    loadingRenewal: false,
    endValue: null,
    endValueActive: null,
    endValueRenewal: null,
    startValue: null,
    startValueActive: null,
    startValueRenewal: null,
    endOpen: false,
    endOpenActive: false,
    endOpenRenewal: false,
    searchCriteria: [],
    searchCriteriaActive: [],
    searchCriteriaRenewal: [],
    selectedColumn: [],
    selectedColumnActive: [],
    selectedColumnRenewal: [],
    categoryType: [],
    lender: [],
    lenderActive: [],
    lenderRenewal: []
  };

  componentDidMount() {
    this.fetch();
    this.fetchActive();
    this.fetchRenewal();
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

  getDataCompanyActive(categoryType) {
    getCompany(categoryType)
      .then(({ data }) => {
        const lenderActive = get(data, "data", []);
        this.setState({
          lenderActive
        });
      })
      .catch(error => {
        message.error(error, 4);
      });
  }

  getDataCompanyRenewal(categoryType) {
    getCompany(categoryType)
      .then(({ data }) => {
        const lenderRenewal = get(data, "data", []);
        this.setState({
          lenderRenewal
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

  handleTableChangeActive = (pagination, filter, sorter) => {
    setTimeout(() => {
      const { paginationActive: pageState } = this.state;
      const pager = {
        ...pageState,
        current: paginationActive.current
      };
      this.setState(
        {
          paginationActive: pager
        },
        () => {
          this.fetchActive();
        }
      );
    }, 400);
  };

  handleTableChangeRenewal = (pagination, filter, sorter) => {
    setTimeout(() => {
      const { paginationRenewal: pageState } = this.state;
      const pager = {
        ...pageState,
        current: paginationRenewal.current
      };
      this.setState(
        {
          paginationRenewal: pager
        },
        () => {
          this.fetchRenewal();
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

  handleCriteriaActive = (value, searchKey) => {
    const updatedCriteria = {
      name: searchKey,
      value: value
    };

    this.setState(state => {
      const searchCriteriaActive = [
        ...state.searchCriteriaActive,
        updatedCriteria
      ];
      return {
        searchCriteriaActive
      };
    });
  };

  handleCriteriaRenewal = (value, searchKey) => {
    const updatedCriteria = {
      name: searchKey,
      value: value
    };

    this.setState(state => {
      const searchCriteriaRenewal = [
        ...state.searchCriteriaRenewal,
        updatedCriteria
      ];
      return {
        searchCriteriaRenewal
      };
    });
  };

  handleCategoryType = (value, searchKey) => {
    this.getDataCompany(value);
    this.handleCriteria(value, searchKey);
  };

  handleCategoryTypeActive = (value, searchKey) => {
    this.getDataCompanyActive(value);
    this.handleCriteriaActive(value, searchKey);
  };

  handleCategoryTypeRenewal = (value, searchKey) => {
    this.getDataCompanyRenewal(value);
    this.handleCriteriaRenewal(value, searchKey);
  };

  handleSearch = () => {
    this.fetch();
  };

  handleSearchActive = () => {
    this.fetchActive();
  };

  handleSearchRenewal = () => {
    this.fetchRenewal();
  };

  handleColumn = value => {
    this.setState(state => {
      const selectedColumn = value;
      return {
        selectedColumn
      };
    });
  };

  handleColumnActive = value => {
    this.setState(state => {
      const selectedColumnActive = value;
      return {
        selectedColumnActive
      };
    });
  };

  handleColumnRenewal = value => {
    this.setState(state => {
      const selectedColumnRenewal = value;
      return {
        selectedColumnRenewal
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
    const apiPath = `${process.env.REACT_APP_SERVER_API}qredit/v1/contract/list/active`;
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
        const contracts = data.row.map((key, index) => {
          return {
            key: index + 1 + (pagination.current - 1) * pagination.pageSize,
            merchant_id: key.client_id,
            merchant_name: key.name,
            contract_number: key.contract_number,
            category_type: key.lender_type.toLowerCase(),
            lender: key.company_name,
            date: unixFormatDateTime(key.sign_in_date),
            due_date: unixFormatDateShort(key.due_date_payment),
            tenor: key.term_day.toLowerCase(),
            max_amount_allowed: key.max_amount_allowed
              ? currencyFormatter(key.max_amount_allowed)
              : "-",
            loan_amount: currencyFormatter(key.loan_amount),
            processing_fee: currencyFormatter(key.processing_fee),
            loan_disbursement: currencyFormatter(key.loan_disbursement),
            admin_fee: currencyFormatter(key.admin_fee),
            amount_disbursement: currencyFormatter(key.amount_disbursement),
            contract_status: key.contract_status,
            index: index + 1 + (pagination.current - 1) * pagination.pageSize
          };
        });
        this.setState({
          loading: false,
          data: contracts,
          pagination
        });
      })
      .catch(err => {
        console.log(err); /* eslint-disable-line no-console */
      });
  };

  fetchActive = () => {
    const {
      paginationActive: { current, pageSize },
      searchCriteriaActive
    } = this.state;

    let params = {
      page: current,
      limit: pageSize
    };
    searchCriteriaActive.map(item => {
      params[item.name] = item.value;
    });

    const user = JSON.parse(window.localStorage.getItem("user"));
    const { access_token } = user.token;
    const apiPath = `${process.env.REACT_APP_SERVER_API}qredit/v1/contract/list/active?contractStatus=ACTIVE`;
    this.setState({ loadingActive: true });
    axios({
      method: "get",
      url: apiPath,
      params: {
        ...params
      },
      headers: { Authorization: `Bearer ${access_token}` }
    })
      .then(response => {
        const { paginationActive } = this.state;
        const data = get(response, "data.data", []);
        paginationActive.total = data.count;
        paginationActive.pages = Math.ceil(
          data.count / paginationActive.pageSize
        );
        const contracts = data.row.map((key, index) => {
          return {
            key:
              index +
              1 +
              (paginationActive.current - 1) * paginationActive.pageSize,
            merchant_id: key.client_id,
            merchant_name: key.name,
            contract_number: key.contract_number,
            category_type: key.lender_type.toLowerCase(),
            lender: key.company_name,
            date: unixFormatDateTime(key.sign_in_date),
            due_date: unixFormatDateShort(key.due_date_payment),
            tenor: key.term_day.toLowerCase(),
            max_amount_allowed: key.max_amount_allowed
              ? currencyFormatter(key.max_amount_allowed)
              : "-",
            loan_amount: currencyFormatter(key.loan_amount),
            processing_fee: currencyFormatter(key.processing_fee),
            loan_disbursement: currencyFormatter(key.loan_disbursement),
            admin_fee: currencyFormatter(key.admin_fee),
            amount_disbursement: currencyFormatter(key.amount_disbursement),
            contract_status: key.contract_status,
            index:
              index +
              1 +
              (paginationActive.current - 1) * paginationActive.pageSize
          };
        });
        this.setState({
          loadingActive: false,
          dataActive: contracts,
          paginationActive
        });
      })
      .catch(err => {
        console.log(err); /* eslint-disable-line no-console */
      });
  };

  fetchRenewal = () => {
    const {
      paginationRenewal: { current, pageSize },
      searchCriteriaRenewal
    } = this.state;

    let params = {
      page: current,
      limit: pageSize
    };
    searchCriteriaRenewal.map(item => {
      params[item.name] = item.value;
    });

    const user = JSON.parse(window.localStorage.getItem("user"));
    const { access_token } = user.token;
    const apiPath = `${process.env.REACT_APP_SERVER_API}qredit/v1/contract/list/active?contractStatus=RENEWAL`;
    this.setState({ loadingRenewal: true });
    axios({
      method: "get",
      url: apiPath,
      params: {
        ...params
      },
      headers: { Authorization: `Bearer ${access_token}` }
    })
      .then(response => {
        const { paginationRenewal } = this.state;
        const data = get(response, "data.data", []);
        paginationRenewal.total = data.count;
        paginationRenewal.pages = Math.ceil(
          data.count / paginationRenewal.pageSize
        );
        const contracts = data.row.map((key, index) => {
          return {
            key:
              index +
              1 +
              (paginationRenewal.current - 1) * paginationRenewal.pageSize,

            merchant_id: key.client_id,
            merchant_name: key.name,
            contract_number: key.contract_number,
            category_type: key.lender_type.toLowerCase(),
            lender: key.company_name,
            date: unixFormatDateTime(key.sign_in_date),
            due_date: unixFormatDateShort(key.due_date_payment),
            tenor: key.term_day.toLowerCase(),
            max_amount_allowed: key.max_amount_allowed
              ? currencyFormatter(key.max_amount_allowed)
              : "-",
            loan_amount: currencyFormatter(key.loan_amount),
            processing_fee: currencyFormatter(key.processing_fee),
            loan_disbursement: currencyFormatter(key.loan_disbursement),
            admin_fee: currencyFormatter(key.admin_fee),
            amount_disbursement: currencyFormatter(key.amount_disbursement),
            contract_status: key.contract_status,
            index:
              index +
              1 +
              (paginationRenewal.current - 1) * paginationRenewal.pageSize
          };
        });
        this.setState({
          loadingRenewal: false,
          dataRenewal: contracts,
          paginationRenewal
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

  disabledEndDateActive = endValue => {
    const { startValueActive } = this.state;
    if (!endValue || !startValueActive) {
      return false;
    }
    return endValue.valueOf() <= startValueActive.valueOf();
  };

  disabledEndDateRenewal = endValue => {
    const { startValueRenewal } = this.state;
    if (!endValue || !startValueRenewal) {
      return false;
    }
    return endValue.valueOf() <= startValueRenewal.valueOf();
  };

  onStartChange = (value, valueString) => {
    const date = convertDateToEpoch(value);
    const convertedDate = unixFormatDateTimeStripe(date);
    this.setState({
      startValue: convertedDate
    });
    this.handleCriteria(convertedDate, "from");
  };

  onStartChangeActive = (value, valueString) => {
    const date = convertDateToEpoch(value);
    const convertedDate = unixFormatDateTimeStripe(date);
    this.setState({
      startValueActive: convertedDate
    });
    this.handleCriteriaActive(convertedDate, "from");
  };

  onStartChangeRenewal = (value, valueString) => {
    const date = convertDateToEpoch(value);
    const convertedDate = unixFormatDateTimeStripe(date);
    this.setState({
      startValueRenewal: convertedDate
    });
    this.handleCriteriaRenewal(convertedDate, "from");
  };

  onEndChange = (value, valueString) => {
    const date = convertDateToEpoch(value);
    const convertedDate = unixFormatDateTimeStripe(date);
    this.setState({
      endValue: convertedDate
    });
    this.handleCriteria(convertedDate, "to");
  };

  onEndChangeActive = (value, valueString) => {
    const date = convertDateToEpoch(value);
    const convertedDate = unixFormatDateTimeStripe(date);
    this.setState({
      endValueActive: convertedDate
    });
    this.handleCriteriaActive(convertedDate, "to");
  };

  onEndChangeRenewal = (value, valueString) => {
    const date = convertDateToEpoch(value);
    const convertedDate = unixFormatDateTimeStripe(date);
    this.setState({
      endValueRenewal: convertedDate
    });
    this.handleCriteriaRenewal(convertedDate, "to");
  };

  handleStartOpenChange = open => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  };

  handleStartOpenChangeActive = open => {
    if (!open) {
      this.setState({ endOpenActive: true });
    }
  };

  handleStartOpenChangeRenewal = open => {
    if (!open) {
      this.setState({ endOpenRenewal: true });
    }
  };

  handleEndOpenChange = open => {
    this.setState({ endOpen: open });
  };

  handleEndOpenChangeActive = open => {
    this.setState({ endOpenActive: open });
  };

  handleEndOpenChangeRenewal = open => {
    this.setState({ endOpenRenewal: open });
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

  onStartTimeChangeActive = (value, valueString) => {
    var date = new Date(this.state.startValueActive);
    date.setHours(
      valueString[0] + valueString[1],
      valueString[3] + valueString[4],
      0
    );
    this.handleCriteriaActive(unixFormatDateTimeStripe(date), "from");
  };

  onStartTimeChangeRenewal = (value, valueString) => {
    var date = new Date(this.state.startValueRenewal);
    date.setHours(
      valueString[0] + valueString[1],
      valueString[3] + valueString[4],
      0
    );
    this.handleCriteriaRenewal(unixFormatDateTimeStripe(date), "from");
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

  onEndTimeChangeActive = (value, valueString) => {
    var date = new Date(this.state.endValueActive);
    date.setHours(
      valueString[0] + valueString[1],
      valueString[3] + valueString[4],
      0
    );
    this.handleCriteriaActive(unixFormatDateTimeStripe(date), "to");
  };

  onEndTimeChangeRenewal = (value, valueString) => {
    var date = new Date(this.state.endValueRenewal);
    date.setHours(
      valueString[0] + valueString[1],
      valueString[3] + valueString[4],
      0
    );
    this.handleCriteriaRenewal(unixFormatDateTimeStripe(date), "to");
  };

  download = () => {
    const { searchCriteria } = this.state;
    let params = {};
    searchCriteria.map(item => {
      params[item.name] = item.value;
    });

    const user = JSON.parse(window.localStorage.getItem("user"));
    const { access_token } = user.token;
    const apiPath = `${process.env.REACT_APP_SERVER_API}qredit/v1/contract/list/active/download`;
    let selectedColumnKey = [];
    let selectedColumn = [
      "index",
      "merchant_name",
      "category_type",
      "lender",
      "tenor",
      "loan_amount",
      "processing_fee",
      "loan_disbursement",
      "admin_fee",
      "amount_disbursement",
      "contract_status"
    ];

    if (this.state.selectedColumn.length > 0) {
      selectedColumn = this.state.selectedColumn;
    }

    selectedColumn.map(data => {
      let index = Constants.keyValueSettlementContracts.findIndex(
        x => x.value === data
      );
      if (index !== -1) {
        selectedColumnKey.push(
          Constants.keyValueSettlementContracts[index].key
        );
      }
    });
    this.setState({ loading: true });
    axios({
      method: "post",
      url: apiPath,
      responseType: "blob",
      headers: { Authorization: "Bearer " + access_token },
      data: {
        from: params.from,
        to: params.to,
        lenderType: params.lenderType,
        categoryType: params.categoryType,
        contractStatus: params.contractStatus,
        columnList: selectedColumnKey
      }
    })
      .then(response => {
        this.setState({ loading: false });
        const date = unixFormatDateStripe(Date.now());
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Contracts-${date}.xls`);
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

  downloadActive = () => {
    const { searchCriteriaActive } = this.state;
    let params = {
      contractStatus: "ACTIVE"
    };
    searchCriteriaActive.map(item => {
      params[item.name] = item.value;
    });

    const user = JSON.parse(window.localStorage.getItem("user"));
    const { access_token } = user.token;
    const apiPath = `${process.env.REACT_APP_SERVER_API}qredit/v1/contract/list/active/download`;
    let selectedColumnKey = [];
    let selectedColumn = [
      "index",
      "merchant_name",
      "category_type",
      "lender",
      "tenor",
      "loan_amount",
      "processing_fee",
      "loan_disbursement",
      "admin_fee",
      "amount_disbursement",
      "contract_status"
    ];

    if (this.state.selectedColumnActive.length > 0) {
      selectedColumn = this.state.selectedColumnActive;
    }

    selectedColumn.map(data => {
      let index = Constants.keyValueSettlementContracts.findIndex(
        x => x.value === data
      );
      if (index !== -1) {
        selectedColumnKey.push(
          Constants.keyValueSettlementContracts[index].key
        );
      }
    });
    this.setState({ loadingActive: true });
    axios({
      method: "post",
      url: apiPath,
      responseType: "blob",
      headers: { Authorization: "Bearer " + access_token },
      data: {
        from: params.from,
        to: params.to,
        lenderType: params.lenderType,
        categoryType: params.categoryType,
        contractStatus: params.contractStatus,
        columnList: selectedColumnKey
      }
    })
      .then(response => {
        this.setState({ loadingActive: false });
        const date = unixFormatDateStripe(Date.now());
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Contracts-Active-${date}.xls`);
        document.body.appendChild(link);
        link.click();
      })
      .catch(error => {
        this.setState({ loadingActive: false });
        const errMsg = get(error, "response.status", null);
        if (errMsg === 400) {
          message.error("Error! Data does not exist!");
        } else {
          message.error("Internal server error!");
        }
      });
  };

  downloadRenewal = () => {
    const { searchCriteriaRenewal } = this.state;
    let params = {
      contractStatus: "RENEWAL"
    };
    searchCriteriaRenewal.map(item => {
      params[item.name] = item.value;
    });

    const user = JSON.parse(window.localStorage.getItem("user"));
    const { access_token } = user.token;
    const apiPath = `${process.env.REACT_APP_SERVER_API}qredit/v1/contract/list/active/download`;
    let selectedColumnKey = [];
    let selectedColumn = [
      "index",
      "merchant_name",
      "category_type",
      "lender",
      "tenor",
      "loan_amount",
      "processing_fee",
      "loan_disbursement",
      "admin_fee",
      "amount_disbursement",
      "contract_status"
    ];

    if (this.state.selectedColumnRenewal.length > 0) {
      selectedColumn = this.state.selectedColumnRenewal;
    }

    selectedColumn.map(data => {
      let index = Constants.keyValueSettlementContracts.findIndex(
        x => x.value === data
      );
      if (index !== -1) {
        selectedColumnKey.push(
          Constants.keyValueSettlementContracts[index].key
        );
      }
    });
    this.setState({ loadingRenewal: true });
    axios({
      method: "post",
      url: apiPath,
      responseType: "blob",
      headers: { Authorization: "Bearer " + access_token },
      data: {
        from: params.from,
        to: params.to,
        lenderType: params.lenderType,
        categoryType: params.categoryType,
        contractStatus: params.contractStatus,
        columnList: selectedColumnKey
      }
    })
      .then(response => {
        this.setState({ loadingRenewal: false });
        const date = unixFormatDateStripe(Date.now());
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Contracts-Renewal-${date}.xls`);
        document.body.appendChild(link);
        link.click();
      })
      .catch(error => {
        this.setState({ loadingRenewal: false });
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
      dataActive,
      dataRenewal,
      pagination,
      paginationActive,
      paginationRenewal,
      loading,
      loadingActive,
      loadingRenewal,
      endOpen,
      endOpenActive,
      endOpenRenewal,
      startValue,
      startValueActive,
      startValueRenewal,
      endValue,
      endValueActive,
      endValueRenewal,
      selectedColumn,
      selectedColumnActive,
      selectedColumnRenewal,
      categoryType,
      lender,
      lenderActive,
      lenderRenewal
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
        title: "Max. Loan",
        dataIndex: "max_amount_allowed",
        show: false
      },
      {
        title: "Apply Loan",
        dataIndex: "loan_amount",
        show: true
      },
      {
        title: "Processing Fee",
        dataIndex: "processing_fee",
        show: true
      },
      {
        title: "Loan Disbursement",
        dataIndex: "loan_disbursement",
        show: true
      },
      {
        title: (
          <Tooltip title={"This is Admin Fee"}>
            <span>Admin Fee</span>
          </Tooltip>
        ),
        dataIndex: "admin_fee",
        show: true
      },
      {
        title: "Amount Disbursement",
        dataIndex: "amount_disbursement",
        show: true
      },
      {
        title: "Contract Status",
        dataIndex: "contract_status",
        show: true,
        render: (text, record) =>
          record.contract_status === "ACTIVE" ? (
            <Tag color="#87d068">Active</Tag>
          ) : (
            <Tag color="#ffae21">Renewal</Tag>
          )
      }
    ];

    let columnsActive = [
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
        title: "Max. Loan",
        dataIndex: "max_amount_allowed",
        show: false
      },
      {
        title: "Apply Loan",
        dataIndex: "loan_amount",
        show: true
      },
      {
        title: "Processing Fee (1,25%)",
        dataIndex: "processing_fee",
        show: true
      },
      {
        title: "Loan Disbursement",
        dataIndex: "loan_disbursement",
        show: true
      },
      {
        title: "Admin Fee",
        dataIndex: "admin_fee",
        show: true
      },
      {
        title: "Amount Disbursement",
        dataIndex: "amount_disbursement",
        show: true
      },
      {
        title: "Contract Status",
        dataIndex: "contract_status",
        show: true,
        render: (text, record) =>
          record.contract_status === "ACTIVE" ? (
            <Tag color="#87d068">Active</Tag>
          ) : (
            <Tag color="#ffae21">Renewal</Tag>
          )
      }
    ];

    let columnsRenewal = [
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
        title: "Max. Loan",
        dataIndex: "max_amount_allowed",
        show: false
      },
      {
        title: "Apply Loan",
        dataIndex: "loan_amount",
        show: true
      },
      {
        title: "Processing Fee (1,25%)",
        dataIndex: "processing_fee",
        show: true
      },
      {
        title: "Loan Disbursement",
        dataIndex: "loan_disbursement",
        show: true
      },
      {
        title: "Admin Fee",
        dataIndex: "admin_fee",
        show: true
      },
      {
        title: "Amount Disbursement",
        dataIndex: "amount_disbursement",
        show: true
      },
      {
        title: "Contract Status",
        dataIndex: "contract_status",
        show: true,
        render: (text, record) =>
          record.contract_status === "ACTIVE" ? (
            <Tag color="#87d068">Active</Tag>
          ) : (
            <Tag color="#ffae21">Renewal</Tag>
          )
      }
    ];

    const defaultColumn = [
      "index",
      "merchant_name",
      "category_type",
      "lender",
      "tenor",
      "loan_amount",
      "processing_fee",
      "loan_disbursement",
      "admin_fee",
      "amount_disbursement",
      "contract_status"
    ];

    const defaultColumnActive = [
      "index",
      "merchant_name",
      "category_type",
      "lender",
      "tenor",
      "loan_amount",
      "processing_fee",
      "loan_disbursement",
      "admin_fee",
      "amount_disbursement",
      "contract_status"
    ];

    const defaultColumnRenewal = [
      "index",
      "merchant_name",
      "category_type",
      "lender",
      "tenor",
      "loan_amount",
      "processing_fee",
      "loan_disbursement",
      "admin_fee",
      "amount_disbursement",
      "contract_status"
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

    if (selectedColumnActive.length) {
      columnsActive.map(item => {
        if (selectedColumnActive.includes(item.dataIndex)) {
          item.show = true;
        } else {
          item.show = false;
        }
      });
    }

    if (selectedColumnRenewal.length) {
      columnsRenewal.map(item => {
        if (selectedColumnRenewal.includes(item.dataIndex)) {
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
            <h2>Active Contracts Loan</h2>
          </Col>
        </Row>
        <Tabs defaultActiveKey="1">
          <TabPane tab="All" key="1">
            <Contracts
              categoryType={categoryType}
              handleCategoryType={this.handleCategoryType}
              onStartChange={this.onStartChange}
              handleStartOpenChange={this.handleStartOpenChange}
              disabledEndDate={this.disabledEndDate}
              onEndChange={this.onEndChange}
              endOpen={endOpen}
              handleEndOpenChange={this.handleEndOpenChange}
              handleCriteria={this.handleCriteria}
              lender={lender}
              startValue={startValue}
              onStartTimeChange={this.onStartTimeChange}
              endValue={endValue}
              onEndTimeChange={this.onEndTimeChange}
              defaultColumn={defaultColumn}
              handleColumn={this.handleColumn}
              columns={columns}
              handleSearch={this.handleSearch}
              data={data}
              pagination={pagination}
              loading={loading}
              handleTableChange={this.handleTableChange}
              all={true}
              download={this.download}
            />
          </TabPane>
          <TabPane tab="Active" key="2">
            <Contracts
              categoryType={categoryType}
              handleCategoryType={this.handleCategoryTypeActive}
              onStartChange={this.onStartChangeActive}
              handleStartOpenChange={this.handleStartOpenChangeActive}
              disabledEndDate={this.disabledEndDateActive}
              onEndChange={this.onEndChangeActive}
              endOpen={endOpenActive}
              handleEndOpenChange={this.handleEndOpenChangeActive}
              handleCriteria={this.handleCriteriaActive}
              lender={lenderActive}
              startValue={startValueActive}
              onStartTimeChange={this.onStartTimeChangeActive}
              endValue={endValueActive}
              onEndTimeChange={this.onEndTimeChangeActive}
              defaultColumn={defaultColumnActive}
              handleColumn={this.handleColumnActive}
              columns={columnsActive}
              handleSearch={this.handleSearchActive}
              data={dataActive}
              pagination={paginationActive}
              loading={loadingActive}
              handleTableChange={this.handleTableChangeActive}
              all={false}
              download={this.downloadActive}
            />
          </TabPane>
          <TabPane tab="Renewal" key="3">
            <Contracts
              categoryType={categoryType}
              handleCategoryType={this.handleCategoryTypeRenewal}
              onStartChange={this.onStartChangeRenewal}
              handleStartOpenChange={this.handleStartOpenChangeRenewal}
              disabledEndDate={this.disabledEndDateRenewal}
              onEndChange={this.onEndChangeRenewal}
              endOpen={endOpenRenewal}
              handleEndOpenChange={this.handleEndOpenChangeRenewal}
              handleCriteria={this.handleCriteriaRenewal}
              lender={lenderRenewal}
              startValue={startValueRenewal}
              onStartTimeChange={this.onStartTimeChangeRenewal}
              endValue={endValueRenewal}
              onEndTimeChange={this.onEndTimeChangeRenewal}
              defaultColumn={defaultColumnRenewal}
              handleColumn={this.handleColumnRenewal}
              columns={columnsRenewal}
              handleSearch={this.handleSearchRenewal}
              data={dataRenewal}
              pagination={paginationRenewal}
              loading={loadingRenewal}
              handleTableChange={this.handleTableChangeRenewal}
              all={false}
              download={this.downloadRenewal}
            />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default ListActiveContractsLoan;
