import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import Filter from './Filter';

import style from './index.module.scss';

class ListFilter extends React.Component {
	static propTypes = {
		tabList: PropTypes.array,
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
	};

  state = {
    tabSelect: this.props.tabList[0].key
  }

	constructor(props) {
		super(props);
	}

  componentDidMount() {

    console.log(this.props)
  };

  changeTab = (key) => {
    this.setState({
      tabSelect: key
    }, () => {
      this.props.changeType(key);
      this.props.history.push(`?tabSelect=${key}`);
    });
  }

	render() {
    const { match, location, history } = this.props;
    console.log('render', this.props)
		return (
			<div className={style.filterWrap}>
				<div className={[`${style.tab}`, 'radius'].join(' ')}>
					{ this.props.tabList.map((item, i) => {
							return (
                <div
                  className={[`${item.key === this.state.tabSelect ? style.select : ''}`, 'radius', `${style.tabItem}`].join(' ')}
                  key={i}
                  onClick={this.changeTab.bind(this, item.key)}
                >{item.name}</div>)
						})
					}
				</div>
        <div className={[`${style.main}`, 'radius', 'whiteBg'].join(' ')}>
  				<div className={[`${style.header}`, 'radius'].join(' ')}>
            <div className={style.filterIcon}>
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-filterIcon"></use>
              </svg>
  					  <div className={style.name}>过滤器</div>
            </div>
  					<div className={style.clearFilter}>清空条件</div>
  				</div>
          <Filter
            filter={this.props.filter.slice(0, 6)}
            searchList={this.props.searchList.slice(6)}
            title={222}
            filterFn={() => {}}
            searchFn={() => {}}
            valueLengthLimit={8}
          />
        </div>
			</div>
		);
	}
}
export default withRouter(ListFilter);