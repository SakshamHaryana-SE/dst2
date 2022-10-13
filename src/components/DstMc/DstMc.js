import React from 'react';
import {
  UserGroupIcon, PlusIcon, ViewGridIcon, ClipboardListIcon,
} from '@heroicons/react/solid';
import { UserAddIcon } from '@heroicons/react/outline';
import { browserHistory } from 'react-router';
import withGoBack from '../../redux/HOC/withGoBack';
import Header from '../Header';

const DstMc = ({ goBack, setGoBack }) => {
  const onDstMc = () => {
    goBack.push(window.location.pathname);
    setGoBack(goBack);
    browserHistory.push('/create-dst-mc');
  };


  return (
    <div>
      <Header/>
      <div className="m-10 text-teal-800 text-center">
        <h2 className="header-text-color">Please select one option to proceed</h2>
      </div>
      <div className="grid grid-cols-2 gap-4 h-48">
        <div
          onClick={onDstMc}
          className="text-center text-2xl"
        >
          <div className="flex items-center justify-center text-teal-700">
            <PlusIcon className="w-10" aria-hidden="true" />
            <UserGroupIcon className="w-5/12 sm:w-1/3 md:w-1/3 lg:w-1/4 xl:w-1/6" aria-hidden="true" />
          </div>
          Create DST MC
        </div>
        <div className="text-center text-2xl">
          <div className="flex items-center justify-center text-teal-700">
            <UserAddIcon className="w-5/12 sm:w-1/3 md:w-1/3 lg:w-1/4 xl:w-1/6" aria-hidden="true" />
          </div>
          Create Trainer Login
        </div>
        <div className="text-center text-2xl">
          <div className="flex items-center justify-center text-teal-700">
            <ViewGridIcon className="w-5/12 sm:w-1/3 md:w-1/3 lg:w-1/4 xl:w-1/6" aria-hidden="true" />
          </div>
          View OJT attendance
        </div>
        <div className="text-center text-2xl">
          <div className="flex items-center justify-center text-teal-700">
            <ClipboardListIcon className="w-5/12 sm:w-1/3 md:w-1/3 lg:w-1/4 xl:w-1/6" aria-hidden="true" />
          </div>
          View MC meeting details
        </div>
      </div>
    </div>
  );
};
export default withGoBack(DstMc);
