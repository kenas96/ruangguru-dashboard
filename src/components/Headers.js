import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { Layout, Icon, Menu, Dropdown } from "antd";
import routes from "../routes";

const { Header } = Layout;

const Headers = ({ onClick, collapsed }) => {
  const profileMenu = (
    <Menu>
      {routes.map((route, index) => {
        if (route.show_headers) {
          const { child } = route;
          if (!!child) {
            const child2 = child;
            return (
              <Menu.SubMenu
                key={`sub${index}`}
                title={
                  <span>
                    <span>{route.title}</span>
                  </span>
                }
              >
                {child2.map((route2, index2) => {
                  if (!!route2.child) {
                    return (
                      <Menu.SubMenu
                        key={`${index}-${index2}`}
                        title={
                          <span>
                            <span>{route2.title}</span>
                          </span>
                        }
                      >
                        {route2.child.map((route3, index3) => {
                          return (
                            <Menu.Item key={route3.id}>
                              <NavLink to={route3.path}>
                                <span>{route3.title}</span>
                              </NavLink>
                            </Menu.Item>
                          );
                        })}
                      </Menu.SubMenu>
                    );
                  } else {
                    return (
                      <Menu.Item key={route2.id}>
                        <NavLink to={route2.path}>
                          <span>{route2.title}</span>
                        </NavLink>
                      </Menu.Item>
                    );
                  }
                })}
              </Menu.SubMenu>
            );
          } else {
            return (
              <Menu.Item key={route.id}>
                <NavLink to={route.path}>
                  <span>{route.title}</span>
                </NavLink>
              </Menu.Item>
            );
          }
        }
      })}
    </Menu>
  );

  return (
    <Header className={`layout__headers ${collapsed ? "collapsed" : ""}`}>
      <div className="layout__headers--wrapper">
        <div className="layout__headers--icon" onClick={onClick}>
          <Icon
            className="trigger"
            type={collapsed ? "menu-unfold" : "menu-fold"}
          />
          <span className="layout__title">Boost Qredit Portal</span>
        </div>

        <div className="layout__headers--right-menu">
          <Dropdown overlay={profileMenu} trigger={["click"]}>
            <div className="layout__headers--menu-wrapper">
              <Icon type="user" />
            </div>
          </Dropdown>
        </div>
      </div>
    </Header>
  );
};

Headers.propTypes = {
  collapsed: PropTypes.bool,
  onClick: PropTypes.func
};

export default Headers;
