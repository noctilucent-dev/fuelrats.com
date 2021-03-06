import actionTypes from '../actionTypes'
import initialState from '../initialState'

import parseJSONAPIResponseForEntityType from '../../helpers/parseJSONAPIResponseForEntityType'





export default function ratsReducer (state = initialState.rats, action) {
  const {
    payload,
    status,
    type,
  } = action

  switch (type) {
    case actionTypes.GET_USER:
    case actionTypes.GET_RESCUE:
    case actionTypes.GET_RESCUES:
    case actionTypes.CREATE_RAT:
    case actionTypes.UPDATE_RAT:
    case actionTypes.UPDATE_RESCUE:
      if (status === 'success') {
        return {
          ...state,
          ...parseJSONAPIResponseForEntityType(payload, 'rats', true),
        }
      }
      break

    case actionTypes.DELETE_RAT:
      if (status === 'success') {
        const newState = { ...state }

        delete newState[action.ratId]

        return newState
      }
      break

    default:
      break
  }

  return state
}
