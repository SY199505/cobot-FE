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
import routes from '@/router.config';

export default class Overview extends React.Component {
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
      routes.map((item, i) => {
        if (item.path === '/project') {
          console.log('overview', item.routes)
          this.setState({
            route: item.routes
          })
        }
      });
    }
    componentDidMount() {
      console.log(this.props.history)
    }

    render() {
      return (
        <div>
          <Menu onClick={this.handleClick} mode="horizontal">
            {this.state.route.map((item, i) => {
              return (
                <Menu.Item key={item.path}>
                  {item.componentName}
                </Menu.Item>
              )
            })}
          </Menu>
        </div>
      );
    }
}
