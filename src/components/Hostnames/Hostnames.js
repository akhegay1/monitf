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
import hostnamesItemsLang from "./HostnamesItemsLang.js";

function Hostnames() {
  console.log("start Hostnames");

  const vappcontext = useContext(appcontext);

  const [hostserr, setHostserr] = useState("");
  const [srchHost, setSrchHost] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const rp = vappcontext.vHostsRp;
  const pn = vappcontext.vHostsPn;

  //console.log(hostnamesItemsLang.get("f1" + vappcontext.vLang));

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
    console.log("url", url);
    console.log(localStorage.getItem("access_token"));

    const result = await axios(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      timeout: ctimeout,
    }).catch((error) => {
      console.log("fetchHostnames " + error.message);
      setHostserr(error.response.data);
      return { data: [{ err: error.message }] };
    });
    console.log("result", result);
    return result;
  };

  async function delClick() {
    const urldel = `${baseurl}hostnames/delete`;
    const data = JSON.stringify({
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

  useEffect(() => {
    fetchHostnames().then((result) => vappcontext.pSetHosts(result.data));
  }, [vappcontext.vHostsPn, vappcontext.vHostsRp]);

  function listHostnames() {
    return (
      <div>
        {(() => {
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
              <label htmlFor="fname">
                {hostnamesItemsLang.get("f1" + vappcontext.vLang)}:
              </label>
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
                {hostnamesItemsLang.get("b1" + vappcontext.vLang)}
              </button>
            </div>
          </div>
        </div>
        <table className={a.tablerows}>
          <thead>
            <tr className={a.headerrow}>
              <th>{hostnamesItemsLang.get("h1" + vappcontext.vLang)}</th>
              <th>{hostnamesItemsLang.get("h2" + vappcontext.vLang)}</th>
              <th>{hostnamesItemsLang.get("h3" + vappcontext.vLang)}</th>
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
                key={item.Id + 1}
                onClick={() => {
                  vappcontext.pSetHostname(item.Id);
                }}
                onDoubleClick={() => vappcontext.pSetState("hostnames", "edit")}
              >
                <td> {item.Hostname}</td>
                <td> {item.Descr}</td>
                <td> {item.Grpname}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <CRUDbtns
          pDelShowConfirm={() => setShowConfirm(a)}
          pSetParentRecs={(hosts) => vappcontext.pSetHosts(hosts)}
          pFetchParentRecs={() => fetchHostnames()}
          pParentStateEdit={{
            CurProcess: "hostnames",
            CurFunc: "edit",
          }}
          pParentStateInsert={{
            CurProcess: "hostnames",
            CurFunc: "insert",
          }}
          pEmptyCurRec={{
            CurHostId: "",
          }}
          pSetParentState={(cur) =>
            vappcontext.pSetState(cur.CurProcess, cur.CurFunc)
          }
          pSetParentCurRec={(h) => vappcontext.pSetHostname(h.CurHostId)}
          pParentCurId={vappcontext.vHostname.CurHostId}
        />
        <Paging
          rp={vappcontext.vHostsRp}
          setRp={(vrp) => vappcontext.pSetHostsRp(vrp)}
          pn={vappcontext.vHostsPn}
          setPn={(vrp) => vappcontext.pSetHostsPn(vrp)}
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
