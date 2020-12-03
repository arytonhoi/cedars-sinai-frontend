import React, { Component } from "react";

// redux
import { connect } from "react-redux";
import {} from "../redux/actions/dataActions";

// css styles
//import "../css/layout.css";
import "../css/input.css";
import "../css/page.css";
import "../css/calendar.css";

// Ant design
import { Button, Layout } from "antd";
//import { SearchOutlined } from "@ant-design/icons";
const { Content, Footer } = Layout;

class calendarPage extends Component {
  constructor() {
    super();
    this.state = {
      // errors
      errors: {},
    };
  }

  render() {
    const { credentials } = this.props.user;
    const isAdmin = credentials.isAdmin;

    return (
      <div className="page-container">
        <header className="page-header-container">
          <div className="page-header-main-items">
            <h1>Calendar</h1>
{isAdmin?
            <Button
              type="primary"
              className="edit-button"
              onClick={(e) => {
                e.preventDefault();
                window.open(
                  "https://calendar.google.com/calendar/u/0/r?cid=cedarsoreducation@gmail.com"
                );
              }}
            >
              Edit Calendar
            </Button>:""
}
          </div>
        </header>
        <Layout className="vertical-fill-layout">
          <Content className="content-card">
            <div className="google-calendar">
              <iframe
                title="Google Calendar"
                src="https://calendar.google.com/calendar/embed?src=cedarsoreducation%40gmail.com&ctz=Europe%2FLondon;showTitle=0"
                style={{ border: "solid 1px #777", width: "100%", height: "100vh" }}
                frameborder="0"
                scrolling="no"
              ></iframe>
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>DevelopForGood ©2020</Footer>
        </Layout>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    data: state.data,
    user: state.user,
  };
};

export default connect(mapStateToProps, {})(calendarPage);
