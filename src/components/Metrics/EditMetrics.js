import React, { Fragment, useContext, useState, useEffect } from "react";
//import t from "./Metrics.module.scss";
import appcontext from "../../appcontext";
//import axios from "axios";
import m from "./Metrics.module.scss";
import a from "../../App.module.scss";
import cn from "classnames";
import axios from "axios";
import Alert from "../Alert/Alert";
import { ctimeout } from "../../params.js";
import { baseurl } from "../../params.js";

const urlupd = `${baseurl}metrics/update`;
const urlins = `${baseurl}metrics/create`;
//222
function EditMetric(props) {
  const vappcontext = useContext(appcontext);

  const [shosts, setShosts] = useState([]);
  const [metricErr, setMetricErr] = useState("");

  const fetchSHostnames = async () => {
    const url = `${baseurl}shostnames`;
    const result = await axios(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      timeout: ctimeout,
    }).catch((error) => {
      console.log("fetchSHostnames " + error.message);
      setMetricErr(error.response.data);
      return { data: [{ err: error.message }] };
    });
    return result;
  };

  const [stmetrics, setStmetrics] = useState([]);
  const fetchSTmetrics = async () => {
    const url = `${baseurl}stmetrics`;
    const result = await axios(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      timeout: ctimeout,
    }).catch((error) => {
      console.log("fetchSTmetrics " + error.message);
      setMetricErr(error.response.data);
      return { data: [{ err: error.message }] };
    });
    return result;
  };

  const [metricstate, setMetricstate] = useState({
    Id: vappcontext.vMetric.CurMetricId,
    Hid: "",
    Port: "",
    Tid: "",
    Mname: "",
    Action: "",
    Descr: "",
    Warning: "",
    Error: "",
    Dbsid: "",
    Username: "",
    Password: "",
    Startm: false,
    Intrvlnotcrucialhrs: "",
    Tresholdismin: false,
  });

  const fetchMetric = async () => {
    console.log("start fetchMetric");

    const url = `${baseurl}metric?id=${metricstate.Id}`;

    const result = await axios(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      timeout: ctimeout,
    }).catch((error) => {
      console.log("fetchMetric " + error.message);
      setMetricErr(error.response.data);
      return { data: [{ err: error.message }] };
    });
    console.log("result.data", result.data);
    if (!metricstate.Id) {
      result.data = {
        Id: "",
        Hid: "",
        Port: "",
        Tid: "",
        Mname: "",
        Action: "",
        Descr: "",
        Warning: "",
        Error: "",
        Dbsid: "",
        Username: "",
        Password: "",
        Startm: false,
        Intrvlnotcrucialhrs: "",
        Tresholdismin: false,
      };
    }
    return result;
  };

  async function saveClick() {
    console.log(
      "saveClick metricstate.Tresholdismin",
      metricstate.Tresholdismin
    );
    const oper = vappcontext.vState.CurFunc;
    console.log("metricstate.Startm" + metricstate.Startm);
    if (oper === "edit") {
      const data = JSON.stringify({
        Id: vappcontext.vMetric.CurMetricId,
        Hid: parseInt(metricstate.Hid),
        Hostname: metricstate.Hostname,
        Port: parseInt(metricstate.Port),
        Tid: parseInt(metricstate.Tid),
        Tmetric: metricstate.Tmetric,
        Action: metricstate.Action,
        Descr: metricstate.Descr,
        Warning: parseFloat(metricstate.Warning),
        Error: parseFloat(metricstate.Error),
        Dbsid: metricstate.Dbsid,
        Username: metricstate.Username,
        Password: metricstate.Password,
        Startm: metricstate.Startm,
        Intrvlnotcrucialhrs: parseInt(metricstate.Intrvlnotcrucialhrs),
        Mname: metricstate.Mname,
        Tresholdismin: metricstate.Tresholdismin,
      });
      console.log("data edit " + data);
      await axios
        .post(urlupd, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          timeout: ctimeout,
        })
        .then((response) => {
          //console.log("response.data " + response.data);
          vappcontext.pSetMetric(response.data);

          props
            .pFetchMetrics()
            .then((result) => vappcontext.pSetMetrics(result.data));
          vappcontext.pSetState("metrics", "list");
        })
        .catch((error) => {
          console.log(error.response.data);
          setMetricErr(error.response.data);
        });
    } else if (oper === "insert") {
      const data = JSON.stringify({
        Hid: parseInt(metricstate.Hid),
        Hostname: metricstate.Hostname,
        Port: parseInt(metricstate.Port),
        Tid: parseInt(metricstate.Tid),
        Tmetric: metricstate.Tmetric,
        Action: metricstate.Action,
        Descr: metricstate.Descr,
        Warning: parseFloat(metricstate.Warning),
        Error: parseFloat(metricstate.Error),
        Dbsid: metricstate.Dbsid,
        Username: metricstate.Username,
        Password: metricstate.Password,
        Startm: metricstate.Startm,
        Intrvlnotcrucialhrs: parseInt(metricstate.Intrvlnotcrucialhrs),
        Mname: metricstate.Mname,
        Tresholdismin: metricstate.Tresholdismin,
      });
      console.log("data ins " + data);
      await axios
        .post(urlins, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          timeout: ctimeout,
        })
        .then((response) => {
          console.log("response.data ins " + response.data);
          vappcontext.pSetMetric(response.data);
          props
            .pFetchMetrics()
            .then((result) => vappcontext.pSetMetrics(result.data));
          vappcontext.pSetState("metrics", "list");
          console.log("aft ins");
        })
        .catch((error) => {
          console.log(error.response.data);
          setMetricErr(error.response.data);
        });
    }
  }

  useEffect(() => {
    fetchSHostnames().then((result) => setShosts(result.data));
    fetchSTmetrics().then((result) => setStmetrics(result.data));
    fetchMetric().then((result) => setMetricstate(result.data));
  }, []);

  return (
    <Fragment>
      {(() => {
        if (metricErr) {
          return (
            <Alert errmsg={metricErr} pSetParentErr={(p) => setMetricErr(p)} />
          );
        }
      })()}
      <div className={cn(a.flexcontainer, a.flexcontainercenter)}>
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
                <select
                  type="text"
                  onChange={(event) => {
                    setMetricstate({
                      ...metricstate,
                      Hid: event.target.value,
                    });
                  }}
                  value={metricstate.Hid}
                >
                  {(() => {
                    if (vappcontext.vState.CurFunc === "insert") {
                      return (
                        <option key={null} value={null}>
                          '--------select-------------'
                        </option>
                      );
                    }
                  })()}
                  {shosts.map((items) => (
                    <option key={items.Id} value={items.Id}>
                      {items.Hostname}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td> Port </td>
              <td>
                <input
                  type="number"
                  value={metricstate.Port}
                  onChange={(event) => {
                    setMetricstate({
                      ...metricstate,
                      Port: event.target.value,
                    });
                  }}
                />
              </td>
            </tr>
            <tr>
              <td> Tmetric </td>
              <td>
                <select
                  type="text"
                  onChange={(event) => {
                    setMetricstate({
                      ...metricstate,
                      Tid: event.target.value,
                    });
                  }}
                  value={metricstate.Tid}
                >
                  {(() => {
                    if (vappcontext.vState.CurFunc === "insert") {
                      return (
                        <option key={null} value={null}>
                          '--------select-------------'
                        </option>
                      );
                    }
                  })()}
                  {stmetrics.map((items) => (
                    <option key={items.Id} value={items.Id}>
                      {items.Tname}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td> Mname </td>
              <td>
                <input
                  type="text"
                  value={metricstate.Mname}
                  onChange={(event) => {
                    setMetricstate({
                      ...metricstate,
                      Mname: event.target.value,
                    });
                  }}
                />
              </td>
            </tr>
            <tr>
              <td> Action </td>
              <td>
                <textarea
                  className={m.textarea}
                  value={metricstate.Action}
                  onChange={(event) => {
                    setMetricstate({
                      ...metricstate,
                      Action: event.target.value,
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
                  value={metricstate.Descr}
                  onChange={(event) => {
                    setMetricstate({
                      ...metricstate,
                      Descr: event.target.value,
                    });
                  }}
                />
              </td>
            </tr>
            <tr>
              <td> Warning </td>
              <td>
                <input
                  type="number"
                  value={metricstate.Warning}
                  onChange={(event) => {
                    setMetricstate({
                      ...metricstate,
                      Warning: event.target.value,
                    });
                  }}
                />
              </td>
            </tr>
            <tr>
              <td> Error </td>
              <td>
                <input
                  type="number"
                  value={metricstate.Error}
                  onChange={(event) => {
                    setMetricstate({
                      ...metricstate,
                      Error: event.target.value,
                    });
                  }}
                />
              </td>
            </tr>
            <tr>
              <td> dbsid </td>
              <td>
                <input
                  type="text"
                  value={metricstate.Dbsid}
                  onChange={(event) => {
                    setMetricstate({
                      ...metricstate,
                      Dbsid: event.target.value,
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
                  value={metricstate.Username}
                  onChange={(event) => {
                    setMetricstate({
                      ...metricstate,
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
                  value={metricstate.Password}
                  onChange={(event) => {
                    setMetricstate({
                      ...metricstate,
                      Password: event.target.value,
                    });
                  }}
                />
              </td>
            </tr>
            <tr>
              <td> Startm </td>
              <td>
                <input
                  type="checkbox"
                  checked={metricstate.Startm}
                  onChange={(event) => {
                    setMetricstate({
                      ...metricstate,
                      Startm: event.target.checked,
                    });
                  }}
                />
              </td>
            </tr>
            <tr>
              <td> Intrvlnotcrucialhrs </td>
              <td>
                <input
                  type="text"
                  value={metricstate.Intrvlnotcrucialhrs}
                  onChange={(event) => {
                    setMetricstate({
                      ...metricstate,
                      Intrvlnotcrucialhrs: event.target.value,
                    });
                  }}
                />
              </td>
            </tr>
            <tr>
              <td> Tresholdismin </td>
              <td>
                <input
                  type="checkbox"
                  checked={metricstate.Tresholdismin}
                  onChange={(event) => {
                    setMetricstate({
                      ...metricstate,
                      Tresholdismin: event.target.checked,
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
          onClick={() => vappcontext.pSetState("metrics", "list")}
        >
          Cancel
        </button>
        <div>
          {vappcontext.vMetric.CurMetricId ? (
            <button
              className={cn(a.btn, a.btnoper)}
              onClick={() => vappcontext.pSetState("metrics", "addmails")}
            >
              Add Mails
            </button>
          ) : (
            ""
          )}
        </div>
      </div>
      <br />
      <br />
    </Fragment>
  );
}

export default EditMetric;
