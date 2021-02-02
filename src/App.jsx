import React from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { auth } from './actions';
import { Headers, Sidebar, Wrapper } from './components';
import Routes from './utils/AppRoutes';
import Login from './pages/login/Login';

const { Content } = Layout;

class App extends React.Component {
  static propTypes = {
    isLogin: PropTypes.bool,
    checkLogin: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      collapsed: false
    };
  }

  componentWillMount() {
    const { checkLogin } = this.props;
    checkLogin();
  }

  toggle = () => {
    const { collapsed } = this.state;
    this.setState({
      collapsed: !collapsed
    });
  }

  render() {
    const { collapsed } = this.state;
    const { isLogin } = this.props;
    const mainLayout = (
      <React.Fragment>
        <Layout>
          <Sidebar
            collapsed={collapsed}
          />
          <Layout
            className={`layout__content-wrapper ${collapsed ? 'collapsed' : ''}`}
          >
            <Headers
              collapsed={collapsed}
              onClick={this.toggle}
            />
            <Content
              className="layout__content"
            >
              <Wrapper>
                {Routes.map(({ path, component }, index) => {
                  return (
                    <Route exact key={index} path={path} component={component} />
                  );
                })}
              </Wrapper>
            </Content>
          </Layout>
        </Layout>
      </React.Fragment>
    );

    return (
      <BrowserRouter>
        <Switch>
          {!isLogin
            ? <Route path="/" name="Login" component={Login} />
            : mainLayout
          }
        </Switch>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = (state) => {
  const { isLogin } = state.auth;
  return {
    isLogin
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    checkLogin: () => dispatch(auth.checkLogin())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
