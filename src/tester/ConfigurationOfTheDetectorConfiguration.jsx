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
import Axios from 'axios';
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
    route: [],
    detail: {
      description: ""
    },
    detectorRuleList: [],
    addRuleModalShow: false,
    selectedDetector: {},
    preDeleteRuleIds: [],
  };

  // constructor(props) {
  //  super(props);
  // }

  componentWillMount() {

  }
  componentDidMount() {
    Axios.get(`/cobot/config/detector/listAll`, {
      params: {
        page: 0,
        pageSize: 10
      }
    }).then(res => {
      this.setState({
        detectorList: res.data.data.data
      })
    })
  };

  fetchDetail = (id) => {
    Axios.get(`/cobot/config/detector/detail`, {
      params: {
        detectorId: id
      }
    }).then(res => {
      this.setState({
        detail: res.data.data.detector
      })
    })
  };

  fetchDeleteRule = (detectorId, ruleIds) => {
    Axios.delete(`/cobot/config/detector/deteleRuleByDetectorId`, {
      params: {
        detectorIds: detectorId,
        ruleIds: ruleIds
      }
    }).then(res => {
      this.fetchRuleByDetectorId(this.state.selectedDetector.id);
    })
  }

  fetchChangeDetail = (detail) => {
    Axios.post(`/cobot/config/detector/save`, detail).then(res => {
      this.fetchDetail(this.state.selectedDetector.id);
    })
  };

  fetchRuleByDetectorId = (id, needExcludeThis=false) => {
    Axios.get(`/cobot/config/detector/listRuleById`, {
      params: {
        detectorIds: id,
        needExcludeThis: needExcludeThis,
        page: 0,
        pageSize: 10
      }
    }).then(res => {
      if (needExcludeThis) {
        this.setState({
          allRuleList: res.data.data.data
        })
      } else {
        this.setState({
          detectorRuleList: res.data.data.data
        })
      }
    })
  };

  fetchAddRuleByDetectorId = (preAddRuleIds) => {
    Axios.post(`/cobot/config/detector/addRuleByDetectorId`, {
      ruleIds: preAddRuleIds,
      detectorIds: this.state.selectedDetector.id
    }).then(res => {
      this.setState({
        addRuleModalShow: false,
        preAddRuleIds: []
      }, () => {
        this.fetchRuleByDetectorId(this.state.selectedDetector.id)
      })
    })
  };

  // fetchAllRule = () => {
  //   Axios.get(`/cobot/config/rule/getAllRule`, {
  //     params: {
  //       page: 0,
  //       pageSize: 10
  //     }
  //   }).then(res => {
  //     this.setState({
  //       allRuleList: res.data.data.data
  //     })
  //   })
  // }

	fetchRuleList = () => {
    Axios.get('/cobot/config/language/package/rule/list', {
      params: {
        configFatherId: '5e43aea57bc2fb4443b30969',
        isCreateProject: false
      }
    }).then(res => {
      if (res) {
        this.setState({
					detectorRuleList: res.data.data.configFather.languageList
        }, () => {
        })
      }
    });
	};

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
          <Table
            className={`${style.table}`}
            bordered
            columns={[
              {
                title: '编号',
                dataIndex: 'detectorCode',
                render: text => <p>{text}</p>,
                ellipsis: true,
              },
              {
                title: '语言',
                dataIndex: 'languageType',
                render: text => <p>{text}</p>,
                ellipsis: true,
              },
              {
                title: '描述',
                dataIndex: 'description',
                render: text => <p>{text}</p>,
                ellipsis: true,
              }
            ]}
            dataSource={this.state.detectorList}
            rowKey={(recored) => recored.id}
            rowSelection={{
              type: 'radio',
              onSelect: (record, selected, selectedRows, nativeEvent) => {
                console.log(record, selected, selectedRows, nativeEvent)
                this.setState({
                  selectedDetector: record
                }, () => {
                  this.fetchDetail(record.id);
                  this.fetchRuleByDetectorId(record.id);
                })
              }
            }}
          ></Table>
        </div>
        {this.state.selectedDetector.id && 
          <div className={`${style.attributeAndRule}`}>
          <Collapse bordered={false} defaultActiveKey={['1']}>
            <Panel className={`${style.attribute}`} header="检测器属性" key="2">
              <div className={`${style.content}`}>
                <InputGroup className={`${style.group}`} compact>
                  <label>CWE对应</label>
                  <Input defaultValue="" value={this.state.detail.cveId} onChange={(e) => {
                    this.setState({
                      detail: {
                        ...this.state.detail,
                        cveId: e.target.value
                      }
                    })
                  }} />
                </InputGroup>
                <InputGroup className={`${style.group}`} compact>
                  <label>CNNVD对应</label>
                  <Input defaultValue="" value={this.state.detail.cnvdId} onChange={(e) => {
                    this.setState({
                      detail: {
                        ...this.state.detail,
                        cnvdId: e.target.value
                      }
                    })
                  }} />
                </InputGroup>
                <InputGroup className={`${style.group}`} compact>
                  <label>OWASP对应</label>
                  <Input defaultValue="" value={this.state.detail.owaspId} onChange={(e) => {
                    this.setState({
                      detail: {
                        ...this.state.detail,
                        owaspId: e.target.value
                      }
                    })
                  }} />
                </InputGroup>
                <InputGroup className={`${style.group}`} compact>
                  <label>描述</label>
                  <Input
                    value={this.state.detail.description}
                    onChange={(e) => {
                      this.setState({
                        detail: {
                          ...this.state.detail,
                          description: e.target.value
                        }
                      })
                    }} />
                </InputGroup>
                <InputGroup className={`${style.group}`} compact>
                  <label>导致结果和风险</label>
                  <Input
                    value={this.state.detail.resultAndRisk}
                    onChange={(e) => {
                      this.setState({
                        detail: {
                          ...this.state.detail,
                          resultAndRisk: e.target.value
                        }
                      })
                    }} />
                </InputGroup>
                <InputGroup className={`${style.group}`} compact>
                  <label>缓解和预防措施</label>
                  <Input
                    value={this.state.detail.precaution}
                    onChange={(e) => {
                      this.setState({
                        detail: {
                          ...this.state.detail,
                          precaution: e.target.value
                        }
                      })
                    }} />
                </InputGroup>
                <InputGroup className={`${style.group}`} compact>
                  <label>缺陷详情</label>
                  <Input
                    value={this.state.detail.detailDefect}
                    onChange={(e) => {
                      this.setState({
                        detail: {
                          ...this.state.detail,
                          detailDefect: e.target.value
                        }
                      })
                    }} />
                </InputGroup>
                <InputGroup className={`${style.group}`} compact>
                  <label>用例</label>
                  <Input
                    value={this.state.detail.description}
                    onChange={(e) => {
                      this.setState({
                        detail: {
                          ...this.state.detail,
                          description: e.target.value
                        }
                      })
                    }} />
                </InputGroup>
                <InputGroup className={`${style.group}`} compact>
                  <label>结果描述</label>
                  <Input
                    value={this.state.detail.description}
                    onChange={(e) => {
                      this.setState({
                        detail: {
                          ...this.state.detail,
                          description: e.target.value
                        }
                      })
                    }} />
                </InputGroup>
                <InputGroup className={`${style.group}`} compact>
                  <label>正确用例解释</label>
                  <Input
                    value={this.state.detail.correctExampleExplanation}
                    onChange={(e) => {
                      this.setState({
                        detail: {
                          ...this.state.detail,
                          correctExampleExplanation: e.target.value
                        }
                      })
                    }} />
                </InputGroup>
                <InputGroup className={`${style.group}`} compact>
                  <label>错误用例解释</label>
                  <Input
                    value={this.state.detail.errorExampleExplanation}
                    onChange={(e) => {
                      this.setState({
                        detail: {
                          ...this.state.detail,
                          errorExampleExplanation: e.target.value
                        }
                      })
                    }} />
                </InputGroup>
                <div className={`${style.save}`}>
                  <Button 
                    type="primary"
                    onClick={() => {
                      this.fetchChangeDetail(this.state.detail)
                    }}
                  >保存</Button>
                </div>
              </div>
            </Panel>
            <Panel header="所属规则（）" key="1">
              <div className={`${style.filter}`}>
                <Button 
                  type="primary" onClick={() => {
                    this.setState({
                      addRuleModalShow: true
                    }, () => {
                      this.fetchRuleByDetectorId(this.state.selectedDetector.id, true);
                    })
                  }}>添加</Button>
                <Button onClick={() => {
                  this.fetchDeleteRule(this.state.selectedDetector.id, this.state.preDeleteRuleIds);
                }}>删除</Button>
              </div>
              <Table 
                columns={[
                  {
                    title: '规则',
                    dataIndex: 'codeRuleName',
                    render: text => <p>{text}</p>
                  },
                  {
                    title: '规则集',
                    dataIndex: 'id',
                    render: text => <p>{text}</p>
                  },
                  {
                    title: '语言',
                    dataIndex: 'languageType',
                    render: text => <p>{text}</p>
                  }
                ]}
                dataSource={this.state.detectorRuleList}
                rowKey={record => record.id}
                rowSelection={{
                  onSelect: (record, selected, selectedRows, nativeEvent) => {
                    this.setState({
                      preDeleteRuleIds: selectedRows.map(item => item.id)
                    });
                  }
                }}
              ></Table>
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
        }
        <Modal 
          destroyOnClose
          title="规则" 
          className={`${style.detectorAddModal}`}
          visible={this.state.addRuleModalShow}
          onOk={() => {
            this.fetchAddRuleByDetectorId(this.state.preAddRuleIds);
          }}
          onCancel={() => {
            this.setState({
              addRuleModalShow: false
            })
          }}
        >
          <Input className={`${style.search}`} placeholder="Basic usage" />
          <Select className={`${style.filter}`} defaultValue="1">
            <Option value="1">1</Option>
          </Select>
          <Table
            rowSelection={{
              onSelect: (record, selected, selectedRows, nativeEvent) => {
                this.setState({
                  preAddRuleIds: selectedRows.map(item => {
                    return item.id
                  })
                })
              }
            }}
            columns={[
              {
                title: '规则',
                dataIndex: 'codeRuleName',
                render: text => <p>{text}</p>
              },
              {
                title: '规则集',
                dataIndex: 'id',
                render: text => <p>{text}</p>
              },
              {
                title: '语言',
                dataIndex: 'languageType',
                render: text => <p>{text}</p>
              }
            ]}
            rowKey={record => record.id}
            dataSource={this.state.allRuleList}
          >
          </Table>
        </Modal>
      </div>
    );
  }
}
