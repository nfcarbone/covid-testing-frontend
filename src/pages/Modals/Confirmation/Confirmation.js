import React, { useRef, useState, useContext, useEffect } from 'react';
import ReactDOM from 'react-dom';
import useBookAppointment from '../../../tools/useBookAppointment';
import LoginModal from '../Login/Login.js';
import ConfirmUserInfoModal from '../ConfirmUserInfo/ConfirmUserInfo.js';
import { App } from '../../../Providers/Context';

const ConfirmationModal = ({ closeModal }) => {
  const bookAppointment = useBookAppointment();
  const { user, appointment } = useContext(App);

  const [infoIsConfirmed, setInfoIsConfirmed] = useState(false);
  const bookingRef = useRef('');

  useEffect(() => {
    if (!bookingRef.current && user && infoIsConfirmed) {
      bookingRef.current = 'Booking...';
      bookAppointment(appointment);
    }
  }, [bookingRef, bookAppointment, appointment, user, infoIsConfirmed]);

  return ReactDOM.createPortal(
    <>
      {!user ? (
        <LoginModal closeModal={closeModal} />
      ) : !infoIsConfirmed ? (
        <ConfirmUserInfoModal
          closeModal={closeModal}
          setInfoIsConfirmed={setInfoIsConfirmed}
        />
      ) : (
        <>
          <div className='overlay'></div>
          <div className='modal'>
            <h1>{bookingRef.current}</h1>
          </div>
        </>
      )}
    </>,
    document.getElementById('portal')
  );
};

export default ConfirmationModal;
