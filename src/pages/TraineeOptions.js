import { UserIcon } from '@heroicons/react/solid';
import React from 'react';
import { browserHistory } from 'react-router';
import Header from '../components/Header';
// import { userLogout } from '../common/globals';

const TraineeOptions = () => {
    null;
    return (
        <>
            <Header />
            <div className="m-10 text-xl font-bold text-teal-800 text-center">
                <h2 className="header-text-color">DST Trainee Attendance</h2>
            </div>
            <div className="m-10 text-teal-800 text-center">
                <div className='mb-10'>
                    <button
                        onClick={() => browserHistory.push('/trainee-record-attendance')}
                        type="button"
                        className="min-w-[16rem] inline-flex items-center px-4 py-2 border border-teal-700 shadow-sm text-base font-medium rounded-md text-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    >
                        <UserIcon className="-ml-1 mr-3 h-5 w-5" aria-hidden="true" />
                        Record Attendance
                    </button>
                </div>
                <div>
                    <button
                        onClick={() => browserHistory.push('/trainee-view-attendance')}
                        type="button"
                        className="min-w-[16rem] inline-flex items-center px-4 py-2 border border-teal-700 shadow-sm text-base font-medium rounded-md text-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    >
                        <UserIcon className="-ml-1 mr-3 h-5 w-5" aria-hidden="true" />
                        View Attendance History
                    </button>
                </div>
            </div>

        </>
    );
};

export default TraineeOptions;