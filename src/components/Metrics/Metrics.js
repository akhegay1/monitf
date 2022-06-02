import React, { useContext, useState, useEffect } from "react";
import appcontext from "../../appcontext";
import axios from "axios";
import a from "../../App.module.scss";
import b from "./Metrics.module.scss";
import Alert from "../Alert/Alert";
import Confirmation from "../Confirmation/Confirmation";
import Paging from "../Paging/Paging";
import EditMetrics from "./EditMetrics";
import Addmails from "./MetricsEmails";
import CRUDbtns from "../CRUDbtns/CRUDbtns";
import cn from "classnames";
import { ctimeout } from "../../params.js";
import { baseurl } from "../../params.js";

function Metrics() {
  console.log("start Metrics");
  const vappcontext = useContext(appcontext);

  const [metricserr, setMetricserr] = useState("");
  const [srchByHostname, setSrchByHostname] = useState("");
  const [srchByTmetric, setSrchByTmetric] = useState("");
  const [srchByAction, setSrchByAction] = useState("");

  const rp = vappcontext.vMetricsRp;
  const pn = vappcontext.vMetricsPn;

  const fetchMetrics = async () => {
    console.log("start fetchMetrics");

    let url = `${baseurl}metrics?rp=${rp}&pn=${pn}`;

    let srchStr;
    if (srchByHostname) {
      srchStr = `&sh=${srchByHostname}`;
    } else {
      srchStr = "";
    }
    url = url + srchStr;
    if (srchByTmetric) {
      srchStr = `&st=${srchByTmetric}`;
    } else {
      srchStr = "";
    }
    url = url + srchStr;
    if (srchByAction) {
      srchStr = `&sa=${srchByAction}`;
    } else {
      srchStr = "";
    }
    url = url + srchStr;

    const result = await axios(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      timeout: ctimeout,
    }).catch((error) => {
      console.log("fetchMetrics " + error.message);
      setMetricserr(error.response.data);
      return { data: [{ err: error.message }] };
    });

    return result;
  };

  const [showConfirm, setShowConfirm] = useState(false);

  async function delClick() {
    const urldel = `${baseurl}metrics/delete`;
    const data = JSON.stringify({
      Id: vappcontext.vMetric.CurMetricId,
    });
    await axios
      .post(urldel, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        timeout: ctimeout,
      })
      .catch((error) => {
        console.log(error.response.data);
        setMetricserr(error.response.data);
      });
    vappcontext.pSetMetric("", "", "");
    fetchMetrics().then((result) => vappcontext.pSetMetrics(result.data));
  }

  useEffect(() => {
    fetchMetrics().then((result) => vappcontext.pSetMetrics(result.data));
  }, [vappcontext.vMetricsPn, vappcontext.vMetricsRp]);

  //console.log("vappcontext.vMetric " + JSON.stringify(vappcontext.vMetric));
  function listMetrics() {
    return (
      <div>
        {(() => {
          if (metricserr) {
            return (
              <Alert
                errmsg={metricserr}
                pSetParentErr={(p) => setMetricserr(p)}
              />
            );
          }
        })()}
        {(() => {
          if (showConfirm) {
            return (
              <Confirmation
                pSetShowConfirm={(p) => setShowConfirm(p)}
                pDelClick={() => delClick()}
              />
            );
          }
        })()}
        <div className={cn(a.flexcontainer, a.flexcontainercenter)}>
          <div className={cn(a.fltr, a.flexcfltrm, a.flexcntnrspacebtwen)}>
            <div className={a.algncenter}>
              <label htmlFor="fname1">Hostname:</label>
            </div>
            <div className={a.algncenter}>
              <input
                type="text"
                id="fname1"
                name="fname"
                value={srchByHostname}
                onChange={(event) => {
                  setSrchByHostname(event.target.value);
                }}
              />
            </div>
            <div className={a.algncenter}>
              <label htmlFor="fname2">Tmetric:</label>
            </div>
            <div className={a.algncenter}>
              <input
                type="text"
                id="fname2"
                name="fname"
                value={srchByTmetric}
                onChange={(event) => {
                  setSrchByTmetric(event.target.value);
                }}
              />
            </div>
            <div className={a.algncenter}>
              <label htmlFor="fname3">Action:</label>
            </div>
            <div className={a.algncenter}>
              <input
                type="text"
                id="fname3"
                name="fname"
                value={srchByAction}
                onChange={(event) => {
                  setSrchByAction(event.target.value);
                }}
              />
            </div>
            <div className={a.algncenter}>
              <button
                className={(a.btn, a.btnoper)}
                onClick={() => {
                  vappcontext.pSetMetric("");
                  fetchMetrics().then((result) =>
                    vappcontext.pSetMetrics(result.data)
                  );
                }}
              >
                Find
              </button>
            </div>
          </div>
        </div>
        <table className={a.tablerows}>
          <thead>
            <tr className={a.headerrow}>
              <th>Id</th>
              <th>Hostname</th>
              <th>Port</th>
              <th>Tmetric</th>
              <th>Mname</th>
              <th>Action</th>
              <th>Warning</th>
              <th>Error</th>
              <th>Startm</th>
              <th>Intrvlnotcrucialhrs</th>
            </tr>
          </thead>
          <tbody>
            {vappcontext.vMetrics.map((item) => (
              <tr
                className={
                  vappcontext.vMetric.CurMetricId === item.Id
                    ? cn(a.selectedrow)
                    : cn(a.unselectedrow)
                }
                key={item.Id}
                onClick={() => {
                  vappcontext.pSetMetric(item.Id);
                }}
                onDoubleClick={() => vappcontext.pSetState("metrics", "edit")}
              >
                <td> {item.Id}</td>
                <td> {item.Hostname}</td>
                <td> {item.Port}</td>
                <td> {item.Tmetric}</td>
                <td> {item.Mname}</td>
                <td>
                  <div className={b.spanaction}>{item.Action}</div>
                </td>
                <td> {item.Warning}</td>
                <td> {item.Error}</td>
                <td> {item.Startm ? "true" : "false"}</td>
                <td> {item.Intrvlnotcrucialhrs}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <CRUDbtns
          pDelShowConfirm={() => setShowConfirm(a)}
          pSetParentRecs={(metrics) => vappcontext.pSetMetrics(metrics)}
          pFetchParentRecs={() => fetchMetrics()}
          pParentStateEdit={{
            CurProcess: "metrics",
            CurFunc: "edit",
          }}
          pParentStateInsert={{
            CurProcess: "metrics",
            CurFunc: "insert",
          }}
          pEmptyCurRec={{
            CurMetricId: "",
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
            Startm: "",
            Intrvlnotcrucialhrs: "",
          }}
          pSetParentState={(cur) =>
            vappcontext.pSetState(cur.CurProcess, cur.CurFunc)
          }
          pSetParentCurRec={(h) => vappcontext.pSetMetric(h.CurMetricId)}
          pParentCurId={vappcontext.vMetric.CurMetricId}
        />

        <Paging
          rp={vappcontext.vMetricsRp}
          setRp={(vrp) => vappcontext.pSetMetricsRp(vrp)}
          pn={vappcontext.vMetricsPn}
          setPn={(vrp) => vappcontext.pSetMetricsPn(vrp)}
        />
      </div>
    );
  }

  if (vappcontext.vState.CurFunc === "list") {
    return listMetrics();
  } else if (
    vappcontext.vState.CurFunc === "edit" ||
    vappcontext.vState.CurFunc === "insert"
  ) {
    return <EditMetrics pFetchMetrics={() => fetchMetrics()} />;
  } else if (vappcontext.vState.CurFunc === "addmails") {
    return <Addmails />;
  }
}

export default Metrics;
