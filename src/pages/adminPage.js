import React, { Component } from "react";

// Redux
import { connect } from "react-redux";
import { clearAllErrors } from "../redux/actions/uiActions";

// CSS Style
// import "../css/adminPage.css";
import "../css/page.css";

// Components
import PasswordEditorForm from "../components/admin/passwordEditorForm";

// Ant design
import { Alert, Empty, Layout } from "antd";
const { Content, Footer } = Layout;

class AdminPage extends Component {
  componentDidMount() {
    this.props.clearAllErrors();
  }

  render() {
    const { isAdmin } = this.props.user;

    return (
      <div className="page-container">
        <header className="page-header-container">
          <div className="page-header-main-items">
            <h1>Admin Settings</h1>
          </div>
        </header>
        <Layout className="vertical-fill-layout">
          {isAdmin ? (
            <div>
              <Content className="content-card padded">
                <div className="content-card-header">
                  <div className="header-row">
                    <h1>Change Passwords</h1>
                  </div>
                </div>
                <div>
                  <div className="row padded-top">
                    <PasswordEditorForm targettedUser="admin" />
                    <PasswordEditorForm targettedUser="staff" />
                  </div>
                  <Alert
                    style={{ display: "inline-block", marginTop: "24px" }}
                    type="warning"
                    message="Changing an account's password will logout everyone using that account."
                    showIcon
                  />
                </div>
              </Content>
              <Content className="content-card padded">
                <div className="content-card-header">
                  <div className="header-row">
                    <h1>Billing Information</h1>
                  </div>
                </div>
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={<span>Section in progress</span>}
                  style={{ margin: "148px 0" }}
                />
              </Content>{" "}
            </div>
          ) : (
            <Content className="content-card">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={<span>Staff accounts cannot view the Admin page.</span>}
                style={{ margin: "148px 0" }}
              />
            </Content>
          )}
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

export default connect(mapStateToProps, { clearAllErrors })(AdminPage);
