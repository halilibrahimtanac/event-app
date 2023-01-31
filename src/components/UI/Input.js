import React from "react";

const Input = (props) => {
  return (
    <div className={props.className}>
      {props.title ? (
        <label className="text-gray-600">{props.title}</label>
      ) : null}
      <input
        className={props.inputClass}
        name={props.inputName}
        type={props.inputType}
        onChange={(e) => props?.onChangeHandler(e)}
        value={props?.value}
      />
    </div>
  );
};

export default Input;
