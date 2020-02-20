import React from 'react';
import {

} from 'antd';
import routes from '@/router.config';

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
        <div>

        </div>
      );
    }
}
