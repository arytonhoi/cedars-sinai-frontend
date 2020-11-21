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

          {isAdmin && this.props.isEditing && (
            <Button
              icon={<EditOutlined />}
              onClick={() => this.props.handleEditThisContact(c.id)}
              type="text"
            />
          )}
        </li>
      );
    }, this);

    return contacts.length !== 0 ? (
      <ul>{contactsListComponent}</ul>
    ) : (
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
    );
  }
}

ContactList.propTypes = {
  contacts: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, {})(ContactList);
