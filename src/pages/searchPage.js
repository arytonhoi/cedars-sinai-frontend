import React, { Component } from "react";

// redux
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { searchFolder } from "../redux/actions/folderActions";

// components
import SearchResult from "../components/folders/searchResult.js";

// styles
import "../css/page.css";
import "../components/folders/folder.css";

// antd
import { Empty, Input, Layout, List, Result, Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
const { Content, Footer } = Layout;
const { Search } = Input;

class SearchPage extends Component {
  constructor() {
    super();
    this.state = {
      searchTerm: "",
    };
  }

  componentDidMount = () => {
    let searchTerm = this.props.match.params.searchTerm;
    this.props.searchFolder(searchTerm);
    this.setState({ searchTerm: searchTerm });
  };

  componentDidUpdate(prevProps) {
    // render page based on current search term
    if (prevProps.match.params.searchTerm !== this.props.match.params.searchTerm) {
      this.props.searchFolder(this.props.match.params.searchTerm);
    }
  }

  searchFolder = (searchTerm) => {
    this.props.history.push(`/resources/search/${searchTerm.trim()}`);
    this.setState({ searchTerm: searchTerm });
  };

  handleChange = (event) => {
    this.setState({
      searchTerm: event.target.value,
    });
  };

  render() {
    const { folderSearchResults } = this.props.folders;
    const searchTerm = this.props.match.params.searchTerm;
    const { errors, loadingActions } = this.props.ui;

    return (
      <div className="page-container">
        <header className="page-header-container">
          <div className="page-header-main-items">
            <Search
              size="large"
              className="folder-search"
              placeholder="Search in Resources"
              value={this.state.searchTerm}
              onChange={this.handleChange}
              onSearch={(searchTerm) => this.searchFolder(searchTerm)}
            />
            <div>
              <Link className="search-return-to-folders" to={`/resources`}>
                <ArrowLeftOutlined />
                <span className="search-return-to-folders-link">Return to resources</span>
              </Link>
            </div>
          </div>
        </header>
        <Layout className="vertical-fill-layout">
          <Content className="content-card padded">
            <div className="content-card-header">
              <div className="header-row">
                <h1>
                  {loadingActions.SET_FOLDER_SEARCH_RESULTS
                    ? "Searching..."
                    : folderSearchResults.length > 0
                    ? `${folderSearchResults.length} results for "${searchTerm}"`
                    : `Nothing matched - "${searchTerm}"`}
                </h1>
              </div>
            </div>
            <div className="vertical-fill-content">
              {loadingActions.SET_FOLDER_SEARCH_RESULTS ? (
                <div className="vertical-content vertical-fill-content vertical-centered-content">
                  <Spin />
                </div>
              ) : errors.SET_FOLDER_SEARCH_RESULTS ? (
                <div className="vertical-content vertical-fill-content vertical-centered-content">
                  <Result
                    status="error"
                    title="Couldn't get search results"
                    subTitle={errors.SET_FOLDER_SEARCH_RESULTS}
                  />
                </div>
              ) : folderSearchResults.length > 0 ? (
                <List
                  className="search-results-list"
                  itemLayout="vertical"
                  size="large"
                  pagination={{
                    defaultPageSize: 10,
                    showSizeChanger: true,
                  }}
                  dataSource={folderSearchResults}
                  renderItem={(folder) => <SearchResult key={folder.id} folder={folder} />}
                />
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={<span>No matches</span>}
                  style={{ margin: "148px 0" }}
                />
              )}
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>DevelopForGood ©2020</Footer>
        </Layout>
      </div>
    );
  }
}
SearchPage.propTypes = {
  folders: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired,
  searchFolder: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  editable: state.editable,
  folders: state.folders,
  user: state.user,
  ui: state.ui,
});

export default connect(mapStateToProps, {
  searchFolder,
})(SearchPage);
