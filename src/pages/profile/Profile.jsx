import React from 'react';
import { Spin } from 'antd';

class ProfileDetail extends React.Component {
  state = {
    loading: false,
    UserEmail: '',
    UserName: '',
    UserPhone: '',
    UserPhoto: '',
    UserStatus: ''
  }

  componentDidMount() {
    this.setState({
      loading: true,
      UserEmail: 'admin@MediaList.com',
      UserName: 'admin',
      UserPhone: '081111111',
      // UserPhoto: detail.UserPhoto !== 'null' ? detail.UserPhoto : 'http://via.placeholder.com/150x150',
      // UserStatus: parseInt(detail.UserStatus, 10) === 1 ? 'Active' : 'Inactive'
    });

    this.setLoading(false);
  }

  setLoading(status) {
    setTimeout(() => {
      this.setState({ loading: status });
    }, 1000);
  }

  render() {
    const {
      loading,
      UserName,
      UserPhoto,
      UserEmail,
      UserPhone,
      UserStatus
    } = this.state;

    const loadingView = (
      <div><center><Spin /></center></div>
    );

    const view = (
      <div className="profile__wrapper">
        <div className="profile__wrapper--img-wrapper">
          <img src="https://via.placeholder.com/150x150/" className="profile-img" />
          <h3 className="profile-name">Superadmin</h3>
        </div>

        <div className="profile__wrapper--details-wrapper">
          <div className="profile__items">
            <p className="profile__items--field">User Name</p>
            <div className="profile__items--separator">:</div>
            <p className="profile__items--value">Superadmin</p>
          </div>

          <div className="profile__items">
            <p className="profile__items--field">Email</p>
            <div className="profile__items--separator">:</div>
            <p className="profile__items--value">superadmin@mail.me</p>
          </div>

          <div className="profile__items">
            <p className="profile__items--field">Phone</p>
            <div className="profile__items--separator">:</div>
            <p className="profile__items--value">089989898989</p>
          </div>

          <div className="profile__items">
            <p className="profile__items--field">Status</p>
            <div className="profile__items--separator">:</div>
            <p className="profile__items--value">Active</p>
          </div>

          <div className="profile__items">
            <p className="profile__items--field">Type</p>
            <div className="profile__items--separator">:</div>
            <p className="profile__items--value">Superadmin</p>
          </div>
        </div>
      </div>
    );
    return (
      <div>
        { loading ? loadingView : view }
      </div>
    );
  }
}

export default ProfileDetail;
