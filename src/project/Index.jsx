import React from 'react';
import {
  Button,
  Menu,
  Dropdown,
  Table,
  Icon,
  Input,
  Select 
} from 'antd';

import ListFilter from '@/ListFilter';

import style from './index.module.scss';

const { Option } = Select;
function handleMenuClick(e) {
  console.log('click', e);
}
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    render: text => <p>{text}</p>,
  },
  {
    title: 'Age',
    dataIndex: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
  },
];
const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  },
  {
    key: '4',
    name: 'Disabled User',
    age: 99,
    address: 'Sidney No. 1 Lake Park',
  },
];

// rowSelection object indicates the need for row selection
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: record => ({
    disabled: record.name === 'Disabled User', // Column configuration not to be checked
    name: record.name,
  }),
};
export default class Project extends React.Component {
    static propTypes = {
        // name: React.PropTypes.string,
    };

    state = {
        languageTypeList: [
            {
                id: '1',
                key: '1',
                num: '1',
                name: '1'
            },
            {
                id: '2',
                key: '2',
                num: '1',
                name: '1'
            }
        ]
    }

    // constructor(props) {
    //  super(props);
    // }

    componentDidMount() {
      console.log(this.props.history)
    }

    handleChange = (value) => {

    }

    changeFilterType = (key) => {
        
    }

    render() {
      return (
        <div className={style.wrap}>
          <ListFilter
            changeType={this.changeFilterType}
            tabList={[
              {
                name: '关注的项目',
                key: 'a',
              },
              {
                name: '所有项目',
                key: 'b'
              }
            ]}
            filter={this.state.languageTypeList.slice(0, 6)}
            searchList={this.state.languageTypeList.slice(6)}
            title={222}
            removeBorder
            filterFn={() => {}}
            searchFn={() => {}}
            valueLengthLimit={8}
          />
          <div className={style.list}>
            <div className={style.header}>
              <div className={style.filter}>
                <Select className={style.typeSelect} defaultValue="lucy" style={{ width: 120 }} onChange={this.handleChange}>
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                  <Option value="disabled" disabled>
                    Disabled
                  </Option>
                  <Option value="Yiminghe">yiminghe</Option>
                </Select>
                <svg className={[`${style.svg}`, "icon"].join(' ')} aria-hidden="true">
                  <use xlinkHref="#icon-filterIcon"></use>
                </svg>
                <Input placeholder="搜索项目名称或标识" />
              </div>
              <div className={style.btnGroup}>
                <Button className={style.btn} icon="search" onClick={()=>{
                  this.props.history.push('/create')
                }}>新建项目</Button>
                <Dropdown overlay={
                  <Menu onClick={handleMenuClick}>
                    <Menu.Item key="1">1st item</Menu.Item>
                    <Menu.Item key="2">2nd item</Menu.Item>
                    <Menu.Item key="3">3rd item</Menu.Item>
                  </Menu>}>
                  <Button icon="search">
                    批量操作 <Icon type="down" />
                  </Button>
                </Dropdown>
              </div>
            </div>
            <Table 
            className={style.table} 
            rowSelection={rowSelection} 
            columns={columns} 
            dataSource={data} />
          </div>
        </div>
      );
    }
}
