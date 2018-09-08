import { TEST_DISPATCH } from './types';


//Register


export const registerUser = (userData) => {
  return {
    type: TEST_DISPATCH,
    payload: userData
  }
}