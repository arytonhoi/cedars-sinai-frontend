import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux stuff
import { connect } from "react-redux";
import { deleteAnnounce, clearErrors } from "../../redux/actions/dataActions";
import ContactList from "./contactList";

// Ant design
import { Avatar, Button, List } from "antd";
import { DeleteOutlined, EditOutlined, UserOutlined } from "@ant-design/icons";

// class
import "./department.css";

class Department extends Component {
  render() {
    const { credentials } = this.props.user;
    const isAdmin = credentials.isAdmin;
    const department = this.props.department;
    const contacts = this.props.contacts;
    return (
      <div className="departmentComponent">
        <List
          itemLayout="horizontal"
          dataSource={contacts}
          header={
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
                    onClick={() =>
                      this.props.handleDeleteDepartment(department.id)
                    }
                    type="text"
                  />
                </div>
              )}
            </header>
          }
          footer={
            <Button
              onClick={() => this.props.handleAddNewContact(department.id)}
              type="dashed"
              block
            >
              + Add New Contact
            </Button>
          }
          renderItem={(c) => (
            <List.Item style={{ padding: 15 }}>
              <div className="contactInfo">
                <Avatar className="contactImg" icon={<UserOutlined />} />
                <h1>{c.name}</h1>
                {/* <p>{c.imageUrl}</p> */}
                <p>{c.phone}</p>
                <p>{c.email}</p>
                {isAdmin && (
                  <span>
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => this.props.handleEditThisContact(c.id)}
                      type="text"
                    />
                    <Button
                      icon={<DeleteOutlined />}
                      onClick={() => this.props.handleDeleteContact(c.id)}
                      type="text"
                    />
                  </span>
                )}
              </div>
            </List.Item>
          )}
        />

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
