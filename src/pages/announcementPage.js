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
} from "../redux/actions/dataActions";

// components
import AnnouncementPostEditorModal from "../components/announcement/announcementPostEditorModal.js";

// css styles
import "../css/page.css";
import "../css/input.css";
// import "../css/textContent.css";
import "../components/announcement/announcement.css";

// Ant design
import { Button, Dropdown, Input, Layout, List, Menu } from "antd";
import { DownOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons";
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
    };
  }

  componentDidMount() {
    this.props.getAnnouncements();
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
    const { filteredAnnouncements } = this.props.data;

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
        <Layout className="vertical-fill-layout">
          <Content className="content-card img-banner">
            <img
              alt="bg"
              src="https://firebasestorage.googleapis.com/v0/b/fir-db-d2d47.appspot.com/o/cedars_sinai_pic_1.png?alt=media&token=8370797b-7650-49b7-8b3a-9997fab0c32c"
            />
          </Content>
          <div
            style={{
              position: "relative",
              bottom: "-15px",
              display: "flex",
              justifyContent: "flex-end",
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
          <Content className="content-card">
            <div className="content-card-header padded">
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

            <List
              className="announcement-list"
              itemLayout="vertical"
              size="large"
              header={
                <header className="content-card-header">
                  <h1>Recent Announcements</h1>
                </header>
              }
              pagination={{
                onChange: (page) => {
                  console.log(page);
                },
                pageSize: 6,
              }}
              dataSource={filteredAnnouncements}
              renderItem={(announcement) => (
                <List.Item
                  key={announcement.id}
                  className="announcement-item collapsed"
                >
                  <header className="announcement-header">
                    <span className="announcement-title">
                      <h1>{announcement.title}</h1>
                      {isAdmin && (
                        <Button
                          icon={<EditOutlined />}
                          onClick={() =>
                            this.handleEditThisAnnouncement(announcement)
                          }
                          type="text"
                        />
                      )}
                    </span>
                    <h3>{announcement.author}</h3>
                    <h3>{announcement.createdAt.toString("MM/dd/yy")}</h3>
                  </header>
                  <div className="announcement-content-holder">
                    <input
                      type="checkbox"
                      className="announcement-toggle"
                      id={"cb" + announcement.id}
                    />
                    <div
                      className="announcement-ckeditor-content"
                      dangerouslySetInnerHTML={{ __html: announcement.content }}
                    />
                    <label
                      htmlFor={"cb" + announcement.id}
                      className="announcement-show-more noselect clickable"
                    >
                      Show More
                    </label>
                  </div>
                </List.Item>
              )}
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
})(AnnouncementPage);
