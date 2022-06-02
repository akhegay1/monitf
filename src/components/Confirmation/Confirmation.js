import React from "react";
import b from "./Confirmation.module.scss";
import a from "../../App.module.scss";
import cn from "classnames";

function Confirmation(props) {
  console.log("Confirmation");
  return (
    <div
      className={cn(
        a.flexcontainercenter,
        a.flexcontainer,
        b.confirm,
        a.flexcntnrspacebtwen
      )}
    >
      <div>Are you sure?</div>
      <div className={cn(a.flexcontainercenter, a.flexcontainer)}>
        <button
          className={cn(a.btn, a.btnoper)}
          onClick={() => {
            props.pSetShowConfirm(false);
            props.pDelClick(true);
          }}
        >
          Ok
        </button>
        <button
          className={cn(a.btn, a.btnoper)}
          onClick={() => {
            props.pSetShowConfirm(false);
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default Confirmation;
