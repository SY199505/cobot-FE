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

  componentDidMount() {
  }

  onClick = ({ item, key, keyPath, domEvent }) => {
    console.log({ item, key, keyPath, domEvent })
    window.location.href = keyPath.reverse().join("");
  }

  loopRouter = (routerArr, routerObj) => {
    if (routerObj) {
      let arr = [];
      console.log(routerObj)
      arr.unshift({
        path: routerObj.path,
        componentName: routerObj.componentName
      }); 
      routerArr = arr.concat(routerArr);
    }
    return routerArr.map((route, i) => {
      if (route.routes && route.routes.length) {
        return (
          <SubMenu
            key={route.path}
            title={
              <span>
                <Icon type="mail" />
              </span>
            }
          >
            {this.loopRouter(route.routes, route)}
          </SubMenu>
        );
      } else {
        return (
          <Menu.Item key={route.path}>
            {route.iconName && (<Icon type="pie-chart" />)}
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
        onClick={this.onClick}
      >
        {this.loopRouter(routes)}
      </Menu>
    );
  }
};