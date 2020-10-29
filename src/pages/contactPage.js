import React, { Component } from "react";
import PropTypes from "prop-types";
import "../css/home.css";

import { connect } from "react-redux";
import { getContacts } from "../redux/actions/dataActions";

class home extends Component {
  componentDidMount() {
    this.props.getContacts();
  }

  render() {
    const { contacts } = this.props.data;
    let contactsMarkup = contacts.map((c) => (
      <li key={c.contactId}>
        <h1>{c.name}</h1>
        <h3>{c.department}</h3>
        <p>{c.imageUrl}</p>
        <p>{c.phone}</p>
        <p>{c.email}</p>
      </li>
    ));

    return <div>{contactsMarkup}</div>;
  }
}

home.propTypes = {
  getContacts: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  isAdmin: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  return {
    data: state.data,
    isAdmin: state.user.isAdmin,
  };
};

export default connect(mapStateToProps, { getContacts })(home);
