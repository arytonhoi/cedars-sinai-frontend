import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux stuff
import { connect } from "react-redux";

class EditContactModal extends Component {
  render() {
    return (
      <div>
        <form noValidate onSubmit={this.props.handleSubmit}>
          <label htmlFor="contactDepartmentId">Department:</label>
          <select
            name="contactDepartmentId"
            onChange={this.props.handleChange}
            value={this.props.contactDepartmentId}
          >
            {this.props.departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          <br />
          <label htmlFor="contactName">Name:</label>
          <input
            id="contactName"
            name="contactName"
            type="text"
            value={this.props.contactName}
            onChange={this.props.handleChange}
          />
          <br />
          <label htmlFor="contactImgUrl">ImgUrl:</label>
          <input
            id="contactImgUrl"
            name="contactImgUrl"
            type="text"
            value={this.props.contactImgUrl}
            onChange={this.props.handleChange}
          />
          <br />
          <label htmlFor="contactPhone">Phone:</label>
          <input
            id="contactPhone"
            name="contactPhone"
            type="text"
            value={this.props.contactPhone}
            onChange={this.props.handleChange}
          />
          <br />
          <label htmlFor="contactEmail">Email:</label>
          <input
            id="contactEmail"
            name="contactEmail"
            type="text"
            value={this.props.contactEmail}
            onChange={this.props.handleChange}
          />
          <br />
          <button type="button" onClick={this.props.handleSubmitContactChange}>
            Change!
          </button>
          <button type="button" onClick={this.props.handleCancelContactChange}>
            Cancel
          </button>
        </form>
      </div>
    );
  }
}

EditContactModal.propTypes = {
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, {})(EditContactModal);
