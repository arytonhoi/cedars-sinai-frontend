import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux stuff
import { connect } from "react-redux";

// Ant design
import { Avatar, Button, Empty } from "antd";
import { EditOutlined, PhoneOutlined, MailOutlined } from "@ant-design/icons";

class ContactList extends Component {
  render() {
    const { credentials } = this.props.user;
    const isAdmin = credentials.isAdmin;
    const department = this.props.department;
    const contacts = this.props.contacts;

    // contacts
    const contactsListComponent = contacts.map((c) => {
      return (
        <li key={c.id} className="contact-item">
          <div className="contact-item-info name">
            {c.imgUrl !== "" && <Avatar src={c.imgUrl} />}
            <h1 className="bold">{c.name}</h1>
          </div>
          <div className="contact-item-info phone">
            <PhoneOutlined />
            <p>{c.phone}</p>
          </div>
          <div className="contact-item-info email">
            <MailOutlined />
            <a href={`mailto:${c.email}`}>{c.email}</a>
          </div>

          {isAdmin && this.props.isEditingPage && (
            <Button
              icon={<EditOutlined />}
              onClick={() =>
                this.props.handleAddorEditContact(department.id, c.id)
              }
              type="text"
            />
          )}
        </li>
      );
    }, this);

    return contacts.length !== 0 ? (
      <ul>{contactsListComponent}</ul>
    ) : (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={<span>No contacts</span>}
      >
        {!this.props.isEditingPage && (
          <Button
            type="dashed"
            onClick={() => this.props.handleAddorEditContact(department.id)}
          >
            Add contact
          </Button>
        )}
      </Empty>
    );
  }
}

ContactList.propTypes = {
  user: PropTypes.object.isRequired,
  department: PropTypes.object.isRequired,
  contacts: PropTypes.array.isRequired,
  handleAddorEditContact: PropTypes.func.isRequired,
  isEditingPage: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, {})(ContactList);
