import React from "react";
import classNames from "classnames/bind";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {DefaultLayout, MinimalLayout} from "~/layout/index.jsx";
import { DefaultRoute, MinimalRoute } from "~/route/routes";
import styles from "./App.module.scss";

const cx = classNames.bind(styles);



function App() {
  return (
    <div className={cx("App")}>
      <Router>
        <Routes>
          <Route element={<DefaultLayout />}>
            {DefaultRoute.map((route) => (
                <Route key={route.path} path={route.path} element={<route.component />} />
            ))}
          </Route>
          <Route element={<MinimalLayout />}>
            {MinimalRoute.map((route) => (
                <Route key={route.path} path={route.path} element={<route.component />} />
            ))}
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;