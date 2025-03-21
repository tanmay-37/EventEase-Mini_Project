import React from 'react';
import login from "../../styles";


const Button = ({action}) => {
  return (
      <button
        type="submit"
        className={login.loginBtnSelected }
      >
        {action}
      </button>
  );
};

export default Button;
