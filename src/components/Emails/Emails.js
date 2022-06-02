import React, { useContext, useState, useEffect } from "react";
import appcontext from "../../appcontext";
import axios from "axios";
import a from "../../App.module.scss";
import Alert from "../Alert/Alert";
import Confirmation from "../Confirmation/Confirmation";
import Paging from "../Paging/Paging";
import EditEmails from "./EditEmails";
import CRUDbtns from "../CRUDbtns/CRUDbtns";
import cn from "classnames";
import { ctimeout } from "../../params.js";
import { baseurl } from "../../params.js";

function Emails() {
  console.log("start Emails");
  const vappcontext = useContext(appcontext);

  const [emailserr, setEmailserr] = useState("");
  const [srchEmail, setSrchEmail] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const rp = vappcontext.vEmailsRp;
  const pn = vappcontext.vEmailsPn;

  const fetchEmails = async () => {
    console.log("start fetchEmails");

    let url = `${baseurl}emails?rp=${rp}&pn=${pn}`;

    let srchStr;
    if (srchEmail) {
      srchStr = `&sh=${srchEmail}`;
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
      console.log("fetchEmails " + error.message);
      setEmailserr(error.response.data);
      return { data: [{ err: error.message }] };
    });
    console.log("result", result);
    return result;
  };

  async function delClick() {
    const urldel = `${baseurl}emails/delete`;
    let data = JSON.stringify({
      Id: vappcontext.vEmail.CurEmailId,
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
        setEmailserr(error.response.data);
      });
    vappcontext.pSetEmail("", "", "");
    fetchEmails().then((result) => vappcontext.pSetEmails(result.data));
  }

  useEffect(() => {
    fetchEmails().then((result) => vappcontext.pSetEmails(result.data));
  }, [vappcontext.vEmailsPn, vappcontext.vEmailsRp]);

  function listEmails() {
    return (
      <div>
        {(() => {
          if (emailserr) {
            return (
              <Alert
                errmsg={emailserr}
                pSetParentErr={(p) => setEmailserr(p)}
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
              <label htmlFor="fname">Email:</label>
            </div>
            <div className={a.algncenter}>
              <input
                type="text"
                id="fname"
                name="fname"
                value={srchEmail}
                onChange={(event) => {
                  setSrchEmail(event.target.value);
                }}
              />
            </div>
            <div className={a.algncenter}>
              <button
                className={(a.btn, a.btnoper)}
                onClick={() => {
                  vappcontext.pSetEmail("");
                  fetchEmails().then((result) =>
                    vappcontext.pSetEmails(result.data)
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
              <th>Email</th>
              <th>Fio</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {vappcontext.vEmails.map((item) => (
              <tr
                className={
                  vappcontext.vEmail.CurEmailId === item.Id
                    ? cn(a.selectedrow)
                    : cn(a.unselectedrow)
                }
                key={item.Id}
                onClick={() => {
                  vappcontext.pSetEmail(item.Id);
                }}
                onDoubleClick={() => vappcontext.pSetState("emails", "edit")}
              >
                <td> {item.Id}</td>
                <td> {item.Email}</td>
                <td> {item.Fio}</td>
                <td> {item.Descr}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <CRUDbtns
          pDelShowConfirm={() => setShowConfirm(a)}
          pSetParentRecs={(emails) => vappcontext.pSetEmails(emails)}
          pFetchParentRecs={() => fetchEmails()}
          pParentStateEdit={{
            CurProcess: "emails",
            CurFunc: "edit",
          }}
          pParentStateInsert={{
            CurProcess: "emails",
            CurFunc: "insert",
          }}
          pEmptyCurRec={{
            CurEmailId: "",
          }}
          pSetParentState={(cur) =>
            vappcontext.pSetState(cur.CurProcess, cur.CurFunc)
          }
          pSetParentCurRec={(h) => vappcontext.pSetEmail(h.CurEmailId)}
          pParentCurId={vappcontext.vEmail.CurEmailId}
        />
        <Paging
          rp={vappcontext.vEmailsRp}
          setRp={(vrp) => vappcontext.pSetEmailsRp(vrp)}
          pn={vappcontext.vEmailsPn}
          setPn={(vrp) => vappcontext.pSetEmailsPn(vrp)}
        />
      </div>
    );
  }

  if (vappcontext.vState.CurFunc === "list") {
    return listEmails();
  } else {
    return <EditEmails pFetchEmails={() => fetchEmails()} />;
  }
}

export default Emails;
