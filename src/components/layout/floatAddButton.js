import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

// AntDesign
import { Dropdown, Menu, Tooltip } from "antd";
import { PlusOutlined } from "@ant-design/icons";

// Styles
import "./floatAddButton.css";

class FloatAddButton extends Component {
  handleAction = (event) => {
    console.log(event.key);
    // console.log(this.props.options);
    // console.log(this.props.options[event.key]);
    this.props.options[event.key]();
  };

  render() {
    const { isAdmin } = this.props.user;
    if (!isAdmin) return null;

    const optionsMenu = (
      <Menu onClick={this.handleAction}>
        {Object.keys(this.props.options).map((option) => (
          <Menu.Item key={option}>{option}</Menu.Item>
        ))}
      </Menu>
    );

    return (
      <Dropdown
        // className="floatAddButton"
        overlay={optionsMenu}
        placement="topCenter"
      >
        <div className="floatAddButton">
          <PlusOutlined style={{ fontSize: "24px", color: "white" }} />
        </div>
      </Dropdown>
    );
  }
}

FloatAddButton.propTypes = {
  user: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps)(FloatAddButton);
