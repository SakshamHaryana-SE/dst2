import base64 from 'base-64';
import { OTP_API_URL, HTTP_BASIC_USER, HTTP_BASIC_PASS, API_KEY, HASURA_QUERY_URL, API_BASE_URL, APPLICATION_ID } from '../common/config';
import { store } from '../redux/store';
import { loaderSet, notifySet, userSet } from '../redux/actions';
import { queryString, userLogout } from '../common/globals';
import moment from "moment";


const validateResponse = async (response) => {
  const apiRes = await response.json();
  const jsonResponse = {
    ...apiRes,
    responseStatus: false,
  };
  /*const { resp: { params: { status, errMsg } } } = jsonResponse;
  if (status === 'Success') {
    const { resp: { result: { responseMsg } } } = jsonResponse;
    jsonResponse.responseStatus = true;
    jsonResponse.message = responseMsg;
  } else {
    jsonResponse.responseStatus = false;
    jsonResponse.message = errMsg;
  }*/
  return jsonResponse;
};

const handleNetworkError = async (responseError) => {
  if (responseError.name !== 'AbortError') {
    store.dispatch(loaderSet(false));
    store.dispatch(notifySet({
      type: 'error',
      message: 'Network request error. Please try again.',
    }));
  }
};


const generateHasuraAPI = async (query) => {
  if (store.getState().user?.user?.tokenExpirationInstant < +new Date()) {
    const reqData = {
      "token": store.getState().user?.user?.token,
      "refreshToken": store.getState().user?.user?.refreshToken
    };
    try {
      await RefreshToken(reqData);
    }
    catch (e) {
      return userLogout();
    }
  }

  return fetch(HASURA_QUERY_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${store.getState().user?.user?.token || process.env.NODE_ENV == "production" ? "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdzYzBfNEtXLXVUVVY4bFh6ZWl2X0R0T1BTUSJ9.eyJhdWQiOiI4OTI0ZDZjNS1kZTMzLTRiNDYtOTllMi05ZDc1MDJmNzI5MzYiLCJleHAiOjIwMDg1MzI5NTAsImlhdCI6MTY0ODUzMjk1MCwiaXNzIjoiYWNtZS5jb20iLCJzdWIiOiJkODFiMTI3MS04MzE4LTQ5OWEtOGRkOS0xMTYzOTBlM2E3YWIiLCJqdGkiOiJjMjg5NzUzYy1lOTAxLTRjOTEtOGNhZi1mMjRjYTg2NzhhMTIiLCJhdXRoZW50aWNhdGlvblR5cGUiOiJQQVNTV09SRCIsInByZWZlcnJlZF91c2VybmFtZSI6IkRTVC1TdWJtaXQtQXR0ZW5kYW5jZSIsImFwcGxpY2F0aW9uSWQiOiI4OTI0ZDZjNS1kZTMzLTRiNDYtOTllMi05ZDc1MDJmNzI5MzYiLCJyb2xlcyI6W10sImh0dHBzOi8vaGFzdXJhLmlvL2p3dC9jbGFpbXMiOnsieC1oYXN1cmEtYWxsb3dlZC1yb2xlcyI6WyJzdWJtaXQtYXR0ZW5kYW5jZSJdLCJ4LWhhc3VyYS1kZWZhdWx0LXJvbGUiOiJzdWJtaXQtYXR0ZW5kYW5jZSJ9fQ.REjnbQyA-KFfWx0m_Jnoa9c5to99ILvYWsYVPvrQ_8-rSth6tJjeBKoVAU4BRHeMEeqEMPOxSDa_1UGioRtuqC_y5XWxqRSwaI4wrhMkD9MzBLkfCiKaSBUn3VG1zZoE80ja2FHVSn_VJubT-h4UXqCQ5CrMGLVGrds5j44WAxR3k-CafcVFSrtDIacez94iZ6d2V7AKSJRz5jxl-R3OSgHNaN5hi-5j5ODpQPcVr72kmWcdp33SILaXlVh7k9DTzHRbDqGrxPXuB_cScyqw07iPrbymwOPxed5r3Fq12rhHqHSWJIyu7tRf_rRW7PZzev5RCtN2IRXcXYj3iTTvvQ" : 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InVGRnE4dHU5aEdxaXpUOHk2QzY1U3hKbGd4YyJ9.eyJhdWQiOiI4OTI0ZDZjNS1kZTMzLTRiNDYtOTllMi05ZDc1MDJmNzI5MzYiLCJleHAiOjIwMjUyMTkwOTEsImlhdCI6MTY2NTIxOTA5MSwiaXNzIjoiYWNtZS5jb20iLCJzdWIiOiJkODFiMTI3MS04MzE4LTQ5OWEtOGRkOS0xMTYzOTBlM2E3YWIiLCJqdGkiOiJmOTBmNjQwNi04YzRkLTRkYzUtYWM4ZS1jMDBiMjA4ZjBlYzUiLCJhdXRoZW50aWNhdGlvblR5cGUiOiJQQVNTV09SRCIsInByZWZlcnJlZF91c2VybmFtZSI6IkRTVC1TdWJtaXQtQXR0ZW5kYW5jZSIsImFwcGxpY2F0aW9uSWQiOiI4OTI0ZDZjNS1kZTMzLTRiNDYtOTllMi05ZDc1MDJmNzI5MzYiLCJyb2xlcyI6W10sImF1dGhfdGltZSI6MTY2NTIxOTA5MSwidGlkIjoiYTcxMzdkZWQtNmY1NS0xMGE4LTZmNWItZjc2ZGJkNzlhZTYwIiwiaHR0cHM6Ly9oYXN1cmEuaW8vand0L2NsYWltcyI6eyJ4LWhhc3VyYS1hbGxvd2VkLXJvbGVzIjpbInN1Ym1pdC1hdHRlbmRhbmNlIiwiSVRJIl0sIngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6InN1Ym1pdC1hdHRlbmRhbmNlIn19.Hc5N68Vx6AC-nI3yPBlALHWqUQ0RlkYXfPByjSoAB0Yw3MJuIFnIs1WY44zgoXl_9BFb0i__JwTWDlvwOlkme23ryyeghRMHHWntYeziK5OG9scm3AH8vVz1hMGEbNixRrWY1Gobb54zDqxz_hlzUhM817wG7X0cht3lzaa-2V1meUKqscsDugQLMzkEtBBMU6NmuzGceSDUXArgFOHawXQSjeJ098SgrJ5HJ_6u7tYCXK8fSLfxMuyf4mgKAIwYZxtKxp3wFqiBzk2CNixVdmi7yXK21QJnmDI99jaBhy4l_Ph1MNLPnZaS3BorRozPZ8cCAaxHuOPhKjXEADEnVw'}`,
    },
    body: JSON.stringify(query)
  }).then(async (response) => await validateResponse(response))
    .catch((error) => handleNetworkError(error));
};

export const RefreshToken = async (data) => {
  const res = await fetch(`${API_BASE_URL}/refresh-token`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: API_KEY,
      "x-application-id": APPLICATION_ID
    },
    body: JSON.stringify(data)
  });
  const { result: { user } } = await validateResponse(res);
  if (user.token) {
    const localUser = store.getState().user;
    localUser.user.token = user.token;
    localUser.user.refreshToken = user.refreshToken;
    localUser.user.tokenExpirationInstant = user.tokenExpirationInstant;
    store.dispatch(userSet(localUser));
  } else {
    throw new Error('unable to set new token');
  }
};

export const sendOTP = async (data) => fetch(`${OTP_API_URL}/dst/sendOTP?${queryString(data)}`, {
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Basic ${base64.encode(`${HTTP_BASIC_USER}:${HTTP_BASIC_PASS}`)}`,
  },
}).then(async (response) => await validateResponse(response))
  .catch((error) => handleNetworkError(error));

export const verifyOTP = async (data) => fetch(`${OTP_API_URL}/dst/verifyOTP?${queryString(data)}`, {
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Basic ${base64.encode(`${HTTP_BASIC_USER}:${HTTP_BASIC_PASS}`)}`,
  },
}).then(async (response) => await validateResponse(response))
  .catch((error) => handleNetworkError(error));

export const ITIlogin = (data) => fetch(`${API_BASE_URL}/login/pin`, {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    // Authorization: `Basic ${base64.encode(`${HTTP_BASIC_USER}:${HTTP_BASIC_PASS}`)}`,
    Authorization: API_KEY,
  },
  body: JSON.stringify(data)
}).then(async (response) => await validateResponse(response))
  .catch((error) => handleNetworkError(error));

export const ResetPIN = (data) => fetch(`${API_BASE_URL}/changePin`, {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: API_KEY,
    "x-application-id": APPLICATION_ID
  },
  body: JSON.stringify(data)
}).then(async (response) => await validateResponse(response))
  .catch((error) => handleNetworkError(error));



export const getAcademicCalendarLinks = (data) => {
  const query = {
    query: `query MyQuery($name: String) {
      iti_academic_calendar_link(where: {iti: {name: {_eq: $name}}}, limit: 1) {
        calendar_link
        id
        created_at
      }
    }`,
    "variables": { name: data.itiName }
  };
  return generateHasuraAPI(query);
};

export const getLoggedInITIDetails = (data) => {
  const query = {
    query: `query MyQuery($name: String) {
      principal(where: {iti: {_eq: $name}}, limit: 1) {
        principal_name
        iti
        email_id
        district
        contact_number
      }
    }`,
    "variables": { name: data.itiName }
  };
  return generateHasuraAPI(query);
};

export const getITIsList = () => {
  const query = {
    query: `query {
      iti {
        id
        name
        district
        latitude
        longitude
      }
    }`
  };
  return generateHasuraAPI(query);
};

export const getIndustriesList = () => {
  const query = {
    query: `query {
      industry {
        id
        name
        district
      }
    }`
  };
  return generateHasuraAPI(query);
};

export const createDstMc = (data) => {
  const query = {
    query: `mutation create_dst_mc_meeting($objects: [dst_mc_meeting_insert_input!] = {}) {
      insert_dst_mc_meeting(objects: $objects) {
        returning {
          id
        }
      }
    }`,
    "variables": { objects: data }
  };
  return generateHasuraAPI(query);
};

//todo: need to test this api
export const updateDstMc = (data) => {
  const query = {
    query: `mutation MyMutation($id: bigint = "", $industry_id: Int = 10) {
      update_dst_mc_meeting_by_pk(pk_columns: {id: $id}, _set: {industry_id: $industry_id}) {
        industry_id
        id
      }
    }`,
    "variables": { id: data.id, industry_id: data.industryId }
  };
  return generateHasuraAPI(query);
};

export const deleteDstMc = (data) => {
  const query = {
    query: `mutation ($id: String) {
      delete_dst_mc_meeting_by_pk(id: $id) {
        id
      }
    }`,
    "variables": { id: data.id }
  };
  return generateHasuraAPI(query);
};

//todo: need to test these filtered apis
export const getFilteredTrades = (data) => {
  const query = {
    query: `query ($iti_id: Int) {
      dst_mc_meeting(where: {iti_id: {_eq: $iti_id}, deleted_at: {_is_null: true}}) {
        id
        district
        iti_id
        iti {
          id
          name
        }
        industry {
          id
          name
          district
        }
        batch
        trade
      }
    }`,
    "variables": { iti_id: data.itiId }
  };
  return generateHasuraAPI(query);
};

export const getFilteredBatch = (data) => {
  const query = {
    query: `query ($iti_id: Int, $trade: String) {
      dst_mc_meeting(where: {iti_id: {_eq: $iti_id}, trade: {_eq: $trade}, deleted_at: {_is_null: true}}) {
        id
        district
        iti_id
        iti {
          id
          name
        }
        industry {
          id
          name
          district
        }
        batch
        trade
      }
    }`,
    "variables": { iti_id: data.itiId, trade: data.trade }
  };
  return generateHasuraAPI(query);
};

export const getFilteredIndustry = (data) => {
  const query = {
    query: `query ($iti_id: Int, $trade: String, $batch: String) {
      dst_mc_meeting(where: {iti_id: {_eq: $iti_id}, trade: {_eq: $trade}, batch: {_eq: $batch}, deleted_at: {_is_null: true}}) {
        id
        district
        iti_id
        iti {
          id
          name
        }
        industry {
          id
          name
          district
        }
        batch
        trade
      }
    }`,
    "variables": { iti_id: data.itiId, trade: data.trade, batch: data.batch }
  };
  return generateHasuraAPI(query);
};

export const getFilteredDSTData = (data) => {
  const query = {
    query: `query ($iti_id: Int, $trade: String, $batch: String, $industry_id: Int) {
      dst_mc_meeting(where: {iti_id: {_eq: $iti_id}, trade: {_eq: $trade}, batch: {_eq: $batch}, industry_id: {_eq: $industry_id}, deleted_at: {_is_null: true}}) {
        id
        district
        iti_id
        iti {
          id
          name
        }
        industry {
          id
          name
          district
        }
        batch
        trade
      }
    }`,
    "variables": { iti_id: data.itiId, trade: data.trade, batch: data.batch, industry_id: data.industryId }
  };
  return generateHasuraAPI(query);
};

export const createNewIndustry = (name, district) => {

  const query = {
    query: `mutation InsertIndustry($name: String = "", $latitude: Float = 0.0, $longitude: Float = 0.0, $district: String = "", $added_by_form: Boolean = true) {
  insert_industry_one(object: {name: $name, latitude: $latitude, longitude: $longitude, district: $district, added_by_form: $added_by_form}) {
    id
    name
  }
}`,
    "variables": { name, district }
  };
  return generateHasuraAPI(query);
};

export const updateDataRelativeToIndustryId = (data, industry, a) => {
  const obj = {
    id: parseInt(a),
    industry_id: industry?.id,
    trainer_name: data.trainer_name,
    trainer_email: data.trainer_email,
    trainer_contact: data.trainer_contact,
    head_name: data.head_name,
    head_email: data.head_email,
    head_contact: data.head_Contact,
    sup_name: data.sup_name,
    sup_email: data.sup_email,
    sup_contact: data.sup_Contact
  };
  const query = {
    query: `mutation MyMutation($id: bigint = "", $industry_id: Int, $trainer_name: String, $trainer_email: String, $trainer_contact: String, $head_name: String, $head_email: String, $head_contact: String, $sup_name: String, $sup_email: String, $sup_contact: String) {
  update_dst_mc_meeting_by_pk(pk_columns: {id: $id}, _set: {industry_id: $industry_id, trainer_name: $trainer_name, trainer_email: $trainer_email, trainer_contact: $trainer_contact, head_name: $head_name, head_email: $head_email, head_contact: $head_contact, sup_name: $sup_name, sup_email: $sup_email, sup_contact: $sup_contact}) {
       industry_id
    id
    head_name
    head_email
    head_contact
    district
    deleted_at
    created_at
    batch
    instance_id
    iti_id
    mc_information_count
    mc_number
    note
    sup_contact
    sup_email
    sup_name
    trade
    trainer_contact
    trainer_email
    trainer_name
    updated_at
  }
}`,
    "variables": obj
  };
  return generateHasuraAPI(query);
};

export const updateFileUrl = (url, a, t) => {

  const obj = {
    dst_mc_meeting_id: parseInt(a),
    type: t,
    file_url: url,
    old_data_json: {},
    new_data_json: {}
  };
  const query = {
    query: `mutation UploadDocument($dst_mc_meeting_id: bigint, $type: String, $file_url: String, $new_data_json: jsonb = "{}", $old_data_json: jsonb = "{}") {
  insert_dst_mc_meeting_uploads_one(object: {dst_mc_meeting_id: $dst_mc_meeting_id, type: $type, file_url: $file_url, new_data_json: $new_data_json, old_data_json: $old_data_json}) {
    id
    dst_mc_meeting_id
    type
    file_url
    created_at
    updated_at
  }
}`,
    "variables": obj
  };
  return generateHasuraAPI(query);
};
export const cancelDSTMC = (data, a) => {
  const localtime = moment().format("YYYY-MM-DD h:mm:ss");
  const obj = {
    id: parseInt(a),
    deleted_at: localtime
  };
  const query = {
    query: `mutation MyMutation($id: bigint!, $deleted_at: timestamptz) {
  update_dst_mc_meeting_by_pk(pk_columns: {id: $id}, _set: {deleted_at: $deleted_at}) {
    industry_id
    id
    head_name
    head_email
    head_contact
    district
    deleted_at
    created_at
    batch
    instance_id
    iti_id
    mc_information_count
    mc_number
    note
    sup_contact
    sup_email
    sup_name
    trade
    trainer_contact
    trainer_email
    trainer_name
    updated_at
    deleted_at
  }
}`,
    "variables": obj
  };
  return generateHasuraAPI(query);
};

export const getTraineeAttendance = (data) => {
  const query = {
    query: `query ($trainee_id: Int, $start_date: date, $end_date: date, $limit: Int, $offset: Int) {
      attendance(where: {trainee_id: {_eq: $trainee_id}, _and: {date: {_gte: $start_date}, _and: {date: {_lte: $end_date}}}}, order_by: {date: desc}, limit: $limit, offset: $offset) {
        date,
        is_present
      }
    }`,
    "variables": {
      trainee_id: data.trainee_id,
      start_date: data.start_date,
      end_date: data.end_date,
      limit: data.limit,
      offset: data.offset
    }
  };
  return generateHasuraAPI(query);
};

export const getIndustryDetails = (id) => {
  const query = {
    query: `query ($id: Int) {
      industry(where: {id: {_eq: $id}}) {
        id
        district
        latitude
        longitude
        name
      }
    }`,
    "variables": { id: id }
  };
  return generateHasuraAPI(query);
};

export const getOjtAttendanceDetails = (data) => {
  const query = {
    query: `query ($batch: String, $iti: Int, $industry: Int, $tradeName: String, $fromDt: date, $toDt: date) {
      q1: trainee(where: {batch: {_eq: $batch}, iti: {_eq: $iti}, industry: {_eq: $industry}, tradeName: {_ilike: $tradeName}}) {
        id
        name
        registrationNumber
        industry
        iti
         attendances_aggregate(where: {is_present: {_eq: true}, date: {_gte: $fromDt, _lte: $toDt}}) {
          aggregate {
            count(columns: is_present)
          }
        }
      }
      q2: trainee(where: {batch: {_eq: $batch}, iti: {_eq: $iti}, industry: {_eq: $industry}, tradeName: {_ilike: $tradeName}}) {
         attendances_aggregate(where: {date: {_gte: $fromDt, _lte: $toDt}}) {
          aggregate {
            count(columns: is_present)
          }
        }
      }
    }
    
    `,
    "variables": { batch: data.batch, iti: data.iti, industry: data.industry, tradeName: data.tradeName, fromDt: data.fromDt, toDt: data.toDt }
  };
  return generateHasuraAPI(query);
};

export const getOptionsForOjtAttendance = (iti_id) => {
  const query = {
    query: `
    query ($iti_id: Int) {
      iti_industry_trade_batch_mapping(where: {iti_id: {_eq: $iti_id}}) {
        batch
        trade
        industry {
          attendances_aggregate {
            aggregate {
              count(columns: is_present)
            }
          }
          id
          name
        }
      }
    }
    `,
    "variables": { iti_id: iti_id }
  };
  return generateHasuraAPI(query);
};