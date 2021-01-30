import React from 'react';
import AppointmentItem from './Item';

const AppointmentsList = ({ appointments, setAppointments }) => {
  const expand = (_id) => {
    let updateExpanded = [...appointments];
    updateExpanded.forEach((appointment) => {
      if (appointment._id.toString() === _id.toString()) {
        appointment.expanded = !appointment.expanded;
      }
    });
    setAppointments(updateExpanded);
  };

  return (
    <div id='appointments-list'>
      {appointments.map((appointment, index) => {
        return (
          <AppointmentItem
            key={index}
            appointment={appointment}
            expand={expand}
          />
        );
      })}
    </div>
  );
};

export default AppointmentsList;
