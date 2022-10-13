import React, { useEffect } from 'react';
import { browserHistory } from 'react-router';
import Header from '../components/Header';
import formSpec from '../form_spec.json';
import withUser from '../redux/HOC/withUser';
import withTrainee from '../redux/HOC/withTrainee';
import { storeUser } from '../common/globals';

const TraineeLogin = ({ setUser, setTrainee }) => {
  const triggers = JSON.stringify(formSpec[0].triggers);

  useEffect(() => {
    console.log('Test');
    window.addEventListener('message', (e) => {
      const { data } = e;
      console.log('data', data);
      try {
        const decoded = JSON.parse(data);
        if (decoded.channel === 'enketo') {
          setTimeout(() => {
            const resp = decoded.loginRes;
            setTrainee(decoded.message);
            storeUser(resp);
            setUser(resp);
            localStorage.setItem('traineeId', decoded.message.id);
            // need to redirect
            browserHistory.push('/trainee');
          }, 1000);
        } else if (decoded.channel === 'traineeAfterLoginDetail') {
          localStorage.setItem('traineeRegistationURL', undefined);
          browserHistory.push('/trainee-registration');
        }
      } catch (error) {
        // console.log(e)
      }
    });
  }, []);

  console.log(`${process.env.REACT_APP_ENKETO}/preview?xform=${process.env.REACT_APP_GET_FORM}/getForm/enrollment&id=enrollment&triggers=${triggers}`);
  return (
    <>
      <Header />
      <div className="m-10 text-xl font-bold text-teal-800 text-center">
        <h2 className="header-text-color">DST Trainee Attendance</h2>
      </div>
      <iframe
        frameBorder="0"
        src={`${process.env.REACT_APP_ENKETO}/preview?xform=${process.env.REACT_APP_GET_FORM}/getForm/enrollment&id=enrollment&triggers=${triggers}`}
        title="Enrollment"
        allow="geolocation"
        width="100%"
        height="50%"
        style={{ display: 'flex', flexGrow: 1 }}
      />
    </>
  );
};
export default withTrainee(withUser(TraineeLogin));
