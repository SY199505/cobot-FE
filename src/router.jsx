import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  // Link
} from "react-router-dom";

import routes from '@/router.config';

export default function RouteConfig() {
  let routesTransform = [];
  let publicPath = "";
  function loop (arr, path) {
    arr.map((item, i) => {
      if (path) {
        item.path = path + item.path;
      }
      routesTransform.unshift(item);
      publicPath += item.path;
      if (Object.prototype.toString.call(item.routes) === "[object Array]") {
        loop(item.routes, publicPath);
      }
      publicPath = "";
    });
  }
  loop(routes);
  return (
    <Router>
      <Switch>
        {routesTransform.map((route, i) => (
          <Route
            path={route.path}
            render={props => (
              // pass the sub-routes down to keep nesting
              <route.component {...props} routes={route.routes} />
            )}
            key={i}
          />
        ))}
      </Switch>
    </Router>
  )
}