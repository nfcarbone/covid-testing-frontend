import React, { useContext } from 'react';
import { HeaderName } from '../../Providers/AccountProvider.js';
import dayjs from 'dayjs';

const AccountHeader = () => {
  const headerName = useContext(HeaderName);

  const now = new dayjs();
  const time =
    now.$H > 3 && now.$H < 12
      ? 'morning'
      : now.$H < 17
      ? 'afternoon'
      : 'evening';

  return (
    <div className='account-header'>
      <div className='avatar'>
        <img src='#' alt='User' />
      </div>
      <h1>{`Good ${time}${headerName ? `, ${headerName}!` : '!'}`}</h1>
    </div>
  );
};

export default AccountHeader;
