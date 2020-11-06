import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

// AntDesign
import { Layout, Menu } from "antd";
import {
  CalendarOutlined,
  ContactsOutlined,
  CreditCardOutlined,
  FolderOpenOutlined,
  LogoutOutlined,
  NotificationOutlined,
  // SettingOutlined,
} from "@ant-design/icons";

// Styles
import "../css/home.css";

const { Sider } = Layout;
class SideNav extends Component {
  state = {
    collapsed: false,
  };

  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  render() {
    const { credentials } = this.props.user;
    const isAdmin = credentials.isAdmin;
    const { collapsed } = this.state;
    return (
      <Sider
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={this.onCollapse}
      >
        <div className="logo-box" >
          <img className="logo" src={process.env.PUBLIC_URL + '/logo.png'} />
        </div>
        <Menu
          theme="light"
          defaultSelectedKeys={["announcements"]}
          mode="inline"
        >
          <Menu.Item key="announcements" icon={<NotificationOutlined />}>
            <Link to="/announcements">Announcements</Link>
          </Menu.Item>
          <Menu.Item key="resources" icon={<FolderOpenOutlined />}>
            <Link to="/resources">Resources</Link>
          </Menu.Item>
          <Menu.Item key="calendar" icon={<CalendarOutlined />}>
            <Link to="/calendar">Calendar</Link>
          </Menu.Item>
          <Menu.Item key="contacts" icon={<ContactsOutlined />}>
            <Link to="/contacts">Contact</Link>
          </Menu.Item>
          {isAdmin && (
            <Menu.Item key="billing" icon={<CreditCardOutlined />}>
              <Link to="/contacts">Billing</Link>
            </Menu.Item>
          )}
          <Menu.Item key="logout" icon={<LogoutOutlined />}>
            <Link to="/logout">Logout</Link>
          </Menu.Item>
        </Menu>
      </Sider>
    );
  }
}

SideNav.propTypes = {
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
});
export default connect(mapStateToProps)(SideNav);
