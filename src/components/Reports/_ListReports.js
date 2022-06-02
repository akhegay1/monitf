import React from "react";
import a from "../../App.module.scss";
import { ctimeout } from "../../params.js";
import { baseurl } from "../../params.js";

function ListReports() {
  console.log("start ListReports");

  const viewFile = async () => {
    let url = `${baseurl}rep_001`;
    console.log(url);
    console.log(localStorage.getItem("access_token"));

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

  function listReports() {
    return (
      <div>
        <table className={a.tablerows}>
          <thead>
            <tr className={a.headerrow}>
              <th>Report</th>
            </tr>
          </thead>
          <tbody>
            <tr
              onDoubleClick={() => {
                viewFile();
              }}
            >
              <td> Rep_001</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return listReports();
}

export default ListReports;
