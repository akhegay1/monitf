import React, { useContext, useState, useEffect } from "react";
import appcontext from "../../appcontext";
import axios from "axios";
import a from "../../App.module.scss";
import b from "./Monitors.module.scss";
import cn from "classnames";
import { ctimeout } from "../../params.js";
import { baseurl } from "../../params.js";
import Alert from "../Alert/Alert";
//1111222
function Monitors() {
  const vappcontext = useContext(appcontext);
  let [vmetricserr, setVmetricserr] = useState("");
  const [tmetric, setTmetric] = useState(vappcontext.vTmetricMon);
  const [srvgrp, setSrvgrp] = useState(vappcontext.vSrvgrpMon);

  const [sTmetrics, setStmetrics] = useState([]);
  const [sSrvgrps, setSrvgrps] = useState([]);

  const fetchStmetrics = async () => {
    let url = `${baseurl}stmetrics`;
    const result = await axios(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      timeout: ctimeout,
    }).catch((error) => {
      console.log("fetchStmetrics " + error.message);
      setVmetricserr(error.response.data);
      return { data: [{ err: error.message }] };
    });
    return result;
  };

  const fetchSsrvgrps = async () => {
    let url = `${baseurl}ssrvgrps`;
    const result = await axios(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      timeout: ctimeout,
    }).catch((error) => {
      console.log("fetchSsrvgrps " + error.message);
      setVmetricserr(error.response.data);
      return { data: [{ err: error.message }] };
    });
    return result;
  };

  const fetchVmetrics = async () => {
    console.log("start fetchVmetrics ");

    let url = `${baseurl}vmetrics?tm=${tmetric}&sg=${srvgrp}`;

    const result = await axios(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      timeout: ctimeout,
    }).catch((error) => {
      console.log("fetchVmetrics aaa " + error.message);
      setVmetricserr(error.response.data);
      return { data: [{ err: error.message }] };
    });
    if (result.data.length === 0) {
      return { data: [{ err: "no recent statistics" }] };
    }
    return result;
  };

  function fetchVmetricsA() {
    fetchStmetrics().then((result) => setStmetrics(result.data));
    fetchSsrvgrps().then((result) => setSrvgrps(result.data));
    fetchVmetrics().then((result) => vappcontext.pSetVmetrics(result.data));
    clearInterval(vappcontext.vInterval);
    let interval = setInterval(
      () =>
        fetchVmetrics().then((result) => vappcontext.pSetVmetrics(result.data)),
      80000
    );

    vappcontext.pSetInterval(interval);
  }
  /*
  function compare(a, b) {
    let comparison = 0;
    if (a.Hostname > b.Hostname) {
      comparison = 1;
    } else if (a.Hostname < b.Hostname) {
      comparison = -1;
    }
    return comparison;
  }

  vappcontext.vVmetrics.sort(compare);
  */

  function squareColor(val, warn, err, execerr, tresholdismin) {
    console.log(tresholdismin);
    if (execerr) {
      return cn(b.square, b.sqgrey);
    } else {
      if (tresholdismin === true) {
        if (val < err && err !== 0) {
          return cn(b.square, b.sqred);
        } else if (val > err && val < warn && warn !== 0 && err !== 0) {
          return cn(b.square, b.sqorange);
        } else {
          return cn(b.square, b.sqgreen);
        }
      } else {
        if (val > err && err !== 0) {
          return cn(b.square, b.sqred);
        } else if (val < err && val > warn && warn !== 0 && err !== 0) {
          return cn(b.square, b.sqorange);
        } else {
          return cn(b.square, b.sqgreen);
        }
      }
    }
  }

  useEffect(() => {
    fetchVmetricsA(); // using camelCase for variable name is recommended.
  }, [tmetric, srvgrp]);

  //console.log("vappcontext.vTmetricMon apivmetricserr " + apivmetricserr);

  return (
    <div>
      {(() => {
        if (vmetricserr) {
          return (
            <Alert
              errmsg={vmetricserr}
              pSetParentErr={(p) => setVmetricserr(p)}
            />
          );
        }
      })()}
      <div
        className={cn(a.flexcontainer, a.flexcontainerstart, b.bottomborder)}
      >
        {sTmetrics.map((item) => (
          <div className={b.tab} key={item.Id}>
            <div
              className={
                vappcontext.vTmetricMon === item.Id
                  ? cn(b.btnactive, b.btn)
                  : b.btn
              }
              onClick={() => {
                setTmetric(item.Id);
                vappcontext.pSetTmetricMon(item.Id);
              }}
            >
              {item.Tname}
            </div>
          </div>
        ))}
      </div>

      <div
        className={cn(a.flexcontainer, a.flexcontainerstart, b.bottomborder)}
      >
        {sSrvgrps.map((item) => (
          <div className={b.tab} key={item.Id}>
            <div
              className={
                vappcontext.vSrvgrpMon === item.Id
                  ? cn(b.btnactive, b.btn)
                  : b.btn
              }
              onClick={() => {
                setSrvgrp(item.Id);
                vappcontext.pSetSrvgrpMon(item.Id);
              }}
            >
              {item.Grpname}
            </div>
          </div>
        ))}
      </div>

      <div className={cn(a.flexcontainer, a.flexcntnrspacebtwen, a.flexwrap)}>
        {vappcontext.vVmetrics.map((item) => (
          <div className={cn(b.holder, b.tab)} key={item.Id}>
            <div
              className={squareColor(
                item.Value,
                item.Warning,
                item.Error,
                item.Execerr,
                item.Tresholdismin
              )}
              key={item.Id}
              onClick={() => {
                let currentdate = new Date();

                let dateFinish =
                  currentdate.getFullYear() +
                  "-" +
                  (currentdate.getMonth() + 1).toString().padStart(2, "0") +
                  "-" +
                  currentdate.getDate().toString().padStart(2, "0") +
                  "T" +
                  currentdate.getHours().toString().padStart(2, "0") +
                  ":" +
                  currentdate.getMinutes().toString().padStart(2, "0");
                let dateStart = new Date();
                dateStart.setHours(currentdate.getHours() - 1);

                dateStart =
                  dateStart.getFullYear() +
                  "-" +
                  (dateStart.getMonth() + 1).toString().padStart(2, "0") +
                  "-" +
                  dateStart.getDate().toString().padStart(2, "0") +
                  "T" +
                  dateStart.getHours().toString().padStart(2, "0") +
                  ":" +
                  dateStart.getMinutes().toString().padStart(2, "0");

                vappcontext.pSetVmetricCh(item.Hid, dateStart, dateFinish);
              }}
              onDoubleClick={() => vappcontext.pSetState("charts", "showchart")}
            ></div>
            <div className={item.Execerr ? b.block : ""}>{item.Execerr}</div>
            <div className={b.label}>{item.Hostname + "/" + item.Mname}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Monitors;
