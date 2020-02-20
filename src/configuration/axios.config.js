import axios from 'axios'
import qs from 'qs';
import {Component} from 'react'
Component.prototype.$axios=axios //将axios挂载到Component上，以供全局使用

axios.defaults.baseURL = '';
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.interceptors.request.use(function (config) {
  console.log(`axios.interceptors.request.config before`, config)
  if (config.method === "delete") {
    config = {
      ...config,
      url: `${config.url}?${qs.stringify(config.params, { indices: false })}`,
      params: {}
    }
  }
  console.log(`axios.interceptors.request.config`, config)
  return ({
    ...config,
    data: qs.stringify(config.data, { indices: false }), 
  });
}, function (error) {
  // Do something with request error
  console.log('axios.interceptors.request.error', error);
  return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  console.log('axios.interceptors.response', response)
  return response;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error);
});