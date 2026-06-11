import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { SkeletonLoader } from "../../components/loader/SkeletonLoader";

const mLocalizer = momentLocalizer(moment);
const StaffCalender = (props) => {
  const generateEvents = () => {
    if (props.appointmentData.length > 0) {
      let collections = [];
      const inputFormat = "YYYY-MM-DDTHH:mm:ss.SSSZ";

      for (let data of props.appointmentData) {
        const [year, month, day] = data.appointmentTime
          .split("T")[0]
          .split("-");
          const [hour, minute] = data.appointmentTime
          .split("T")[1]
          .split(":");

        const dateObject = new Date(data.appointmentTime);
        dateObject.setFullYear(year);
        dateObject.setMonth(month - 1);
        dateObject.setDate(day);
        dateObject.setHours(hour);
        dateObject.setMinutes(minute);
        dateObject.setSeconds(0);
        const utcTime = moment.utc(data.appointmentTime, inputFormat);
        const formattedTime = moment(utcTime).format("hh:mm A");
        const title = `${formattedTime} - ${data.sale.employee.firstName} ${data.sale.employee.lastName}`;

        collections.push({
          title: title,
          start: dateObject,
          end: dateObject,
          saleId: data.sale.id,
          appointmentId: data.id,
          appTime: data.appointmentTime,
          suspend: data.sale.suspended,
        });
      }
      return collections;
    }
  };

  const handleEventClick = (event) => {
    props.handleBookAppointment(true, event);
  };

  const eventStyleGetter = (event, start, end, isSelected) => {
    let backgroundColor;
    let color = "white";

    const today = moment(new Date());
    const eventStartDate = moment(start);

    if (event.suspend === 0) {
      backgroundColor = "#ff8881"; // Completed
    } else if (event.suspend === 3 && eventStartDate.isBefore(today)) {
      backgroundColor = "#000000"; // No show
    } else if (event.suspend === 3 && eventStartDate.isSameOrAfter(today)) {
      backgroundColor = "#61ba99"; // Scheduled
    } else if (event.suspend === 1) {
      backgroundColor = "#ecb97b"; // In Progress
    } else {
      backgroundColor = "#61ba99";
    }

    return {
      style: {
        backgroundColor,
        color,
      },
    };
  };

  return (
    <>
      {props.loading ? (
        <SkeletonLoader />
      ) : (
        <div className="px-2 py-2">
          {props.appointmentData.length > 0 ? 
            (
              <Calendar
                defaultView="agenda"
                localizer={mLocalizer}
                events={generateEvents()}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                popup={true}
                onSelectEvent={handleEventClick}
                eventPropGetter={eventStyleGetter}
              />
            ) : (
              <Calendar
                localizer={mLocalizer}
                style={{ height: 500 }}
              />
            )
          }
        </div>
      )}
    </>
  );
};

export default StaffCalender;
