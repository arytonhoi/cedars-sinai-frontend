import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux stuff
import { connect } from "react-redux";
import DepartmentSection from "./departmentSection";

// class
import "./contacts.css";
import "../../css/page.css";

class DepartmentList extends Component {
  render() {
    const { credentials } = this.props.user;
    const isAdmin = credentials.isAdmin;
    const departments = this.props.departments;

    if (departments.length === 0) {
      if (isAdmin) {
        return <p>No departments yet. Add some.</p>;
      } else {
        return <p>No departments yet.</p>;
      }
    } else {
      const departmentsListComponent = departments.map((d) => {
        const departmentContacts = this.props.contacts.filter(
          (c) => c.departmentId === d.id
        );
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
            // general
            isEditingPage={this.props.isEditingPage}
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
  isEditingPage: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, {})(DepartmentList);
