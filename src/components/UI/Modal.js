import React from "react";
import ReactDOM from "react-dom";

const Modal = (props) => {
  const overlay = (
    <div className={props.overlay} onClick={() => props.setShow(false)}></div>
  );
  const content = <div className={props.className}>{props.children}</div>;
  return (
    <>
      {ReactDOM.createPortal(overlay, document.getElementById("overlay"))}
      {ReactDOM.createPortal(content, document.getElementById("content"))}
    </>
  );
};

export default Modal;
