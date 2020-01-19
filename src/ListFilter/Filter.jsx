import React, { Component } from 'react';

import { Button, Checkbox, Col, notification, Row, Select } from 'antd';

import style from './filter.module.scss';

const { Option } = Select;

function i18n(argument) {
  return 22;
}
class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedValues: [],
      collspan: false,
      disabled: false,
      searchValue: []
    };
  };

  countLength = () => {
    const valueLengthLimit = this.props.valueLengthLimit;
    if (valueLengthLimit) {
      this.setState({
        disabled: this.state.checkedValues.length + this.state.searchValue.length >= valueLengthLimit
      }, () => {
        if (this.state.disabled) {
          notification.info({
            description: `${i18n('FilterList_i18n_gEL4')}${valueLengthLimit}${i18n('FilterList_i18n_Q2OT')},${i18n('FilterList_i18n_7mpq')}。`,
            duration: 3,
            message: `${this.props.title}${i18n('BugTable_i18n_kme6')}`,
          });
        }
      });
    }
  };

  handleCheckboxChange = (checkedValues) => {
    this.props.filterFn(checkedValues);
    this.setState({
      checkedValues: checkedValues
    }, () => {
      this.countLength();
    });
  };

  handleSearchChange = (searchValue) => {
    this.props.searchFn(searchValue);
    this.setState({
      searchValue: searchValue
    }, () => {
      this.countLength();
    });
  };

  render() { // filter searchList title removeBorder filterFn searchFn
    return (
      <Row className={[`${this.state.collspan ? style.collspan : ''}`, "wrap"].join(' ')} style={this.props.removeBorder ? {padding: '10px 0 0'} : {borderTop: '1px solid rgba(151,151,151, 0.3)', padding: '10px 0', marginTop: '10px'}}>
        <Col className={style.titleWrap} onClick={()=>{
          this.setState({
            collspan: !this.state.collspan
          });
        }}>
          <div>{this.props.title}</div>
          <svg className={[`icon`, `${style.svg}`].join(' ')} aria-hidden="true">
            <use xlinkHref="#icon-arrow-down"></use>
          </svg>
        </Col>
        <Col className={style.groupList}>
          <Checkbox.Group
            onChange={this.handleCheckboxChange}
            style={{width: '100%'}}
          >
          { this.props.filter.length > 0 && this.props.filter.map((item, index) => {
            return (
                <Row align="middle" className={style.checkboxItem} justify="space-between" key={item.key || index} type="flex">
                  <Col>
                    <Checkbox disabled={this.state.disabled && this.state.checkedValues.indexOf(item.id) === -1} value={item.id}>
                      <span style={{color: '#333', fontSize: 12}}>{item.name}</span>
                    </Checkbox>
                  </Col>
                  <Col style={{color: '#000', fontSize: 12}}>
                    {item.num}
                  </Col>
              </Row>);
          })}
          </Checkbox.Group>
        </Col>
        { (this.props.searchList && this.props.searchList.length > 0) && <Col>
          <Select
            allowClear
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            mode="multiple"
            onChange={this.handleSearchChange}
            placeholder={i18n('FilterList_i18n_sZhz')}
            showArrow
            showSearch
            style={{marginTop: 10, width: '100%'}}
          >
            {this.props.searchList.map((item, index) => {
              return (<Option
                disabled={this.state.disabled && this.state.searchValue.indexOf(item.id) === -1}
                key={item.key || index}
                value={item.id}>{`${item.name}(${item.num})`}
              </Option>);
            })}
          </Select>
        </Col>}
      </Row>
    );
  }
}

export default Filter;