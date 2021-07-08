import { Logout } from "./pages";

import ListSubscribedUser from "./pages/subscribedUser/list/ListSubscribedUser";
import DetailSubscribedUser from "./pages/subscribedUser/detail/DetailSubscribedUser";

const routes = [
  {
    id: "home",
    hideSidebar: true,
    title: "Home",
    path: "/",
    component: ListSubscribedUser
  },
  {
    id: "user",
    icon: "user",
    title: "User",
    path: "/user",
    component: ListSubscribedUser
  },
  {
    hideSidebar: true,
    title: "Prize Subscribed User",
    path: "/user/prize/:id/",
    component: DetailSubscribedUser
  },
  {
    id: 7,
    title: "Logout",
    show_headers: true,
    hideSidebar: true,
    path: "/logout",
    component: Logout
  }
];

export default routes;
