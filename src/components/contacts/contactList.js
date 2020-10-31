import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux stuff
import { connect } from "react-redux";
import { deleteAnnounce, clearErrors } from "../../redux/actions/dataActions";

class ContactList extends Component {
  render() {
    const { credentials } = this.props.user;
    const isAdmin = credentials.isAdmin;

    const contacts = this.props.contacts;
    const contactsMarkup = contacts.map((c) => (
      <li key={c.id}>
        <h1>{c.name}</h1>
        <h3>{c.department}</h3>
        <p>{c.imageUrl}</p>
        <p>{c.phone}</p>
        <p>{c.email}</p>
        {isAdmin && (
          <div>
            <button
              onClick={this.props.handleEditThisContact}
              // name="targettedDepartmentId"
              value={c.id}
              type="button"
            >
              Edit Contact
            </button>
            <button
              onClick={this.props.handleDeleteContact}
              // name="targettedDepartmentId"
              value={c.id}
              type="button"
            >
              Delete Contact
            </button>
          </div>
        )}
      </li>
    ));

    return <div>{contactsMarkup}</div>;
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
