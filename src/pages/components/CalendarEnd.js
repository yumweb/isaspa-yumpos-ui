import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CalendarEnd = () => {
  const [endDate, setEndDate] = useState();
  return (
    <DatePicker
      dateFormat={"dd-MMM-yyyy"}
      placeholderText="End Date"
      className="calendar-end"
      selected={endDate}
      onChange={(date) => setEndDate(date)}
    />
  );
};

export default CalendarEnd;
