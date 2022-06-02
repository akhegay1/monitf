import React, { useState } from "react";

import { ctimeout } from "../../../params.js";
//import axios from "axios";
import t from "../Reports.module.scss";
import a from "../../../App.module.scss";
import cn from "classnames";

import { baseurl } from "../../../params.js";

function Rep001() {
  console.log("start Rep_001");
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

  const [dtStart, setDtStart] = useState(dateStart);
  const [dtFinish, setDtFinish] = useState(dateFinish);

  const viewFile = async () => {
    let url = `${baseurl}rep_001`;
    console.log(url);
    //console.log(localStorage.getItem("access_token"));

    let srchStr;
    if (dtStart) {
      srchStr = `?dtStart=${dtStart}`;
    }
    if (dtFinish) {
      srchStr = srchStr + `&dtFinish=${dtFinish}`;
    }
    url = url + srchStr;
    console.log(url);
    // Change this to use your HTTP client
    fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      timeout: ctimeout,
    }) // FETCH BLOB FROM IT
      .then((response) => response.blob())
      .then((blob) => {
        // RETRIEVE THE BLOB AND CREATE LOCAL URL
        let _url = window.URL.createObjectURL(blob);
        console.log(_url);
        window.open(_url, "_blank").focus(); // window.open + focus
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={cn(t.flexcontainer)}>
      <div className={cn(a.fltr, a.flexcontainervert, a.flexcntnrspacebtwen)}>
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
              viewFile();
            }}
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
}

export default Rep001;
