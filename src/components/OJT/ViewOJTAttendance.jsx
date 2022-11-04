import React, { useEffect, useRef, useState } from 'react';
import { DocumentDownloadIcon, } from '@heroicons/react/solid';
import withGoBack from '../../redux/HOC/withGoBack';
import Header from '../Header';
import { onGoBack } from "../../common/globals";
import { getFilteredBatch, getFilteredDSTData, getFilteredIndustry, getFilteredTrades, getIndustryDetails, getITIsList, getOjtAttendanceDetails, getOptionsForOjtAttendance } from '../../utils/utils';
import withUser from '../../redux/HOC/withUser';
import { browserHistory } from 'react-router';

const ViewOJTAttendance = ({ goBack, user }) => {
    const [currentIti, setCurrentIti] = useState('');
    const [selectedTrade, setSelectedTrade] = useState('');
    const [selectedBatch, setSelectedBatch] = useState('');
    const [selectedIndsutry, setSelectedIndsutry] = useState('');
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [nextDisabled, setNextDisabled] = useState(true);
    const [options, setOptions] = useState({});
    const wrapperRef = useRef();

    const onBack = () => {
        onGoBack(goBack);
    };

    const fetchITIsList = async () => {
        const data = await getITIsList();
        const currentITI = data.data.iti.find((item) => item.name == user?.user?.user?.username).id;
        setCurrentIti(currentITI);
        let res = await getOptionsForOjtAttendance(currentITI);
        const optionsObj = {};
        res.data.iti_industry_trade_batch_mapping.forEach(el => {
            if (el.industry.attendances_aggregate.aggregate.count > 0)
                if (!optionsObj[el.trade]) {
                    optionsObj[el.trade] = {
                        batches: [el.batch],
                        industries: [{ id: el.industry.id, name: el.industry.name }]
                    };
                } else {
                    optionsObj[el.trade].batches.push(el.batch);
                    optionsObj[el.trade].industries.push({ id: el.industry.id, name: el.industry.name });
                }
        });
        setOptions(optionsObj);
    };

    useEffect(() => {
        fetchITIsList();
    }, []);

    const getMinDate = () => {
        if (!selectedBatch) return null;
        return `${selectedBatch.split("-")[0]}-01-01`;
    };

    const getMaxDate = () => {
        if (!selectedBatch) return null;
        return `20${selectedBatch.split("-")[1]}-12-31`;
    };

    const handleNext = async () => {
        if (!selectedBatch || !selectedIndsutry || !selectedTrade || !startDate)
            return;
        wrapperRef.current.className += " animate__animated animate__slideOutLeft";
        setTimeout(() => {
            browserHistory.push(`/view-ojt-attendance/${currentIti}/${selectedIndsutry}/${selectedBatch}/${selectedTrade}/${startDate}/${endDate || ('20' + selectedBatch.split("-")[1] + '-12-31')}`);
        }, 1000);
    };

    useEffect(() => {
        if (!selectedBatch || !selectedIndsutry || !selectedTrade || !startDate)
            setNextDisabled(true);
        else
            setNextDisabled(false);
    }, [selectedBatch, selectedIndsutry, selectedTrade, startDate, endDate]);


    return (
        <div>
            <Header title="View OJT  Attendance" onBackButton={onBack} />
            <div className='flex flex-col sm:w-full lg:w-[50%] lg:m-auto lg:my-10 lg:wrap px-5 pb-[50px]' ref={wrapperRef}>
                <div className='w-full my-5'>
                    <p className='text-teal-800 font-bold text-xl mb-2'>Select a DST trade</p>
                    <select className="form-select appearance-none p-3 font-semibold text-gray-700 bg-white border-2 border-solid border-teal-800 w-full"
                        name="trade"
                        id="trade"
                        value={selectedTrade}
                        onChange={(event) => { setSelectedTrade(event.target.value); }}
                    >
                        <option >Select Trade</option>
                        {
                            Object.keys(options)?.map((item) => <option key={item} value={item}>{item}</option>)
                        }
                    </select>
                </div>
                <div className='w-full my-5'>
                    <p className='text-teal-800 font-bold text-xl mb-2'>Select a batch for the trade</p>
                    <select className="form-select appearance-none p-3 font-semibold text-gray-700 bg-white border-2 border-solid border-teal-800 w-full"
                        name="trade"
                        id="trade"
                        value={selectedBatch}
                        onChange={(event) => { setSelectedBatch(event.target.value); }}
                    >
                        <option >Select Batch</option>
                        {
                            options[selectedTrade]?.batches?.map((item) => <option key={item} value={item}>{item}</option>)
                        }
                    </select>
                </div>
                <div className='w-full my-5'>
                    <p className='text-teal-800 font-bold text-xl mb-2'>Select an Industry for the same</p>
                    <select className="form-select appearance-none p-3 font-semibold text-gray-700 bg-white border-2 border-solid border-teal-800 w-full"
                        name="filteredIndustries" id="filteredIndustries"
                        value={selectedIndsutry}
                        onChange={(event) => setSelectedIndsutry(event.target.value)}
                    >
                        <option value="">Select Industry</option>
                        {
                            options[selectedTrade]?.industries?.map((item) => <option key={item.name} value={item.id}>{item.name}</option>)
                        }
                    </select>
                </div>
                <div className='w-full my-5'>
                    <p className='text-teal-800 font-bold text-xl mb-2'>From Date</p>
                    <input type="date" min={getMinDate()} max={getMaxDate()} className='form-select appearance-none p-3 font-semibold text-gray-700 bg-white border-2 border-solid border-teal-800 w-full' onChange={e => setStartDate(e.target.value)} />
                </div>
                <div className='w-full my-5'>
                    <p className='text-teal-800 font-bold text-xl mb-2'>To Date</p>
                    <input type="date" min={getMinDate()} max={getMaxDate()} className='form-select appearance-none p-3 font-semibold text-gray-700 bg-white border-2 border-solid border-teal-800 w-full' onChange={e => setEndDate(e.target.value)} />
                </div>
                <div className='w-full flex justify-end'>
                    <div
                        onClick={handleNext}
                        className={`bg-teal-700 px-10 py-2 my-2 hover:bg-teal-800 hover:rounded transition ease-in-out duration-300 cursor-pointer text-white text-xl text-semibold ${nextDisabled && 'opacity-[50%]'}`}>
                        Next
                    </div>
                </div>
            </div>
        </div>
    );
};
export default withUser(withGoBack(ViewOJTAttendance));

