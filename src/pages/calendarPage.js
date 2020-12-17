import React, { Component } from "react";

// redux
import { connect } from "react-redux";
import { getCalendarEvents } from "../redux/actions/calendarActions";

// css styles
//import "../css/layout.css";
import "../css/input.css";
import "../css/page.css";
import "../css/calendar.css";
import Day from "../components/calendars/Day";
// Ant design
import { Calendar, Badge, Button, Layout } from "antd";
//import { SearchOutlined } from "@ant-design/icons";
const { Content, Footer } = Layout;
class calendarPage extends Component {
  constructor() {
    super();
    var date = new Date()
    this.state = {
      selectedDate:{
        day: date.getDate(),
        month: date.getMonth(),
        year:date.getFullYear(),
      },
      currentDate:{
        day: date.getDate(),
        month: date.getMonth(),
        year:date.getFullYear(),
      },
      // errors
      errors: {}
    };
  }
  componentDidMount(){
    this.props.getCalendarEvents(Date.parse(new Date(this.state.selectedDate.year,this.state.selectedDate.month,1)) )
  }
  render() {
//console.log(this.state)
    const { isAdmin } = this.props.user;

var getListData = (value) => {
  return this.props.calendar.events.filter(x=>{
    x = new Date(x.start.dateTime)
    return x.getFullYear()===value.year() && x.getMonth()===value.month() && x.getDate() === value.date()
  })
}

var setDate = (e) =>{
  if(e.month() !== this.state.selectedDate.month || e.year() !== this.state.selectedDate.year){
    this.props.getCalendarEvents(Date.parse(new Date(e.year(),e.month(),0)) )
  }
  this.setState({
    selectedDate:{
      day: e.date(),
      month: e.month(),
      year:e.year(),
    },
  })
}
function debug(e){
  console.log(e)
}
var dateCellRender = (value) => {
  const eventList = getListData(value);
  return (
    <Day
      key={value.toString()}
      date={value}
      events={eventList}
      isToday={value.date()===this.state.currentDate.day &&
               value.month()===this.state.currentDate.month &&
               value.year()===this.state.currentDate.year
              }
      isSelected={value.date()===this.state.selectedDate.day &&
                  value.month()===this.state.selectedDate.month &&
                  value.year()===this.state.selectedDate.year
                 }
      isSelectedMonth={value.month()===this.state.selectedDate.month}
    />
  );
}
console.log(this.props)
    return (
      <div className="page-container">
        <header className="page-header-container">
          <div className="page-header-main-items">
            <h1>Calendar</h1>
            {isAdmin ? (
              <Button
                type="primary"
                className="edit-button"
                onClick={(e) => {
                  e.preventDefault();
                  window.open(
                    "https://calendar.google.com/calendar/u/0/r?cid=cedarsoreducation@gmail.com"
                  );
                }}
              >
                Edit Calendar
              </Button>
            ) : (
              ""
            )}
          </div>
        </header>
        <Layout className="vertical-fill-layout">
          <Content className="content-card">
            <div className="google-calendar">
              <Calendar dateFullCellRender={dateCellRender} onChange={setDate} onPanelChange={setDate} onSelect={setDate} />
            </div>
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

export default connect(mapStateToProps, {getCalendarEvents})(calendarPage);
