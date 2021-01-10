import React, { Component } from "react";

// redux
import { connect } from "react-redux";
import { getCalendarEvents } from "../redux/actions/calendarActions";

// components
import FloatAddButton from "../components/layout/floatAddButton";

// css styles
import "../css/input.css";
import "../css/page.css";
import "../css/calendar.css";
import Day from "../components/calendars/Day";

// Ant design
import { Modal, Calendar, Layout } from "antd";
import { CalendarOutlined, EnvironmentOutlined, AlignLeftOutlined } from "@ant-design/icons";
const { Content, Footer } = Layout;

class calendarPage extends Component {
  constructor() {
    super();
    var date = new Date();
    this.state = {
      showEventDetails: false,
      editCalendar: false,
      showEditModal: false,
      selectedEvent: undefined,
      selectedDate: {
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
      },
      currentDate: {
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
      },
      // errors
      errors: {},
    };
  }

  componentDidMount() {
    this.props.getCalendarEvents(
      Date.parse(new Date(this.state.selectedDate.year, this.state.selectedDate.month, 1))
    );
  }

  handleEditThisCalendar() {
    window.open("https://calendar.google.com/calendar/u/0/r?cid=cedarsoreducation@gmail.com");
  }

  render() {
    //console.log(this.state)
    const { isAdmin } = this.props.user;

    let getListData = (value) => {
      return this.props.calendar.events.filter((x) => {
        return (
          x.startTime.date.getFullYear() === value.year() &&
          x.startTime.date.getMonth() === value.month() &&
          x.startTime.date.getDate() === value.date()
        );
      });
    };

    let selectEvent = (etag) => {
      this.setState({
        showEventDetails: !this.state.showEventDetails,
        selectedEvent: this.props.calendar.events.find((x) => x.etag === etag),
      });
    };

    let setDate = (e) => {
      if (
        e.month() !== this.state.selectedDate.month ||
        e.year() !== this.state.selectedDate.year
      ) {
        this.props.getCalendarEvents(Date.parse(new Date(e.year(), e.month(), 0)));
      }
      this.setState({
        selectedDate: {
          day: e.date(),
          month: e.month(),
          year: e.year(),
        },
      });
    };

    let dateCellRender = (value) => {
      const eventList = getListData(value);
      return (
        <Day
          key={value.toString()}
          date={value}
          events={eventList}
          eventToggleCallback={selectEvent}
          isToday={
            value.date() === this.state.currentDate.day &&
            value.month() === this.state.currentDate.month &&
            value.year() === this.state.currentDate.year
          }
          isSelected={
            value.date() === this.state.selectedDate.day &&
            value.month() === this.state.selectedDate.month &&
            value.year() === this.state.selectedDate.year
          }
          isSelectedMonth={value.month() === this.state.selectedDate.month}
        />
      );
    };

    const floatAddButtonOptions = {
      Calendar: this.handleEditThisCalendar,
    };

    return (
      <div className="page-container">
        {isAdmin && <FloatAddButton options={floatAddButtonOptions} isEditOptions={true} />}
        {typeof this.state.selectedEvent !== "undefined" && (
          <Modal
            visible={this.state.showEventDetails}
            title={
              typeof this.state.selectedEvent.summary === "undefined"
                ? "Calendar Event"
                : this.state.selectedEvent.summary
            }
            onCancel={() => this.setState({ showEventDetails: false })}
            footer={null}
          >
            <div className="event-modal-show-holder">
              <div className="event-modal-row" key="1">
                <CalendarOutlined />
                <span>
                  {this.state.selectedEvent.startTime.toString("d MMM YYYY H:mm t")} to{" "}
                  {this.state.selectedEvent.endTime.toString("d MMM YYYY H:mm t")}
                </span>
              </div>
              <div className="event-modal-row" key="2">
                <EnvironmentOutlined />
                <span>
                  {typeof this.state.selectedEvent.location === "undefined" ? (
                    <i>Location not provided</i>
                  ) : (
                    this.state.selectedEvent.location
                  )}
                </span>
              </div>
              <div className="event-modal-row" key="3">
                <AlignLeftOutlined />
                <span>
                  {typeof this.state.selectedEvent.description === "undefined" ? (
                    <i>Description not provided</i>
                  ) : (
                    this.state.selectedEvent.description
                  )}
                </span>
              </div>
            </div>
          </Modal>
        )}
        <Layout className="vertical-fill-layout">
          <Content className="content-card calendar-container">
            <Calendar
              className="calendar"
              dateFullCellRender={dateCellRender}
              onChange={setDate}
              onPanelChange={setDate}
              onSelect={setDate}
            />
          </Content>
          <Footer style={{ textAlign: "center" }}>DevelopForGood ©2020</Footer>
        </Layout>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    data: state.data,
    user: state.user,
    calendar: state.calendar,
  };
};

export default connect(mapStateToProps, { getCalendarEvents })(calendarPage);
