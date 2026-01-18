import { DefaultLayout, MinimalLayout } from "~/layout/index.jsx";
import Dashboard from "~/page/Dashboard/index.jsx";
import Mgs_waiting from "~/page/Mgs_waiting/index.jsx";
import Marketplace from "~/page/Marketplace/index.jsx";
import Group from "~/page/Group/index.jsx";
import Register from "~/page/Register/index.jsx";
import Warehouse from "~/page/Warehouse/index.jsx";
import Login from "~/page/Login/index.jsx";

import {publicRoutes} from "~/config";

const DefaultRoute = [
    {
        path: publicRoutes.dashboard,
        component: Dashboard,
        layout: DefaultLayout,
    },
    {
        path: publicRoutes.warehouse,
        component: Warehouse,
        layout: DefaultLayout,
    },
    {
        path: publicRoutes.msg_waiting,
        component: Mgs_waiting,
        layout: DefaultLayout,
    },
    {
        path: publicRoutes.marketplace,
        component: Marketplace,
        layout: DefaultLayout,
    },
    {
        path: publicRoutes.group,
        component: Group,
        layout: DefaultLayout,
    }
];

const MinimalRoute = [
    {
        path: publicRoutes.login,
        component: Login,
        layout: MinimalLayout,
    },
    {
        path: publicRoutes.register,
        component: Register,
        layout: MinimalLayout,
    },
];

export { DefaultRoute, MinimalRoute };