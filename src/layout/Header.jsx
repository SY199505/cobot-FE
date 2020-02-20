import React from 'react';
// import fetch from 'axios';

import logo from '@/assets/basic/logo.png';

import style from './header.module.scss';

// import utils from '@/utils';


export default class Header extends React.Component {
	static propTypes = {
		// name: React.PropTypes.string,
	};

	// constructor(props) {
	// 	super(props);
	// }

	render() {
		return (
			<div id={style.header}>
				<img id={style.logo} src={logo} alt="logo" />
				<h1 className={style.brandName}>CoBOT</h1>
			</div>
		);
	}
}
