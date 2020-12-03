import React, { Component } from "react";

// Redux
import { connect } from "react-redux";

// CSS Style
// import "../css/adminPage.css";
import "../css/page.css";

// Components
import PasswordEditorForm from "../components/admin/passwordEditorForm";

// Ant design
import { Empty, Layout } from "antd";
const { Content, Footer } = Layout;

class AdminPage extends Component {
  render() {
    return (
      <div className="page-container">
        <header className="page-header-container">
          <div className="page-header-main-items">
            <h1>Admin Settings</h1>
          </div>
        </header>
        <Layout className="vertical-fill-layout">
          <Content className="content-card">
            <div className="content-card-header">
              <div className="header-row">
                <h1>Change Passwords</h1>
              </div>
            </div>
            <div className="padded-content horizontal">
              <PasswordEditorForm targettedUser="admin" />
              <PasswordEditorForm targettedUser="staff" />
            </div>
          </Content>

          <Content className="content-card">
            <div className="content-card-header">
              <div className="header-row">
                <h1>Billing Information</h1>
              </div>
            </div>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={<span>Section in progress</span>}
              style={{ margin: "148px 0" }}
            ></Empty>
          </Content>
          <Footer style={{ textAlign: "center" }}>DevelopForGood ©2020</Footer>
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(AdminPage);
