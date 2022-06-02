import React, { useState, useContext } from "react";
import appcontext from "../../appcontext";
import a from "../../App.module.scss";
import b from "./MonitorsAll.module.scss";
import cn from "classnames";
import { baseWSurl } from "../../params.js";
import Alert from "../Alert/Alert";

let url = `${baseWSurl}vmetricsAll`;
let socket = new WebSocket(url);
socket.onopen = function () {
  console.log("Status: Connected\n");
};

function MonitorsAll() {
  console.log("MonitorsAll started");
  const vappcontext = useContext(appcontext);

  let [vVmetricsAll, setVVmetricsAll] = useState([]);
  let [vVmetricserr, setVVmetricserr] = useState("");

  socket.onmessage = function (e) {
    //console.log(JSON.parse(e.data));
    setVVmetricsAll(JSON.parse(e.data));
    //console.log("vVmetricsAll", vVmetricsAll);
  };

  function squareColor(val, warn, err, execerr, tresholdismin) {
    //console.log(tresholdismin);
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

  //console.log("vappcontext.vTmetricMon apivmetricserr " + apivmetricserr);
  /*useEffect(() => {
    fetchVmetricsA(); // using camelCase for variable name is recommended.
  }, []);
*/
  return (
    <div>
      {(() => {
        if (vVmetricserr) {
          return (
            <Alert
              errmsg={vVmetricserr}
              pSetParentErr={(p) => setVVmetricserr(p)}
            />
          );
        }
      })()}

      <div className={cn(a.flexcontainer, a.flexcntnrspacebtwen, a.flexwrap)}>
        {vVmetricsAll.map((item) => (
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
            {item.Hostname + "/" + item.Mname}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MonitorsAll;
