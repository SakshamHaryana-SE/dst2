import { useEffect, useState } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/solid';
import GoH from '../images/GoH-Transparent.png';
import haryanaLogo from '../images/SDIT-Haryana.png';
import withUser from '../redux/HOC/withUser';
import { userLogout, getUser } from '../common/globals';

const Header = ({
  title = '', onBackButton = '',
}) => {
  const [user, setUser] = useState({});
  useEffect(() => {
    getUser().then((data) => {
      setUser(data);
    });
  }, []);
  return (
    <div className="sticky top-0 z-50">
      <div className="flex flex-row h-15 w-full bg-teal-700 text-white text-center justify-center">
        <div
          className="w-1/6 self-center pl-2"
          onClick={onBackButton === '' ? () => {
          } : onBackButton}
        >
          {
            onBackButton && <ArrowLeftIcon className="w-7 h-7 cursor-pointer" aria-hidden="true" />
          }
        </div>
        <div className="grow self-center">
          {
            title !== '' && <span className="text-2xl" aria-hidden="true">{title}</span>
          }
        </div>
        <div className="w-1/6 self-center pr-2"> {
          (user !== undefined && user !== null && Object.keys(user).length > 0)
          && (
            <button
              onClick={() => userLogout()}
              type="button"
              className="bg-teal-800 text-white px-5 py-3 text-lg w-auto"
            >
              Logout
            </button>
          )
        }</div>
      </div>
      <div className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div
            className="flex justify-between items-center border-b-2 border-gray-100 py-6 md:space-x-10"
          >
            <div className="flex justify-start">
              <span className="sr-only">Workflow</span>
              <img
                className="h-8 w-auto sm:h-10"
                src={haryanaLogo}
                alt=""
              />
            </div>
            <div className="font-bold text-xl text-center text-teal-700 w-100">
              Dual System of Training (DST)
            </div>
            <div
              className="flex justify-end space-x-4"
            >
              <img
                className="h-14 w-auto sm:h-14"
                src={GoH}
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default withUser(Header);
