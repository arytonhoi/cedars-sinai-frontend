import React, { Component } from "react";
import "./SearchResult.css";
import PropTypes from "prop-types";

import { FolderFilled } from "@ant-design/icons"

// Redux stuff
import { connect } from "react-redux";
//import { deleteAnnounce, clearErrors } from "../../redux/actions/dataActions";

class SearchResult extends Component {
// eslint-disable-next-line
  stripHTMLRegex = new RegExp(`<\\/? *[a-zA-Z0-9]+( *[a-zA-Z0-9]+ *= *['"].+?['"])* *\\/? *>`,"gi")
// eslint-disable-next-line
  findMatchStringRegex = new RegExp( `((\\w+\\W+){0,4}).*?${this.props.searchKey}.+?((\\w+\\W+){0,4})`, "gi")
  boldMatchStringRegex = new RegExp(`${this.props.searchKey}`, "gi")
  showSearchResult = (string) => {
    string = string.replace(this.stripHTMLRegex, "")
    var matches = string.match(this.findMatchStringRegex)
    if(matches===null){
      matches = string.split(" ").slice(0,20).join(" ")
      if(string !== matches){matches += "..."}
      return(<span className="em3 search-result-content">{matches}</span>)
    }else{
      return (<span className="em3 search-result-content">
        {matches.map(x=>{
          return (<span dangerouslySetInnerHTML={{__html:" ..."+x.replace(this.boldMatchStringRegex,`<b>${this.props.searchKey}</b>`) + "... "}} />)
        })}
      </span>)
    }
  }
  render() {
    const { data } = this.props
    return(
      <a className="search-result noselect" href={"/resources/"+data.id}>
          <div className="folder-logo-icon">
            <FolderFilled />
          </div>
          <div className="search-main-box">
            <span className="em2 search-result-title">{data.title}</span>
            <span className="search-result-breadcrumb">
              <span>
                <a className="em4-light" href="/resources">Resources</a>
              </span>
              { (typeof(data) === "object" && typeof(data.path) === "object")?
                (data.path.map((x, i) =>
                    ((x.id !== "" && x.id !== "home") ?
                    (<span className="em4-light" key={x.id}>{" / "}<a className="em4-light" href={x.id}>{x.name}</a></span>):
                    (""))
                  )
                ): ("") }
            </span>
            {this.showSearchResult(data.content)}
          </div>
      </a>
    );
  }
}

SearchResult.propTypes = {
  data: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { })(
  SearchResult
);
