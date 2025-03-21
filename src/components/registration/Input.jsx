import React from 'react';
import styles from "../../styles";

const Input = ({ type, name, placeholder }) => {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      className={`${styles.input} relative z-1`}
    />
  );
};

export default Input;
