import { Layout } from "antd";
import React, { Component } from "react";

// Redux
import { connect } from "react-redux";

// CSS Style
// import "../css/adminPage.css";
import "../css/page.css";

// Components
// import PasswordChangeSection from "../components/admin/passwordChangeSection";
import PasswordEditorForm from "../components/admin/passwordEditorForm";
import BillingSection from "../components/admin/billingSection";

// Ant design
const { Content, Footer } = Layout;

class AdminPage extends Component {
  constructor() {
    super();
    this.state = {
      currentPassword: "123456",
      newPassword: "",
      confirmPassword: "",
    };
  }

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
              <PasswordEditorForm title="Admin" />
              <PasswordEditorForm title="Staff" />
            </div>
          </Content>

          <Content className="content-card">
            <BillingSection />
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
