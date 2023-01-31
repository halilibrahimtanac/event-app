import React from "react";
import Modal from "./Modal";

const Dialog = (props) => {
  return (
    <Modal
      className={props.className}
      overlay={props.overlay}
      setShow={props.showHandler}
    >
      <div className="w-full h-[20vh] relative flex flex-col justify-between text-center">
        <h1 className="text-2xl font-bold">{props.title}</h1>

        <div className="w-full h-auto relative flex justify-between">
          <button
            className="w-[10vh] bg-green-300 text-white rounded-md p-1"
            onClick={props.onClickHandler}
          >
            OK
          </button>
          <button
            className="w-[10vh] bg-red-300 text-white rounded-md p-1"
            onClick={props.showHandler}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default Dialog;
