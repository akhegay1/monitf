import React, { useContext, useState, useEffect } from "react";
import appcontext from "../../appcontext";
import axios from "axios";
import a from "../../App.module.scss";
import Alert from "../Alert/Alert";
import Confirmation from "../Confirmation/Confirmation";
import EditSrvgrps from "./EditSrvgrps";
import CRUDbtns from "../CRUDbtns/CRUDbtns";
import cn from "classnames";
import { ctimeout } from "../../params.js";
import { baseurl } from "../../params.js";

function Srvgrps() {
  console.log("start Srvgrps");
  const vappcontext = useContext(appcontext);

  let [srvgrpserr, setSrvgrpserr] = useState("");
  //просто залипуха чтобы при клике и заходе в компонент fetch делался, как на других
  const [srvgrpsPn, setSrvgrpsPn] = useState(0);

  const [showConfirm, setShowConfirm] = useState(false);

  const fetchSrvgrps = async () => {
    console.log("start fetchSrvgrps");

    let url = `${baseurl}srvgrps?rp=20&pn=1`;

    const result = await axios(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      timeout: ctimeout,
    }).catch((error) => {
      console.log("fetchSrvgrps " + error.message);
      setSrvgrpserr(error.response.data);
      return { data: [{ err: error.message }] };
    });
    return result;
  };

  async function delClick() {
    const urldel = `${baseurl}srvgrps/delete`;
    let data = JSON.stringify({
      Id: vappcontext.vSrvgrp.CurSrvgrpId,
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
        setSrvgrpserr(error.response.data);
      });
    vappcontext.pSetSrvgrp("", "", "");
    fetchSrvgrps().then((result) => vappcontext.pSetSrvgrps(result.data));
  }

  //if srvgrps in context empty, then fetch from server
  function chkEmptyVars() {
    if (
      typeof vappcontext.vSrvgrps !== "undefined" &&
      vappcontext.vSrvgrps.length === 0
    ) {
      fetchSrvgrps().then((result) => vappcontext.pSetSrvgrps(result.data));
    }
  }
  useEffect(() => {
    fetchSrvgrps().then((result) => vappcontext.pSetSrvgrps(result.data));
  }, [srvgrpsPn]);

  function listSrvgrps() {
    return (
      <div>
        {(() => {
          if (srvgrpserr) {
            return (
              <Alert
                errmsg={srvgrpserr}
                pSetParentErr={(p) => setSrvgrpserr(p)}
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
        <table className={a.tablerows}>
          <thead>
            <tr className={a.headerrow}>
              <th>Id</th>
              <th>Tname</th>
            </tr>
          </thead>
          <tbody>
            {vappcontext.vSrvgrps.map((item) => (
              <tr
                className={
                  vappcontext.vSrvgrp.CurSrvgrpId === item.Id
                    ? cn(a.selectedrow)
                    : cn(a.unselectedrow)
                }
                key={item.Id}
                onClick={() => {
                  vappcontext.pSetSrvgrp(item.Id);
                }}
                onDoubleClick={() => vappcontext.pSetState("srvgrps", "edit")}
              >
                <td> {item.Id}</td>
                <td> {item.Grpname}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <CRUDbtns
          pDelShowConfirm={() => setShowConfirm(a)}
          pSetParentRecs={(srvgrps) => vappcontext.pSetSrvgrps(srvgrps)}
          pFetchParentRecs={() => fetchSrvgrps()}
          pParentStateEdit={{
            CurProcess: "srvgrps",
            CurFunc: "edit",
          }}
          pParentStateInsert={{
            CurProcess: "srvgrps",
            CurFunc: "insert",
          }}
          pEmptyCurRec={{
            CurSrvgrpId: "",
            CurTname: "",
          }}
          pSetParentState={(cur) => {
            vappcontext.pSetState(cur.CurProcess, cur.CurFunc);
          }}
          pSetParentCurRec={(h) => vappcontext.pSetSrvgrp(h.CurSrvgrpId)}
          pParentCurId={vappcontext.vSrvgrp.CurSrvgrpId}
        />
      </div>
    );
  }

  if (vappcontext.vState.CurFunc === "list") {
    return listSrvgrps();
  } else {
    return <EditSrvgrps pFetchSrvgrps={() => fetchSrvgrps()} />;
  }
}

export default Srvgrps;
