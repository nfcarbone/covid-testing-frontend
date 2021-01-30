import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Go } from '../../Providers/Context';

export default function Menu({ toggleMenu }) {
  const go = useContext(Go);

  const handleTo = (to) => {
    go(to);
    toggleMenu();
  };

  return (
    <div id='menu' className='flex-col' onClick={toggleMenu}>
      <Link className='header-link' to={'#'} onClick={() => handleTo('/')}>
        <h2>Welcome</h2>
      </Link>
      <Link
        className='header-link'
        to='#'
        onClick={() => handleTo('/search/form')}
      >
        <h2>New Appointment</h2>
      </Link>
      <Link
        className='header-link'
        to='#'
        onClick={() => handleTo('/information')}
      >
        <h2>Information</h2>
      </Link>
    </div>
  );
}
