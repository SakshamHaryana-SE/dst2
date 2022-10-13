import React, { useState } from 'react';
import OTPInput, { ResendOTP } from 'otp-input-react';
import { browserHistory } from 'react-router';
import {onGoBack, storeUser, userLogout} from '../../common/globals';
import withGoBack from '../../redux/HOC/withGoBack';
import withUser from '../../redux/HOC/withUser';
import withNotify from '../../redux/HOC/withNotify';
import withLoader from '../../redux/HOC/withLoader';
import Header from '../Header';
import {ITIlogin, verifyOTP} from '../../utils/utils';
import {store} from "../../redux/store";
import {notifySet} from "../../redux/actions";
import { ResetPIN } from '../../utils/utils';
import {Field, Form} from "react-final-form";
import {renderField, required} from "../../helpers/form-validations";
import {APPLICATION_ID} from "../../common/config";

const ResetPassword = ({
               goBack, setGoBack, user, setNotify, setLoader, setUser,
             }) => {
  const [confirmPin, setConfirmPin] = useState('');
  const [newPin, setNewPin] = useState('');

  const onBack = () => {
    onGoBack(goBack);
  };

  const onSubmit = async (formData) => {
    if(formData.pin.length<4){
      store.dispatch(notifySet({
        type: 'error',
        message: 'PIN should be of 4 digit',
      }));
      return;
    }
    const reqData = {
      "loginId": formData.username,
      // "password": OTP,
      "password": formData.pin,
      "applicationId": APPLICATION_ID
    };
    setLoader(true);
    const Res = await ITIlogin(reqData);
    if(Res){
      const { responseCode, message, result } = Res;
      if (responseCode === 'OK') {
        setUser({ ...result.data });
        setNotify({ message: 'Login successfully', type: 'success' });
        goBack.push(window.location.pathname);
        setGoBack(goBack);
        browserHistory.push('/iti-welcome');
      } else {
        setNotify({ message: message || "can't login", type: 'error' });
      }
    }
    setLoader(false);
  };

  const onReset = async (formData) => {
    if(!user?.user?.user?.username || (formData.newPin && formData.newPin.length<4)){
      setNotify({ message: 'PIN should be of 4 digit', type: 'error' });
      return ;
    }
    if(formData.confirmPin !== formData.newPin){
      setNotify({ message: 'PIN do not match', type: 'error' });
      return ;
    }
    const reqData = {
      loginId: user?.user?.user?.username,
      password: formData.newPin,
    };
    ResetPIN(reqData).then((res) => {
      if(res.msg === "Password changed successfully"){
        setNotify({ message: res?.msg || 'PIN Changed successfully', type: 'success' });
        userLogout();
        // browserHistory.push('/iti-login');
      }else{
        setNotify({ message: res.message || 'error occured', type: 'error' });
      }
    });
    setLoader(false);
  };

  return (
      <div>
        <Header />
        <div className="m-10 font-bold text-xl text-teal-800 text-center">
          <h2 className="header-text-color">Reset Password</h2>
        </div>
        <div className="flex justify-center items-center">
          <Form
              onSubmit={onReset}
              render={({ handleSubmit }) => (
                  <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div className="mb-4">
                      <label className="block text-teal-700 text-sm font-bold mb-2" htmlFor="newPin">
                        Enter New PIN
                      </label>
                      <Field
                          className="shadow appearance-none border border-teal-600 rounded w-full py-2 px-3 text-teal-700 leading-tight focus:outline-none focus:shadow-outline"
                          name="newPin"
                          type="password"
                          id="newPin"
                          validate={required}
                      >
                        {renderField}
                      </Field>
                    </div>
                    <div className="mb-4">
                      <label className="block text-teal-700 text-sm font-bold mb-2" htmlFor="confirmPin">
                        Confirm New PIN
                      </label>
                      <Field
                          className="shadow appearance-none border border-teal-600 rounded w-full py-2 px-3 text-teal-700 leading-tight focus:outline-none focus:shadow-outline"
                          name="confirmPin"
                          type="password"
                          id="confirmPin"
                          validate={required}
                      >
                        {renderField}
                      </Field>
                    </div>
                    <div className="py-10 flex item-center justify-around">
                      <button
                          onClick={onBack}
                          className="bg-teal-700 hover:bg-teal-500 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline flex-1"
                          type="button"
                      >
                        Go Back
                      </button>
                      <span className="w-5"></span>
                      <button
                          type="submit"
                          className="bg-teal-700 hover:bg-teal-500 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline flex-1"
                      >
                        Reset
                      </button>
                    </div>
                  </form>
              )}
          />
        </div>
      </div>
  );
};
export default withNotify(withLoader(withUser(withGoBack(ResetPassword))));
