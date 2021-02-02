import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';

import routes from '../routes';

const { Sider } = Layout;

const Sidebar = ({ collapsed }) => {
  const logo = 'logo.png';
  const logoCollapsed = 'logo-collapsed.png';
  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      className={`layout__sidebar ${collapsed ? 'collapsed' : ''}`}
    >
      <div className="layout__sidebar--logo">
        <img
          src={`/assets/icons/${collapsed ? logoCollapsed : logo}`}
          alt="Logo"
        />
      </div>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
        {routes.map((route, index) => {
          if (!route.hideSidebar) {
            const { child } = route;
            if (!!child) {
              const child2 = child;
              return (
                <Menu.SubMenu
                  key={`sub${index}`}
                  title={
                    <span>
                      <Icon type={route.icon} />
                      <span>{route.title}</span>
                    </span>
                  }
                >
                  {child2.map((route2, index2) => {
                    if (!route2.hideSidebar) {
                      if (!!route2.child) {
                        return (
                          <Menu.SubMenu
                            key={`${index}-${index2}`}
                            title={
                              <span>
                                <Icon type={route2.icon} />
                                <span>{route2.title}</span>
                              </span>
                            }
                          >
                            {route2.child.map((route3, index3) => {
                              if (!route3.hideSidebar) {
                                return (
                                  <Menu.Item key={route3.id}>
                                    <NavLink to={route3.path}>
                                      <Icon type={route3.icon} />
                                      <span>{route3.title}</span>
                                    </NavLink>
                                  </Menu.Item>
                                );
                              } else {
                                return null;
                              }
                            })}
                          </Menu.SubMenu>
                        );
                      } else {
                        return (
                          <Menu.Item key={route2.id}>
                            <NavLink to={route2.path}>
                              <Icon type={route2.icon} />
                              <span>{route2.title}</span>
                            </NavLink>
                          </Menu.Item>
                        );
                      }
                    } else {
                      return null;
                    }
                  })}
                </Menu.SubMenu>
              );
            } else {
              return (
                <Menu.Item key={route.id}>
                  <NavLink to={route.path}>
                    <Icon type={route.icon} />
                    <span>{route.title}</span>
                  </NavLink>
                </Menu.Item>
              );
            }
          } else {
            return null;
          }
        })}
      </Menu>
    </Sider>
  );
};

Sidebar.propTypes = {
  collapsed: PropTypes.bool
};

export default Sidebar;
