import React, { Component } from "react";
import PropTypes from "prop-types";

// redux
import { connect } from "react-redux";

// css styles
import "../../css/page.css";
import "./announcement.css";

// Ant design
import { Button, Empty, List } from "antd";
import { EditOutlined } from "@ant-design/icons";

class AnnouncementList extends Component {
  render() {
    const { isAdmin } = this.props.user;
    const announcements = this.props.announcements;
    const filter = this.props.filter;
    const maxAnnouncementPreviewHeight = 300;

    if (announcements.length === 0 && filter.searchTerm !== "") {
      return (
        <Empty
          style={{ margin: "auto" }}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <span>
              No announcements matched <br /> "{filter.searchTerm}"{" "}
            </span>
          }
        ></Empty>
      );
    } else if (announcements.length === 0) {
      return (
        <Empty
          style={{ margin: "auto" }}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <span>
              {isAdmin
                ? `Post announcements using the bottom right "+" button`
                : "No announcements yet"}
            </span>
          }
        ></Empty>
      );
    } else {
      return (
        <List
          className="content-card-list announcement-list"
          itemLayout="vertical"
          size="large"
          pagination={{
            onChange: (page) => {
              console.log(page);
            },
            defaultPageSize: 10,
            showSizeChanger: true,
          }}
          dataSource={announcements}
          renderItem={(announcement) => (
            <List.Item key={announcement.id} className="announcement-item">
              <header className="announcement-header">
                <span className="announcement-title">
                  <h1>{announcement.title}</h1>
                  {isAdmin && (
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => this.props.handleEditThisAnnouncement(announcement)}
                      type="text"
                    />
                  )}
                </span>
                <h3>{announcement.author}</h3>
                <h3>{announcement.createdAt.toString("MM/dd/yy")}</h3>
              </header>
              <div className="announcement-content-container">
                <input
                  type="checkbox"
                  className="announcement-expand-toggle-checkbox"
                  id={announcement.id + "-expand-checkbox"}
                />
                <div
                  ref={(element) => {
                    if (element && element.clientHeight > maxAnnouncementPreviewHeight) {
                      element.className = element.className + " overflowed";
                    }
                  }}
                  className="announcement-content ckeditor-content"
                  dangerouslySetInnerHTML={{ __html: announcement.content }}
                />
                <span className="announcement-expand-toggle">
                  <label htmlFor={announcement.id + "-expand-checkbox"} className="ant-btn">
                    Show more
                  </label>
                </span>
                <span className="announcement-collapse-toggle">
                  <label htmlFor={announcement.id + "-expand-checkbox"} className="ant-btn">
                    Show less
                  </label>
                </span>
              </div>
            </List.Item>
          )}
        />
      );
    }
  }
}

AnnouncementList.propTypes = {
  announcements: PropTypes.array.isRequired,
  filter: PropTypes.object.isRequired,
  handleEditThisAnnouncement: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, {})(AnnouncementList);
