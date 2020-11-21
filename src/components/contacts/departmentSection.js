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
    const { credentials } = this.props.user;
    const isAdmin = credentials.isAdmin;
    const department = this.props.department;

    if (!isAdmin && this.props.contacts.length === 0) {
      return null;
    } else {
      return (
        <li className="department-item">
          <header className="content-card-header padded">
            <h1>{department.name}</h1>
            {isAdmin && this.props.isEditing && (
              <Button
                icon={<EditOutlined />}
                onClick={() =>
                  this.props.handleEditThisDepartment(department.id)
                }
                type="text"
              />
            )}
          </header>
          <ContactList
            contacts={this.props.contacts}
            department={department}
            isEditing={this.props.isEditing}
            handleEditThisContact={this.props.handleEditThisContact}
          />

          {isAdmin && this.props.isEditing && (
            <footer>
              <Button
                onClick={() => this.props.handleAddNewContact(department.id)}
                type="dashed"
                block
              >
                + Add New Contact
              </Button>
            </footer>
          )}
        </li>
      );
    }
  }
}

DepartmentSection.propTypes = {
  contacts: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, {})(DepartmentSection);
