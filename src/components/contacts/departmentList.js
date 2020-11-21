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

    const departmentsListComponent = departments.map((d) => {
      const departmentContacts = this.props.contacts.filter(
        (c) => c.departmentId === d.id
      );
      return (
        <DepartmentSection
          key={d.id}
          department={d}
          contacts={departmentContacts}
          handleEditThisDepartment={this.props.handleEditThisDepartment}
          handleDeleteDepartment={this.props.handleDeleteDepartment}
          handleAddNewContact={this.props.handleAddNewContact}
          handleSubmitNewContact={this.props.handleSubmitNewContact}
          handleEditThisContact={this.props.handleEditThisContact}
          handleSubmitContactChange={this.props.handleSubmitContactChange}
          handleCancelContactChange={this.props.handleCancelContactChange}
          handleDeleteContact={this.props.handleDeleteContact}
          handleChange={this.props.handleChange}
          isEditing={this.props.isEditing}
        />
      );
    }, this);

    if (!isAdmin && this.props.contacts.length === 0) {
      return null;
    } else {
      return <ul>{departmentsListComponent}</ul>;
    }
  }
}

DepartmentList.propTypes = {
  contacts: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, {})(DepartmentList);
