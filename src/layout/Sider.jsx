import React from 'react';
import { Menu, Icon } from 'antd';

import style from './sider.module.scss';

import routes from '@/router.config';

const { SubMenu } = Menu;

export default class Sider extends React.Component {
  state = {
    collapsed: true,
  };

  // constructor(props) {
  //   super(props);
  // }

  componentWillMount() {
  }

  loopRouter = (routerArr) => {
    return routerArr.map((route, i) => {
      if (route.routes && route.routes.length) {
        return (
          <SubMenu
            key="sub1"
            title={
              <span>
                <Icon type="mail" />
                <span>Navigation One</span>
              </span>
            }
          >
            {this.loopRouter(route.routes)}
          </SubMenu>
        );
      } else {
        return (
          <Menu.Item key={route.path}>
            <Icon type="pie-chart" />
            <span>{route.componentName}</span>
          </Menu.Item>
        );
      }
    });
  }

  render() {
    return (
      <Menu
        defaultSelectedKeys={['/']}
        defaultOpenKeys={[]}
        mode="inline"
        theme="dark"
        inlineCollapsed={this.state.collapsed}
        id={style.menu}
      >
        {this.loopRouter(routes)}
      </Menu>
    );
  }
};