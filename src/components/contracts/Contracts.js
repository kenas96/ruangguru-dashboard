import React from "react";
import { Table, Button, DatePicker, Select, Row, Col, TimePicker } from "antd";
import PropTypes from "prop-types";

import { Constants } from "../../utils/Constants";

const { Option } = Select;

const Contracts = ({
  categoryType,
  handleCategoryType,
  onStartChange,
  handleStartOpenChange,
  disabledEndDate,
  onEndChange,
  endOpen,
  handleEndOpenChange,
  handleCriteria,
  lender,
  startValue,
  onStartTimeChange,
  endValue,
  onEndTimeChange,
  defaultColumn,
  handleColumn,
  columns,
  handleSearch,
  data,
  pagination,
  loading,
  handleTableChange,
  all,
  download
}) => {
  return (
    <div>
      <Row gutter={16} style={{ paddingTop: "20px", fontSize: "12px" }}>
        <Col span={9}>
          <div className="btn__wrapper">
            <h4 style={{ marginTop: "5px" }}>Category Type: </h4>
            <Select
              allowClear
              showSearch
              style={{ width: "60%" }}
              placeholder="Category Type"
              onChange={event => handleCategoryType(event, "categoryType")}
            >
              {categoryType.map(data => (
                <Option key={Math.random()} value={data.lenderType}>
                  {data.lenderType}
                </Option>
              ))}
            </Select>
          </div>
        </Col>
        <Col span={7}>
          <div className="btn__wrapper">
            <h4 style={{ marginTop: "5px" }}>Start Applied Date: </h4>
            <DatePicker
              name="startDate"
              className="date_picker--position"
              style={{ width: "60%" }}
              size="medium"
              format="DD/MM/YYYY"
              placeholder="Start Date"
              onChange={onStartChange}
              onOpenChange={handleStartOpenChange}
            />
          </div>
        </Col>
        <Col span={7}>
          <div className="btn__wrapper">
            <h4 style={{ marginTop: "5px" }}>End Applied Date: </h4>
            <DatePicker
              name="endDate"
              className="date_picker--position"
              style={{ width: "60%" }}
              disabledDate={disabledEndDate}
              size="medium"
              format="DD/MM/YYYY "
              placeholder="End Date"
              onChange={onEndChange}
              open={endOpen}
              onOpenChange={handleEndOpenChange}
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
              onChange={event => handleCriteria(event, "lenderType")}
              disabled={lender.length === 0}
            >
              {lender.map(data => (
                <Option key={Math.random()} value={data.companyName}>
                  {data.companyName}
                </Option>
              ))}
            </Select>
          </div>
        </Col>
        <Col span={7}>
          <div className="btn__wrapper">
            <h4 style={{ marginTop: "5px" }}>Start Time: </h4>
            <TimePicker
              format={"HH:mm"}
              placeholder="Start Time"
              size="medium"
              className="date_picker--position"
              style={{ width: "60%" }}
              disabled={!startValue}
              onChange={onStartTimeChange}
            />
          </div>
        </Col>
        <Col span={7}>
          <div className="btn__wrapper">
            <h4 style={{ marginTop: "5px" }}>End Time: </h4>
            <TimePicker
              format={"HH:mm"}
              placeholder="End Time"
              size="medium"
              className="date_picker--position"
              style={{ width: "60%" }}
              disabled={!endValue}
              onChange={onEndTimeChange}
            />
          </div>
        </Col>
        {all && (
          <Col span={9}>
            <div className="btn__wrapper">
              <h4 style={{ marginTop: "5px" }}>Contract Status: </h4>
              <Select
                allowClear
                showSearch
                style={{ width: "60%" }}
                placeholder="Contract Status"
                onChange={event => handleCategoryType(event, "contractStatus")}
              >
                {Constants.contractStatus.map(data => (
                  <Option key={Math.random()} value={data.value}>
                    {data.name}
                  </Option>
                ))}
              </Select>
            </div>
          </Col>
        )}
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
              onChange={event => handleColumn(event)}
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
                onClick={handleSearch}
              >
                Filter
              </Button>
              <Button
                type="primary"
                icon="download"
                style={{ marginRight: "10px" }}
                onClick={download}
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
          onChange={handleTableChange}
        />
      </div>
    </div>
  );
};

Contracts.propTypes = {
  categoryType: PropTypes.PropTypes.instanceOf(Array),
  handleCategoryType: PropTypes.func,
  onStartChange: PropTypes.func,
  handleStartOpenChange: PropTypes.func,
  disabledEndDate: PropTypes.func,
  onEndChange: PropTypes.func,
  endOpen: PropTypes.bool,
  handleEndOpenChange: PropTypes.func,
  handleCriteria: PropTypes.func,
  lender: PropTypes.PropTypes.instanceOf(Array),
  startValue: PropTypes.string,
  onStartTimeChange: PropTypes.func,
  endValue: PropTypes.string,
  onEndTimeChange: PropTypes.func,
  defaultColumn: PropTypes.PropTypes.instanceOf(Array),
  handleColumn: PropTypes.func,
  columns: PropTypes.PropTypes.instanceOf(Array),
  handleSearch: PropTypes.func,
  data: PropTypes.PropTypes.instanceOf(Array),
  pagination: PropTypes.instanceOf(Object),
  loading: PropTypes.bool,
  handleTableChange: PropTypes.func,
  all: PropTypes.bool,
  download: PropTypes.func
};

export default Contracts;
