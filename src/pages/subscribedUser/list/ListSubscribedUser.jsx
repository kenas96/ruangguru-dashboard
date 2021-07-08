import React from "react";
import { Table, Icon } from "antd";
import { Link } from "react-router-dom";

class ListSubscribedUser extends React.Component {
  state = {
    data: [
      {
        index: 1,
        key: "anugrahaman71",
        userId: "anugrahaman71",
        userName: "Anugrah Aman",
        userEmail: "anugrahaman71@gmail.com",
        userPhoneNumber: "6281245176267"
      },
      {
        index: 2,
        key: "rahelpratama413",
        userId: "rahelpratama413",
        userName: "Rahel Pratama",
        userEmail: "rahelpratama413@gmail.com",
        userPhoneNumber: "6285744176764"
      },
      {
        index: 3,
        key: "aisyahrodiah354",
        userId: "aisyahrodiah354",
        userName: "Aisyah Rodiah",
        userEmail: "aisyahrodiah354@gmail.com",
        userPhoneNumber: "6285716296700"
      },
      {
        index: 4,
        key: "donomargonobegono97",
        userId: "donomargonobegono97",
        userName: "Dono Margono Begono",
        userEmail: "donomargonobegono97@gmail.com",
        userPhoneNumber: "6281246676200"
      }
    ]
  };

  render() {
    const { data } = this.state;
    const columns = [
      {
        title: "No",
        dataIndex: "index"
      },
      {
        title: "Name",
        dataIndex: "userName"
      },
      {
        title: "Email",
        dataIndex: "userEmail"
      },
      {
        title: "Phone Number",
        dataIndex: "userPhoneNumber"
      },
      {
        title: "Prize",
        dataIndex: "action",
        render: (text, record) => (
          <span>
            <Link
              to={{
                pathname: `user/prize/${record.key}/`
              }}
              title="Assign Prize"
            >
              <Icon type="gift" />
            </Link>
          </span>
        )
      }
    ];
    return (
      <div className="table-wrapper">
        <Table
          className="table-user"
          columns={columns}
          dataSource={data}
          pagination={false}
        />
      </div>
    );
  }
}

export default ListSubscribedUser;
