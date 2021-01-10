import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

// AntDesign
import { Dropdown, Menu, Tooltip } from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";

// Styles
import "./floatAddButton.css";

class FloatAddButton extends Component {
  handleAction = (event) => {
    this.props.options[event.key]();
  };

  render() {
    const { isAdmin } = this.props.user;
    const options = this.props.options;
    const isEditOptions = this.props.isEditOptions;
    const optionKeys = Object.keys(options);

    if (!isAdmin) return null;

    if (optionKeys.length === 1) {
      return (
        <Tooltip title={`${isEditOptions ? "Edit" : "Add"} ${optionKeys[0]}`}>
          <div className="float-button single-option" onClick={() => options[optionKeys[0]]()}>
            {isEditOptions ? (
              <EditOutlined className="float-button-text" />
            ) : (
              <PlusOutlined className="float-button-text" />
            )}
          </div>
        </Tooltip>
      );
    } else {
      const optionsMenu = (
        <Menu onClick={this.handleAction}>
          {Object.keys(options).map((option) => (
            <Menu.Item key={option}>{option}</Menu.Item>
          ))}
        </Menu>
      );
      return (
        <Dropdown overlay={optionsMenu} placement="topCenter">
          <div className="float-button">
            <PlusOutlined style={{ fontSize: "24px", color: "white" }} />
          </div>
        </Dropdown>
      );
    }
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
