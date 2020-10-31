import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux stuff
import { connect } from "react-redux";
import { deleteAnnounce, clearErrors } from "../../redux/actions/dataActions";
import ContactList from "./contactList";

class Department extends Component {
  render() {
    const { credentials } = this.props.user;
    const isAdmin = credentials.isAdmin;
    const department = this.props.department;
    const contacts = this.props.contacts;
    return (
      <div>
        <h2>{department.name}</h2>
        {isAdmin && (
          <div>
            <button
              onClick={this.props.handleAddNewContact}
              // name="targettedDepartmentId"
              value={department.id}
              type="button"
            >
              Add Contact
            </button>
            <button
              onClick={this.props.handleEditThisDepartment}
              // name="targettedDepartmentId"
              value={department.id}
              type="button"
            >
              Edit Department
            </button>
            <button
              onClick={this.props.handleDeleteDepartment}
              // name="targettedDepartmentId"
              value={department.id}
              type="button"
            >
              Delete Department
            </button>
          </div>
        )}
        <ul>
          <ContactList
            name="targettedDepartmentId"
            value={department.id}
            contacts={contacts}
            handleAddNewContact={this.props.handleAddNewContact}
            handleSubmitNewContact={this.props.handleSubmitNewContact}
            handleEditThisContact={this.props.handleEditThisContact}
            handleSubmitContactChange={this.props.handleSubmitContactChange}
            handleCancelContactChange={this.props.handleCancelContactChange}
            handleDeleteContact={this.props.handleDeleteContact}
            handleChange={this.props.handleChange}
          />
        </ul>
      </div>
    );
  }
}

Department.propTypes = {
  contacts: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, { deleteAnnounce, clearErrors })(
  Department
);
