import React, { Component } from "react";
import "./SearchResult.css";
import PropTypes from "prop-types";

import { FolderFilled } from "@ant-design/icons";

// Redux stuff
import { connect } from "react-redux";
//import { deleteAnnounce, clearErrors } from "../../redux/actions/dataActions";

class SearchResult extends Component {
  render() {
    const { data } = this.props;
    return (
      <a
        className="search-result noselect padding-normal"
        href={"/resources/" + data.id}
      >
        <div key="1" className="folder-logo-icon">
          <FolderFilled />
        </div>
        <div key="2" className="search-main-box">
          <span key="21" className="em2 search-result-title">
            {data.title}
          </span>
          <span key="22" className="search-result-breadcrumb">
            <span key={Math.random()}>
              <span className="em4-light">
                Resources
              </span>
            </span>
            {typeof data === "object" && typeof data.path === "object"
              ? data.path.map((x, i) => {
                  if (x.name.length >= 30) {
                    x.name = x.name.slice(0, 30) + "...";
                  }
                  return x.id !== "" && x.id !== "home" ? (
                    <span className="em4-light" key={x.id}>
                      {" / "}
                      {x.name}
                    </span>
                  ) : (
                    ""
                  );
                })
              : ""}
          </span>
          <span
            key="23"
            dangerouslySetInnerHTML={{ __html: data.content }}
          />
        </div>
      </a>
    );
  }
}

SearchResult.propTypes = {
  data: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {})(SearchResult);
