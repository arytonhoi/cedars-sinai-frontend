import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux stuff
import { connect } from "react-redux";
import { deleteAnnounce, clearErrors } from "../../redux/actions/dataActions";
import ContactList from "./contactList";

// Ant design
import { Avatar, Button, List } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PhoneOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";

// class
import "./department.css";

class Department extends Component {
  render() {
    const { credentials } = this.props.user;
    const isAdmin = credentials.isAdmin;
    const department = this.props.department;
    const contacts = this.props.contacts;

    // contacts
    const contactsListComponent = contacts.map(function (c) {
      return (
        <li className="contactRow">
          <div className="contactImg">
            <Avatar icon={<UserOutlined />} />
            {/* <p>{c.imageUrl}</p> */}
          </div>
          <h1 className="contactName">{c.name}</h1>
          <div className="contactPhone">
            <PhoneOutlined />
            <p>{c.phone}</p>
          </div>
          <span className="contactEmail">
            <MailOutlined />
            <p>{c.email}</p>
          </span>

          {isAdmin && (
            <span>
              <Button
                icon={<EditOutlined />}
                onClick={() => this.props.handleEditThisContact(c.id)}
                type="text"
              />
              {/* <Button
                icon={<DeleteOutlined />}
                onClick={() => this.props.handleDeleteContact(c.id)}
                type="text"
              /> */}
            </span>
          )}
        </li>
      );
    }, this);

    return (
      <div className="departmentComponent">
        <header className="departmentHeader">
          <h2>{department.name}</h2>
          {isAdmin && (
            <div className="departmentAndContactButton">
              <Button
                icon={<EditOutlined />}
                onClick={() =>
                  this.props.handleEditThisDepartment(department.id)
                }
                type="text"
              />
              <Button
                icon={<DeleteOutlined />}
                onClick={() => this.props.handleDeleteDepartment(department.id)}
                type="text"
              />
            </div>
          )}
        </header>
        <ul className="contactList">{contactsListComponent}</ul>
        <footer className="addContactFooter">
          <Button
            onClick={() => this.props.handleAddNewContact(department.id)}
            type="dashed"
            block
          >
            + Add New Contact
          </Button>
        </footer>

        {/* <button
          onClick={this.props.handleAddNewContact}
          name="targettedDepartmentId"
          value={department.id}
          type="button"
        >
          Add Contact
        </button> */}
        {/* <ul>
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
        </ul> */}
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
