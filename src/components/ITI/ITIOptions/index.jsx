import React, { useEffect, useState } from 'react';
import { UserAddIcon, UserGroupIcon, } from '@heroicons/react/solid';
import { CalendarIcon } from '@heroicons/react/outline';
import { browserHistory } from 'react-router';
import withGoBack from '../../../redux/HOC/withGoBack';
import Header from '../../Header';
import { getAcademicCalendarLinks } from "../../../utils/utils";
import { userLogout } from '../../../common/globals';
import withNotify from "../../../redux/HOC/withNotify";
import withUser from "../../../redux/HOC/withUser";
import { onGoBack } from '../../../common/globals';
import styles from "./index.module.scss";
import OptionCard from './OptionCard';

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
                <div className="m-10 text-teal-800 text-center font-bold lg:mb-20">
                    <h2 className="header-text-color">Please select one option to proceed</h2>
                </div>
                <div className={styles.container}>
                    <OptionCard icon={<UserAddIcon />} title={"Create, Cancel or Update DST MSC"} onClick={onDstMc} />
                    <OptionCard icon={<CalendarIcon />} title={"Update Academic Calendar"} onClick={onUpdateAcademicCalendar} />
                    <OptionCard icon={<UserGroupIcon />} title={"View DST MC"} onClick={() => browserHistory.push('/view-dst-mc')} />
                    <OptionCard icon={<CalendarIcon />} title={"View OJT Attendance"} onClick={() => browserHistory.push('/view-ojt-attendance')} />
                </div>
            </div>
        </div>
    );
};
export default withNotify(withUser(withGoBack(ITIOptions)));
