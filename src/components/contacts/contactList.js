import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux stuff
import { connect } from "react-redux";
import { deleteAnnounce, clearErrors } from "../../redux/actions/dataActions";

// Ant design
import { Avatar, Button } from "antd";
import { EditOutlined, PhoneOutlined, MailOutlined } from "@ant-design/icons";

class ContactList extends Component {
  render() {
    const { credentials } = this.props.user;
    const isAdmin = credentials.isAdmin;
    const contacts = this.props.contacts;

    // contacts
    const contactsListComponent = contacts.map(function (c) {
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
            <p>{c.email}</p>
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

    return <ul className="contactList">{contactsListComponent}</ul>;
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

export default connect(mapStateToProps, { deleteAnnounce, clearErrors })(
  ContactList
);
