import { useState } from "react";
import { useEffect } from "react";
import { browserHistory } from 'react-router';
import withGoBack from "../../redux/HOC/withGoBack";
import withUser from "../../redux/HOC/withUser";
import { getOjtAttendanceDetails, getTraineeAttendance } from "../../utils/utils";
import Header from "../Header";
import Modal from '../Common/Modal';
import AttendanceTable from "./AttendanceTable";
import { CSVLink } from "react-csv";
import { DocumentDownloadIcon, InformationCircleIcon } from "@heroicons/react/solid";

const OJTAttendanceTable = (props) => {
    const [tableData, setTableData] = useState([]);
    const [modal, showModal] = useState(false);
    const [attendanceRecord, setAttendanceRecord] = useState();
    const [traineeName, setTraineeName] = useState("");

    const csvHeaders = [
        { label: "Trainee Name", key: "name" },
        { label: "Registration Number", key: "registrationNumber" },
        { label: "Days Present", key: "daysPresent" },
        { label: "Total Days", key: "totalDays" }
    ];
    const { batch, fromDt, industry, iti, toDt, tradeName } = props.params;

    useEffect(async () => {
        const data = {
            batch: `${batch.split("-")[0]}-20${batch.split("-")[1]}`,
            iti: Number(iti),
            industry: Number(industry),
            tradeName: tradeName,
            fromDt: fromDt,
            toDt: toDt
        };
        let res = await getOjtAttendanceDetails(data);
        setTableData(res.data);
    }, []);

    const onBack = () => {
        browserHistory.goBack();
    };

    const [windowWidth, setWindowWidth] = useState(0);
    let resizeWindow = () => {
        setWindowWidth(window.innerWidth);
    };

    useEffect(() => {
        resizeWindow();
        window.addEventListener("resize", resizeWindow);
        return () => window.removeEventListener("resize", resizeWindow);
    }, []);

    const fetchAttendanceRecord = async (el) => {
        let res = await getTraineeAttendance({
            trainee_id: el.id,
            start_date: props.params.fromDt,
            end_date: props.params.toDt,
            limit: 10000,
            offset: 0
        });
        setTraineeName(el.name);
        setAttendanceRecord(res.data.attendance);
        showModal(true);
    };

    return (
        <div>
            {modal &&
                <Modal showModal={showModal}>
                    <AttendanceTable attendanceRecord={attendanceRecord} name={traineeName} />
                </Modal>
            }
            <Header title="View OJT Attendance" onBackButton={onBack} />
            <table className="leading-normal w-[90%] lg:w-[90%] pb-10 m-auto mt-10 animate__animated animate__fadeIn">
                <thead>
                    <tr>
                        {windowWidth > 768 && <th
                            className="px-5 py-3 border-b-2 border-gray-200 bg-teal-800 text-center text-md font-semibold text-white uppercase tracking-wider"
                        >
                            #
                        </th>}
                        <th
                            className="px-5 py-3 border-b-2 border-gray-200 bg-teal-800 text-center text-md font-semibold text-white uppercase tracking-wider"
                        >
                            Trainee Name
                        </th>
                        <th
                            className="px-5 py-3 border-b-2 border-gray-200 bg-teal-800 text-center text-md font-semibold text-white uppercase tracking-wider"
                        >
                            Reg. No.
                        </th>
                        <th
                            className="px-5 py-3 border-b-2 border-gray-200 bg-teal-800 text-center text-md font-semibold text-white uppercase tracking-wider"
                        >
                            Total Present
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.q1 && tableData.q1.map((el, i) =>
                        <tr key={el.date}>
                            {windowWidth > 768 && <td className={`py-5 border-b border-gray-200 bg-white text-md text-center ${i % 2 && 'bg-gray-100'}`}>
                                {i + 1}
                            </td>}
                            <td className={`py-5 border-b border-gray-200 bg-white text-md text-center ${i % 2 && 'bg-gray-100'}`}>
                                {el.name}
                            </td>
                            <td className={`py-5 border-b border-gray-200 bg-white text-md text-center ${i % 2 && 'bg-gray-100'}`}>
                                {el.registrationNumber}
                            </td>
                            <td className={`py-5 border-b font-bold border-gray-200 bg-white text-md text-center text-teal-600 ${i % 2 && 'bg-gray-100'}`}>
                                <span className='flex flex-row items-center justify-center cursor-pointer' onClick={() => fetchAttendanceRecord(el)}>{el.attendances_aggregate.aggregate.count} / {tableData.q2[i].attendances_aggregate.aggregate.count} &nbsp; <InformationCircleIcon className="text-teal-800 h-5 w-5" /></span>
                            </td>
                        </tr>
                    )}

                </tbody>
            </table>
            {tableData.q1 && <div className='w-full flex justify-end'>
                <CSVLink
                    data={tableData.q1.map((el, i) => {
                        const temp = { ...el, daysPresent: el.attendances_aggregate.aggregate.count, totalDays: tableData.q2[i].attendances_aggregate.aggregate.count };
                        return temp;
                    })}
                    className='bg-teal-800 px-4 py-2 lg:mr-20 mr-2 text-white flex items-center text-lg my-8 cursor-pointer hover:bg-teal-900 hover:rounded-lg ease-in-out duration-200'
                    headers={csvHeaders}
                    filename={`Batch ${batch}-${tradeName}-${fromDt}-to-${toDt}.csv`}>
                    <span>
                        Export &nbsp;
                    </span>
                    <DocumentDownloadIcon className='h-5 w-5' />
                </CSVLink>
            </div>
            }
        </div>
    );
};

export default withUser(withGoBack(OJTAttendanceTable));