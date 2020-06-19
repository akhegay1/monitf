import React, { Fragment, useContext, useState, useEffect } from "react";
//import t from "./Hostnames.module.scss";
import appcontext from "../../appcontext";
//import axios from "axios";
import t from "./Hostnames.module.scss";
import a from "../../App.module.scss";
import cn from "classnames";
import axios from "axios";
import Alert from "../Alert/Alert";
import { ctimeout } from "../../params.js";
import { baseurl } from "../../params.js";

const urlupd = `${baseurl}hostnames/update`;
const urlins = `${baseurl}hostnames/create`;

function EditHostname(props) {
  const vappcontext = useContext(appcontext);
  const [hoststate, setHoststate] = useState({
    Id: vappcontext.vHostname.CurHostId,
    Hostname: "",
    Descr: "",
  });
  console.log("hoststate", hoststate);
  let [hostErr, setHostErr] = useState("");

  //props.pFetchHostnames().then((result) => vappcontext.pSetHosts(result.data));

  //console.log("hoststate " + JSON.stringify(hoststate));

  const fetchHostname = async () => {
    console.log("start fetchHostname");

    let url = `${baseurl}hostname?id=${hoststate.Id}`;

    const result = await axios(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      timeout: ctimeout,
    }).catch((error) => {
      console.log("fetchHostname " + error.message);
      return { data: [{ err: error.message }] };
    });

    console.log("result.data", result.data);
    if (!hoststate.Id) {
      result.data = { Id: "", Hostname: "", Descr: "" };
    }
    return result;
  };

  async function saveClick() {
    const oper = vappcontext.vState.CurFunc;
    if (oper === "edit") {
      let data = JSON.stringify({
        Id: vappcontext.vHostname.CurHostId,
        Hostname: hoststate.Hostname,
        Descr: hoststate.Descr,
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
          vappcontext.pSetHostname(
            response.data,
            hoststate.hostname,
            hoststate.descr
          );
          props
            .pFetchHostnames()
            .then((result) => vappcontext.pSetHosts(result.data));
          vappcontext.pSetState("hostname", "hostname", "list");
        })
        .catch((error) => {
          console.log(error.response.data);
          setHostErr(error.response.data);
        });
    } else if (oper === "insert") {
      let data = JSON.stringify({
        Hostname: hoststate.Hostname,
        Descr: hoststate.Descr,
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
          vappcontext.pSetHostname(
            response.data,
            hoststate.hostname,
            hoststate.descr
          );
          props
            .pFetchHostnames()
            .then((result) => vappcontext.pSetHosts(result.data));
          vappcontext.pSetState("hostname", "hostname", "list");
          console.log("aft ins");
        })
        .catch((error) => {
          console.log(error.response.data);
          setHostErr(error.response.data);
        });
    }
  }

  useEffect(() => {
    fetchHostname().then((result) => setHoststate(result.data));
  }, []);

  //console.log("hoststate sss", hoststate);
  return (
    <Fragment>
      {(() => {
        if (hostErr) {
          return (
            <Alert errmsg={hostErr} pSetParentErr={(p) => setHostErr(p)} />
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
              <td> Hostname </td>
              <td>
                <input
                  type="text"
                  value={hoststate.Hostname}
                  onChange={(event) => {
                    setHoststate({
                      ...hoststate,
                      Hostname: event.target.value,
                    });
                  }}
                />
              </td>
            </tr>
            <tr>
              <td> Descr </td>
              <td>
                <input
                  type="text"
                  value={hoststate.Descr}
                  onChange={(event) => {
                    setHoststate({
                      ...hoststate,
                      Descr: event.target.value,
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
          onClick={() => vappcontext.pSetState("hostname", "hostname", "list")}
        >
          Cancel
        </button>
      </div>
    </Fragment>
  );
}

export default EditHostname;
