import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { auth } from '../../actions';

class Logout extends React.Component {
  static propTypes = {
    logout: PropTypes.func
  };

  componentWillMount() {
    const { logout } = this.props;
    logout();
  }

  render() {
    return (
      <Redirect to="/" />
    );
  }
}

const mapStateToProps = (state) => {
  const {
    isLogin
  } = state.auth;
  return {
    isLogin
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(auth.logout())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
