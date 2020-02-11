import React from 'react';
import { 
	Button,
	Input,
	Radio,
	Select, 
	Tabs } from 'antd';

import style from './create.module.scss';

const { TabPane } = Tabs;
const { Option } = Select;

function onChange(value) {
  console.log(`selected ${value}`);
}

function onBlur() {
  console.log('blur');
}

function onFocus() {
  console.log('focus');
}

function onSearch(val) {
  console.log('search:', val);
}

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
]

export default class Create extends React.Component {
	static propTypes = {
		// name: React.PropTypes.string,
	};

	callback = (key) => {
	  console.log(key);
	}

	constructor(props) {
		super(props);
		this.state = {
			bitsSelect: "64",
			importMethodSelect: "archive",
		}
	};

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
			  <Tabs className={`${style.tabs}`} defaultActiveKey="1" onChange={this.callback}>
			    <TabPane tab="项目信息" key="1">
			      <div className={`${style.flexColumn}`}>
			      	<label>项目名称</label>
			      	<Input className={`${style.input}`} />
			      </div>
			      <div className={`${style.flexColumn}`}>
			      	<label>系统位数</label>
			      	<Radio.Group
			      	  options={bitsOptions}
			      	  onChange={this.bitsOptionChange}
			      	  value={this.state.bitsSelect} />
			      </div>
			      <div className={[`${style.flexColumn}`, `${style.alignTop}`].join(' ')}>
			      	<label>导入方式</label>
			      	<Radio.Group
			      		className={`${style.flexRow}`}
			      	  options={importMethodOptions}
			      	  onChange={this.importMethodOptionChange}
			      	  value={this.state.importMethodSelect} />
			      </div>
			    </TabPane>
			    <TabPane tab="检测项配置" key="2">
			      Content of Tab Pane 2
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
						    onFocus={onFocus}
						    onBlur={onBlur}
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
