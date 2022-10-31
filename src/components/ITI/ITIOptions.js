import React, { useEffect, useState } from 'react';
import {
  ViewGridIcon, ClipboardListIcon, UserAddIcon, UserGroupIcon,
} from '@heroicons/react/solid';
import { LocationMarkerIcon, CalendarIcon } from '@heroicons/react/outline';
import { browserHistory } from 'react-router';
import withGoBack from '../../redux/HOC/withGoBack';
import Header from '../Header';
import { getAcademicCalendarLinks, ITIlogin } from "../../utils/utils";
import { userLogout } from '../../common/globals';
import { isEmpty } from "lodash";
import withNotify from "../../redux/HOC/withNotify";
import withUser from "../../redux/HOC/withUser";
import { onGoBack } from '../../common/globals';

const ITIOptions = ({ goBack, setGoBack, setNotify, user }) => {
  const onDstMc = () => {
    goBack.push(window.location.pathname);
    setGoBack(goBack);
    browserHistory.push('/dst-mc-options');
  };

  const onUpdateAcademicCalendar = () => {
    if (academicCalendarLink?.calendar_link) {
      window.open(academicCalendarLink?.calendar_link);
    } else {
      window.alert('Academic calendar form has not been updated yet.');
    }
  };


  const [academicCalendarLink, setAcademicCalendarLink] = useState('');

  const fetchAcademicLink = async () => {
    const reqData = {
      itiName: user?.user?.user?.username
    };
    const { data: { iti_academic_calendar_link } } = await getAcademicCalendarLinks(reqData);
    setAcademicCalendarLink(iti_academic_calendar_link[0]);
  };

  useEffect(() => {
    fetchAcademicLink();
  }, []);
  const onBack = () => {
    onGoBack(goBack);
  };

  return (
    <div>
      <Header onBackButton={onBack} />
      <div className="p-2 pb-10">
        <div className="m-10 text-teal-800 text-center">
          <h2 className="header-text-color">Please select one option to proceed</h2>
        </div>
        <div className="grid grid-cols-12 mb-10">
          <div className="col-span-12 grid grid-cols-1 gap-y-9">
            <div className="text-lg cursor-pointer" onClick={onDstMc}
            >
              <div className="flex items-center lg:justify-center text-teal-700 ml-10 lg:ml-0">
                <UserAddIcon className="w-2/12 sm:w-1/4 md:w-1/6 lg:w-1/12 xl:w-1/12 pr-3" aria-hidden="true" />
                <span>Create, cancel, or update DST MC</span>
              </div>
            </div>
            <div className="text-lg cursor-pointer" onClick={onUpdateAcademicCalendar}>
              <div className="flex items-center lg:justify-center text-teal-700 ml-10 lg:ml-0">
                <CalendarIcon className="w-2/12 sm:w-1/4 md:w-1/6 lg:w-1/12 xl:w-1/12 pr-3" aria-hidden="true" />
                <span>Update Academic Calendar</span>
              </div>
            </div>
            <div className="text-lg cursor-pointer" onClick={() => browserHistory.push('/view-dst-mc')}>
              <div className="flex items-center lg:justify-center text-teal-700 ml-10 lg:ml-0">
                <UserGroupIcon className="w-2/12 sm:w-1/4 md:w-1/6 lg:w-1/12 xl:w-1/12 pr-3" aria-hidden="true" />
                <span>View DST MC</span>
              </div>
            </div>
            <div className="text-lg cursor-pointer" onClick={() => browserHistory.push('/view-ojt-attendance')}>
              <div className="flex items-center lg:justify-center text-teal-700 ml-10 lg:ml-0">
                <CalendarIcon className="w-2/12 sm:w-1/4 md:w-1/6 lg:w-1/12 xl:w-1/12 pr-3" aria-hidden="true" />
                <span>View OJT Attendance</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <button
            onClick={() => userLogout()}
            className="bg-teal-700 hover:bg-teal-500 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline"
            type="button"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
export default withNotify(withUser(withGoBack(ITIOptions)));
