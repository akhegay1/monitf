import React, { useContext, useState, useEffect } from "react";
import appcontext from "../../appcontext";
import axios from "axios";
import a from "../../App.module.scss";
import Alert from "../Alert/Alert";
import Confirmation from "../Confirmation/Confirmation";
import EditTmetrics from "./EditTmetrics";
import CRUDbtns from "../CRUDbtns/CRUDbtns";
import cn from "classnames";
import { ctimeout } from "../../params.js";
import { baseurl } from "../../params.js";

function Tmetrics() {
  console.log("start Tmetrics");
  const vappcontext = useContext(appcontext);

  let [tmetricserr, setTmetricserr] = useState("");
  //просто залипуха чтобы при клике и заходе в компонент fetch делался, как на других
  const [tmetricsPn, setTmetricsPn] = useState(0);

  const [showConfirm, setShowConfirm] = useState(false);

  const fetchTmetrics = async () => {
    console.log("start fetchTmetrics");

    let url = `${baseurl}tmetrics?rp=20&pn=1`;

    const result = await axios(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      timeout: ctimeout,
    }).catch((error) => {
      console.log("fetchTmetrics " + error.message);
      setTmetricserr(error.response.data);
      return { data: [{ err: error.message }] };
    });
    return result;
  };

  async function delClick() {
    const urldel = `${baseurl}tmetrics/delete`;
    let data = JSON.stringify({
      Id: vappcontext.vTmetric.CurTmetricId,
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
        setTmetricserr(error.response.data);
      });
    vappcontext.pSetTmetric("", "", "");
    fetchTmetrics().then((result) => vappcontext.pSetTmetrics(result.data));
  }

  //if tmetrics in context empty, then fetch from server
  function chkEmptyVars() {
    if (
      typeof vappcontext.vTmetrics !== "undefined" &&
      vappcontext.vTmetrics.length === 0
    ) {
      fetchTmetrics().then((result) => vappcontext.pSetTmetrics(result.data));
    }
  }
  useEffect(() => {
    fetchTmetrics().then((result) => vappcontext.pSetTmetrics(result.data));
  }, [tmetricsPn]);

  function listTmetrics() {
    return (
      <div>
        {(() => {
          if (tmetricserr) {
            return (
              <Alert
                errmsg={tmetricserr}
                pSetParentErr={(p) => setTmetricserr(p)}
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
            {vappcontext.vTmetrics.map((item) => (
              <tr
                className={
                  vappcontext.vTmetric.CurTmetricId === item.Id
                    ? cn(a.selectedrow)
                    : cn(a.unselectedrow)
                }
                key={item.Id}
                onClick={() => {
                  vappcontext.pSetTmetric(item.Id);
                }}
                onDoubleClick={() => vappcontext.pSetState("tmetrics", "edit")}
              >
                <td> {item.Id}</td>
                <td> {item.Tname}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <CRUDbtns
          pDelShowConfirm={() => setShowConfirm(a)}
          pSetParentRecs={(tmetrics) => vappcontext.pSetTmetrics(tmetrics)}
          pFetchParentRecs={() => fetchTmetrics()}
          pParentStateEdit={{
            CurProcess: "tmetrics",
            CurFunc: "edit",
          }}
          pParentStateInsert={{
            CurProcess: "tmetrics",
            CurFunc: "insert",
          }}
          pEmptyCurRec={{
            CurTmetricId: "",
            CurTname: "",
          }}
          pSetParentState={(cur) => {
            console.log("cur", cur);
            vappcontext.pSetState(cur.CurProcess, cur.CurFunc);
          }}
          pSetParentCurRec={(h) => vappcontext.pSetTmetric(h.CurTmetricId)}
          pParentCurId={vappcontext.vTmetric.CurTmetricId}
        />
      </div>
    );
  }

  if (vappcontext.vState.CurFunc === "list") {
    return listTmetrics();
  } else {
    return <EditTmetrics pFetchTmetrics={() => fetchTmetrics()} />;
  }
}

export default Tmetrics;
