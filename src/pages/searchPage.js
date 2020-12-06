import React, { Component } from "react";

// redux
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  getFolder,
  searchFolder,
  deleteFolder,
  patchFolder,
  syncAllSubFolders,
} from "../redux/actions/dataActions";

// components
import SearchResult from "../components/folders/SearchResult.js";

// images
// import CIcon from "../images/icon.png";

// styles
import "../css/page.css";

// antd
import { SearchOutlined } from "@ant-design/icons";
import { Button, Empty, Input, Layout } from "antd";
const { Content, Footer } = Layout;

class SearchPage extends Component {
  constructor() {
    super();
    this.state = {
      searchTerm: "",
    };
  }

  componentDidMount = () => {
    this.props.searchFolder(this.props.match.params.searchTerm);
  };

  handleChange = (event) => {
    console.log(event.target.value);
    this.setState({
      searchTerm: event.target.value,
    });
  };

  searchFolder = () => {
    const searchTerm = this.state.searchTerm.trim();
    // this.props.searchFolder(searchTerm);
    window.location.href = `${process.env.PUBLIC_URL}/resources/search/${searchTerm}`;
  };

  render() {
    // const { credentials } = this.props.user;
    // const isAdmin = credentials.isAdmin;
    const { folderSearchResults } = this.props.data;
    const searchTerm = this.props.match.params.searchTerm;

    return (
      <div className="page-container">
        <header className="page-header-container">
          <div className="page-header-main-items">
            <h1>Search Resources</h1>
            <span className="page-header-interactive-items">
              <Input
                className="resources-search no-padding"
                onChange={this.handleChange}
                suffix={<SearchOutlined />}
                placeholder="Search resources by name"
              />
              <Button
                type="primary"
                disabled={
                  this.state.isEditingFolders || this.state.isEditingPost
                }
                onClick={this.searchFolder}
              >
                Search
              </Button>
            </span>
          </div>
        </header>
        <Layout className="vertical-fill-layout">
          <Content className="content-card">
            <div className="content-card-header">
              <div className="header-row">
                {folderSearchResults.length > 0
                  ? `Search results for ${searchTerm}`
                  : `Nothing matched ${searchTerm}`}
              </div>
            </div>
            <div>
              {folderSearchResults.length > 0 ? (
                folderSearchResults.map((x, i) => (
                  <SearchResult key={i} data={x} />
                ))
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
  getFolder: PropTypes.func.isRequired,
  searchFolder: PropTypes.func.isRequired,
  deleteFolder: PropTypes.func.isRequired,
  patchFolder: PropTypes.func.isRequired,
  syncAllSubFolders: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  editable: state.editable,
  data: state.data,
  user: state.user,
  UI: state.UI,
});

export default connect(mapStateToProps, {
  getFolder,
  searchFolder,
  patchFolder,
  deleteFolder,
  syncAllSubFolders,
})(SearchPage);
