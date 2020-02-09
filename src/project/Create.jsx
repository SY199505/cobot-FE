import React from 'react';
import { Button, Select, Tabs } from 'antd';

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

export default class Create extends React.Component {
	static propTypes = {
		// name: React.PropTypes.string,
	};

	callback = (key) => {
	  console.log(key);
	}

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className={['radius', 'card'].join(' ')}>
			  <Tabs className={[`${style.tabs}`, 'ww'].join(' ')} defaultActiveKey="3" onChange={this.callback}>
			    <TabPane tab="Tab 1" key="1">
			      Content of Tab Pane 1
			    </TabPane>
			    <TabPane tab="Tab 2" key="2">
			      Content of Tab Pane 2
			    </TabPane>
			    <TabPane tab="Tab 3" key="3">
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
		  </div>
	  );
	}
}
