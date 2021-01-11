import React, { Component } from "react";

// redux
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { searchFolder } from "../redux/actions/folderActions";

// components
import SearchResult from "../components/folders/SearchResult.js";

// styles
import "../css/page.css";

// antd
import { Empty, Input, Layout, Spin } from "antd";
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
    const { loadingActions } = this.props.ui;

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
          </div>
        </header>
        <Layout className="vertical-fill-layout">
          <Content className="content-card">
            <div className="content-card-header">
              <div className="header-row">
                {loadingActions.SET_FOLDER_SEARCH_RESULTS
                  ? "Searching..."
                  : folderSearchResults.length > 0
                  ? `Search results for "${searchTerm}"`
                  : `Nothing matched "${searchTerm}"`}
              </div>
            </div>
            <div>
              {loadingActions.SET_FOLDER_SEARCH_RESULTS && (
                <div className="padded vertical-content">
                  <Spin style={{ marginTop: "48px" }} />
                </div>
              )}
              {!loadingActions.SET_FOLDER_SEARCH_RESULTS &&
                (folderSearchResults.length > 0 ? (
                  folderSearchResults.map((x, i) => <SearchResult key={i} data={x} />)
                ) : (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={<span>No matches</span>}
                    style={{ margin: "148px 0" }}
                  />
                ))}
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
