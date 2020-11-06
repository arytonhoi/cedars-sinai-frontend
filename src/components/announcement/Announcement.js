import React, { Component } from "react";
import "./Announcement.css";
import PropTypes from "prop-types";

// Redux stuff
import { connect } from "react-redux";
import { deleteAnnounce, clearErrors } from "../../redux/actions/dataActions";

class Announcement extends Component {
  render() {
    const now = new Date().getTime();
    const { index, what, admin } = this.props;
    return (
      <label
        className={what.isPinned ? "ann-parent ann-pinned" : "ann-parent"}
        htmlFor={index}
      >
        <div className={now - what.createdTs > 7776000000 ? "ann ann-old" : "ann"}>
          <div className="ann-head noselect">
            <div className="ann-head-top">
              <span className="ann-person">{what.author}</span>
              <span className="ann-date">
                {what.createdAt.toString("dd/MM/yy")}
              </span>
              {admin ? (
                <span>
                  <label className="ann-menu-toggle" htmlFor={"conf_" + index}>•••</label>
                  <input
                    type="checkbox"
                    className="delete-confirm-toggle hide"
                    id={"conf_" + index}
                  />
                  <label
                    htmlFor={"conf_" + index}
                    className="delete-confirm shadow hide"
                  >
                    <p
                      className="delete-action"
                      onClick={() => this.props.deleteAnnounce(index)}
                    >
                      Confirm deletion
                    </p>
                    <p>Cancel</p>
                  </label>
                </span>
              ) : ("")}
            </div>
            <span className="ann-title">{what.title}</span>
          </div>
          <input type="checkbox" className="post-toggle hide" id={index} />
          <div className="ann-body hide">
            <div
              className="ann-text"
              dangerouslySetInnerHTML={{ __html: what.content }}
            ></div>
          </div>
        </div>
      </label>
    );
  }
}

Announcement.propTypes = {
  what: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { deleteAnnounce, clearErrors })(
  Announcement
);
