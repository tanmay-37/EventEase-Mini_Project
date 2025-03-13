import React from 'react';
import login from "../../styles";


const Button = ({ type, userType, action, setAction }) => {
  return (
      <button
        type={type}
        className={action === userType ? login.loginBtnSelected : login.loginBtnNotSelected}
        onClick={() => setAction(userType)}
      >
        {userType}
      </button>
  );
};

export default Button;
