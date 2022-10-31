import { DocumentDownloadIcon } from "@heroicons/react/solid";
import { CSVLink } from "react-csv";

const AttendanceTable = ({ attendanceRecord, name }) => {

    const csvHeaders = [
        { label: "Name", key: "name" },
        { label: "Date", key: "date" },
        { label: "Attendance", key: "is_present" }
    ];

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
            <table className="leading-normal w-full pb-10">
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
                    {attendanceRecord?.map((el, i) =>
                        <tr key={el.date}>
                            <td className="text-center py-5 border-b border-gray-200 bg-white text-md">
                                {i + 1}
                            </td>
                            <td className="text-center px-5 py-5 border-b border-gray-200 bg-white text-md">
                                {getDate(el.date)}
                            </td>
                            <td className="text-center px-5 py-5 border-b border-gray-200 bg-white text-md" key={el.date}>
                                <span className={`${el.is_present ? "px-3 py-1 bg-green-200 text-green-900 rounded-full" : "px-3 py-1 bg-red-200 text-red-900 rounded-full"}`}>{el.is_present ? 'Present' : 'Absent'}</span>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            {attendanceRecord.length > 0 && <div className='w-full flex justify-end'>
                <CSVLink
                    data={attendanceRecord.map(el => {
                        let temp = { ...el, name: name, is_present: el.is_present ? "Present" : "Absent" };
                        return temp;
                    })}
                    className='bg-teal-800 px-4 py-2 text-white flex items-center text-lg my-8 cursor-pointer hover:bg-teal-900 hover:rounded-lg ease-in-out duration-200'
                    headers={csvHeaders}
                    filename={`Attendance-${name}`}>
                    <span>
                        Export &nbsp;
                    </span>
                    <DocumentDownloadIcon className='h-5 w-5' />
                </CSVLink>
            </div>}
        </>
    );
};

export default AttendanceTable;