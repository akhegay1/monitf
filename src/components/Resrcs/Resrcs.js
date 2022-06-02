import React, { useContext, useState, useEffect } from "react";
import appcontext from "../../appcontext";
import axios from "axios";
import a from "../../App.module.scss";
import Alert from "../Alert/Alert";
import Confirmation from "../Confirmation/Confirmation";
import Paging from "../Paging/Paging";
import EditResrcs from "./EditResrcs";
import CRUDbtns from "../CRUDbtns/CRUDbtns";
import cn from "classnames";
import { ctimeout } from "../../params.js";
import { baseurl } from "../../params.js";

function Resrcs() {
  console.log("start Resrcs");
  const vappcontext = useContext(appcontext);

  let [Resrcserr, setResrcserr] = useState("");
  const [srchResrc, setSrchResrc] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  let rp = vappcontext.vResrcsRp;
  let pn = vappcontext.vResrcsPn;

  const fetchResrcs = async () => {
    console.log("start fetchResrcs");

    let url = `${baseurl}resrcs?rp=${rp}&pn=${pn}`;

    let srchStr;
    if (srchResrc) {
      srchStr = `&sh=${srchResrc}`;
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
      console.log("fetchResrcs " + error.message);
      setResrcserr(error.response.data);
      return { data: [{ err: error.message }] };
    });
    console.log("result", result);
    return result;
  };

  async function delClick() {
    const urldel = `${baseurl}resrcs/delete`;
    let data = JSON.stringify({
      Id: vappcontext.vResrc.CurResrcId,
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
        setResrcserr(error.response.data);
      });
    vappcontext.pSetResrc("", "", "");
    fetchResrcs().then((result) => vappcontext.pSetResrcs(result.data));
  }

  useEffect(() => {
    fetchResrcs().then((result) => vappcontext.pSetResrcs(result.data));
  }, [vappcontext.vResrcsPn, vappcontext.vResrcsRp]);

  function listResrcs() {
    return (
      <div>
        {(() => {
          if (Resrcserr) {
            return (
              <Alert
                errmsg={Resrcserr}
                pSetParentErr={(p) => setResrcserr(p)}
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
        <div className={cn(a.flexcontainer, a.flexcontainercenter)}>
          <div className={cn(a.fltr, a.flexcfltr, a.flexcntnrspacebtwen)}>
            <div className={a.algncenter}>
              <label htmlFor="fname">Resrc:</label>
            </div>
            <div className={a.algncenter}>
              <input
                type="text"
                id="fname"
                name="fname"
                value={srchResrc}
                onChange={(event) => {
                  setSrchResrc(event.target.value);
                }}
              />
            </div>
            <div className={a.algncenter}>
              <button
                className={(a.btn, a.btnoper)}
                onClick={() => {
                  vappcontext.pSetResrc("");
                  fetchResrcs().then((result) =>
                    vappcontext.pSetResrcs(result.data)
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
              <th>Resrc</th>
              <th>Descr</th>
            </tr>
          </thead>
          <tbody>
            {vappcontext.vResrcs.map((item) => (
              <tr
                className={
                  vappcontext.vResrc.CurResrcId === item.Id
                    ? cn(a.selectedrow)
                    : cn(a.unselectedrow)
                }
                key={item.Id}
                onClick={() => {
                  vappcontext.pSetResrc(item.Id);
                }}
                onDoubleClick={() => vappcontext.pSetState("resrcs", "edit")}
              >
                <td> {item.Id}</td>
                <td> {item.Resrc}</td>
                <td> {item.Descr}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <CRUDbtns
          pDelShowConfirm={() => setShowConfirm(a)}
          pSetParentRecs={(Resrcs) => vappcontext.pSetResrcs(Resrcs)}
          pFetchParentRecs={() => fetchResrcs()}
          pParentStateEdit={{
            CurProcess: "resrcs",
            CurFunc: "edit",
          }}
          pParentStateInsert={{
            CurProcess: "resrcs",
            CurFunc: "insert",
          }}
          pEmptyCurRec={{
            CurResrcId: "",
          }}
          pSetParentState={(cur) =>
            vappcontext.pSetState(cur.CurProcess, cur.CurFunc)
          }
          pSetParentCurRec={(h) => vappcontext.pSetResrc(h.CurResrcId)}
          pParentCurId={vappcontext.vResrc.CurResrcId}
        />
        <Paging
          rp={vappcontext.vResrcsRp}
          setRp={(vrp) => vappcontext.pSetResrcsRp(vrp)}
          pn={vappcontext.vResrcsPn}
          setPn={(vrp) => vappcontext.pSetResrcsPn(vrp)}
        />
      </div>
    );
  }

  if (vappcontext.vState.CurFunc === "list") {
    return listResrcs();
  } else {
    return <EditResrcs pFetchResrcs={() => fetchResrcs()} />;
  }
}

export default Resrcs;
