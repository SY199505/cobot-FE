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
const { TextArea } = Input;

const deleteMethod = {
  rule: (id) => {
    axios.delete(`/config/language/package/rule/delete`, {
      params: {
        codeRuleIds: id
      }
    })
  }
};

const modalAttr = {
  rule: {
    title: '新增规则',
    fetchUrl: '/config/node/save',
    fetchDeleteUrl: '/config/language/package/rule/delete'
  },
  class: {
    title: '新增类',
    fetchUrl: '/config/node/save',
    fetchDeleteUrl: '/config/language/package/class/delete'
  },
  package: {
    title: '新增规则集',
    fetchUrl: '/config/node/save',
    fetchDeleteUrl: '/config/language/package/delete'
  },
  copy: {
    title: '复制节点',
    fetchUrl: '/config/copyOrMoveNode',
  },
  move: {
    title: '移动节点',
    fetchUrl: '/config/copyOrMoveNode',
  },
}
const typeAble = {
	language: {
    sameLevel: {
      language: true,
      package: false,
      class: false,
      rule: false
    },
    highLevel: {
      language: true,
      package: false,
      class: false,
      rule: false
    }
	},
	package: {
    sameLevel: {
      language: false,
      package: true,
      class: false,
      rule: false
    },
    highLevel: {
      language: true,
      package: false,
      class: false,
      rule: false
    }
	},
	class: {
    sameLevel: {
      language: false,
      package: false,
      class: false,
      rule: true
    },
    highLevel: {
      language: false,
      package: true,
      class: false,
      rule: false
    }
	},
	rule: {
    sameLevel: {
      language: false,
      package: false,
      class: false,
      rule: false
    },
    highLevel: {
      language: false,
      package: true,
      class: true,
      rule: false
    }
  },
	copy: {
    sameLevel: {
      language: true,
      package: false,
      class: false,
      rule: false
    },
    highLevel: {
      language: true,
      package: false,
      class: false,
      rule: false
    }
  },
	move: {
    sameLevel: {
      language: true,
      package: false,
      class: false,
      rule: false
    },
    highLevel: {
      language: true,
      package: false,
      class: false,
      rule: false
    }
  },
};

let expandedKeys = [];
let checkedKeys = [];

export default class RuleConfiguration extends React.Component {
  static propTypes = {
    // name: React.PropTypes.string,
  };

  state = {
    rule: {
      page: 0,
      pageSize: 10,
      ruleList: [],
      detectorList: [],
      selectedKeys: [],
      expandedKeys: []
    },
    isOpen: false,
    canAdd: false,
    operateModalShow: false,
    id: null,
    selectedNodeData: {
      belongTo: "",
      id: ""
    },
    sortNum: 0,
    detector: {
      page: 0,
      pageSize: 10,
      detectorList: [],
      modalShow: false,
      preAddDetectors: [],
      preDeleteDetectors: []
    },
    treeType: 'sameLevel',
    openModalType: 'rule',
    modalSelect: ''
  };

  // constructor(props) {
  //  super(props);
  // }

  componentDidMount() {
    this.fetchRuleTree();
  };

  computedNode = (data, attr) => {
    data.forEach(item => {
      if (attr) {
        if (item[attr]) {
          checkedKeys.push(item.id);
        }
      } else {
        expandedKeys.push(item.id);
      }
      if (item.packageList || item.codeRuleList || item.codeRuleClasssList) {
        this.computedNode(item.packageList || item.codeRuleList || item.codeRuleClasssList, attr)
      }
    })
  }

  fetchRuleTree = () => {
    axios.get('/cobot/config/language/package/rule/list', {
      params: {
        configFatherId: '5e43aea57bc2fb4443b30969',
        isCreateProject: false
      }
    }).then(res => {
      if (res) {
        this.computedNode(res.data.data.configFather.languageList); // 计算所有节点
        this.computedNode(res.data.data.configFather.languageList, 'defaultSelected'); // 计算defaultSelected===true的节点
        this.setState({
          rule: {
            ...this.state.rule,
            checkedKeys: checkedKeys,
            expandedKeys: expandedKeys
          }
        }, () => {
          this.setState({
            rule: {
              ...this.state.rule,
              ruleList: res.data.data.configFather.languageList,
            }
          })
        })
      }
    });
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

  // fetchRuleDetector = () => {
  //   axios.get(`/cobot/config/detector/listAll`, {
  //     page: this.state.detector.page,
  //     pageSize: this.state.detector.pageSize
  //   }).then((res) => {
  //     this.setState({
  //       detector: {
  //         ...this.state.detector,
  //         modalShow: true,
  //         detectorList: res.data.data.data
  //       }
  //     }, () => {
  //       console.log('this.state.detector.modalShow', this.state.detector.modalShow)
  //     })
  //   })
  // }

  delete = (id) => {
    axios.delete('/cobot/config/language/package/rule/delete', {
      id: id
    })
  };

  fetchRuleChange = (belongTo, data) => {
    let fetchData = {};
    switch (belongTo) {
      case 'language':
        fetchData = {
          language: {
            ...data
          }
        }
        break;
      case 'package':
        fetchData = {
          codeRulePackage: {
            ...data
          }
        }
        break;
      case 'class':
        fetchData = {
          codeRuleClass: {
            ...data
          }
        }
      break;
      case 'rule':
        fetchData = {
          codeRule: {
            ...data
          }
        }
      break;
      default:
        break;
    }
    axios.post(`/cobot/config/node/save`, {
      belongTo: belongTo,
      ...fetchData
    }, {
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => {
      this.fetchRuleTree()
    })
  };

  fetchRuleDetector = (ruleIdList, needExcludeThis=false) => {
    axios.get(`/cobot/config/detector/listByRule` , {
      params: {
        ruleIds: ruleIdList,
        page: this.state.detector.page,
        pageSize: this.state.detector.pageSize,
        needExcludeThis: needExcludeThis
      }
    }).then(res => {
      if (res) {
        if (needExcludeThis) {
          this.setState({
            detector: {
              ...this.state.detector,
              modalShow: true,
              detectorList: res.data.data.data
            }
          }, () => {
          })
        } else {
          this.setState({
            rule: {
              ...this.state.rule,
              detectorList: res.data.data.data
            }
          }, () => {
          })
        }
      }
    })
  };

	renderTreeNodes = (data, selectedNodeType="") =>
    data.map(item => {
      if (item.packageList || item.codeRuleList || item.codeRuleClasssList) {
        return (
          <TreeNode 
            disabled={Boolean(selectedNodeType.length) && !(typeAble[selectedNodeType][this.state.treeType][item.belongTo])}
            icon={<Icon type="smile-o" />} 
            title={(
              <div>
                <Icon type={item.show ? 'eye' : 'eye-invisible'} className={`${style.eye}`} />
                <span>{item.name || item.packageName || item.ruleClassName || item.codeRuleName}</span>
              </div>
            )}
            value={item.id}
            key={item.id}
            dataRef={item}
          >
            {this.renderTreeNodes(item.packageList || item.codeRuleList || item.codeRuleClasssList, selectedNodeType)}
          </TreeNode>
        );
      }
      return <TreeNode
        disabled={Boolean(selectedNodeType.length) && !(typeAble[selectedNodeType][this.state.treeType][item.belongTo])}
        icon={<Icon type="smile-o" />} 
        title={(
          <div>
            <Icon type={item.show ? 'eye' : 'eye-invisible'} className={`${style.eye}`} />
            <span>{item.name || item.packageName || item.ruleClassName || item.codeRuleName}</span>
          </div>)
        }
        value={item.name || item.packageName || item.ruleClassName || item.codeRuleName}
        key={item.id}
        {...item} 
      />;
    });
  render() {
    // this.computedNode(this.state.rule.ruleList || [])
    // console.log('expandedKeys', expandedKeys)
    return (
      <div className={[`${style.detector}`, 'radius', 'card'].join(' ')}>
        <div className={`${style.list}`}>
          <div className={`${style.filter}`}>
            <span className={`${style.title}`}>编码规则配置</span>
            <span>显示</span>
            <Switch 
              checkedChildren="开" 
              unCheckedChildren="关" 
              className={`${style.input}`} 
              disabled={!this.state.selectedNodeData.id} 
              checked={this.state.selectedNodeData.show} 
              onClick={() => {
                this.setState({
                  selectedNodeData: {
                    ...this.state.selectedNodeData,
                    show: !this.state.selectedNodeData.show
                  }
                }, () => {
                  this.fetchRuleChange(this.state.selectedNodeData.belongTo, {
                    show: this.state.selectedNodeData.show,
                    id: this.state.selectedNodeData.id
                  });
                })
              }}
            />
          </div>
          <div className={`${style.btnGroup}`}>
            <Dropdown
              overlay={
                <Menu onClick={() => {}}>
                  <Menu.Item
                    key="1"
                    onClick={() => {
                      this.setState({
                        operateModalShow: true,
                        treeType: 'sameLevel',
                        openModalType: 'rule'
                      })
                    }}
                    disabled={!(this.state.selectedNodeData.belongTo === "package" || this.state.selectedNodeData.belongTo === "class")} 
                  >新增规则</Menu.Item>
                  <Menu.Item 
                    key="2" 
                    disabled={!(this.state.selectedNodeData.belongTo === "package")}
                    onClick={() => {
                      this.setState({
                        operateModalShow: true,
                        treeType: 'sameLevel',
                        openModalType: 'class'
                      })
                    }}
                  >新增类</Menu.Item>
                  <Menu.Item 
                    key="3" 
                    disabled={!(this.state.selectedNodeData.belongTo === "language")}
                    onClick={() => {
                      this.setState({
                        operateModalShow: true,
                        treeType: 'sameLevel',
                        openModalType: 'package'
                      })
                    }}
                  >新增规则集</Menu.Item>
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
              disabled={!this.state.selectedNodeData.belongTo || this.state.selectedNodeData.belongTo === 'language'}
              onClick={() => {
                axios.delete(`/cobot/config/node/delete`, {
                  params: {
                    belongTo: this.state.selectedNodeData.belongTo,
                    thisNodeId: this.state.selectedNodeData.id
                  }
                }).then(res => {
                  this.fetchRuleTree();
                })
              }}
            >删除</Button>
            <Button type="primary"
              disabled={!this.state.selectedNodeData.belongTo || this.state.selectedNodeData.belongTo === 'language'}
              onClick={() => {
                this.setState({
                  operateModalShow: true,
                  treeType: 'highLevel',
                  openModalType: 'copy'
                })
              }}>复制</Button>
            <Button type="primary"
              disabled={!this.state.selectedNodeData.belongTo || this.state.selectedNodeData.belongTo === 'language'}
              onClick={() => {
                this.setState({
                  operateModalShow: true,
                  treeType: 'highLevel',
                  openModalType: 'move'
                })
              }}
            >移动</Button>
          </div>
          <Tree
            className={`${style.table}`}
            checkable
            checkedKeys={this.state.rule.checkedKeys}
            expandedKeys={this.state.rule.expandedKeys}
            onExpand={(expandedKeys, {expanded, node}) => {
              console.log(expandedKeys, {expanded, node})
              if (expanded) {
                this.setState({
                  rule: {
                    ...this.state.rule,
                    expandedKeys: this.state.rule.expandedKeys.concat([node.props.value])
                  }
                })
              } else {
                const valueIndex = this.state.rule.expandedKeys.findIndex(item => item === node.props.value);
                this.state.rule.expandedKeys.splice(valueIndex, 1);
                this.setState({
                  rule: {
                    ...this.state.rule,
                    expandedKeys:  this.state.rule.expandedKeys
                  }
                })
              }
            }}
            onCheck={(checkedKeys, {checked, checkedNodes, node, event, halfCheckedKeys}) => {
              console.log(checkedKeys, {checked, checkedNodes, node, event, halfCheckedKeys})
              const nodeData = node.props.dataRef ? node.props.dataRef : node.props;
              this.fetchRuleChange(nodeData.belongTo, {
                defaultSelected: checked,
                id: nodeData.id
              });
            }}
            onSelect={(selectedKeys, {selected, selectedNodes, node, event}) => {
              const selectedNodeData = node.props.dataRef ? node.props.dataRef : node.props;
              console.log('selectedNodeData', selectedNodeData)
              this.setState({
                selectedNodeData: {...selectedNodeData},
                isOpen: selectedNodeData.show,
                canAdd: true,
                id: selectedNodeData.id,
                modalSelect: selectedNodeData
              }, () => {
                this.state.selectedNodeData.belongTo === "rule" && this.fetchRuleDetector(selectedNodeData.id, false);
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
                    <label>语言</label><Input value={this.state.selectedNodeData.languageType} onChange={(e) => {
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
                    <label>OWASP对应</label>
                    <Input value={this.state.selectedNodeData.owaspId} onChange={(e) => {
                      this.setState({
                        selectedNodeData: {...this.state.selectedNodeData, owaspId: e.target.value}
                      })
                    }} />
                  </InputGroup>
                  <InputGroup className={`${style.group}`} compact>
                    <label>严重等级</label>
                    <Select defaultValue={this.state.selectedNodeData.severityLevel} style={{ width: 120 }}>
                        <Option value="1">1</Option>
                    </Select>
                  </InputGroup>
                  <InputGroup className={`${style.group}`} compact>
                    <label>问题类型</label><Select defaultValue="1" style={{ width: 120 }}>
                        <Option value="1">1</Option>
                    </Select>
                  </InputGroup>
                  <InputGroup className={`${style.group}`} compact>
                    <label>描述</label><TextArea value={this.state.selectedNodeData.description} onChange={(e) => {
                      this.setState({
                        selectedNodeData: {...this.state.selectedNodeData, description: e.target.value}
                      })
                    }} />
                  </InputGroup>
                  <InputGroup className={`${style.group}`} compact>
                    <label>导致结果和风险</label>
                    <TextArea value={this.state.selectedNodeData.resultAndRisk} onChange={(e) => {
                      this.setState({
                        selectedNodeData: {...this.state.selectedNodeData, resultAndRisk: e.target.value}
                      })
                    }} />
                  </InputGroup>
                  <InputGroup className={`${style.group}`} compact>
                    <label>缓解和预防措施</label>
                    <TextArea value={this.state.selectedNodeData.precaution} onChange={(e) => {
                      this.setState({
                        selectedNodeData: {...this.state.selectedNodeData, precaution: e.target.value}
                      })
                    }} />
                  </InputGroup>
                  <InputGroup className={`${style.group}`} compact>
                    <label>缺陷详解</label>
                    <TextArea value={this.state.selectedNodeData.detailDefect} onChange={(e) => {
                      this.setState({
                        selectedNodeData: {...this.state.selectedNodeData, detailDefect: e.target.value}
                      })
                    }} />
                  </InputGroup>
                  <InputGroup className={`${style.group}`} compact>
                    <label>用例</label><TextArea value={this.state.selectedNodeData.cveId} onChange={(e) => {
                      this.setState({
                        selectedNodeData: {...this.state.selectedNodeData, cveId: e.target.value}
                      })
                    }} />
                  </InputGroup>
                  <InputGroup className={`${style.group}`} compact>
                    <label>结果描述</label><TextArea value={this.state.selectedNodeData.cveId} onChange={(e) => {
                      this.setState({
                        selectedNodeData: {...this.state.selectedNodeData, cveId: e.target.value}
                      })
                    }} />
                  </InputGroup>
                  <InputGroup className={`${style.group}`} compact>
                    <label>正确用例解释</label>
                    <TextArea value={this.state.selectedNodeData.correctExampleExplanation} onChange={(e) => {
                      this.setState({
                        selectedNodeData: {...this.state.selectedNodeData, correctExampleExplanation: e.target.value}
                      })
                    }} />
                  </InputGroup>
                  <InputGroup className={`${style.group}`} compact>
                    <label>错误用例解释</label>
                    <TextArea value={this.state.selectedNodeData.errorExampleExplanation} onChange={(e) => {
                      this.setState({
                        selectedNodeData: {...this.state.selectedNodeData, errorExampleExplanation: e.target.value}
                      })
                    }} />
                  </InputGroup>
                  <div className={`${style.save}`}>
                    <Button type="primary" onClick={() => {
                      this.fetchRuleChange(this.state.selectedNodeData.belongTo, {
                        id: this.selectedNodeData.id
                      })
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
                      this.fetchRuleDetector(this.state.selectedNodeData.id, true);
                    }}>添加</Button>
                    <Button type="primary" 
                    disabled={!this.state.detector.preDeleteDetectors.length}
                    onClick={(e) => {
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
        <Modal 
          className={`${style.detectorAddModal}`} 
          title="检测器" 
          visible={this.state.detector.modalShow}
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
        <Modal title={modalAttr[this.state.openModalType].title} visible={this.state.operateModalShow}
          className={`${style.modalAdd}`}
          onCancel={() => {
            this.setState({
              operateModalShow: false,
              name: null,
              sortNum: 0
            })
          }}
          onOk={() => {
            let fetchData = {};
            switch (this.state.openModalType) {
              case 'package':
                fetchData = {
                  thisNodeId: this.state.modalSelect.id,
                  belongTo: this.state.openModalType,
                  codeRulePackage: {
                    id: this.state.modalSelect.id,
                    packageName: this.state.modalAddName
                  }
                }
                break;
              case 'class':
                fetchData = {
                  packageId: this.state.modalSelect.id,
                  codeRuleClass: {
                    ruleClassName: this.state.modalAddName
                  }
                }
              break;
              case 'rule':
                fetchData = {
                  ruleClassId: this.state.modalSelect.id,
                  codeRule: {
                    codeRuleName: this.state.modalAddName
                  }
                }
              break;
              case 'copy':
                fetchData = {
                  isCopy: true,
                  targetNodeId: this.state.modalSelect.id, 
                  targetNodeType: this.state.modalSelect.belongTo, 
                  thisNodeId: this.state.selectedNodeData.id,
                  thisNodetype: this.state.selectedNodeData.belongTo,
                  targetNodeName: this.state.modalAddName
                }
              break;
              case 'move':
                fetchData = {
                  isCopy: false,
                  targetNodeId: this.state.modalSelect.id, 
                  targetNodeType: this.state.modalSelect.belongTo, 
                  thisNodeId: this.state.selectedNodeData.id,
                  thisNodetype: this.state.selectedNodeData.belongTo
                }
              break;
              default:
                break;
            }
            axios.post(`/cobot${modalAttr[this.state.openModalType].fetchUrl}`, fetchData).then(res => {
              this.fetchRuleTree();
            })
          }
        }>
          <div className={style.item}>
            <label>位置</label>   
            <TreeSelect
              showSearch
              value={this.state.modalSelect.id}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="Please select"
              allowClear
              treeDefaultExpandAll
              onChange={() => {}}
              defaultValue={"5e43b255379acc49cc0edd33"}
              onChange={(value, label, extra) => {
                console.log(`onChange`, value, label, extra)
              }}
              onSelect={(value, label, extra) => {
                console.log(`onSelect`, value, label, extra)
                this.setState({
                  modalSelect: label.props.dataRef
                })
              }}
            >
              {this.renderTreeNodes(this.state.rule.ruleList, this.state.selectedNodeData.belongTo)}
            </TreeSelect>
          </div>
          <div className={style.item}>
            <label>名称</label>
            <Input value={this.state.modalAddName} onChange={(e) => {
              this.setState({
                modalAddName: e.target.value
              })
            }}/>
          </div>
          <div className={style.item}>
            <label>排序</label>
            <InputNumber min={0} defaultValue={0} value={this.state.sortNum} onChange={(e) => {
              this.setState({
                sortNum: Number(e.target.value)
              })
            }} />
          </div>
        </Modal>
      </div>
    );
  }
}
