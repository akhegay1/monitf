/*Parent component, 
1)Contains in state current variables, such as current process or current table. 
2)Renders TopMenu and depending on current process, renders form. For example hostnames.
3)Create context and wraps Context Provider around TopMenu and form.
4)Using Context passes functions to change state of App from child components
*/

import React, { useState } from "react";
import "./App.css";
import appcontext from "./appcontext";
import Hostnames from "./components/Hostnames/Hostnames";
import Tmetrics from "./components/Tmetrics/Tmetrics";
import Metrics from "./components/Metrics/Metrics";
import TopMenu from "./components/TopMenu/TopMenu";
import Monitors from "./components/Monitors/Monitors";
import MonitorsTbl from "./components/MonitorsTbl/MonitorsTbl";
import Charts from "./components/Charts/Charts";
import Auth from "./components/Auth/Auth";

function App() {
  //init state
  const [state, setState] = useState({
    CurProcess: "hostname",
    CurTable: "hostname",
    CurFunc: "list",
  });

  const [authorized, setAuthorized] = useState(true);

  //list of hosts
  const [hostnames, setHostnames] = useState([]);
  //selected host
  const [hostname, setHostname] = useState({
    CurHostId: 0,
  });
  //Rp - rows per page, Pn - page number
  const [hostsRp, setHostsRp] = useState(10);
  const [hostsPn, setHostsPn] = useState(1);

  //list of Tmetrics
  const [tmetrics, setTmetrics] = useState([]);
  //selected Tmetric
  const [tmetric, setTmetric] = useState({
    CurTmetricId: 0,
  });

  //list of vmetrics
  const [vmetrics, setVmetrics] = useState([]);

  //list of metrics
  const [metrics, setMetrics] = useState([]);
  //selected metric
  const [metric, setMetric] = useState({
    CurMetricId: 0,
  });
  //Rp - rows per page, Pn - page number
  const [metricsRp, setMetricsRp] = useState(20);
  const [metricsPn, setMetricsPn] = useState(1);

  //list of vmetricsCh for Chart
  const [vmetricsCh, setVmetricsCh] = useState([]);
  const [vmetricCh, setVmetricCh] = useState({
    CurHostCh: 0,
    CurDtStartCh: "2006-01-02T15:00",
    CurDtFinishCh: "2006-01-02T15:00",
  });

  const [tmetricMon, setTmetricMon] = useState(1);
  const [interval, setInterval] = useState(0);

  return (
    <div className="App">
      <appcontext.Provider
        value={{
          //CurProcess, CurTable,
          vState: state,
          pSetState: (proc, tbl, fnc) => {
            setState({
              ...state,
              CurProcess: proc,
              CurTable: tbl,
              CurFunc: fnc,
            });
          },
          ////////////////Hostnames/////////////////////////
          vHostnames: hostnames,
          pSetHosts: (hostnames) => {
            setHostnames(hostnames);
          },
          vHostname: hostname,
          pSetHostname: (id) =>
            setHostname({
              ...hostname,
              CurHostId: id,
            }),
          vHostsRp: hostsRp,
          pSetHostsRp: (rp) => {
            setHostsRp(rp);
          },
          vHostsPn: hostsPn,
          pSetHostsPn: (pn) => {
            setHostsPn(pn);
          },
          ////////////////Tmetrics/////////////////////////
          vTmetrics: tmetrics,
          pSetTmetrics: (tmetrics) => {
            setTmetrics(tmetrics);
          },
          vTmetric: tmetric,
          pSetTmetric: (id) => {
            setTmetric({
              ...tmetric,
              CurTmetricId: id,
            });
          },
          ////////////////Metrics/////////////////////////
          vMetrics: metrics,
          pSetMetrics: (metrics) => {
            setMetrics(metrics);
          },
          vMetric: metric,
          pSetMetric: (id) =>
            setMetric({
              ...metric,
              CurMetricId: id,
            }),
          vMetricsRp: metricsRp,
          pSetMetricsRp: (rp) => {
            setMetricsRp(rp);
          },
          vMetricsPn: metricsPn,
          pSetMetricsPn: (pn) => {
            setMetricsPn(pn);
          },
          ////////////////Vmetrics/////////////////////////
          vVmetrics: vmetrics,
          pSetVmetrics: (vmetrics) => {
            setVmetrics(vmetrics);
          },
          vTmetricMon: tmetricMon,
          pSetTmetricMon: (vtmetricmon) => {
            setTmetricMon(vtmetricmon);
          },
          ////////////////VmetricsCh/////////////////////////
          vVmetricsCh: vmetricsCh,
          pSetVmetricsCh: (vmetricsCh) => {
            setVmetricsCh(vmetricsCh);
          },
          vVmetricCh: vmetricCh,
          pSetVmetricCh: (host, dtStart, dtFinish) => {
            setVmetricCh({
              ...vmetricCh,
              CurHostCh: host,
              CurDtStartCh: dtStart,
              CurDtFinishCh: dtFinish,
            });
          },
          ////////////////////Interval//////////////////
          vInterval: interval,
          pSetInterval: (interval) => {
            setInterval(interval);
          },
          vAuthorized: authorized,
          pSetAuthorized: (a) => {
            setAuthorized(a);
          },
        }}
      >
        {(() => {
          if (authorized) {
            return <TopMenu />;
          } else {
            return <Auth />;
          }
        })()}
        {(() => {
          if (state.CurProcess === "hostname") {
            return <Hostnames />;
          } else if (state.CurProcess === "tmetric") {
            return <Tmetrics />;
          } else if (state.CurProcess === "metric") {
            return <Metrics />;
          } else if (state.CurProcess === "monitor") {
            return <Monitors />;
          } else if (state.CurProcess === "chart") {
            return <Charts />;
          } else if (state.CurProcess === "monitortbl") {
            return <MonitorsTbl />;
          }
        })()}
      </appcontext.Provider>
    </div>
  );
}

export default App;
