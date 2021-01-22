import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

// AntDesign
import { Layout, Menu } from "antd";
import {
  CalendarOutlined,
  ContactsOutlined,
  FilePdfOutlined,
  FolderOpenOutlined,
  LogoutOutlined,
  NotificationOutlined,
  SettingOutlined,
} from "@ant-design/icons";

// Styles
import "../../css/home.css";

const { Sider } = Layout;
class SideNav extends Component {
  state = {
    collapsed: false,
  };

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  render() {
    const { isAdmin } = this.props.user;

    const { collapsed } = this.state;
    const { location } = this.props;
    return (
      <Sider theme="light" collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
        <Menu theme="light" selectedKeys={[location.pathname.split("/", 2)[1]]} mode="inline">
          <Menu.Item style={{ marginTop: "24px", marginBottom: "24px" }}>
            {this.state.collapsed ? (
              <img
                style={{ position: "relative", left: "-8px" }}
                className="logo"
                alt=""
                src={process.env.PUBLIC_URL + "/icon-min.svg"}
              />
            ) : (
              <img className="logo" alt="" src={process.env.PUBLIC_URL + "/logo.png"} />
            )}
          </Menu.Item>
          <Menu.Item key="announcements" icon={<NotificationOutlined />}>
            <Link to="/announcements">Announcements</Link>
          </Menu.Item>
          <Menu.Item key="newsletters" icon={<FilePdfOutlined />}>
            <Link to="/newsletters">Newsletters</Link>
          </Menu.Item>
          <Menu.Item key="resources" icon={<FolderOpenOutlined />}>
            <Link to="/resources">Resources</Link>
          </Menu.Item>
          <Menu.Item key="calendar" icon={<CalendarOutlined />}>
            <Link to="/calendar">Calendar</Link>
          </Menu.Item>
          <Menu.Item key="contacts" icon={<ContactsOutlined />}>
            <Link to="/contacts">Contacts</Link>
          </Menu.Item>
          {isAdmin && (
            <Menu.Item key="admins" icon={<SettingOutlined />}>
              <Link to="/admins">Admin Settings</Link>
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

export default withRouter(connect(mapStateToProps)(SideNav));
