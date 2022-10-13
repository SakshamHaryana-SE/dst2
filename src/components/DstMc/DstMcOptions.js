import React, {useEffect, useState} from 'react';
import {
    ViewGridIcon, ClipboardListIcon, UserAddIcon, UserGroupIcon,
} from '@heroicons/react/solid';
import { LocationMarkerIcon, CalendarIcon } from '@heroicons/react/outline';
import { browserHistory } from 'react-router';
import withGoBack from '../../redux/HOC/withGoBack';
import Header from '../Header';
import {getFilteredTrades, getITIsList, getFilteredBatch, getFilteredIndustry} from "../../utils/utils";
import {onGoBack, userLogout} from '../../common/globals';
import {isEmpty} from "lodash";
import withNotify from "../../redux/HOC/withNotify";
import withUser from "../../redux/HOC/withUser";

const DstMcOptions = ({ goBack, setGoBack, setNotify, user }) => {
    const [selectedOption, setSelectedOption] = useState('create');
    const onBack = () => {
        onGoBack(goBack);
    };
    const onNext = (path) => {
        goBack.push(window.location.pathname);
        setGoBack(goBack);
        browserHistory.push(path);
    };

    const onValueChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if(selectedOption === 'create') {
            onNext('/create-dst-mc');
        }else if(selectedOption === 'update') {
            onNext('/update-dst-mc');
        } else if(selectedOption === 'cancel') {
            onNext('/cancel-dst-mc');
        }
    };

    return (
        <div>
            <Header title="Create DST MC" onBackButton={onBack} />
            <div className="p-2">
                <div className="m-10 text-teal-800 text-center">
                    <h2 className="header-text-color">DST MC Creation and Updation</h2>
                </div>
                <div className="grid grid-cols-1 place-items-center mb-10">
                    <div className="flex flex-col gap-y-9">
                        <div>Please choose 'Create DSTMC' if you are creating a DST MC for the first time.
                            <br/>
                            Please choose 'Cancel DSTMC' if your MoU has been cancelled with the industry partner.
                            <br/>
                            Please choose 'Update existing DSTMC' if yout MoU has been cancelled with the industry partner and you have onboarded a new industry partner.
                        </div>
                        <form onSubmit={handleSubmit}>
                            <h5>Select one of the following options to proceed</h5>

                            <div className="flex items-center my-4">
                                <input id="create" type="radio" value="create" name="DstMcOption"
                                       className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                       checked={selectedOption === "create"}
                                       onChange={onValueChange} />
                                <label htmlFor="create"
                                       className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Create DSTMC</label>
                            </div>
                            <div className="flex items-center mb-4">
                                <input id="cancel" type="radio" value="cancel" name="DstMcOption"
                                       className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                       checked={selectedOption === "cancel"}
                                       onChange={onValueChange} />
                                <label htmlFor="cancel"
                                       className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Cancel DSTMC</label>
                            </div>
                            <div className="flex items-center mb-4">
                                <input id="update" type="radio" value="update" name="DstMcOption"
                                       className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                       checked={selectedOption === "update"}
                                       onChange={onValueChange} />
                                <label htmlFor="update"
                                       className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Update Existing DSTMC</label>
                            </div>
                            <div className="flex items-center justify-center mt-10">
                                <button
                                    className="bg-teal-700 hover:bg-teal-500 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline"
                                    type="submit"
                                >
                                    Next
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default withNotify(withUser(withGoBack(DstMcOptions)));
