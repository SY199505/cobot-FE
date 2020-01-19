import React from 'react';

import Header from '@/layout/Header';
import Project from '@/project/Index';
import Sider from '@/layout/Sider';

import RouteConfig from '@/router';

import { useHistory } from 'react-router-dom';
import style from './App.module.scss';

function App() {
  return (
    <div className={style["App"]}>
      <Sider />
      <div id={style["main-content"]}>
    		<Header />
        <div id={style.routeWrap}>
	       <RouteConfig />
        </div>
      </div>
    </div>
  );
}

export default App;
