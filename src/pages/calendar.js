import React, { Component } from "react";

// redux
import { connect } from "react-redux";
import {
} from "../redux/actions/dataActions";

// css styles
import "../css/layout.css";
import "../css/input.css";
import "../css/calendar.css";

// Ant design
import { Button, Layout } from "antd";
//import { SearchOutlined } from "@ant-design/icons";
const { Content, Footer } = Layout;


class Calendar extends Component {

  constructor() {
    super();
    this.state = {
      
      // errors
      errors: {},
    };
  }

  
  render() {
    //const { credentials } = this.props.user;
    //const isAdmin = credentials.isAdmin;
   
    return (
      <div className="container">
        <header className="page-header">
          <div className="page-header-title">
            <h1>Calendar</h1>
            <Button 
            type="primary"
            variant="contained"
            style={{width: "100%"}}
            className="edit-button"
            >
              Edit
            </Button>
          </div>
        </header>
        <Layout className="vertical-fill-layout">
          <Content className="content-container" >
            <div className ="google-calendar"> 
            <iframe title = "Google Calendar"src="https://calendar.google.com/calendar/embed?height=760&amp;wkst=1&amp;bgcolor=%23ffffff&amp;ctz=America%2FLos_Angeles&amp;src=am9lLmh3YW5nZ0BnbWFpbC5jb20&amp;src=ZW4udXNhI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&amp;color=%237986CB&amp;color=%237986CB&amp;showTitle=0" style={{border:'solid 1px #777'}} width="1000" height="760" frameborder="0" scrolling="no"></iframe>
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

export default connect(mapStateToProps, {
  
})(Calendar);

