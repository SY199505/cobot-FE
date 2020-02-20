import React from 'react';
import {
  Select,
  Input,
  Button,
  Table,
  Collapse,
  Modal
} from 'antd';
import style from './ConfigurationOfTheDetectorConfiguration.module.scss';
const InputGroup = Input.Group;
const { Search } = Input;
const { Option } = Select;
const { Panel } = Collapse;
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
export default class ConfigurationOfTheDetectorConfiguration extends React.Component {
  static propTypes = {
    // name: React.PropTypes.string,
  };

  state = {
    route: []
  };

  // constructor(props) {
  //  super(props);
  // }

  componentWillMount() {

  }
  componentDidMount() {
    console.log(this.props.history)
  }

  render() {
    return (
      <div className={[`${style.detector}`, 'radius', 'card'].join(' ')}>
        <div className={`${style.list}`}>
          <div className={`${style.filter}`}>
            <span className={`${style.title}`}>检测器列表</span>
            <Select defaultValue="1" style={{ width: 120 }}>
              <Option value="1">1</Option>
            </Select>
            <Search className={`${style.input}`} onSearch={() => {}} placeholder="Basic usage" />
          </div>
          <Table className={`${style.table}`} bordered columns={columns} dataSource={data} rowSelection={() => {}}></Table>
        </div>
          <div className={`${style.attributeAndRule}`}>
            <Collapse bordered={false} defaultActiveKey={[ '1']}>
              <Panel className={`${style.attribute}`} header="检测器属性" key="2">
                <div className={`${style.content}`}>
                  <InputGroup className={`${style.group}`} compact>
                    <label>CWE对应</label><Input defaultValue="" />
                  </InputGroup>
                  <InputGroup className={`${style.group}`} compact>
                    <label>CNNVD对应</label><Input defaultValue="" />
                  </InputGroup>
                  <InputGroup className={`${style.group}`} compact>
                    <label>OWASP对应</label><Input defaultValue="" />
                  </InputGroup>
                  <InputGroup className={`${style.group}`} compact>
                    <label>描述</label><Input defaultValue="" />
                  </InputGroup>
                  <InputGroup className={`${style.group}`} compact>
                    <label>导致结果和风险</label><Input defaultValue="" />
                  </InputGroup>
                  <InputGroup className={`${style.group}`} compact>
                    <label>缓解和预防措施</label><Input defaultValue="" />
                  </InputGroup>
                  <InputGroup className={`${style.group}`} compact>
                    <label>缺陷详情</label><Input defaultValue="" />
                  </InputGroup>
                  <InputGroup className={`${style.group}`} compact>
                    <label>用例</label><Input defaultValue="" />
                  </InputGroup>
                  <InputGroup className={`${style.group}`} compact>
                    <label>结果描述</label><Input defaultValue="" />
                  </InputGroup>
                  <InputGroup className={`${style.group}`} compact>
                    <label>正确用例解释</label><Input defaultValue="" />
                  </InputGroup>
                  <InputGroup className={`${style.group}`} compact>
                    <label>错误用例解释</label><Input defaultValue="" />
                  </InputGroup>
                  <div className={`${style.save}`}>
                    <Button type="primary">保存</Button>
                  </div>
                </div>
              </Panel>
              <Panel header="所属规则（）" key="1">
                <div className={`${style.filter}`}>
                  <Button type="primary">添加</Button>
                  <Button>删除</Button>
                </div>
                <Table columns={columns} dataSource={data} rowSelection={() => {}}></Table>
                <Modal title="绑定规则" visible={false}>
                  <Input placeholder="Basic usage" />
                  <Select defaultValue="1" style={{ width: 120 }}>
                    <Option value="1">1</Option>
                  </Select>
                  {/* 规则、规则及、语言 */}
                  <Table columns={columns} dataSource={data} rowSelection={() => {}}></Table>
                </Modal>
                
              </Panel>
            </Collapse>
          </div>
      </div>
    );
  }
}
