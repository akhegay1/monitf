import React, { useContext, useState, useEffect } from "react";
import appcontext from "../../appcontext";
import a from "../../App.module.scss";
import cn from "classnames";
import Rep001 from "./AllReports/Rep001";

function Reports() {
  console.log("start Reports");
  let listReps = ["rep_001", "rep_002", "rep_003"];
  const vappcontext = useContext(appcontext);

  function listReports() {
    return (
      <div>
        <table className={a.tablerows}>
          <thead>
            <tr className={a.headerrow}>
              <th>Report Name</th>
            </tr>
          </thead>
          <tbody>
            {listReps.map((item) => (
              <tr
                className={
                  vappcontext.vReport.CurReport === item
                    ? cn(a.selectedrow)
                    : cn(a.unselectedrow)
                }
                key={item}
                onClick={() => {
                  vappcontext.pSetReport(item);
                }}
                onDoubleClick={() => vappcontext.pSetState(item, "view")}
              >
                <td> {item}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (vappcontext.vState.CurFunc === "list") {
    console.log(vappcontext.vState);
    return listReports();
  } else {
    return <Rep001 />;
  }
}

export default Reports;
