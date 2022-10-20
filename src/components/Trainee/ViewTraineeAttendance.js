import { ChevronLeftIcon, ChevronRightIcon, UserIcon } from '@heroicons/react/solid';
import React, { useEffect, useRef, useState } from 'react';
import { browserHistory } from 'react-router';
import { getUser } from '../../common/globals';
import { getTraineeAttendance } from '../../utils/utils';
import Header from '../Header';
// import { userLogout } from '../common/globals';

const ViewTraineeAttendance = () => {
    const [userData, setUserData] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [error, setError] = useState("");
    const [attendanceData, setAttendanceData] = useState(null);
    const [limit, setLimit] = useState(10);
    const page = useRef(0);

    useEffect(() => {
        getUser().then(res => setUserData(res));
    }, []);

    const getAttendance = async () => {
        if (!userData || !startDate || !endDate) {
            setError("Either the start or end date is missing");
            setTimeout(() => {
                setError("");
            }, 3000);
            return;
        } else if (new Date(startDate) >= new Date(endDate)) {
            setError("Start date must be earlier than the end date");
            setTimeout(() => {
                setError("");
            }, 3000);
            return;
        }

        let attendanceData = await getTraineeAttendance({
            trainee_id: userData.id,
            start_date: startDate,
            end_date: endDate,
            limit: limit,
            offset: page.current * limit
        });
        setAttendanceData(attendanceData?.data?.attendance);
    };

    const handlePagination = (next) => {
        if (attendanceData?.length < limit && next == 1) return;
        if (page.current == 0 && next == -1) return;
        page.current = page.current + next;
        getAttendance();
        window.scrollTo({ top: 50, behavior: 'smooth' });
    };

    function getDate(_date) {
        var d = new Date(_date);
        var options = {
            year: 'numeric',
            day: 'numeric',
            month: 'long',
        };
        var n = d.toLocaleDateString('en-GB', options);
        var replase = n.replace(new RegExp(',', 'g'), ' ');
        return replase;
    };

    return (
        <>
            <Header />
            <div className="m-10 text-xl font-bold text-teal-800 text-center">
                <h2 className="header-text-color">DST Trainee Attendance</h2>
            </div>
            <div className="text-teal-800 text-center w-full flex flex-col items-center" >
                <div className='w-full lg:w-[70%] flex flex-row justify-center'>
                    <div className='lg:w-[50%] lg:mr-4'>
                        <p>Start Date</p>
                        <input type="date" className='lg:w-full p-2 sm:mx-2 border border-teal-700 rounded-lg' onChange={e => setStartDate(e.target.value)} />
                    </div>
                    <div className='lg:w-[50%] lg:ml-4'>
                        <p>End Date</p>
                        <input type="date" className='lg:w-full p-2 sm:mx-2 border border-teal-700 rounded-lg' onChange={e => setEndDate(e.target.value)} />
                    </div>
                </div>
                <select className='w-[90%] lg:w-[70%] p-3 border border-teal-800 rounded-lg mt-8' onChange={e => setLimit(Number(e.target.value))}>
                    <option value={10} selected disabled>No of entries</option>
                    <option value={10}>10</option>
                    <option value={30}>30</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
                <div className={`hover:cursor-pointer transition ease-in-out delay-150 w-[90%] lg:w-[70%] bg-teal-800 text-white font-bold rounded-md p-3 m-8 ${(!startDate || !endDate) && 'opacity-60'}`}
                    onClick={() => {
                        page.current = 0;
                        getAttendance();
                    }}>
                    Get Attendance
                </div>
                {error && <span className='animate__animated animate__headShake text-rose-500 font-bold mx-10'>{error}</span>}
                <table className="leading-normal w-[90%] lg:w-[80%] pb-10">
                    <thead>
                        <tr>
                            <th
                                className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-md font-semibold text-gray-700 uppercase tracking-wider"
                            >
                                #
                            </th>
                            <th
                                className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-md font-semibold text-gray-700 uppercase tracking-wider"
                            >
                                Record Date
                            </th>
                            <th
                                className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-md font-semibold text-gray-700 uppercase tracking-wider"
                            >
                                Attendance
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendanceData && attendanceData.map((el, i) =>
                            <tr key={el.date}>
                                <td className=" py-5 border-b border-gray-200 bg-white text-md">
                                    {page.current * limit + i + 1}
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-md">
                                    {getDate(el.date)}
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-md">
                                    <span
                                        className={`relative inline-block px-3 py-1 font-semibold text-${el.is_present ? 'green' : 'red'}-900 leading-tight`}
                                    >
                                        <span
                                            aria-hidden
                                            className={`absolute inset-0 bg-${el.is_present ? 'green' : 'red'}-200 opacity-50 rounded-full`}
                                        ></span>
                                        <span className="relative">{el.is_present ? 'Present' : 'Absent'}</span>
                                    </span>
                                </td>
                            </tr>
                        )}

                    </tbody>
                </table>
                {attendanceData && <div className='w-full my-3 flex flex-row justify-center animate__animated animate__fadeInUp' style={{ paddingBottom: 50 }}>
                    <ChevronLeftIcon className={`h-10 w-10 ${page.current == 0 && 'opacity-40'}`} onClick={() => handlePagination(-1)}></ChevronLeftIcon>
                    <ChevronRightIcon className={`h-10 w-10 ${attendanceData?.length < limit && 'opacity-40'}`} onClick={() => handlePagination(1)}></ChevronRightIcon>
                </div>}
            </div>

        </>
    );
};
export default ViewTraineeAttendance;
