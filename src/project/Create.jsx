import React from 'react';
import { 
	Button,
	Checkbox,
	Drawer,
	Icon,
	Input,
	Popover,
	Radio,
	Select,
	Switch,
	Tabs,
	Tree
} from 'antd';

import style from './create.module.scss';
import Axios from 'axios';

const { TabPane } = Tabs;
const { Option } = Select;
const { TreeNode } = Tree;
const { Search } = Input;

function onChange(value) {
  console.log(`selected ${value}`);
}

function onSearch(val) {
  console.log('search:', val);
}
const treeData = [
  {
    title: '0-0',
    key: '0-0',
    children: [
      {
        title: '0-0-0',
        key: '0-0-0',
        children: [
          { title: '0-0-0-0', key: '0-0-0-0' },
          { title: '0-0-0-1', key: '0-0-0-1' },
          { title: '0-0-0-2', key: '0-0-0-2' },
        ],
      },
      {
        title: '0-0-1',
        key: '0-0-1',
        children: [
          { title: '0-0-1-0', key: '0-0-1-0' },
          { title: '0-0-1-1', key: '0-0-1-1' },
          { title: '0-0-1-2', key: '0-0-1-2' },
        ],
      },
      {
        title: '0-0-2',
        key: '0-0-2',
      },
    ],
  },
  {
    title: 'erwrqrqwereqwrewqrewrewrwrw',
    key: '0-1',
    children: [
      { title: '0-1-0-0', key: '0-1-0-0' },
      { title: '0-1-0-1', key: '0-1-0-1' },
      { title: '0-1-0-2', key: '0-1-0-2' },
    ],
  },
  {
    title: '0-2',
    key: '0-2',
  },
];
const bitsOptions = [
	{
		label: "8位",
		value: "8"
	},
	{
		label: "16位",
		value: "16"
	},
	{
		label: "32位",
		value: "32"
	},
	{
		label: "64位",
		value: "64"
	}
];

const importMethodOptions = [
	{
		label: "文件夹",
		value: "folder"
	},
	{
		label: "SVN",
		value: "svn"
	},
	{
		label: "GIT",
		value: "git"
	},
	{
		label: "压缩包",
		value: "archive"
	}
];

export default class Create extends React.Component {
	static propTypes = {
		// name: React.PropTypes.string,
	};

	componentDidMount() {
    console.log(this.props.history)
  };

	callback = (key) => {
	  console.log(key);
	}

	constructor(props) {
		super(props);
		this.state = {
			bitsSelect: "64",
			importMethodSelect: "archive",
			drawerShowTab2: false,
			configList: [],
			defaultConfigId: "",
			detectorDetail: {
				languageList: [
					{
						packageList: []
					}
				]
			},
			ruleList: [],
			customCodeRuleList: [],
			checkOwnRules: [],
			confirmOwnRules: [],
			ruleLength: 0
		}
	};
	componentWillMount () {
		console.log(this.props)
		Axios.get(`/cobot//config/list`).then(res => {
			if (res) {
				this.setState({
					configList: res.data.data,
					defaultConfigId: res.data.data.find(item => item.defaultConfig).id
				}, () => {
					this.fetchDetailByConfigId(this.state.defaultConfigId);
				})
			}
		})
	};

	fetchDetailByConfigId = (id) => {
		Axios.get(`/cobot/config/language/package/list`, {
			params: {
				configFatherId: id
			}
		}).then(res => {
			if (res) {
				this.setState({
					detectorDetail: res.data.data,
					customCodeRuleList: res.data.data.customCodeRuleList || []
				})
			}
		})
	};

	fetchRuleList = () => {
    Axios.get('/cobot/config/language/package/rule/list', {
      params: {
        configFatherId: '5e43aea57bc2fb4443b30969',
        isCreateProject: false
      }
    }).then(res => {
      if (res) {
        this.setState({
					ruleList: res.data.data.configFather.languageList,
					ruleLength: res.data.data.configFather.codeRuleSize
        }, () => {
        })
      }
    });
	};

	renderTreeNodes = data =>
    data.map(item => {
      if (item.packageList || item.codeRuleList || item.codeRuleClasssList) {
        return (
					<TreeNode
						checkable={item.belongTo === 'rule'}
            icon={<Icon type="smile-o" />} 
            title={(
              <div>
                <Icon 
                  type={item.show ? 'eye' : 'eye-invisible'} 
                  className={`${style.eye}`} />
                <span>{item.name || item.packageName || item.codeRuleName || item.ruleClassName}</span>
              </div>
            )} 
            key={item.id} 
            dataRef={item}
          >
            {this.renderTreeNodes(item.packageList || item.codeRuleList || item.codeRuleClasssList)}
          </TreeNode>
        );
      }
      return (
				<TreeNode 
					icon={<Icon type="smile-o" />} 
					title={(
						<div>
							<Icon type={item.show ? 'eye' : 'eye-invisible'} className={`${style.eye}`} />
							<span>{item.name || item.packageName || item.codeRuleName || item.ruleClassName}</span>
						</div>)} 
						key={item.id} 
						{...item} 
				/>);
		});
		
	bitsOptionChange = (e) => {
		this.setState({
			bitsOptions: e.target.value
		});
	};

	importMethodOptionChange = (e) => {
		this.setState({
			importMethodSelect: e.target.value
		});
	};

	render() {
		return (
			<div className={['radius', 'card', `${style.filling}`].join(' ')}>
			  <Tabs className={`${style.tabs}`} defaultActiveKey="1" onChange={(key) => {
					this.props.history.push(`?tabSelect=${key}`);
				}}>
			    <TabPane tab="项目信息" key="1">
			      <div className={[`${style.flexColumn}`, "marginB20"].join(' ')}>
			      	<label>项目名称</label>
			      	<Input className={`${style.input}`} />
			      </div>
			      <div className={[`${style.flexColumn}`, "marginB20"].join(' ')}>
			      	<label>系统位数</label>
			      	<Radio.Group
			      	  options={bitsOptions}
			      	  onChange={this.bitsOptionChange}
			      	  value={this.state.bitsSelect} />
			      </div>
			      <div className={[[`${style.flexColumn}`, "marginB20"].join(' '), `${style.alignTop}`].join(' ')}>
			      	<label>导入方式</label>
			      	<Radio.Group
			      		className={`${style.flexRow}`}
			      	  options={importMethodOptions}
			      	  onChange={this.importMethodOptionChange}
			      	  value={this.state.importMethodSelect} />
			      </div>
			    </TabPane>
			    <TabPane tab="检测项配置" key="2">
			      <div className={[`${style.flexColumn}`, "marginB20"].join(' ')}>
						  <Select
						  	className={[`${style.select}`, "marginR20"].join(' ')}
						    showSearch
						    style={{ width: 200 }}
						    placeholder="Select a person"
								optionFilterProp="children"
								defaultValue={this.state.defaultConfigId}
						    onChange={(value) => {
									this.setState({
										confirmOwnRules: []
									})
									this.fetchDetailByConfigId(value);
								}}
						    onSearch={onSearch}
						    filterOption={(input, option) =>
						      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
						    }
						  >
								{this.state.configList.map(item => {
						    	return (<Option value={item.id}>{item.configName}</Option>);
								})}
						  </Select>
						  <Button icon="plus">新增配置</Button>
			      </div>
			      <div className={[`${style.flexColumn}`, "marginB20"].join(' ')}>
			      	<span className="marginR20">代码克隆分析</span>
			      	<Switch className="marginR20" checkedChildren="开" unCheckedChildren="关" defaultChecked={this.state.detectorDetail.cloneAnalysis} />
              <Popover content={``}>
                <Icon className="cursorPointer marginR20" type="question-circle" />
              </Popover>
			      	<span className="marginR20">代码度量</span>
			      	<Switch className="marginR20" checkedChildren="开" unCheckedChildren="关" defaultChecked={this.state.detectorDetail.codeMeasure} />
              <Popover content={``}>
                <Icon className="cursorPointer marginR20" type="question-circle" />
              </Popover>
			      </div>
						{this.state.detectorDetail.languageList.length > 0 && this.state.detectorDetail.languageList.map((languageList, index) => {
							return (
							<div className={[`${style.flexRow}`, `${style.checkGroup}`].join(' ')} key={index}>
								<div className={[`${style.flexColumn}`, `${style.checkGroupItem}`].join(' ')} onClick={() => {
									this.state.detectorDetail.languageList[index].show = !this.state.detectorDetail.languageList[index].show;
									this.setState({
										detectorDetail: this.state.detectorDetail
									});
								}}>
									<div className={`${style.nameWrap}`}>
										{this.state.detectorDetail.languageList[index].show ? (<Icon type="down" />) : (<Icon type="right" />)}
										<span className={`${style.name}`}>{languageList.name}</span>
									</div>
								</div>
								{languageList.packageList.length > 0 && this.state.detectorDetail.languageList[index].show && languageList.packageList.map((item, i) => {
									return (
										<div className={`${style.checkGroupItem}`} key={item.id}>
											<Checkbox onChange={() => {}}>{item.packageName}</Checkbox>
											<div className={style.flexColumn}>
												<Radio.Group onChange={() => {}} value={1}>
													<Radio value={1}>默认</Radio>
													<Radio value={2}>自定义</Radio>
												</Radio.Group>
												<Checkbox.Group options={['Apple', 'Pear', 'Orange']} defaultValue={['Apple']} onChange={() => {}} />
												<Icon className={["cursorPointer", `${style.iconDanger}`].join(' ')} onClick={() => {
													this.setState({
														drawerShowTab2: true
													}, () => {
														this.fetchRuleList();
													});
												}} type="question-circle" />
											</div>
										</div>
									)
								})}
							</div>
							);
						})}
			      <div className={[`${style.flexRow}`, `${style.checkGroup}`].join(' ')}>
			      	<div className={[`${style.flexColumn}`, `${style.nameWrap}`].join(' ')}>
				      	<Icon type="down" />
			          <div className={`${style.name}`}>自定义配置项</div>
								<Icon
								  type="plus-circle"
								  onClick={() => {
										this.setState({
											drawerShowTab2: true
										}, () => {
											this.fetchRuleList();
										});
									}} 
								/>
		          </div>
							{this.state.confirmOwnRules.concat(this.state.customCodeRuleList).map(item => {
								return (
									<div className={``}>
										{item.codeRuleName}
										<Icon className="cursorPointer" type="delete" />
									</div>
								)
							})}
			      </div>
						<Drawer
							destroyOnClose
		          placement="right"
		          closable={false}
		          onClose={() => {
								this.setState({
									drawerShowTab2: false
								});
							}}
		          visible={this.state.drawerShowTab2}
		          className={`${style.drawer}`}
		          width={500}
		        >
		          <div className={`${style.title}`}>
								<Icon type="setting" />
								<p>配置</p>
							</div>
							<div className={`${style.search}`}>
								<Search
									enterButton="搜索"
									onSearch={value => console.log(value)}
									className={`${style.input}`}
								/>
								<span className={`${style.tip}`}>已选择{this.state.checkOwnRules.length}个/共{this.state.ruleLength}个</span>
							</div>
							<Tree
								checkable
								defaultExpandAll
								defaultCheckedKeys={this.state.confirmOwnRules.concat(this.state.customCodeRuleList).map(item => item.id)}
								onExpand={() => {}}
								onCheck={(checkedKeys, {checked, checkedNodes, node, event, halfCheckedKeys}) => {
									console.log(`check`,checkedKeys, {checked, checkedNodes, node, event, halfCheckedKeys} )
									this.setState({
										checkOwnRules: checkedNodes.map(item => {
											return {
												id: item.props.id,
												codeRuleName: item.props.codeRuleName
											}
										})
									})
								}}
								onSelect={(selectedKeys, {selected, selectedNodes, node, event}) => {
								}}
								switcherIcon={<Icon type="down" />}
							>
								{this.renderTreeNodes(this.state.ruleList)}
							</Tree>
				      <div className={`${style.drawerFooter}`}>
				      	<Button onClick={() => {
									this.setState({
										drawerShowTab2: false
									});
								}}>关闭</Button>
				      	<Button
									type="primary" 
									onClick={() => {
										this.setState({
											drawerShowTab2: false,
											confirmOwnRules: this.state.checkOwnRules
										}, () => {
										})
									}}
								>确认</Button>
				      </div>
		        </Drawer>
			    </TabPane>
			    <TabPane tab="编译器配置" key="3">
			      <div className="languageName">C/C++</div>
			      <div className={style.selectArea}>
				     	<label>编译器配置</label>
						  <Select
						  	className={style.select}
						    showSearch
						    style={{ width: 200 }}
						    placeholder="Select a person"
						    optionFilterProp="children"
						    onChange={onChange}
						    onSearch={onSearch}
						    filterOption={(input, option) =>
						      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
						    }
						  >
						    <Option value="jack">Jack</Option>
						    <Option value="lucy">Lucy</Option>
						    <Option value="tom">Tom</Option>
						  </Select>
						  <Button>添加</Button>
						</div>
						<Drawer
		          placement="right"
		          closable={false}
		          onClose={() => {}}
		          visible={this.state.drawerShow}
		          width={800}
		          bodyStyle={{height: '100%', padding: 0}}
		        >
		        	<div className={`${style.drawerTab3}`}>
			        	<div className={`${style.list}`}>
			        		<div className={`${style.title}`}>系统自带编译器</div>
			        		{[1, 2, 3].map((item, i) => {
			        			return (
			        				<div className={[item === 2 ? `${style.select}` : ``, `${style.listItem}`].join(' ')}>222</div>
			        			)
			        		})}
			        		<div className={`${style.own}`}>
			        		  <span className={`${style.title}`}>自定义编译器</span>
				        		<Icon className={`${style.icon}`} type="plus-circle" theme="filled" />
				        		<Icon className={`${style.icon}`} type="minus-circle" theme="filled" />
			        		</div>
			        		{[1, 2, 3].map((item, i) => {
			        			return (
			        				<div className={[item === 2 ? `${style.select}` : ``, `${style.listItem}`].join(' ')}>222</div>
			        			)
			        		})}
			        		<Button className={`${style.btnClose}`}>关闭</Button>
			        	</div>
			        	<div className={`${style.content}`}>等待通知</div>
			        </div>
		        </Drawer>
			    </TabPane>
			  </Tabs>
			  <div className={`${style.btnGroup}`}>
				  <Button>取消</Button>
				  <Button type="primary">创建项目</Button>
				</div>
		  </div>
	  );
	}
}
