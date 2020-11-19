import React, { Component } from "react";
import PropTypes from "prop-types";

// redux
import { connect } from "react-redux";
import {
  deleteAnnouncement,
  getAnnouncements,
  patchAnnouncement,
  postAnnouncement,
} from "../redux/actions/dataActions";

// utils
import DateHelper from "../util/dateHelper.js";

// components
// import Announcement from "../components/announcement/Announcement.js";
import AnnouncementPostEditor from "../components/announcement/announcementPostEditor.js";

// css styles
import "../css/annPage.css";
import "../css/layout.css";
import "../css/input.css";
import "../css/textContent.css";
import "../components/announcement/Announcement.css";

// Ant design
import { Button, Dropdown, Input, Layout, List, Menu } from "antd";
import { DownOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons";
const { Content, Footer } = Layout;

class AnnouncementPage extends Component {
  constructor() {
    super();
    this.state = {
      // announcement
      announcementId: "",
      announcementTitle: "",
      announcementAuthor: "",
      announcementContent: "",
      // search and filter
      searchKey: "",
      maxAge: 7776000000,
      showCreateAnn: false,
    };
  }

  componentDidMount() {
    this.props.getAnnouncements();
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleEditThisAnnouncement = (announcement) => {
    this.setState({
      announcementId: announcement.id,
      announcementTitle: announcement.title,
      announcementAuthor: announcement.author,
      announcementContent: announcement.content,
    });
  };

  handleCancelEditAnnouncement = () => {
    this.setState({
      announcementId: "",
      announcementTitle: "",
      announcementAuthor: "",
      announcementContent: "",
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

  // filters
  filterByAge = (e) => {
    this.setState({ ...this.state, maxAge: e.key });
  };

  filterByText = (e) => {
    this.setState({ ...this.state, searchKey: e.target.value });
  };

  render() {
    const menu = (
      <Menu onClick={this.filterByAge}>
        <Menu.Item key="259200000">Recently Added</Menu.Item>
        <Menu.Item key="2678400000">Last Month</Menu.Item>
        <Menu.Item key="604800000">Last Week</Menu.Item>
        <Menu.Item key="86400000">Last 24 Hours</Menu.Item>
      </Menu>
    );
    var { maxAge, searchKey } = this.state;
    const { credentials } = this.props.user;
    const isAdmin = credentials.isAdmin;
    const { announcements } = this.props.data;
    // let announcementsMarkup = announcements.map((a) => (
    //   // <li key={a.announcementId}>
    //   //   <h1>{a.title}</h1>
    //   //   <h3>{a.author}</h3>
    //   //   <p>{a.content}</p>
    //   // </li>
    // ));
    //console.log(announcements)
    // const now = new Date().getTime();
    announcements.sort((a, b) => {
      a.createdAt = new DateHelper(a.createdAt);
      a.createdTs = a.createdAt.getTimestamp();
      b.createdAt = new DateHelper(b.createdAt);
      b.createdTs = b.createdAt.getTimestamp();
      return a.createdTs < b.createdTs;
    });

    return (
      <div className="container">
        <header className="page-header">
          <div className="page-header-title">
            <h1>Announcements</h1>
          </div>
          {/* <div className="header-search-items">
            <Input
              style={{ width: 300 }}
              className="search-input"
              id="searchTerm"
              name="searchTerm"
              type="text"
              placeholder="Search contacts by name"
              value={this.state.searchTerm}
              onChange={this.handleChange}
              suffix={
                <SearchOutlined
                  className="search-input-icon"
                  style={{ color: "rgba(0,0,0,.45)" }}
                />
              }
            />
            {isAdmin && !this.state.isEditing && (
              <Button
                type="primary"
                size={"medium"}
                onClick={() => this.toggleEditing()}
              >
                Edit
              </Button>
            )}
            {isAdmin && this.state.isEditing && (
              <Button
                type="primary"
                size={"medium"}
                onClick={() => this.toggleEditing()}
              >
                Done Editing
              </Button>
            )}
          </div> */}
        </header>
        <Layout className="vertical-fill-layout">
          <div className="content-search-items">
            <Input
              style={{ width: 400 }}
              size="small"
              className="search-input"
              id="searchTerm"
              name="searchTerm"
              type="text"
              placeholder="Search by keyword"
              value={this.state.searchTerm}
              onChange={this.handleChange}
              suffix={
                <SearchOutlined
                  className="search-input-icon"
                  style={{ color: "rgba(0,0,0,.45)" }}
                />
              }
            />
            <Dropdown overlay={menu} className="right-aligned">
              {/* <div>
        {(isAdmin) ?
         (<div>
           <h3>Welcome Back, Admin</h3>
           {this.state.showCreateAnn ? "" : <Button type="primary" onClick={this.togglePostAnn}>Create Announcement</Button>}
         </div>) :
         ("")
        }
        {(isAdmin&&this.state.showCreateAnn) ? <PostAnn onCancel={this.togglePostAnn} /> : ""}
        <div className="floating-component shadow">
          <div className="ann-navbar">
            <div className="ann-navbar-search">
              <input type="text" onChange={this.filterByText} placeholder="Search by keyword" />
              <SearchOutlined className="ann-navbar-search-icon valign"/>
            </div>
            <Dropdown overlay={menu}> */}
              <Button>
                Filter by date <DownOutlined />
              </Button>
            </Dropdown>
          </div>
          <Content className="padded-content-container">
            {/* <div className="ann-navbar">
              <div className="ann-navbar-search">
                <input
                  type="text"
                  onChange={this.filterByText}
                  placeholder="Search by keyword"
                />
                <SearchOutlined className="ann-navbar-search-icon valign" />
              </div>
              <Dropdown overlay={menu}>
                <Button>
                  Filter by date <DownOutlined />
                </Button>
              </Dropdown>
            </div> */}
            {isAdmin && (
              <AnnouncementPostEditor
                isEditingExistingAnnouncement={this.state.announcementId !== ""}
                announcementTitle={this.state.announcementTitle}
                announcementAuthor={this.state.announcementAuthor}
                announcementContent={this.state.announcementContent}
                handlePostOrPatchAnnouncement={
                  this.handlePostOrPatchAnnouncement
                }
                handleCancelEditAnnouncement={this.handleCancelEditAnnouncement}
                handleDeleteThisAnnouncement={this.handleDeleteThisAnnouncement}
              />
            )}
            <List
              itemLayout="vertical"
              size="large"
              header={
                <h2
                  className="padded-content-container section-header"
                  style={{ marginBottom: "0", paddingBottom: "0" }}
                >
                  Recent Announcements
                </h2>
              }
              // pagination={{
              //   onChange: (page) => {
              //     console.log(page);
              //   },
              //   pageSize: 3,
              // }}
              dataSource={announcements}
              renderItem={(announcement) => (
                <List.Item
                  key={announcement.id}
                  className="announcement-container"
                >
                  <div className="announcement-header">
                    {isAdmin && (
                      <Button
                        className="right-aligned-btn"
                        icon={<EditOutlined />}
                        onClick={() =>
                          this.handleEditThisAnnouncement(announcement)
                        }
                        type="text"
                      />
                    )}
                    <h1>{announcement.title}</h1>
                    <span>
                      <h3>{announcement.author}</h3>
                      <h3>{announcement.createdAt.toString("MM/dd/yy")}</h3>
                    </span>
                  </div>
                  <div
                    className="ckeditor-content"
                    dangerouslySetInnerHTML={{ __html: announcement.content }}
                  />
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
})(AnnouncementPage);
