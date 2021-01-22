import React, { Component } from "react";
import PropTypes from "prop-types";

// redux
import { connect } from "react-redux";
import { POST_NEWSLETTER, PATCH_NEWSLETTER, DELETE_NEWSLETTER } from "../redux/types";
import {
  deleteNewsletter,
  getNewsletters,
  patchNewsletter,
  postNewsletter,
} from "../redux/actions/newsletterActions";
import {
  clearAllErrors,
  clearError,
  setLoadingAction,
  stopLoadingAction,
} from "../redux/actions/uiActions";

// components
import NewsletterEditorModal from "../components/newsletters/newsletterEditorModal.js";
import FloatAddButton from "../components/layout/floatAddButton";

// css styles
import "../css/page.css";
import "../css/ckeditor.css";
import "../components/newsletters/newsletter.css";

// Ant design
// antd
import { Button, Layout, List, notification, Result, Spin } from "antd";
import { EditOutlined, FilePdfOutlined, LoadingOutlined } from "@ant-design/icons";
const { Content, Footer } = Layout;

class NewsletterPage extends Component {
  constructor() {
    super();
    this.state = {
      // newsletter inputs
      newsletterId: "",
      newsletterTitle: "",
      newsletterUrl: "",
      // newsletter editor modal
      showNewsletterEditorModal: false,
    };
  }

  componentDidMount() {
    this.props.clearAllErrors();
    this.props.getNewsletters();
  }

  componentDidUpdate(prevProps) {
    // render action progress and errors
    let currentErrors = this.props.ui.errors;
    let currentloadingActions = this.props.ui.loadingActions;
    let previousLoadingActions = prevProps.ui.loadingActions;
    let previousLoadingActionNames = Object.keys(previousLoadingActions);

    previousLoadingActionNames.forEach((actionName) => {
      if (!currentloadingActions[actionName] && previousLoadingActions[actionName]) {
        // if preivousLoadingAction is no longer loading
        switch (actionName) {
          case POST_NEWSLETTER:
            notification.close(POST_NEWSLETTER);
            currentErrors[actionName]
              ? notification["error"]({
                  message: "Failed to post newsletter",
                  description: currentErrors[actionName],
                  duration: 0,
                  onClose: () => {
                    clearError(POST_NEWSLETTER);
                  },
                })
              : notification["success"]({
                  message: "Newsletter posted!",
                });
            break;

          case PATCH_NEWSLETTER:
            notification.close(PATCH_NEWSLETTER);
            currentErrors[actionName]
              ? notification["error"]({
                  message: "Failed to update newsletter",
                  description: currentErrors[actionName],
                  duration: 0,
                  onClose: () => {
                    clearError(PATCH_NEWSLETTER);
                  },
                })
              : notification["success"]({
                  message: "Newsletter updated!",
                });
            break;

          case DELETE_NEWSLETTER:
            notification.close(DELETE_NEWSLETTER);
            currentErrors[actionName]
              ? notification["error"]({
                  message: "Failed to delete newsletter",
                  description: currentErrors[actionName],
                  duration: 0,
                  onClose: () => {
                    clearError(DELETE_NEWSLETTER);
                  },
                })
              : notification["success"]({
                  message: "Newsletter deleted!",
                });
            break;
          default:
            break;
        }
      }
    });
  }

  // newsletter editor functions
  handleEditThisNewsletter = (newsletter = null) => {
    if (newsletter === null) {
      this.setState({
        newsletterId: "",
        newsletterTitle: "",
        newsletterUrl: "",
        showNewsletterEditorModal: true,
      });
    } else {
      this.setState({
        newsletterId: newsletter.id,
        newsletterTitle: newsletter.title,
        newsletterUrl: newsletter.url,
        showNewsletterEditorModal: true,
      });
    }
  };

  handleCancelEditNewsletter = () => {
    this.setState({
      newsletterId: "",
      newsletterTitle: "",
      newsletterUrl: "",
      showNewsletterEditorModal: false,
    });
  };

  handlePostOrPatchNewsletter = (formValues) => {
    const newNewsletter = {
      title: formValues.newsletterTitle,
      url: formValues.newsletterUrl,
    };

    if (this.state.newsletterId === "") {
      // posting new newsletter
      notification.open({
        key: POST_NEWSLETTER,
        duration: 0,
        message: "Posting newsletter...",
        icon: <LoadingOutlined />,
      });
      this.props.postNewsletter(newNewsletter);
    } else {
      // editing exisitng newsletter
      notification.open({
        key: PATCH_NEWSLETTER,
        duration: 0,
        message: "Updating newsletter...",
        icon: <LoadingOutlined />,
      });
      this.props.patchNewsletter(this.state.newsletterId, newNewsletter);
    }

    this.handleCancelEditNewsletter();
  };

  handleDeleteThisNewsletter = () => {
    notification.open({
      key: DELETE_NEWSLETTER,
      duration: 0,
      message: "Deleting newsletter...",
      icon: <LoadingOutlined />,
    });
    this.props.deleteNewsletter(this.state.newsletterId);
    this.handleCancelEditNewsletter();
  };

  render() {
    const { isAdmin } = this.props.user;
    const { errors, loadingActions } = this.props.ui;
    const { newsletters } = this.props.newsletters;

    const floatAddButtonOptions = {
      Newsletter: this.handleEditThisNewsletter,
    };

    return (
      <div className="page-container">
        {isAdmin && <FloatAddButton options={floatAddButtonOptions} />}
        {isAdmin && (
          <NewsletterEditorModal
            visible={this.state.showNewsletterEditorModal}
            isEditingExistingNewsletter={this.state.newsletterId !== ""}
            newsletterTitle={this.state.newsletterTitle}
            newsletterUrl={this.state.newsletterUrl}
            handlePostOrPatchNewsletter={this.handlePostOrPatchNewsletter}
            handleCancelEditNewsletter={this.handleCancelEditNewsletter}
            handleDeleteThisNewsletter={this.handleDeleteThisNewsletter}
          />
        )}
        <Layout className="vertical-fill-layout">
          <Content className="content-card padded">
            <div className="content-card-header">
              <div className="header-row">
                <h1>Newsletters</h1>
              </div>
            </div>
            {loadingActions.SET_NEWSLETTERS ? (
              <div className="vertical-content vertical-fill-content vertical-centered-content">
                <Spin />
              </div>
            ) : errors.SET_NEWSLETTERS ? (
              <div className="vertical-content vertical-fill-content vertical-centered-content">
                <Result
                  status="error"
                  title="Couldn't get newsletters"
                  subTitle={errors.SET_NEWSLETTERS}
                />
              </div>
            ) : (
              <List
                className="newsletter-list"
                itemLayout="vertical"
                size="large"
                pagination={{
                  defaultPageSize: 10,
                  showSizeChanger: true,
                }}
                dataSource={newsletters}
                renderItem={(newsletter) => (
                  <List.Item key={newsletter.id} className="newsletter-container">
                    <div className="newsletter-icon">
                      <FilePdfOutlined />
                    </div>
                    <div className="newsletter-info">
                      <div className="newsletter-header">
                        <a
                          className="newsletter-title"
                          href={newsletter.url}
                          rel="noreferrer"
                          target="_blank"
                        >
                          {newsletter.title}
                        </a>
                        {isAdmin && (
                          <Button
                            className="newsletter-edit-icon"
                            icon={<EditOutlined />}
                            onClick={() => this.handleEditThisNewsletter(newsletter)}
                            type="text"
                          />
                        )}
                      </div>
                      <span className="newsletter-date">
                        Posted on: {newsletter.createdAt.toString("MM/dd/yy")}
                      </span>
                    </div>
                  </List.Item>
                )}
              />
            )}
          </Content>
          <Footer style={{ textAlign: "center" }}>DevelopForGood ©2020</Footer>
        </Layout>
      </div>
    );
  }
}

NewsletterPage.propTypes = {
  // newsletters
  getNewsletters: PropTypes.func.isRequired,
  postNewsletter: PropTypes.func.isRequired,
  patchNewsletter: PropTypes.func.isRequired,
  deleteNewsletter: PropTypes.func.isRequired,
  // generic
  newsletters: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    newsletters: state.newsletters,
    ui: state.ui,
  };
};

export default connect(mapStateToProps, {
  // newsletters,
  deleteNewsletter,
  getNewsletters,
  patchNewsletter,
  postNewsletter,
  // loading
  clearAllErrors,
  clearError,
  setLoadingAction,
  stopLoadingAction,
})(NewsletterPage);
