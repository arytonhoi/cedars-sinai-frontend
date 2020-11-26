import { Layout } from 'antd';
import React, { Component } from 'react';

// Redux
import { connect } from 'react-redux';

// CSS Style
import "../css/adminPage.css";

// Components
import PasswordSection from "../components/admin/passwordSection";
import BillSection from "../components/admin/billSection";

// Ant design
const { Content, Footer } = Layout;


class adminPage extends Component {

    constructor() {
        super();
        this.state = {
            currentPassword: "123456",
            newPassword: "",
            confirmPassword: "",
        //   // departments
        //   addingDepartment: false,
        //   targettedDepartmentId: "",
        //   departmentName: "",
        //   // contacts
        //   targettedContactId: "",
        //   addingContact: false,
        //   contactName: "",
        //   contactImgUrl: "",
        //   contactDepartmentId: "",
        //   contactPhone: "",
        //   contactEmail: "",
        //   // search
        //   searchTerm: "",
        //   // editing
        //   isEditing: false,
        //   visible: false,
        //   // errors
        //   errors: {},
        };
      }

    render() {
        return (
            <div className="container">
                <header className="adminHeader">
                    <div className="adminHeaderTitle">
                        <h1>Admin Settings</h1>
                    </div>
                </header>
                <Layout className="verticalFillLayout">
                    <div className="floating-component shadow">
                        <Content className="admin-content-container">
                            <PasswordSection />
                        </Content>
                    </div>

                    <div className="floating-component shadow">
                        <Content className="admin-content-container">
                            <BillSection />
                        </Content>
                    </div>
                    <Footer style={{ textAlign: "center" }}>DevelopForGood ©2020</Footer>
                </Layout>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {

    };
}

// const mapDispatchToProps = (dispatch) => {
//     return {

//     };
// }


export default connect(
    mapStateToProps,
)(adminPage);