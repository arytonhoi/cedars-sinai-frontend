import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux stuff
import { connect } from "react-redux";

// Ant design
import { Avatar, Button, Empty, Spin } from "antd";
import { EditOutlined, PhoneOutlined, MailOutlined } from "@ant-design/icons";

class ContactList extends Component {
  render() {
    const { isAdmin } = this.props.user;
    const { loadingActions } = this.props.ui;

    const department = this.props.department;
    const contacts = this.props.contacts;

    // contacts
    const contactsListComponent = contacts.map((c) => {
      if(c.phone.match(/^\d{10}$/) !== null){
        c.phone = "(" + c.phone.slice(0,3) + ") " + c.phone.slice(3,6) + "-" + c.phone.slice(6,10)
      }
      return (
        <li key={c.id} className="contact-item">
          <div className="contact-item-content">
            <div className="contact-item-info name">
              {c.imgUrl !== "" && <Avatar src={c.imgUrl} />}
              <h1>{c.name}</h1>
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
          </div>
        </li>
      );
    }, this);

    if (loadingActions.SET_CONTACTS) {
      return <Spin style={{ marginTop: "48px" }} />;
    } else {
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
}

ContactList.propTypes = {
  user: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired,
  department: PropTypes.object.isRequired,
  contacts: PropTypes.array.isRequired,
  handleAddorEditContact: PropTypes.func.isRequired,
  isEditingPage: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    ui: state.ui,
  };
};

export default connect(mapStateToProps, {})(ContactList);
