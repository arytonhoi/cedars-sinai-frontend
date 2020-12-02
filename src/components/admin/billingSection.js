import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux stuff
import { connect } from "react-redux";
import { clearErrors } from "../../redux/actions/dataActions";

// Ant design
// import { Row, Col, Input, Form } from 'antd';

// class
import "./admin.css";

class BillingSection extends Component {
  render() {
    const { credentials } = this.props.user;
    const isAdmin = credentials.isAdmin;

    return (
      <div className="passwordComponent">
        <header className="passwordHeader">
          <h2>Billing Information</h2>
        </header>
      </div>
    );
  }
}

BillingSection.propTypes = {
  //   contacts: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, { clearErrors })(BillingSection);
