import { Home, Logout, ChangePassword } from "./pages";

import ListUserRolePermission from "./pages/userRolePermission/list/ListUserRolePermission";
import CreateUserRolePermission from "./pages/userRolePermission/create/CreateUserRolePermission";
import DetailUserRolePermission from "./pages/userRolePermission/detail/DetailUserRolePermission";
import UpdateUserRolePermission from "./pages/userRolePermission/update/UpdateUserRolePermission";

import ListUserPrivilege from "./pages/userPrivilege/list/ListUserPrivilege";
import CreateUserPrivilege from "./pages/userPrivilege/create/CreateUserPrivilege";
import UpdateUserPrivilege from "./pages/userPrivilege/update/UpdateUserPrivilege";

import ListApplication from "./pages/application/ListApplication";
import ListActiveContractsLoan from "./pages/activeContractsLoan/ListActiveContractsLoan";
import ListRepayment from "./pages/repayment/ListRepayment";
import ListWatchlist from "./pages/watchlist/ListWatchlist";
import ListTransaction from "./pages/transaction/ListTransaction";

let permission = {};

const user = JSON.parse(window.localStorage.getItem("user"));
const roles = user.info.resource_access["boost-qredit-portal-dev"].roles;
roles.map(key => {
  permission[key] = 1;
});

const routes = [
  {
    id: "home",
    icon: "home",
    title: "Home",
    path: "/",
    component: Home
  },
  {
    id: "userRole",
    hideSidebar: permission.GET_ROLE_PERMISSIONS == 0 ? true : false,
    icon: "user",
    title: "User Role",
    path: "/user-role",
    component: ListUserRolePermission
  },
  {
    hideSidebar: true,
    title: "Create User Role",
    path: "/create-user-role",
    component: CreateUserRolePermission
  },
  {
    hideSidebar: true,
    title: "Detail User Role",
    path: "/user-role/detail/:id/",
    component: DetailUserRolePermission
  },
  {
    hideSidebar: true,
    title: "Edit User Role",
    path: "/user-role/edit/:id/",
    component: UpdateUserRolePermission
  },
  {
    id: "userPrivilege",
    hideSidebar: permission.GET_ALL_USER == 0 ? true : false,
    icon: "team",
    title: "User Privilege",
    path: "/user",
    component: ListUserPrivilege
  },
  {
    hideSidebar: true,
    title: "Create User",
    path: "/create-user",
    component: CreateUserPrivilege
  },
  {
    hideSidebar: true,
    title: "Edit User",
    path: "/user/edit/:id/",
    component: UpdateUserPrivilege
  },
  {
    id: "application",
    hideSidebar: permission.GET_APPLICATIONS == 0 ? true : false,
    icon: "contacts",
    title: "Application",
    path: "/application",
    component: ListApplication
  },
  {
    id: "activeContractsLoan",
    hideSidebar: permission.GET_ACTIVE_CONTRACT_LOAN == 0 ? true : false,
    icon: "credit-card",
    title: "Active Contracts Loan",
    path: "/active-contracts-loan",
    component: ListActiveContractsLoan
  },
  {
    id: "repayment",
    hideSidebar: permission.GET_REPAYMENT == 0 ? true : false,
    icon: "swap",
    title: "Repayment",
    path: "/repayment",
    component: ListRepayment
  },
  {
    id: "watchlist",
    hideSidebar: permission.GET_WATCHLIST == 0 ? true : false,
    icon: "exclamation-circle",
    title: "Watchlist",
    path: "/watchlist",
    component: ListWatchlist
  },
  {
    id: "transaction",
    hideSidebar: permission.GET_TRANSACTION == 0 ? true : false,
    icon: "line-chart",
    title: "Transaction",
    path: "/transaction",
    component: ListTransaction
  },
  {
    id: 7,
    title: "Logout",
    show_headers: true,
    hideSidebar: true,
    path: "/logout",
    component: Logout
  },
  {
    id: 8,
    title: "Change Password",
    hideSidebar: true,
    show_headers: false,
    path: "/change-password/:key",
    component: ChangePassword
  }
];

export default routes;
