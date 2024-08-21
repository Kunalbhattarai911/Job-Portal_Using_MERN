
export const logout = () => (dispatch) => {
    dispatch({ type: 'LOGOUT' }); // Assuming 'LOGOUT' clears the user state in your auth reducer
};