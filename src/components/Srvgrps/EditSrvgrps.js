import React, { Fragment, useContext, useState, useEffect } from "react";
//import t from "./Srvgrps.module.scss";
import appcontext from "../../appcontext";
//import axios from "axios";
import t from "./Srvgrps.module.scss";
import a from "../../App.module.scss";
import cn from "classnames";
import axios from "axios";
import Alert from "../Alert/Alert";
import { ctimeout } from "../../params.js";
import { baseurl } from "../../params.js";

const urlupd = `${baseurl}srvgrps/update`;
const urlins = `${baseurl}srvgrps/create`;

function EditSrvgrps(props) {
  console.log("start EditSrvgrps");
  const vappcontext = useContext(appcontext);
  const [srvgrpstate, setSrvgrpstate] = useState({
    Id: vappcontext.vSrvgrp.CurSrvgrpId,
    Grpname: "",
  });

  let [srvgrpErr, setSrvgrpErr] = useState("");
  //props.pFetchSrvgrpnames().then((result) => vappcontext.pSetSrvgrps(result.data));

  const fetchSrvgrp = async () => {
    console.log("start fetchSrvgrp");

    let url = `${baseurl}srvgrp?id=${srvgrpstate.Id}`;

    const result = await axios(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      timeout: ctimeout,
    }).catch((error) => {
      console.log("fetchSrvgrp " + error.message);
      setSrvgrpErr(error.response.data);
      return { data: [{ err: error.message }] };
    });
    console.log("result.data", result.data);
    if (!srvgrpstate.Id) {
      result.data = { Id: "", Grpname: "" };
    }
    return result;
  };

  async function saveClick() {
    const oper = vappcontext.vState.CurFunc;
    if (oper === "edit") {
      let data = JSON.stringify({
        Id: vappcontext.vSrvgrp.CurSrvgrpId,
        Grpname: srvgrpstate.Grpname,
      });
      await axios
        .post(urlupd, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          timeout: ctimeout,
        })
        .then((response) => {
          console.log("response.data " + response.data);
          vappcontext.pSetSrvgrp(response.data, srvgrpstate.Grpname);
          props
            .pFetchSrvgrps()
            .then((result) => vappcontext.pSetSrvgrps(result.data));
          vappcontext.pSetState("srvgrps", "list");
        })
        .catch((error) => {
          console.log(error.response.data);
          setSrvgrpErr(error.response.data);
        });
    } else if (oper === "insert") {
      let data = JSON.stringify({
        Grpname: srvgrpstate.Grpname,
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
          vappcontext.pSetSrvgrp(response.data, srvgrpstate.Grpname);
          props
            .pFetchSrvgrps()
            .then((result) => vappcontext.pSetSrvgrps(result.data));
          vappcontext.pSetState("srvgrps", "list");
          console.log("aft ins");
        })
        .catch((error) => {
          setSrvgrpErr(error.response.data);
        });
    }
  }

  useEffect(() => {
    fetchSrvgrp().then((result) => setSrvgrpstate(result.data));
  }, []);

  return (
    <Fragment>
      {(() => {
        if (srvgrpErr) {
          return (
            <Alert errmsg={srvgrpErr} pSetParentErr={(p) => setSrvgrpErr(p)} />
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
              <td> Srvgrpname </td>
              <td>
                <input
                  type="text"
                  value={srvgrpstate.Grpname}
                  onChange={(event) => {
                    setSrvgrpstate({
                      ...srvgrpstate,
                      Grpname: event.target.value,
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
          onClick={() => vappcontext.pSetState("srvgrps", "list")}
        >
          Cancel
        </button>
      </div>
    </Fragment>
  );
}

export default EditSrvgrps;
