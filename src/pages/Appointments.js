import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import * as tools from '../tools/tools.js';
import { App, SetApp } from '../Providers/ContextProvider.js';
import { Appointments } from '../Providers/AccountProvider.js';
import AppointmentsList from './Appointments/AppointmentsList.js';
import LoginModal from './Modal/LoginModal.js';

const Error = ({ error }) => <h1>{error}</h1>;
const Loading = () => <h1>Loading...</h1>;

const AppointmentsPage = () => {
  const history = useHistory();
  const { loading, error, loggedIn, title } = useContext(App);

  const setApp = useContext(SetApp);
  if (title !== 'Appointments')
    setApp((prevState) => ({ ...prevState, title: 'Appointments' }));

  const appointments = useContext(Appointments);

  const [showPast, setShowPast] = useState(false);
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);

  useEffect(() => {
    if (!loggedIn) return;
    let updated = [...appointments];
    updated.forEach((appointment) => (appointment.expanded = false));
    const sorted = tools.sortAppointments(updated);
    setUpcoming(sorted[0]);
    setPast(sorted[1]);
  }, [loggedIn, appointments]);

  return (
    <>
      {loading && <Loading />}
      {error && <Error error={error} />}
      {!loggedIn ? (
        <LoginModal closeModal={history.goBack} />
      ) : (
        <div>
          <div className='appointments-tabs'>
            <div
              className={
                showPast ? 'appointments-tab' : 'appointments-tab-selected'
              }
              onClick={() => setShowPast(false)}
            >
              Upcoming
            </div>
            <div
              className={
                showPast ? 'appointments-tab-selected' : 'appointments-tab'
              }
              onClick={() => setShowPast(true)}
            >
              Past
            </div>
          </div>
          {showPast ? (
            past.length === 0 ? (
              <h1>No past appointments.</h1>
            ) : (
              <AppointmentsList appointments={past} setAppointments={setPast} />
            )
          ) : upcoming.length === 0 ? (
            <h1>No upcoming appointments.</h1>
          ) : (
            <AppointmentsList
              appointments={upcoming}
              setAppointments={setUpcoming}
            />
          )}
        </div>
      )}
    </>
  );
};

export default AppointmentsPage;
