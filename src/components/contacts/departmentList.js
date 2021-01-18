import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux stuff
import { connect } from "react-redux";
import DepartmentSection from "./departmentSection";

// styles
import "./contacts.css";
import "../../css/page.css";

// antd
import { Empty, Spin } from "antd";

class DepartmentList extends Component {
  render() {
    const { isAdmin } = this.props.user;

    const departments = this.props.departments;
    const contacts = this.props.contacts;
    const searchTerm = this.props.searchTerm;

    if (departments.length === 0) {
      return (
        <Empty
          style={{ margin: "auto" }}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <span>
              {isAdmin
                ? 'Add departments using the botttom right "+" button'
                : "No departments yet."}
            </span>
          }
        ></Empty>
      );
    } else if (contacts.length === 0 && searchTerm !== "") {
      return (
        <Empty
          style={{ margin: "auto" }}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <span>
              No contacts matched <br /> "{searchTerm}"
            </span>
          }
        />
      );
    } else {
      const departmentsListComponent = departments.map((d) => {
        const departmentContacts = contacts.filter((c) => c.departmentId === d.id);
        return (
          <DepartmentSection
            key={d.id}
            // data
            department={d}
            contacts={departmentContacts}
            // department functions
            handleAddorEditDepartment={this.props.handleAddorEditDepartment}
            // contacts
            handleAddorEditContact={this.props.handleAddorEditContact}
            searchTerm={this.props.searchTerm}
          />
        );
      }, this);

      return <ul>{departmentsListComponent}</ul>;
    }
  }
}

DepartmentList.propTypes = {
  user: PropTypes.object.isRequired,
  // data
  departments: PropTypes.array.isRequired,
  contacts: PropTypes.array.isRequired,
  // department functions
  handleAddorEditDepartment: PropTypes.func.isRequired,
  // contact functions
  handleAddorEditContact: PropTypes.func.isRequired,
  // general
  searchTerm: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, {})(DepartmentList);
