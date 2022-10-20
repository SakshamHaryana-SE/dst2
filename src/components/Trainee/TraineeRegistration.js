import React, { useEffect } from 'react';
import { browserHistory } from 'react-router';
import Header from '../Header';
import { response } from './dummyLoginResponse';
import { storeUser } from '../../common/globals';

const TraineeRegistration = () => {
  let url = `${process.env.REACT_APP_GET_FORM}/getForm/traineeRegistration`;
  const customURL = localStorage.getItem('traineeRegistationURL');
  // localStorage.setItem('DST_USER_DATA', null);
  if (customURL !== null && customURL !== undefined && customURL !== 'undefined') url = customURL;

  useEffect(() => {
    window.addEventListener('message', (e) => {
      const { data } = e;
      try {
        const decoded = JSON.parse(data);
        if (decoded.channel === 'traineeRegistration' && decoded.traineeId !== null) {
          localStorage.setItem('DST_USER_DATA', decoded.user);
          setTimeout(() => {
            storeUser(response);
            localStorage.setItem('traineeId', decoded.traineeId);
            browserHistory.push('/trainee-options');
          }, 1000);
        } else if (decoded.channel === 'traineeRegistration') {
          alert('Could not Register User');
        } else {
          console.log('Normal Flow');
        }
      } catch (error) {
        // console.log(e)
      }
    });
  }, []);

  return (
    <>
      <Header />
      <iframe
        frameBorder="0"
        src={`${process.env.REACT_APP_ENKETO}/preview?xform=${encodeURIComponent(url)}&id=traineeRegistration`}
        title="Trainer"
        allow="geolocation"
        width="100%"
        height="670px"
      />
    </>
  );
};

export default TraineeRegistration;
