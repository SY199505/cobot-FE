import React from 'react';
import axios from 'axios';
import {
  Select,
  Input,
  Button,
  Table,
  Collapse,
  Dropdown,
  Modal,
  Tree,
  Menu,
  Icon,
  Switch,
  InputNumber,
  TreeSelect
} from 'antd';
import style from './RuleConfiguration.module.scss';
const InputGroup = Input.Group;
const { Option } = Select;
const { Panel } = Collapse;
const { TreeNode } = Tree;

const deleteMethod = {
  rule: (id) => {
    axios.delete(`/config/language/package/rule/delete`, {
      params: {
        codeRuleIds: id
      }
    })
  }
}

export default class RuleConfiguration extends React.Component {
  static propTypes = {
    // name: React.PropTypes.string,
  };

  state = {
    rule: {
      page: 0,
      pageSize: 10,
      ruleList: [],
      detectorList: []
    },
    isOpen: false,
    canAdd: false,
    addModalShow: false,
    id: null,
    selectedNodeData: {
      belongTo: ""
    },
    sortNum: 0,
    detector: {
      page: 0,
      pageSize: 10,
      detectorList: [],
      modalShow: false,
      preAddDetectors: []
    },
  };

  // constructor(props) {
  //  super(props);
  // }

  componentWillMount() {

  }
  componentDidMount() {
    axios.get('/cobot/config/language/package/rule/list', {
      params: {
        configFatherId: '5e43aea57bc2fb4443b30969',
        isCreateProject: false
      }
    }).then(res => {
      if (res) {
        this.setState({
          rule: {
            ...this.state.rule,
            ruleList: res.data.data.configFather.languageList
          }
        }, () => {
        })
      }
    })
    console.log(this.props.history)
  };

  fetchAddDetectorToRule = (ruleIds, detectorIds) => {
    axios.post(`/cobot/config/detector/addByRuleId`, {
      ruleIds: ruleIds,
      detectorIds: detectorIds
    }).then(res => {
      if (res) {
        this.fetchRuleDetector(ruleIds);
      }
    })
  };

  fetchDeletDetectorToRule = (ruleIds, detectorIds) => {
    axios.delete(`/cobot/config/detector/deteleDetectorByRuleId`, {
      params: {
        ruleIds: ruleIds,
        detectorIds: detectorIds

      }
    }).then(res => {
      if (res) {
        this.fetchRuleDetector(ruleIds);
      }
    })
  };

  fetchDetectorAll = () => {
    axios.get(`/cobot/config/detector/listAll`, {
      page: this.state.detector.page,
      pageSize: this.state.detector.pageSize
    }).then((res) => {
      this.setState({
        detector: {
          ...this.state.detector,
          modalShow: true,
          detectorList: res.data.data.data
        }
      }, () => {
        console.log('this.state.detector.modalShow', this.state.detector.modalShow)
      })
    })
  }

  delete = (id) => {
    axios.delete('/cobot/config/language/package/rule/delete', {
      id: id
    })
  };

  fetchRuleChange = (data) => {
    axios.post(`/cobot/config/language/package/rule/save`, {
        codeRuleName: data.codeRuleName,
        id: data.id
    }).then((res) => {
      
    })
  };

  fetchRuleDetector = (ruleIdList) => {
    axios.get(`/cobot/config/detector/listByRule` , {
      params: {
        ruleIds: ruleIdList,
        page: this.state.detector.page,
        pageSize: this.state.detector.pageSize
      }
    }).then(res => {
      if (res) {
        this.setState({
          rule: {
            ...this.state.rule,
            detectorList: res.data.data.data
          }
        }, () => {
          console.log(this.state.rule.detectorList)
        })
      }
    })
  };

	renderTreeNodes = data =>
    data.map(item => {
      if (item.packageList || item.codeRuleList) {
        return (
          <TreeNode icon={<Icon type="smile-o" />} title={(<div><Icon type={item.show ? 'eye' : 'eye-invisible'} className={`${style.eye}`} /><span>{item.name || item.packageName || item.codeRuleName}</span></div>)} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.packageList || item.codeRuleList)}
          </TreeNode>
        );
      }
      return <TreeNode icon={<Icon type="smile-o" />} title={(<div><Icon type={item.show ? 'eye' : 'eye-invisible'} className={`${style.eye}`} /><span>{item.name || item.packageName || item.codeRuleName}</span></div>)} key={item.id} {...item} />;
    });
  render() {
    return (
      <div className={[`${style.detector}`, 'radius', 'card'].join(' ')}>
        <div className={`${style.list}`}>
          <div className={`${style.filter}`}>
            <span className={`${style.title}`}>编码规则配置</span>
            <span>显示</span>
            <Switch checkedChildren="开" unCheckedChildren="关" className={`${style.input}`} checked={this.state.isOpen} />
          </div>
          <div className={`${style.btnGroup}`}>
            <Dropdown
              overlay={
                <Menu onClick={() => {}}>
                  <Menu.Item
                    key="1"
                    onClick={() => {
                      this.setState({
                        addModalShow: true
                      })
                    }}
                    disabled={!(this.state.selectedNodeData.belongTo === "package" || this.state.selectedNodeData.belongTo === "class")} 
                  >新增规则</Menu.Item>
                  <Menu.Item key="2" disabled={!(this.state.selectedNodeData.belongTo === "package")}>新增类</Menu.Item>
                  <Menu.Item key="3" disabled={!(this.state.selectedNodeData.belongTo === "language")}>新增规则集</Menu.Item>
                </Menu>
              }
              disabled={!this.state.selectedNodeData.belongTo || this.state.selectedNodeData.belongTo === "rule"}
            >
              <Button>
              新增 <Icon type="down" />
              </Button>
            </Dropdown>
            <Button
              type="primary"
              disabled={this.state.selectedNodeData.belongTo === 'language'}
            >删除</Button>
            <Button type="primary">复制</Button>
            <Button type="primary">移动</Button>
            <Modal title="新增规则" visible={this.state.addModalShow}
              onCancel={() => {
                this.setState({
                  addModalShow: false,
                  name: null,
                  sortNum: 0
                })
              }}
              onOk={() => {
                axios.post('/cobot/config/language/package/rule/save', {
                  codeRuleName: this.state.name,
                  packageId: this.state.selectedNodeData.id
                })
              }
            }>
              选择的节点名称<div>{}</div>
              <label>名称</label>
              <Input value={this.state.selectedNodeData.codeRuleName} onChange={(e) => {
                this.setState({
                  selectedNodeData: {...this.state.selectedNodeData, codeRuleName: e.target.value}
                })
              }}/>
              <label>排序</label>
              <InputNumber min={0} defaultValue={0} value={this.state.sortNum} onChange={(e) => {
                this.setState({
                  sortNum: Number(e.target.value)
                })
              }} />
            </Modal>
            
          </div>
          <Tree
            className={`${style.table}`}
            checkable
            defaultExpandAll
            onExpand={() => {}}
            onCheck={() => {}}
            onSelect={(selectedKeys, {selected, selectedNodes, node, event}) => {
              const selectedNodeData = node.props.dataRef ? node.props.dataRef : node.props;
              this.setState({
                selectedNodeData: {...selectedNodeData},
                isOpen: selectedNodeData.show,
                canAdd: true,
                id: selectedNodeData.id
              }, () => {
                const idList = [];
                idList.push(selectedNodeData.id);
                this.state.selectedNodeData.belongTo === "rule" && this.fetchRuleDetector(selectedNodeData.id);
              });
            }}
            switcherIcon={<Icon type="down" />}
          >
            {this.renderTreeNodes(this.state.rule.ruleList)}
          </Tree>
        </div>
        {this.state.selectedNodeData.belongTo === "rule" &&
          (
          <div className={`${style.attributeAndRule}`}>
            <Collapse bordered={false} defaultActiveKey={[ '1']}>
              <Panel className={`${style.panel1}`} header={
                <div className={`${style.title}`}>
                  <span>规则属性</span>
                  <div className={`${style.btnGroup}`}>
                    <Button type="primary" onClick={(e) => {
                      e.stopPropagation();
                    }}>导入ExcelExcel</Button>
                    <Button type="primary">导出</Button>
                  </div>
                </div>
              } key="1">
                <div className={`${style.content}`}>
                  <InputGroup className={`${style.group}`} compact>
                    <label>名称</label>
                    <Input value={this.state.selectedNodeData.codeRuleName} onChange={(e) => {
                      this.setState({
                        selectedNodeData: {...this.state.selectedNodeData, codeRuleName: e.target.value}
                      })
                    }} />
                  </InputGroup>
                  <InputGroup className={`${style.group}`} compact>
                    <label>检测器</label>
                    <Select defaultValue="1" style={{ width: 120 }}>
                      <Option value="1">1</Option>
                    </Select>
                  </InputGroup>
                  <InputGroup className={`${style.group}`} compact>
                    <label>排序</label>
                    <Input value={this.state.selectedNodeData.cveId} onChange={(e) => {
                      this.setState({
                        selectedNodeData: {...this.state.selectedNodeData, cveId: e.target.value}
                      })
                    }} />
                  </InputGroup>
                  <InputGroup className={`${style.group}`} compact>
                    <label>语言</label><Input value={this.state.selectedNodeData.cveId} onChange={(e) => {
                      this.setState({
                        selectedNodeData: {...this.state.selectedNodeData, cveId: e.target.value}
                      })
                    }} />
                  </InputGroup>
                  <InputGroup className={`${style.group}`} compact>
                    <label>CWE对应</label>
                    <Input value={this.state.selectedNodeData.cveId} onChange={(e) => {
                      this.setState({
                        selectedNodeData: {...this.state.selectedNodeData, cveId: e.target.value}
                      })
                    }} />
                  </InputGroup>
                  <InputGroup className={`${style.group}`} compact>
                    <label>CNNVD对应</label>
                    <Input value={this.state.selectedNodeData.cnvdId} onChange={(e) => {
                      this.setState({
                        selectedNodeData: {...this.state.selectedNodeData, cnvdId: e.target.value}
                      })
                    }} />
                  </InputGroup>
                  <InputGroup className={`${style.group}`} compact>
                    <label>严重等级</label><Input value={this.state.selectedNodeData.cveId} onChange={(e) => {
                      this.setState({
                        selectedNodeData: {...this.state.selectedNodeData, cveId: e.target.value}
                      })
                    }} />
                  </InputGroup>
                  <InputGroup className={`${style.group}`} compact>
                    <label>问题类型</label><Select defaultValue="1" style={{ width: 120 }}>
                        <Option value="1">1</Option>
                    </Select>
                  </InputGroup>
                  <InputGroup className={`${style.group}`} compact>
                    <label>描述</label><Input value={this.state.selectedNodeData.cveId} onChange={(e) => {
                      this.setState({
                        selectedNodeData: {...this.state.selectedNodeData, cveId: e.target.value}
                      })
                    }} />
                  </InputGroup>
                  <InputGroup className={`${style.group}`} compact>
                    <label>导致结果和风险</label>
                    <Input value={this.state.selectedNodeData.resultAndRisk} onChange={(e) => {
                      this.setState({
                        selectedNodeData: {...this.state.selectedNodeData, resultAndRisk: e.target.value}
                      })
                    }} />
                  </InputGroup>
                  <InputGroup className={`${style.group}`} compact>
                    <label>缓解和预防措施</label>
                    <Input value={this.state.selectedNodeData.precaution} onChange={(e) => {
                      this.setState({
                        selectedNodeData: {...this.state.selectedNodeData, precaution: e.target.value}
                      })
                    }} />
                  </InputGroup>
                  <InputGroup className={`${style.group}`} compact>
                    <label>缺陷详解</label>
                    <Input value={this.state.selectedNodeData.detailDefect} onChange={(e) => {
                      this.setState({
                        selectedNodeData: {...this.state.selectedNodeData, detailDefect: e.target.value}
                      })
                    }} />
                  </InputGroup>
                  <InputGroup className={`${style.group}`} compact>
                    <label>用例</label><Input value={this.state.selectedNodeData.cveId} onChange={(e) => {
                      this.setState({
                        selectedNodeData: {...this.state.selectedNodeData, cveId: e.target.value}
                      })
                    }} />
                  </InputGroup>
                  <InputGroup className={`${style.group}`} compact>
                    <label>结果描述</label><Input value={this.state.selectedNodeData.cveId} onChange={(e) => {
                      this.setState({
                        selectedNodeData: {...this.state.selectedNodeData, cveId: e.target.value}
                      })
                    }} />
                  </InputGroup>
                  <InputGroup className={`${style.group}`} compact>
                    <label>正确用例解释</label>
                    <Input value={this.state.selectedNodeData.correctExampleExplanation} onChange={(e) => {
                      this.setState({
                        selectedNodeData: {...this.state.selectedNodeData, correctExampleExplanation: e.target.value}
                      })
                    }} />
                  </InputGroup>
                  <InputGroup className={`${style.group}`} compact>
                    <label>错误用例解释</label>
                    <Input value={this.state.selectedNodeData.errorExampleExplanation} onChange={(e) => {
                      this.setState({
                        selectedNodeData: {...this.state.selectedNodeData, errorExampleExplanation: e.target.value}
                      })
                    }} />
                  </InputGroup>
                  <div className={`${style.save}`}>
                    <Button type="primary" onClick={() => {
                      this.fetchRuleChange(this.state.selectedNodeData)
                    }}>保存</Button>
                  </div>
                </div>
              </Panel>
              <Panel className={`${style.panel2}`} header={
                <div className={`${style.title}`}>
                  <span>检测器（{this.state.rule.detectorList.length || 0}）</span>
                  <div className={`${style.btnGroup}`}>
                    <Button type="primary" onClick={(e) => {
                      e.stopPropagation();
                      this.fetchDetectorAll();
                    }}>添加</Button>
                    <Button type="primary" onClick={(e) => {
                      e.stopPropagation();
                      this.fetchDeletDetectorToRule(this.state.selectedNodeData.id, this.state.detector.preDeleteDetectors)
                    }}>删除</Button>
                  </div>
                </div>
              } key="2">
              <Table
                columns={[
                  {
                    title: '编号',
                    dataIndex: 'detectorCode',
                    render: text => <p>{text}</p>
                  },
                  {
                    title: '语言',
                    dataIndex: 'languageType',
                    render: text => <p>{text}</p>
                  },
                  {
                    title: '描述',
                    dataIndex: 'description',
                    render: text => <p>{text}</p>
                  }
                ]}
                dataSource={this.state.rule.detectorList}
                rowSelection={{
                  onChange: (selectedRowKeys, selectedRows) => {
                    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                    this.setState({
                      detector: {
                        ...this.state.detector,
                        preDeleteDetectors: selectedRows.map(item => {
                          return item.id;
                        })
                      }
                    })
                  }
                }}></Table>
              </Panel>
            </Collapse>
          </div>
          )
        }
        <Modal className={`${style.detectorAddModal}`} title="检测器" visible={this.state.detector.modalShow}
            onOk={() => {
              this.fetchAddDetectorToRule(this.state.selectedNodeData.id, this.state.detector.preAddDetectors);
              this.setState({
                detector: {
                  ...this.state.detector,
                  modalShow: false
                }
              });
            }}
            onCancel={() => {
              this.setState({
                detector: {
                  ...this.state.detector,
                  modalShow: false
                }
              })
          }}>
            <Input className={`${style.search}`} placeholder="Basic usage" />
            <Select className={`${style.filter}`} defaultValue="1">
              <Option value="1">1</Option>
            </Select>
            <Table 
              columns={[
                {
                  title: '编号',
                  dataIndex: 'detectorCode',
                  render: text => <p>{text}</p>
                },
                {
                  title: '语言',
                  dataIndex: 'languageType',
                  render: text => <p>{text}</p>
                },
                {
                  title: '描述',
                  dataIndex: 'description',
                  render: text => <p>{text}</p>
                }
              ]}
              dataSource={this.state.detector.detectorList}
              rowKey={record => {
                return record.id;
              }}
              rowSelection={{
                onChange: (selectedRowKeys, selectedRows) => {
                  console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                  this.setState({
                    detector: {
                      ...this.state.detector,
                      preAddDetectors: selectedRows.map(item => {
                        return item.id;
                      })
                    }
                  })
                }
              }}
            ></Table>
          </Modal>
      </div>
    );
  }
}
