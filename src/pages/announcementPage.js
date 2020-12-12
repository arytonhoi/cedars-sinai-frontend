import React, { Component } from "react";
import PropTypes from "prop-types";

// redux
import { connect } from "react-redux";
import {
  // Images
  GET_BANNER_IMAGE,
  PATCH_BANNER_IMAGE,
  // Announcements
  SET_ANNOUNCEMENTS,
  POST_ANNOUNCEMENT,
  PATCH_ANNOUNCEMENT,
  DELETE_ANNOUNCEMENT,
  FILTER_ANNOUNCEMENTS,
} from "../redux/types";
import {
  deleteAnnouncement,
  getAnnouncements,
  getBannerImage,
  getFilteredAnnouncements,
  patchAnnouncement,
  patchBannerImage,
  postAnnouncement,
} from "../redux/actions/announcementActions";

import {
  setLoadingPage,
  stopLoadingPage,
  setLoadingAction,
  stopLoadingAction,
} from "../redux/actions/uiActions";

// components
import AnnouncementPostEditorModal from "../components/announcement/announcementPostEditorModal.js";
import AnnouncementList from "../components/announcement/announcementList.js";
import BannerImgEditorModal from "../components/announcement/bannerImgEditorModal.js";

// css styles
import "../css/page.css";
import "../css/ckeditor.css";
import "../components/announcement/announcement.css";

// Ant design
// antd
import {
  Button,
  Dropdown,
  Input,
  Layout,
  Menu,
  notification,
  Result,
  Spin,
} from "antd";
import {
  DownOutlined,
  LoadingOutlined,
  SearchOutlined,
} from "@ant-design/icons";
const { Content, Footer } = Layout;

class AnnouncementPage extends Component {
  constructor() {
    super();
    this.state = {
      // announcement inputs
      announcementId: "",
      announcementTitle: "",
      announcementAuthor: "",
      announcementContent: "",
      // search and filter
      filteredAnnouncements: [],
      filter: {
        searchTerm: "",
        oldestAnnouncementTimestamp: 7776000000,
      },
      // announcement editor modal
      isEditing: false,
      elementHeight: "",
      // banner img
      isEditingBannerImg: false,
      // errors and loading
      loadingActions: {},
      errors: {},
    };
  }

  componentDidMount() {
    this.props.getAnnouncements();
    this.props.getBannerImage("announcements");
  }

  componentDidUpdate(prevProps) {
    // render action progress and errors
    let currentErrors = this.props.ui.errors;
    let currentloadingActions = this.props.ui.loadingActions;
    let previousLoadingActions = prevProps.ui.loadingActions;
    let previousLoadingActionNames = Object.keys(previousLoadingActions);

    previousLoadingActionNames.forEach((actionName) => {
      if (
        !currentloadingActions[actionName] &&
        previousLoadingActions[actionName]
      ) {
        // if preivousLoadingAction is no longer loading
        switch (actionName) {
          case PATCH_ANNOUNCEMENT:
            notification.close(PATCH_ANNOUNCEMENT);
            if (currentErrors[actionName]) {
              notification["error"]({
                message: "Announcement failed to update",
                description: currentErrors[actionName],
                duration: 0,
              });
            } else {
              notification["success"]({
                message: "Announcement updated!",
              });
            }
            break;
          case POST_ANNOUNCEMENT:
            notification.close(POST_ANNOUNCEMENT);
            notification["success"]({
              message: "Announcement posted!",
            });
            break;
          default:
            break;
        }
      }
    });
  }

  // input change handlers
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
    console.log(this.state);
  };

  handleFilterChange = (event) => {
    const updatedFilter = this.state.filter;
    updatedFilter[event.target.name] = event.target.value;
    this.setState({
      filter: updatedFilter,
    });
    this.props.getFilteredAnnouncements(updatedFilter);
  };

  handleAgeFilterChange = (event) => {
    const updatedFilter = this.state.filter;
    updatedFilter.oldestAnnouncementTimestamp = event.key;
    this.setState({
      filter: updatedFilter,
    });
    this.props.getFilteredAnnouncements(updatedFilter);
  };

  // form handlers
  toggleEditing = () => {
    this.setState({
      isEditing: !this.state.isEditing,
    });
  };

  // announcement editor functions
  handleEditThisAnnouncement = (announcement) => {
    this.setState({
      announcementId: announcement.id,
      announcementTitle: announcement.title,
      announcementAuthor: announcement.author,
      announcementContent: announcement.content,
      isEditing: true,
    });
  };

  handleCancelEditAnnouncement = () => {
    this.setState({
      announcementId: "",
      announcementTitle: "",
      announcementAuthor: "",
      announcementContent: "",
      isEditing: false,
    });
  };

  handlePostOrPatchAnnouncement = (formValues) => {
    const newAnnouncement = {
      title: formValues.announcementTitle,
      author: formValues.announcementAuthor,
      content: formValues.announcementContent,
      isPinned: false,
    };

    if (this.state.announcementId === "") {
      // posting new announcement
      notification.open({
        key: POST_ANNOUNCEMENT,
        duration: 0,
        message: "Posting announcement...",
        icon: <LoadingOutlined />,
      });
      this.props.postAnnouncement(newAnnouncement);
    } else {
      // editing exisitng announcement
      notification.open({
        key: PATCH_ANNOUNCEMENT,
        duration: 0,
        message: "Updating announcement...",
        icon: <LoadingOutlined />,
      });
      this.props.patchAnnouncement(this.state.announcementId, newAnnouncement);
    }

    this.handleCancelEditAnnouncement();
  };

  handleDeleteThisAnnouncement = () => {
    this.props.deleteAnnouncement(this.state.announcementId);
    this.handleCancelEditAnnouncement();
  };

  // banner editor functions
  handleEditBannerImg = () => {
    this.setState({
      isEditingBannerImg: true,
    });
  };

  handlePatchBannerImg = (formValues) => {
    const newImgUrlObj = {
      imgUrl: formValues.bannerImgUrl,
    };
    this.props.patchBannerImage("announcements", newImgUrlObj);
    this.handleCancelEditBannerImg();
  };

  handleCancelEditBannerImg = () => {
    this.setState({
      isEditingBannerImg: false,
    });
  };

  render() {
    const { isAdmin } = this.props.user;
    const { errors, loadingActions } = this.props.ui;
    const { bannerImgs, filteredAnnouncements } = this.props.announcements;

    return (
      <div className="page-container">
        {isAdmin && (
          <AnnouncementPostEditorModal
            visible={this.state.isEditing}
            isEditingExistingAnnouncement={this.state.announcementId !== ""}
            announcementTitle={this.state.announcementTitle}
            announcementAuthor={this.state.announcementAuthor}
            announcementContent={this.state.announcementContent}
            handlePostOrPatchAnnouncement={this.handlePostOrPatchAnnouncement}
            handleCancelEditAnnouncement={this.handleCancelEditAnnouncement}
            handleDeleteThisAnnouncement={this.handleDeleteThisAnnouncement}
          />
        )}
        {isAdmin && (
          <BannerImgEditorModal
            visible={this.state.isEditingBannerImg}
            bannerImgUrl={bannerImgs.announcements}
            handlePatchBannerImg={this.handlePatchBannerImg}
            handleCancelEditBannerImg={this.handleCancelEditBannerImg}
          />
        )}
        <Layout className="vertical-fill-layout">
          <Content className="content-card img-banner">
            <img alt="bg" src={bannerImgs.announcements} />
            <div className="img-banner-mask"></div>
            <h1>{isAdmin ? "Welcome Admin" : "Welcome"}</h1>
            <Button onClick={this.handleEditBannerImg}>Change picture</Button>
          </Content>
          <Content className="content-card">
            <div className="content-card-header">
              <div className="header-row">
                <h1>Recent Announcements</h1>
                <span className="page-header-interactive-items">
                  <Input
                    style={{ width: 400 }}
                    id="searchTerm"
                    name="searchTerm"
                    type="text"
                    placeholder="Search by keyword"
                    value={this.state.searchTerm}
                    onChange={this.handleFilterChange}
                    suffix={
                      <SearchOutlined
                        className="search-input-icon"
                        style={{ color: "rgba(0,0,0,.45)" }}
                      />
                    }
                  />
                  <Dropdown
                    overlay={
                      <Menu onClick={this.handleAgeFilterChange}>
                        <Menu.Item key="259200000">Recently Added</Menu.Item>
                        <Menu.Item key="86400000">Last 24 Hours</Menu.Item>
                        <Menu.Item key="604800000">Last Week</Menu.Item>
                        <Menu.Item key="2678400000">Last Month</Menu.Item>
                        <Menu.Item key="Infinity">Everything</Menu.Item>
                      </Menu>
                    }
                  >
                    <Button>
                      Filter by date <DownOutlined />
                    </Button>
                  </Dropdown>
                  {isAdmin && (
                    <Button
                      type="primary"
                      size={"medium"}
                      onClick={() => this.toggleEditing()}
                    >
                      Post New Announcement
                    </Button>
                  )}
                </span>
              </div>
            </div>
            {loadingActions.SET_ANNOUNCEMENTS ? (
              <div className="padded-content vertical-content">
                <Spin style={{ marginTop: "48px" }} />
              </div>
            ) : errors.SET_ANNOUNCEMENTS ? (
              <Result
                status="error"
                title="Failed to get announcements"
                subTitle={errors.SET_ANNOUNCEMENTS}
              />
            ) : (
              <AnnouncementList
                announcements={filteredAnnouncements}
                filter={this.state.filter}
                handleEditThisAnnouncement={this.handleEditThisAnnouncement}
              />
            )}
          </Content>
          <Footer style={{ textAlign: "center" }}>DevelopForGood ©2020</Footer>
        </Layout>
      </div>
    );
  }
}

AnnouncementPage.propTypes = {
  // announcements
  getAnnouncements: PropTypes.func.isRequired,
  postAnnouncement: PropTypes.func.isRequired,
  patchAnnouncement: PropTypes.func.isRequired,
  deleteAnnouncement: PropTypes.func.isRequired,
  getFilteredAnnouncements: PropTypes.func.isRequired,
  // banners
  getBannerImage: PropTypes.func.isRequired,
  patchBannerImage: PropTypes.func.isRequired,
  // generic
  announcements: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    announcements: state.announcements,
    ui: state.ui,
  };
};

export default connect(mapStateToProps, {
  // announcements,
  deleteAnnouncement,
  getAnnouncements,
  getBannerImage,
  getFilteredAnnouncements,
  patchAnnouncement,
  postAnnouncement,
  patchBannerImage,
  // loading
  setLoadingPage,
  stopLoadingPage,
  setLoadingAction,
  stopLoadingAction,
})(AnnouncementPage);
