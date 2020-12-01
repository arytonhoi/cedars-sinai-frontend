import React, { Component } from "react";
import PropTypes from "prop-types";

// redux
import { connect } from "react-redux";
import {
  deleteAnnouncement,
  getAnnouncements,
  patchAnnouncement,
  postAnnouncement,
  getFilteredAnnouncements,
  getBannerImage,
  patchBannerImage,
} from "../redux/actions/dataActions";

// components
import AnnouncementPostEditorModal from "../components/announcement/announcementPostEditorModal.js";
import AnnouncementList from "../components/announcement/announcementList.js";
// import BannerImgEditorModal from "../components/announcement/bannerImgEditorModal.js";

// css styles
import "../css/page.css";
import "../css/ckeditor.css";
import "../components/announcement/announcement.css";

// Ant design
import { Button, Dropdown, Input, Layout, Menu } from "antd";
import { DownOutlined, SearchOutlined } from "@ant-design/icons";
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
    };
  }

  componentDidMount() {
    this.props.getAnnouncements();
    this.props.getBannerImage("announcements");
  }

  // input change handlers
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
    console.log(this.state);
  };

  getHeight(element) {
    console.log(element.clientHeight);
    console.log(element.offsetHeight);

    if (element && this && !this.state.elementHeight) {
      // need to check that we haven't already set the height or we'll create an infinite loop
      this.setState({ elementHeight: element.clientHeight });
      console.log(element.clientHeight);
    }
  }

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
      this.props.postAnnouncement(newAnnouncement);
    } else {
      // editing exisitng announcement
      this.props.patchAnnouncement(this.state.announcementId, newAnnouncement);
    }

    this.handleCancelEditAnnouncement();
  };

  handleDeleteThisAnnouncement = () => {
    this.props.deleteAnnouncement(this.state.announcementId);
    this.handleCancelEditAnnouncement();
  };

  render() {
    const { credentials } = this.props.user;
    const isAdmin = credentials.isAdmin;
    const { bannerImgs, filteredAnnouncements } = this.props.data;

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
        {/* {isAdmin && (
          <BannerImgEditorModal
            visible={this.state.isEditingBannerImg}
            bannerImgUrl={bannerImgs.announcements}
            handleCancelPatchBannerImg={}
            handlePatchBannerImg={}
          />
        )} */}
        <Layout className="vertical-fill-layout">
          <Content className="content-card img-banner">
            <img alt="bg" src={bannerImgs.announcements} />
            <div className="img-banner-mask"></div>
            <h1>Welcome Admin</h1>
            <Button>Change picture</Button>
          </Content>
          {isAdmin && (
            <div
              style={{
                position: "relative",
                bottom: "-4px",
                marginTop: "16px",
              }}
            >
              <Button
                type="primary"
                size={"medium"}
                onClick={() => this.toggleEditing()}
              >
                Post New Announcement
              </Button>
            </div>
          )}
          <Content className="content-card">
            <div className="content-card-header">
              <div className="header-row">
                <Input
                  style={{ width: 400 }}
                  // size="small"
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
              </div>
              <div className="header-row">
                <h1>Recent Announcements</h1>
              </div>
            </div>
            <AnnouncementList
              announcements={filteredAnnouncements}
              filter={this.state.filter}
              handleEditThisAnnouncement={this.handleEditThisAnnouncement}
            />
          </Content>
          <Footer style={{ textAlign: "center" }}>DevelopForGood ©2020</Footer>
        </Layout>
      </div>
    );
  }
}

AnnouncementPage.propTypes = {
  getAnnouncements: PropTypes.func.isRequired,
  postAnnouncement: PropTypes.func.isRequired,
  patchAnnouncement: PropTypes.func.isRequired,
  deleteAnnouncement: PropTypes.func.isRequired,
  getFilteredAnnouncements: PropTypes.func.isRequired,
  getBannerImage: PropTypes.func.isRequired,
  patchBannerImage: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    data: state.data,
  };
};

export default connect(mapStateToProps, {
  getAnnouncements,
  postAnnouncement,
  patchAnnouncement,
  deleteAnnouncement,
  getFilteredAnnouncements,
  getBannerImage,
  patchBannerImage,
})(AnnouncementPage);
