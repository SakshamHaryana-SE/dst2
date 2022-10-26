import React, { useEffect, useState } from 'react';
import { DocumentDownloadIcon, } from '@heroicons/react/solid';
import withGoBack from '../../redux/HOC/withGoBack';
import Header from '../Header';
import { onGoBack } from "../../common/globals";
import { getFilteredBatch, getFilteredDSTData, getFilteredIndustry, getFilteredTrades, getIndustryDetails, getITIsList } from '../../utils/utils';
import withUser from '../../redux/HOC/withUser';
import { CSVLink } from 'react-csv';
import CommonModal from '../Common/Modal';

const csvHeaders = [
  { label: "District", key: "district" },
  { label: "ITI Name", key: "iti.name" },
  { label: "Batch", key: "batch" },
  { label: "Trade", key: "trade" },
  { label: "Industry", key: "industry.name" }
];

const ViewDstMc = ({ goBack, user }) => {
  const [tableData, setTableData] = useState([]);
  const [currentIti, setCurrentIti] = useState('');
  const [trades, setTrades] = useState([]);
  const [batches, setBatches] = useState([]);
  const [filteredIndustries, setFilteredIndustries] = useState([]);
  const [selectedTrade, setSelectedTrade] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedIndsutry, setSelectedIndsutry] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  const onBack = () => {
    onGoBack(goBack);
  };

  const onTradesSelect = async (value) => {
    const reqData = {
      itiId: currentIti,
      trade: value
    };
    setSelectedTrade(value);
    setSelectedBatch("");
    setSelectedIndsutry("");
    setTableData([]);
    const { data: { dst_mc_meeting } } = await getFilteredBatch(reqData);
    const list = dst_mc_meeting.map((item) => item.batch).filter((item, index, self) => self.indexOf(item) === index);
    setBatches(list);
  };

  const onBatchSelect = async (value) => {
    const reqData = {
      itiId: currentIti,
      trade: selectedTrade,
      batch: value
    };
    setSelectedBatch(value);
    setSelectedIndsutry('');
    const { data: { dst_mc_meeting } } = await getFilteredIndustry(reqData);
    const list = dst_mc_meeting.map((item) => item.industry).filter((item, index, self) => self.indexOf(item) === index);
    setFilteredIndustries(list);
  };

  const onIndustrySelect = async (value) => {
    const reqData = {
      itiId: currentIti,
      trade: selectedTrade,
      batch: selectedBatch,
      industryId: value
    };
    setSelectedIndsutry(value);
    const { data: { dst_mc_meeting } } = await getFilteredDSTData(reqData);
    setTableData(dst_mc_meeting);
  };

  const fetchITIsList = async () => {
    const data = await getITIsList();
    const currentITI = data.data.iti.find((item) => item.name == user?.user?.user?.username).id;
    setCurrentIti(currentITI);
    fetchFilteredTrades(currentITI);
  };


  const fetchFilteredTrades = async (currentITI) => {
    const reqData = {
      itiId: currentITI
    };
    const { data: { dst_mc_meeting } } = await getFilteredTrades(reqData);
    const list = dst_mc_meeting.map((item) => item.trade).filter((item, index, self) => self.indexOf(item) === index);
    setTrades(list);
  };

  useEffect(() => {
    fetchITIsList();
  }, []);

  const showIndustryModal = async (data) => {
    let industryData = await getIndustryDetails(data.id);
    if (!industryData?.data?.industry?.[0]) return;
    setModalData(industryData.data.industry[0]);
    setShowModal(true);
  };


  return (
    <div>
      {showModal && modalData && <CommonModal showModal={setShowModal}>
        <div className='flex  flex-col'>
          <p className='text-center mb-10 text-teal-700 text-2xl font-bold'>{modalData.name}</p>
          <p className='text-lg font-semibold py-2'>District: {modalData.district}</p>
          <p className='text-lg font-semibold py-2'>Latitue: {modalData.latitude}</p>
          <p className='text-lg font-semibold py-2'>Longitude: {modalData.longitude}</p>
          <p className='text-lg font-semibold py-2'>ID: {modalData.id}</p>
        </div>
      </CommonModal>}
      <Header title="View DST MC" onBackButton={onBack} />
      <div className="grid grid-cols-3 gap-x-4 p-4 lg:mx-20">
        <select className="form-select appearance-none p-3 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-teal-800 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
          name="trade"
          id="trade"
          value={selectedTrade}
          onChange={(event) => { onTradesSelect(event.target.value); }}
        >
          <option >Select Trade</option>
          {
            trades?.map((item) => <option key={item} value={item}>{item}</option>)
          }
        </select>

        <select className="form-select appearance-none p-3 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-teal-800 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
          name="trade"
          id="trade"
          value={selectedBatch}
          onChange={(event) => { onBatchSelect(event.target.value); }}
        >
          <option >Select Batch</option>
          {
            batches && batches.length > 0 && batches.map((item) => <option key={item} value={item}>{item}</option>)
          }
        </select>

        <select className="form-select appearance-none p-3 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-teal-800 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
          name="filteredIndustries" id="filteredIndustries"
          value={selectedIndsutry}
          onChange={(event) => onIndustrySelect(event.target.value)}
        >
          <option value="">Select Industry</option>
          {
            filteredIndustries && filteredIndustries.length > 0 && filteredIndustries.map((item) => <option key={item.name} value={item.id}>{item.name}</option>)
          }
        </select>

      </div>
      <table className="leading-normal w-[90%] lg:w-[90%] pb-10 m-auto mt-10">
        <thead>
          <tr>
            <th
              className="px-5 py-3 border-b-2 border-gray-200 bg-teal-800 text-center text-md font-semibold text-white uppercase tracking-wider"
            >
              #
            </th>
            <th
              className="px-5 py-3 border-b-2 border-gray-200 bg-teal-800 text-center text-md font-semibold text-white uppercase tracking-wider"
            >
              District
            </th>
            <th
              className="px-5 py-3 border-b-2 border-gray-200 bg-teal-800 text-center text-md font-semibold text-white uppercase tracking-wider"
            >
              ITI Name
            </th>
            <th
              className="px-5 py-3 border-b-2 border-gray-200 bg-teal-800 text-center text-md font-semibold text-white uppercase tracking-wider"
            >
              Industry
            </th>
          </tr>
        </thead>
        <tbody>
          {tableData && tableData.map((el, i) =>
            <tr key={el.date}>
              <td className={`py-5 border-b border-gray-200 bg-white text-md text-center ${i % 2 && 'bg-gray-100'}`}>
                {i + 1}
              </td>
              <td className={`py-5 border-b border-gray-200 bg-white text-md text-center ${i % 2 && 'bg-gray-100'}`}>
                {el.district}
              </td>
              <td className={`py-5 border-b border-gray-200 bg-white text-md text-center ${i % 2 && 'bg-gray-100'}`}>
                {el.iti.name}
              </td>
              <td className={`py-5 border-b border-gray-200 bg-white text-md text-center text-teal-500 ${i % 2 && 'bg-gray-100'}`}>
                <span className='cursor-pointer' onClick={() => showIndustryModal(el.industry)}>{el.industry.name}</span>
              </td>
            </tr>
          )}

        </tbody>
      </table>
      {tableData?.length > 0 && <div className='w-full flex justify-end'>
        <CSVLink
          data={tableData}
          className='bg-teal-800 px-4 py-2 text-white flex items-center text-lg mr-[5%] my-8 cursor-pointer hover:bg-teal-900 hover:rounded-lg ease-in-out duration-200'
          headers={csvHeaders}
          filename={`${selectedTrade}_${selectedBatch}_${filteredIndustries.filter(el => el.id == selectedIndsutry)[0].name || ""}`}>
          <span>
            Export &nbsp;
          </span>
          <DocumentDownloadIcon className='h-5 w-5' />
        </CSVLink>
      </div>}
    </div>
  );
};
export default withUser(withGoBack(ViewDstMc));

