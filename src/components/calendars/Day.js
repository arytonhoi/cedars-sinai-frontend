import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux stuff
import { connect } from "react-redux";

// Ant design
import "./Day.css";
import { Badge } from "antd";
import { Empty, Spin } from "antd";
import { EditOutlined, PhoneOutlined, MailOutlined } from "@ant-design/icons";

class Day extends Component {
  render() {
    const { isAdmin } = this.props.user;
    const { loadingActions } = this.props.ui;
    const { date, events, isToday, isSelectedMonth, isSelected, eventToggleCallback } = this.props;

    // contacts
    const eventMarkup = <>
      {events.map((e,i) => <Badge key={i} onClick={()=>{eventToggleCallback(e.etag)}} status="success" text={e.summary} /> )}
    </>
    const b = 255 - events.length*2;
    const dateCellMarkup = <div style={{"background":`rgb(${b},${b},255)`}} className={`day-holder noselect ${isSelected && "day-selected"}`}>
          <div className="day-topbar">
            <span className={isToday?"day-today":null}>{date.date()}</span>
          </div>
          {!isSelectedMonth && <div className="day-greyed-out" />}
          <div className="day-events-aligner">
            <div className="day-events">
              {eventMarkup}
            </div>
          </div>
        </div>

    if (loadingActions.SET_CONTACTS) {
      return <Spin style={{ marginTop: "48px" }} />;
    } else {
      return dateCellMarkup
    }
  }
}

/*
      return events.length !== 0 ? (
        {dateCellMarkup}
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={<span>No events</span>}
        >
        </Empty>
      );
*/
Day.propTypes = {
  ui: PropTypes.object.isRequired,
  events: PropTypes.array.isRequired,
  isSelectedMonth: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool.isRequired,
  isToday: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    ui: state.ui,
  };
};

export default connect(mapStateToProps, {})(Day);
