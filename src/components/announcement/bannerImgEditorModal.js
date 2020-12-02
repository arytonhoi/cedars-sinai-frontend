import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux stuff
import { connect } from "react-redux";

// styles
import "../../css/modal.css";

// Antd
import { Button, Form, Input, Modal } from "antd";

class BannerImgEditorModal extends Component {
  componentDidUpdate() {
    if (this.formRef.current) {
      this.formRef.current.resetFields();
    }
  }

  formRef = React.createRef();

  render() {
    return (
      <Modal
        className="modal"
        title="Edit banner image"
        visible={this.props.visible}
        centered={true}
        width={1000}
        closable={false}
        footer={[
          <span className="modal-footer-filler" key="space"></span>,
          <Button
            key="back"
            onClick={() => {
              this.props.handleCancelEditBannerImg();
              this.formRef.current.resetFields();
            }}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            variant="contained"
            form="bannerImgEditorForm"
            htmlType="submit"
          >
            Save changes
          </Button>,
        ]}
      >
        <div>
          <Form
            className="modal-form"
            id="bannerImgEditorForm"
            layout="vertical"
            ref={this.formRef}
            initialValues={{
              bannerImgUrl: this.props.bannerImgUrl,
            }}
            onFinish={(formValues) => {
              this.props.handlePatchBannerImg(formValues);
              this.formRef.current.resetFields();
            }}
          >
            {/* <Form.Item>
              <img
                style={{ width: "100%" }}
                src={
                  this.formRef.current
                    ? this.formRef.current.getFieldValue("bannerImgUrl")
                    : this.props.bannerImgUrl
                }
                alt="Banner Preview"
              />
            </Form.Item> */}
            <Form.Item
              name="bannerImgUrl"
              label="Banner image URL"
              rules={[{ required: true, message: "Image URL required" }]}
            >
              <Input
                name="bannerImgUrl"
                type="text"
                placeholder="(ex. something.jpg)"
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    );
  }
}

BannerImgEditorModal.propTypes = {
  bannerImgUrl: PropTypes.string.isRequired,
  handlePatchBannerImg: PropTypes.func.isRequired,
  handleCancelEditBannerImg: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {})(BannerImgEditorModal);
