import React from 'react';
import { ArrowRight } from '../../../icons';

const LocationPreview = ({ location, handleSelection }) => {
  const { name, address } = location;

  return (
    <div id='location-preview' onClick={() => handleSelection(location._id)}>
      <div id='preview-info'>
        <div>
          <h2>{name}</h2>
          <hr />
          <p className='preview-address'>
            {address.street}, {address.city}, {address.state} {address.zip}
          </p>
        </div>
        <p className='preview-next'>Next:</p>
        <p id='preview-time' className='bold'>
          {location.available[0]}
        </p>
      </div>
      <ArrowRight />
    </div>
  );
};

export default LocationPreview;
