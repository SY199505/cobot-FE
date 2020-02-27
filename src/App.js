import Header from '@/layout/Header';
import Sider from '@/layout/Sider';

import RouteConfig from '@/router';

import style from './App.module.scss';

import React, { Component } from 'react';
import Axios from 'axios';

export class App extends Component {

  componentDidMount() {
    this.getDictionary('severityLevel', true)
    this.getDictionary('language', true)
  }

  getDictionary = (dictionaryName, ifKeyValue=false) => {
    Axios.get(`/cobot/dict/queryByDictType`, {
      params: {
        dictType: dictionaryName,
        needKey: ifKeyValue
      }
    }, {
      header: {
        'Content-Type': 'application/json'
      }
    })
  }

  render() {
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
}

export default App;
