import React, { useContext, useState, useEffect } from "react";
import appcontext from "../../appcontext";
import axios from "axios";
import a from "../../App.module.scss";
import Alert from "../Alert/Alert";
import Confirmation from "../Confirmation/Confirmation";
import Paging from "../Paging/Paging";
import EditHostnames from "./EditHostnames";
import CRUDbtns from "../CRUDbtns/CRUDbtns";
import cn from "classnames";
import { ctimeout } from "../../params.js";
import { baseurl } from "../../params.js";

function Hostnames() {
  console.log("start Hostnames");
  const vappcontext = useContext(appcontext);

  let [hostserr, setHostserr] = useState("");
  const [hostsPn, setHostsPn] = useState(0);
  const [hostsRp, setHostsRp] = useState(0);
  const [srchHost, setSrchHost] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  let rp = vappcontext.vHostsRp;
  let pn = vappcontext.vHostsPn;

  const fetchHostnames = async () => {
    console.log("start fetchHostnames");

    let url = `${baseurl}hostnames?rp=${rp}&pn=${pn}`;

    let srchStr;
    if (srchHost) {
      srchStr = `&sh=${srchHost}`;
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
      console.log("fetchHostnames " + error.message);
      return { data: [{ err: error.message }] };
    });
    console.log("result", result);
    return result;
  };

  async function delClick() {
    const urldel = `${baseurl}hostnames/delete`;
    let data = JSON.stringify({
      Id: vappcontext.vHostname.CurHostId,
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
        setHostserr(error.response.data);
      });
    vappcontext.pSetHostname("", "", "");
    fetchHostnames().then((result) => vappcontext.pSetHosts(result.data));
  }

  let apihosterr;
  if (typeof vappcontext.vHostnames[0] != "undefined") {
    apihosterr = vappcontext.vHostnames[0].err;
  }

  useEffect(() => {
    fetchHostnames().then((result) => vappcontext.pSetHosts(result.data));
  }, [hostsPn, hostsRp]);

  function listHostnames() {
    return (
      <div>
        {(() => {
          if (apihosterr) {
            hostserr = apihosterr;
          }
          if (hostserr) {
            return (
              <Alert errmsg={hostserr} pSetParentErr={(p) => setHostserr(p)} />
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
          <div className={cn(a.fltr, a.flexcfltr, a.flexcntnrspacebtwen)}>
            <div className={a.algncenter}>
              <label htmlFor="fname">Hostname:</label>
            </div>
            <div className={a.algncenter}>
              <input
                type="text"
                id="fname"
                name="fname"
                value={srchHost}
                onChange={(event) => {
                  setSrchHost(event.target.value);
                }}
              />
            </div>
            <div className={a.algncenter}>
              <button
                className={(a.btn, a.btnoper)}
                onClick={() => {
                  vappcontext.pSetHostname("");
                  fetchHostnames().then((result) =>
                    vappcontext.pSetHosts(result.data)
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
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {vappcontext.vHostnames.map((item) => (
              <tr
                className={
                  vappcontext.vHostname.CurHostId === item.Id
                    ? cn(a.selectedrow)
                    : cn(a.unselectedrow)
                }
                key={item.Id}
                onClick={() => {
                  vappcontext.pSetHostname(item.Id);
                }}
                onDoubleClick={() =>
                  vappcontext.pSetState("hostname", "hostname", "edit")
                }
              >
                <td> {item.Id}</td>
                <td> {item.Hostname}</td>
                <td> {item.Descr}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <CRUDbtns
          pDelShowConfirm={() => setShowConfirm(a)}
          pSetParentRecs={(hosts) => vappcontext.pSetHosts(hosts)}
          pFetchParentRecs={() => fetchHostnames()}
          pParentStateEdit={{
            CurProcess: "hostname",
            CurTable: "hostname",
            CurFunc: "edit",
          }}
          pParentStateInsert={{
            CurProcess: "hostname",
            CurTable: "hostname",
            CurFunc: "insert",
          }}
          pEmptyCurRec={{
            CurHostId: "",
          }}
          pSetParentState={(cur) =>
            vappcontext.pSetState(cur.CurProcess, cur.CurTable, cur.CurFunc)
          }
          pSetParentCurRec={(h) => vappcontext.pSetHostname(h.CurHostId)}
          pParentCurId={vappcontext.vHostname.CurHostId}
        />
        <Paging
          rp={vappcontext.vHostsRp}
          setRp={(vrp) => vappcontext.pSetHostsRp(vrp)}
          pn={vappcontext.vHostsPn}
          setPn={(vrp) => vappcontext.pSetHostsPn(vrp)}
          pSetParentPn={(pn) => setHostsPn(pn)}
          pSetParentRp={(rp) => setHostsRp(rp)}
        />
      </div>
    );
  }

  if (vappcontext.vState.CurFunc === "list") {
    return listHostnames();
  } else {
    return <EditHostnames pFetchHostnames={() => fetchHostnames()} />;
  }
}

export default Hostnames;
