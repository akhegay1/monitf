import React, { Fragment, useContext, useState, useEffect } from "react";
//import t from "./Tmetrics.module.scss";
import appcontext from "../../appcontext";
//import axios from "axios";
import t from "./Tmetrics.module.scss";
import a from "../../App.module.scss";
import cn from "classnames";
import axios from "axios";
import Alert from "../Alert/Alert";
import { ctimeout } from "../../params.js";
import { baseurl } from "../../params.js";

const urlupd = `${baseurl}tmetrics/update`;
const urlins = `${baseurl}tmetrics/create`;

function EditTmetrics(props) {
  console.log("start EditTmetrics");
  const vappcontext = useContext(appcontext);
  const [tmetricstate, setTmetricstate] = useState({
    Id: vappcontext.vTmetric.CurTmetricId,
    Tname: "",
  });

  let [tmetricErr, setTmetricErr] = useState("");
  //props.pFetchTmetricnames().then((result) => vappcontext.pSetTmetrics(result.data));

  const fetchTmetric = async () => {
    console.log("start fetchTmetrcic");

    let url = `${baseurl}tmetric?id=${tmetricstate.Id}`;

    const result = await axios(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      timeout: ctimeout,
    }).catch((error) => {
      console.log("fetchTmetrcic " + error.message);
      setTmetricErr(error.response.data);
      return { data: [{ err: error.message }] };
    });
    console.log("result.data", result.data);
    if (!tmetricstate.Id) {
      result.data = { Id: "", Tname: "" };
    }
    return result;
  };

  async function saveClick() {
    const oper = vappcontext.vState.CurFunc;
    console.log("oper", oper);
    if (oper === "edit") {
      let data = JSON.stringify({
        Id: vappcontext.vTmetric.CurTmetricId,
        Tname: tmetricstate.Tname,
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
          vappcontext.pSetTmetric(response.data, tmetricstate.Tname);
          props
            .pFetchTmetrics()
            .then((result) => vappcontext.pSetTmetrics(result.data));
          vappcontext.pSetState("tmetrics", "list");
        })
        .catch((error) => {
          console.log(error.response.data);
          setTmetricErr(error.response.data);
        });
    } else if (oper === "insert") {
      let data = JSON.stringify({
        Tname: tmetricstate.Tname,
      });
      console.log("data AAA", data);
      await axios
        .post(urlins, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          timeout: ctimeout,
        })
        .then((response) => {
          console.log("response.data ins " + response.data);
          vappcontext.pSetTmetric(response.data, tmetricstate.Tname);
          props
            .pFetchTmetrics()
            .then((result) => vappcontext.pSetTmetrics(result.data));
          vappcontext.pSetState("tmetrics", "list");
          console.log("aft ins");
        })
        .catch((error) => {
          setTmetricErr(error.response.data);
        });
    }
  }

  useEffect(() => {
    fetchTmetric().then((result) => setTmetricstate(result.data));
  }, []);

  console.log("vappcontext.vState.CurFunc", vappcontext.vState.CurFunc);

  return (
    <Fragment>
      {(() => {
        if (tmetricErr) {
          return (
            <Alert
              errmsg={tmetricErr}
              pSetParentErr={(p) => setTmetricErr(p)}
            />
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
              <td> Tmetricname </td>
              <td>
                <input
                  type="text"
                  value={tmetricstate.Tname}
                  onChange={(event) => {
                    setTmetricstate({
                      ...tmetricstate,
                      Tname: event.target.value,
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
          onClick={() => vappcontext.pSetState("tmetrics", "list")}
        >
          Cancel
        </button>
      </div>
    </Fragment>
  );
}

export default EditTmetrics;
