import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux stuff
import { connect } from "react-redux";

class UpdateDepartmentModal extends Component {
  render() {
    return (
      <div>
        <form noValidate onSubmit={this.props.handleSubmit}>
          <label htmlFor="departmentName">Update Department Name:</label>
          <input
            id="departmentName"
            name="departmentName"
            type="text"
            value={this.props.departmentName}
            onChange={this.props.handleChange}
          />
          <button type="button" onClick={this.props.handleSubmitDepartmentChange}>
            Change!
          </button>
          <button type="button" onClick={this.props.handleCancelDepartmentChange}>
            Cancel
          </button>
        </form>
      </div>
    );
  }
}

UpdateDepartmentModal.propTypes = {
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, {})(UpdateDepartmentModal);
