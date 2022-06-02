import React, { useState, useEffect, useContext } from "react";
import a from "../../App.module.scss";
import b from "./Charts.module.scss";
import cn from "classnames";
import { Line } from "react-chartjs-2";
import { ctimeout } from "../../params.js";
import { baseurl } from "../../params.js";
import axios from "axios";
import Alert from "../Alert/Alert";
import appcontext from "../../appcontext";

function Charts() {
  const vappcontext = useContext(appcontext);
  const [vmetricsCherr, setVmetricsCherr] = useState("");

  const [shosts, setShosts] = useState([]);
  const [find, setFind] = useState(true);

  const fetchSHostnames = async () => {
    const url = `${baseurl}shostnames`;
    const result = await axios(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      timeout: ctimeout,
    }).catch((error) => {
      console.log("fetchSHostnames " + error.message);
      return { data: [{ err: error.message }] };
    });
    return result;
  };
  const [hostId, setHostId] = useState(vappcontext.vVmetricCh.CurHostCh);
  const [dtStart, setDtStart] = useState(vappcontext.vVmetricCh.CurDtStartCh);
  const [dtFinish, setDtFinish] = useState(
    vappcontext.vVmetricCh.CurDtFinishCh
  );

  const datasetsF = {
    fill: false,
    lineTension: 0.1,
    backgroundColor: "rgba(75,192,192,0.4)",
    borderColor: "rgba(75,192,192,1)",
    borderCapStyle: "butt",
    borderDash: [],
    borderDashOffset: 0.0,
    borderJoinStyle: "miter",
    pointBorderColor: "rgba(75,192,192,1)",
    pointBackgroundColor: "#fff",
    pointBorderWidth: 1,
    pointHoverRadius: 5,
    pointHoverBackgroundColor: "rgba(75,192,192,1)",
    pointHoverBorderColor: "rgba(220,220,220,1)",
    pointHoverBorderWidth: 2,
    pointRadius: 1,
    pointHitRadius: 10,
  };

  const fetchVmetricsCh = async () => {
    console.log("start fetchVmetricsCh");
    console.log(
      "vappcontext.vVmetricCh " + JSON.stringify(vappcontext.vVmetricCh)
    );
    const url = `${baseurl}vmetrics/getbydt`;
    const data = JSON.stringify({
      HostnameId: parseInt(vappcontext.vVmetricCh.CurHostCh),
      StartTime: vappcontext.vVmetricCh.CurDtStartCh + ":00.456766+06:00",
      FinishTime: vappcontext.vVmetricCh.CurDtFinishCh + ":00.456766+06:00",
    });
    console.log("data aaa" + data);

    await axios
      .post(url, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        timeout: ctimeout,
      })
      .then((response) => {
        vappcontext.pSetVmetricsCh(response.data);
      })
      .catch((error) => {
        console.log(error.response.data);
        setVmetricsCherr(error.response.data);
      });
  };

  //console.log("vmetricsCh " + JSON.stringify(vappcontext.vVmetricsCh));
  const unique = vappcontext.vVmetricsCh
    .map((item) => item.Hostmname)
    .filter((value, index, self) => self.indexOf(value) === index);
  //console.log("unique " + unique);

  function compare(a, b) {
    let comparison = 0;
    if (a.Vtime > b.Vtime) {
      comparison = 1;
    } else if (a.Vtime < b.Vtime) {
      comparison = -1;
    }
    return comparison;
  }

  //Hostmname - это хост плюс имя метрики
  //fetch приносит все записи за период, надо разделить по Hostmname, чтобы для каждого Hostmname, был отдельный массив
  //и каждый массив запихиваем в Map со значением key равным Hostmname
  let ChartsArrays = new Map();
  let ChartArray = [];
  //Разделить массив обхектов на два, в одном - labels, в другом - data
  let labelsArrays = new Map();
  let valuesArrays = new Map();
  let labelsArr = [];
  let valuesArr = [];

  unique.forEach((item, index) => {
    vappcontext.vVmetricsCh.filter((value) => {
      if (value.Hostmname === item) {
        ChartArray.push(value);
      }
    });
    ChartArray.sort(compare);
    ChartsArrays.set(item, ChartArray);
    ChartArray.forEach((item, index) => {
      labelsArr.push(item.Vtime);
      valuesArr.push(item.Value);
    });
    labelsArrays.set(item, labelsArr);
    valuesArrays.set(item, valuesArr);

    /*console.log(
      "ChartsArrays(" + item + ")" + JSON.stringify(ChartsArrays.get(item))
    );
    console.log(
      "labelsArrays(" + item + ")" + JSON.stringify(labelsArrays.get(item))
    );
    console.log(
      "valuesArrays(" + item + ")" + JSON.stringify(valuesArrays.get(item))
    );*/
    ChartArray = [];
    labelsArr = [];
    valuesArr = [];
  });

  if (typeof vmetricsCherr[0] != "undefined") {
    vmetricsCherr = vmetricsCherr[0].err;
  }

  useEffect(() => {
    fetchVmetricsCh();
    fetchSHostnames().then((result) => setShosts(result.data));
  }, [find]);

  function GetDataLine(item) {
    let data = {};
    data = {
      labels: labelsArrays.get(item),
      datasets: [
        {
          ...datasetsF,
          label: item,
          data: valuesArrays.get(item),
        },
      ],
    };
    return data;
  }

  return (
    <div>
      {(() => {
        if (vmetricsCherr) {
          return (
            <Alert
              errmsg={vmetricsCherr}
              pSetParentErr={(p) => setVmetricsCherr(p)}
            />
          );
        }
      })()}
      <div className={cn(a.flexcontainercenter, a.flexcontainer)}>
        <div className={cn(a.fltr, a.flexcfltrm, a.flexcntnrspacebtwen)}>
          <div className={a.algncenter}>
            <label htmlFor="host">Hostname:</label>
          </div>
          <div className={a.algncenter}>
            <select
              type="text"
              id="host"
              onChange={(event) => {
                setHostId(event.target.value);
              }}
              value={hostId}
            >
              {shosts.map((items) => (
                <option key={items.Id} value={items.Id}>
                  {items.Hostname}
                </option>
              ))}
            </select>
          </div>

          <div className={a.algncenter}>
            <label htmlFor="dtStart">dtStart:</label>
          </div>
          <div className={a.algncenter}>
            <input
              type="datetime-local"
              id="dtStart"
              onChange={(event) => {
                setDtStart(event.target.value);
              }}
              value={dtStart}
            />
          </div>
          <div className={a.algncenter}>
            <label htmlFor="dtFinish">dtFinish:</label>
          </div>
          <div className={a.algncenter}>
            <input
              type="datetime-local"
              id="dtFinish"
              onChange={(event) => {
                setDtFinish(event.target.value);
              }}
              value={dtFinish}
            />
          </div>

          <div className={a.algncenter}>
            <button
              className={(a.btn, a.btnoper)}
              onClick={() => {
                setFind(!find);
                vappcontext.pSetVmetricCh(hostId, dtStart, dtFinish);
                fetchVmetricsCh();
              }}
            >
              Find
            </button>
          </div>
        </div>
      </div>

      <div className={cn(a.flexcontainercenter, a.flexcontainer, a.flexwrap)}>
        {unique.map((item) => (
          <div key={item} className={b.chart}>
            <Line data={GetDataLine(item)} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Charts;
