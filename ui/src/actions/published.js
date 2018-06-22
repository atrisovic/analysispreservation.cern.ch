import axios from 'axios';
import { replace } from 'react-router-redux';

export const PUBLISHED_REQUEST = 'PUBLISHED_REQUEST';
export const PUBLISHED_SUCCESS = 'PUBLISHED_SUCCESS';
export const PUBLISHED_ERROR = 'PUBLISHED_ERROR';

export const PUBLISHED_ITEM_REQUEST = 'PUBLISHED_ITEM_REQUEST';
export const PUBLISHED_ITEM_SUCCESS = 'PUBLISHED_ITEM_SUCCESS';
export const PUBLISHED_ITEM_ERROR = 'PUBLISHED_ITEM_ERROR';

export const RERUN_PUBLISHED_REQUEST = 'RERUN_PUBLISHED_REQUEST';
export const RERUN_PUBLISHED_SUCCESS = 'RERUN_PUBLISHED_SUCCESS';
export const RERUN_PUBLISHED_ERROR = 'RERUN_PUBLISHED_ERROR';

export const RERUN_STATUS_REQUEST = 'RERUN_STATUS_REQUEST';
export const RERUN_STATUS_SUCCESS = 'RERUN_STATUS_SUCCESS';
export const RERUN_STATUS_ERROR = 'RERUN_STATUS_ERROR';

export const RERUN_OUTPUTS_REQUEST = 'RERUN_OUTPUTS_REQUEST';
export const RERUN_OUTPUTS_SUCCESS = 'RERUN_OUTPUTS_SUCCESS';
export const RERUN_OUTPUTS_ERROR = 'RERUN_OUTPUTS_ERROR';

export function publishedRequest(){
  return {
    type: PUBLISHED_REQUEST
  };
}

export function publishedSuccess(published) {
  return {
    type: PUBLISHED_SUCCESS,
    published
  };
}

export function publishedError(error) {
  return {
    type: PUBLISHED_ERROR,
    error
  };
}

export function publishedItemRequest(){
  return {
    type: PUBLISHED_ITEM_REQUEST
  };
}

export function publishedItemSuccess(published) {
  return {
    type: PUBLISHED_ITEM_SUCCESS,
    published
  };
}

export function publishedItemError(error) {
  return {
    type: PUBLISHED_ITEM_ERROR,
    error
  };
}

export function rerunPublishedRequest() {
  return {
    type: RERUN_PUBLISHED_REQUEST
  };
}

export function rerunPublishedSuccess(data) {
  return {
    type: RERUN_PUBLISHED_SUCCESS,
    data
  };
}

export function rerunPublishedError(error) {
  return {
    type: RERUN_PUBLISHED_ERROR,
    error
  };
}

export function rerunStatusRequest() {
  return {
    type: RERUN_STATUS_REQUEST
  };
}

export function rerunStatusSuccess(data) {
  return {
    type: RERUN_STATUS_SUCCESS,
    data
  };
}

export function rerunStatusError(error) {
  return {
    type: RERUN_STATUS_ERROR,
    error
  };
}

export function rerunOutputsRequest() {
  return {
    type: RERUN_OUTPUTS_REQUEST
  };
}

export function rerunOutputsSuccess(data) {
  return {
    type: RERUN_OUTPUTS_SUCCESS,
    data
  };
}

export function rerunOutputsError(error) {
  return {
    type: RERUN_OUTPUTS_ERROR,
    error
  };
}

export function getPublished() {
  return function (dispatch) {
    dispatch(publishedRequest());

    let uri = '/api/records/';
    axios.get(uri)
      .then(function (response) {
        dispatch(publishedSuccess(response.data));
      })
      .catch(function (error) {
        dispatch(publishedError(error));
      });
  };
}

export function getPublishedItem(id) {
  return function (dispatch) {
    dispatch(publishedItemRequest());

    let uri = `/api/records/${id}`;
    axios.get(uri)
      .then(function (response) {
        dispatch(publishedItemSuccess(response.data));
      })
      .catch(function (error) {
        dispatch(publishedItemError(error.response.data));
      });
  };
}

export function rerunPublished(workflow_id, pid) {
  return function (dispatch) {
    dispatch(rerunPublishedRequest());

    let uri = `/api/reana/start/${workflow_id}`;
    
    axios.get(uri)
      .then(function (response) {
        dispatch(rerunPublishedSuccess(response.data));
        dispatch(replace(`/published/${pid}/status/${workflow_id}`));
      })
      .catch(function (error) {
        dispatch(rerunPublishedSuccess(error));
      });
  };
}


export function getAnalysisStatus(workflow_id) {
  return function (dispatch) {
    dispatch(rerunStatusRequest());

    let uri = `/api/reana/status/${workflow_id}`

    axios.get(uri)
      .then(function (response) {
        dispatch(rerunStatusSuccess(response.data));
      })
      .catch(function (error) {
        dispatch(rerunStatusError(error));
      });
  };
}

export function getAnalysisOutputs(workflow_id) {
  return function (dispatch) {
    dispatch(rerunOutputsRequest());

    let uri = `/api/reana/status/${workflow_id}/outputs`

    axios.get(uri)
      .then(function (response) {
        dispatch(rerunOutputsSuccess(response.data));
      })
      .catch(function (error) {
        dispatch(rerunOutputsError(error));
      });
  };
}
