import React, { Fragment, useState } from "react";

//import axios from "axios";
import t from "./ChangeMyPwd.scss";
import a from "../../App.module.scss";
import cn from "classnames";
import axios from "axios";
import Alert from "../Alert/Alert";
import AlertGreen from "../AlertGreen/AlertGreen";
import { ctimeout, baseurl } from "../../params.js";

const urlupd = `${baseurl}changeMyPwd`;

function ChangeMyPwd() {
  const [msg, setMsg] = useState("");
  const [userErr, setUserErr] = useState("");
  const [newPwd1, setNewPwd1] = useState("");
  const [newPwd2, setNewPwd2] = useState("");

  async function saveClick() {
    const data = JSON.stringify({
      NewPwd1: newPwd1,
      NewPwd2: newPwd2,
    });
    console.log("access_token", localStorage.getItem("access_token"));
    await axios
      .post(urlupd, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        timeout: ctimeout,
      })
      .then((response) => {
        console.log("response.data " + response.data);
        setUserErr("");
        setMsg("Password changed");
      })
      .catch((error) => {
        console.log(error.response.data);
        setUserErr(error.response.data);
      });
  }

  //console.log("userstate sss", userstate);
  return (
    <Fragment>
      {(() => {
        if (userErr) {
          return (
            <Alert errmsg={userErr} pSetParentErr={(p) => setUserErr(p)} />
          );
        }
        if (msg) {
          return <AlertGreen okmsg={msg} pSetParentMsg={(p) => setMsg(p)} />;
        }
      })()}
      <div className={cn(t.flexcontainer, t.flexcontainercenter)}>
        <table className={a.tablerows}>
          <tbody>
            <tr>
              <td> New Password </td>
              <td>
                <input
                  type="password"
                  onChange={(event) => {
                    setNewPwd1(event.target.value);
                  }}
                />
              </td>
            </tr>

            <tr>
              <td> Confirm Password </td>
              <td>
                <input
                  type="password"
                  onChange={(event) => {
                    setNewPwd2(event.target.value);
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className={cn(a.flexcontainer, a.flexcontainerend)}>
        <button
          className={cn(a.btn, a.btnoper)}
          onClick={() => {
            saveClick();
          }}
        >
          Save
        </button>
      </div>
    </Fragment>
  );
}

export default ChangeMyPwd;
