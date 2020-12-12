import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux stuff
import { connect } from "react-redux";
import ContactList from "./contactList";

// Ant design
import { Button } from "antd";
import { EditOutlined } from "@ant-design/icons";

// class
import "./contacts.css";
import "../../css/page.css";

class DepartmentSection extends Component {
  render() {
    const { isAdmin } = this.props.user;

    const department = this.props.department;
    const contacts = this.props.contacts;

    if (
      (contacts.length === 0 && this.props.searchTerm !== "") ||
      (!isAdmin && contacts.length === 0)
    ) {
      return null;
    } else {
      return (
        <li className="department-item">
          <header className="content-card-header">
            <div className="header-row">
              <h1>{department.name}</h1>
              {isAdmin && this.props.isEditingPage && (
                <Button
                  icon={<EditOutlined />}
                  onClick={() =>
                    this.props.handleAddorEditDepartment(department.id)
                  }
                  type="text"
                />
              )}
            </div>
          </header>
          <ContactList
            department={department}
            contacts={contacts}
            handleAddorEditContact={this.props.handleAddorEditContact}
            isEditingPage={this.props.isEditingPage}
          />

          {isAdmin && this.props.isEditingPage && (
            <footer>
              <Button
                onClick={() => this.props.handleAddorEditContact(department.id)}
                type="dashed"
                block
              >
                + Add new contact
              </Button>
            </footer>
          )}
        </li>
      );
    }
  }
}

DepartmentSection.propTypes = {
  user: PropTypes.object.isRequired,
  // data
  department: PropTypes.object.isRequired,
  contacts: PropTypes.array.isRequired,
  // department functions
  handleAddorEditDepartment: PropTypes.func.isRequired,
  // contacts
  handleAddorEditContact: PropTypes.func.isRequired,
  // general
  isEditingPage: PropTypes.bool.isRequired,
  searchTerm: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, {})(DepartmentSection);
