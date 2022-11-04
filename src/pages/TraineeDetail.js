import React, { useEffect } from 'react';
import { browserHistory } from 'react-router';
import Header from '../components/Header';
// import { userLogout } from '../common/globals';

const TraineeDetail = () => {
  useEffect(() => {
    window.addEventListener('message', (e) => {
      const { data } = e;
      try {
        const decoded = JSON.parse(data);
        if (decoded.channel === 'traineeDetail') {
          setTimeout(async () => {
            // need to redirect
            if (decoded.url !== null && decoded.url !== undefined) {
              localStorage.setItem('traineeRegistationURL', decoded.url);
              browserHistory.push('/trainee-registration');
            } else {
              // await userLogout();
              browserHistory.push('/trainee-login');
            }
          }, 2000);
        }
      } catch (error) {
        // console.log(e)
      }
    });
  }, []);
  const traineeId = localStorage.getItem('traineeId');
  return (
    <>
      <Header onBackButton={() => browserHistory.goBack()} />
      <div className="m-10 text-xl font-bold text-teal-800 text-center">
        <h2 className="header-text-color">DST Trainee Attendance</h2>
      </div>
      <iframe
        frameBorder="0"
        src={`${process.env.REACT_APP_ENKETO}/preview?xform=${process.env.REACT_APP_GET_FORM}/getFormPrefilled/${traineeId}&id=preFilled`}
        title="Test Geolocation"
        allow="geolocation"
        width="100%"
        height="650px"
      />
    </>
  );
};
export default TraineeDetail;
