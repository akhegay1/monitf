import React from "react";
import a from "./AlertGreen.module.scss";
import b from "../../App.module.scss";
import cn from "classnames";

function AlertGreen(props) {
  console.log("AlertHGreen");
  return (
    <div className={cn(b.flexcontainercenter, b.flexcontainer)}>
      <div className={a.alert}>
        <span
          className={a.closebtn}
          onClick={() => {
            props.pSetParentMsg(); //при клике обнуляем текст msg в парент компоненте и он  перерисовывается уже без алерта
          }}
        >
          &times;
        </span>
        <strong>{props.okmsg}</strong>
      </div>
    </div>
  );
}

export default AlertGreen;
