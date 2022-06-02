import React from "react";
import a from "./Alert.module.scss";
import b from "../../App.module.scss";
import cn from "classnames";

function Alert(props) {
  console.log("Alert");
  return (
    <div className={cn(b.flexcontainercenter, b.flexcontainer)}>
      <div className={a.alert}>
        <span
          className={a.closebtn}
          onClick={() => {
            props.pSetParentErr(); //при клике обнуляем текст ошибки в парент компоненте и он  перерисовывается уже без алерта
          }}
        >
          &times;
        </span>
        <strong>{props.errmsg}</strong>
      </div>
    </div>
  );
}

export default Alert;
