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
        <li key={c.id} className="contactRow">
          <div className="contactImg">
            {c.imgUrl !== "" && <Avatar src={c.imgUrl} />}
          </div>
          <h1 className="contactName">{c.name}</h1>
          <div className="contactPhone">
            <PhoneOutlined />
            <p>{c.phone}</p>
          </div>
          <span className="contactEmail">
            <MailOutlined />
            {/* <p href={`mailto:${c.email}`}>{c.email}</p> */}
            <a href={`mailto:${c.email}`}>{c.email}</a>
          </span>

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
      <ul className="contactList">{contactsListComponent}</ul>
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
