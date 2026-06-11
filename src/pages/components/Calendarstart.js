import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CalendarStart = () => {
  const [startDate, setStartDate] = useState();
  return (
    <DatePicker
      dateFormat={"dd-MMM-yyyy"}
      placeholderText="Start Date"
      className="calendar-start"
      selected={startDate}
      onChange={(date) => setStartDate(date)}
    />
  );
};

export default CalendarStart;
