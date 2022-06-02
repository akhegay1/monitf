import React, { Fragment, useContext, useState, useEffect } from "react";
import appcontext from "../../appcontext";
//import axios from "axios";
import t from "./Users.module.scss";
import a from "../../App.module.scss";
import cn from "classnames";
import axios from "axios";
import Alert from "../Alert/Alert";
import { ctimeout } from "../../params.js";
import { baseurl } from "../../params.js";

const urlupd = `${baseurl}users/update`;
const urlins = `${baseurl}users/create`;

function EditUser(props) {
  const vappcontext = useContext(appcontext);
  const [userstate, setUserstate] = useState({
    Id: vappcontext.vUser.CurUserId,
    Fio: "",
    Username: "",
    Passw: "",
    DtStart: "",
  });
  console.log("userstate", userstate);
  let [userErr, setUserErr] = useState("");

  const fetchUser = async () => {
    console.log("start fetchUser");

    let url = `${baseurl}user?id=${userstate.Id}`;

    const result = await axios(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      timeout: ctimeout,
    }).catch((error) => {
      console.log("fetchUser " + error.message);
      setUserErr(error.response.data);
      return { data: [{ err: error.message }] };
    });

    console.log("result.data", result.data);
    if (!userstate.Id) {
      result.data = { Id: "", Fio: "", Username: "", DtStart: "" };
    }
    return result;
  };

  async function saveClick() {
    const oper = vappcontext.vState.CurFunc;

    if (oper === "edit") {
      let data = JSON.stringify({
        Id: vappcontext.vUser.CurUserId,
        Fio: userstate.Fio,
        Username: userstate.Username,
        Passw: userstate.Passw,
        DtStart: userstate.DtStart,
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
          vappcontext.pSetUser(
            response.data,
            userstate.Fio,
            userstate.Username,
            userstate.Passw,
            userstate.DtStart
          );
          props
            .pFetchUsers()
            .then((result) => vappcontext.pSetUsers(result.data));
          vappcontext.pSetState("users", "list");
        })
        .catch((error) => {
          console.log(error.response.data);
          setUserErr(error.response.data);
        });
    } else if (oper === "insert") {
      let data = JSON.stringify({
        Id: 0,
        Fio: userstate.Fio,
        Username: userstate.Username,
        Passw: userstate.Passw,
        DtStart: userstate.DtStart,
      });
      await axios
        .post(urlins, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          timeout: ctimeout,
        })
        .then((response) => {
          console.log("response.data ins " + response.data);
          vappcontext.pSetUser(
            response.data,
            userstate.Fio,
            userstate.Username,
            userstate.Passw,
            userstate.DtStart
          );
          props
            .pFetchUsers()
            .then((result) => vappcontext.pSetUsers(result.data));
          vappcontext.pSetState("users", "list");
          console.log("aft ins");
        })
        .catch((error) => {
          console.log(error.response.data);
          setUserErr(error.response.data);
        });
    }
  }

  useEffect(() => {
    fetchUser().then((result) => setUserstate(result.data));
  }, []);

  //console.log("userstate sss", userstate);
  return (
    <Fragment>
      {(() => {
        if (userErr) {
          return (
            <Alert errmsg={userErr} pSetParentErr={(p) => setUserErr(p)} />
          );
        }
      })()}
      <div className={cn(t.flexcontainer, t.flexcontainercenter)}>
        <table className={a.tablerows}>
          <thead>
            <tr className={a.headerrow}>
              <th>Name</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td> Fio </td>
              <td>
                <input
                  type="text"
                  value={userstate.Fio}
                  onChange={(event) => {
                    setUserstate({
                      ...userstate,
                      Fio: event.target.value,
                    });
                  }}
                />
              </td>
            </tr>
            <tr>
              <td> Username </td>
              <td>
                <input
                  type="text"
                  value={userstate.Username}
                  onChange={(event) => {
                    setUserstate({
                      ...userstate,
                      Username: event.target.value,
                    });
                  }}
                />
              </td>
            </tr>

            <tr>
              <td> Password </td>
              <td>
                <input
                  type="password"
                  value={userstate.Passw}
                  onChange={(event) => {
                    setUserstate({
                      ...userstate,
                      Passw: event.target.value,
                    });
                  }}
                />
              </td>
            </tr>

            <tr>
              <td> DtStart </td>
              <td>
                <input
                  type="datetime-local"
                  value={userstate.DtStart}
                  onChange={(event) => {
                    setUserstate({
                      ...userstate,
                      DtStart: event.target.value,
                    });
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
        <button
          className={cn(a.btn, a.btnoper)}
          onClick={() => vappcontext.pSetState("users", "list")}
        >
          Cancel
        </button>
      </div>
    </Fragment>
  );
}

export default EditUser;
