import React, { Component } from 'react';
import './Announcement.css';
import PropTypes from 'prop-types';

class Announcement extends Component{
  render(){
    const { index, what } = this.props
console.log(this.props)
    return (
      <label className="ann" for={index}>
        <a>
          <div className="ann-head noselect">
            <div className="ann-head-left">
              <span className="ann-person">{what.author}</span>
              <span className="ann-date">{what.createdAt.toString("MMM dd")}</span>
            </div>
            <span className="ann-title">{what.title}</span>
            <span className="ann-menu">
              <svg className="ann-menu-icon" viewBox="0 0 100 80" width="40" height="40">
                <rect width="100" height="20"></rect>
                <rect y="30" width="100" height="20"></rect>
                <rect y="60" width="100" height="20"></rect>
              </svg>
            </span>
          </div>
          <input type="checkbox" className="post-toggle" id={index} />
          <div className="ann-body">
            <span className="ann-text">{what.content}</span>
          </div>
        </a>
      </label>
    )
  }

}

Announcement.propTypes = {
  what: PropTypes.object.isRequired,
};

export default Announcement
