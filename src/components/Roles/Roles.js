import React, { useContext, useState, useEffect } from "react";
import appcontext from "../../appcontext";
import axios from "axios";
import a from "../../App.module.scss";
import Alert from "../Alert/Alert";
import Confirmation from "../Confirmation/Confirmation";
import Paging from "../Paging/Paging";
import EditRoles from "./EditRoles";
import CRUDbtns from "../CRUDbtns/CRUDbtns";
import cn from "classnames";
import { ctimeout } from "../../params.js";
import { baseurl } from "../../params.js";

function Roles() {
  console.log("start Roles");
  const vappcontext = useContext(appcontext);

  let [roleserr, setRoleserr] = useState("");
  const [srchRole, setSrchRole] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  let rp = vappcontext.vRolesRp;
  let pn = vappcontext.vRolesPn;

  const fetchRoles = async () => {
    console.log("start fetchRoles");

    let url = `${baseurl}roles?rp=${rp}&pn=${pn}`;

    let srchStr;
    if (srchRole) {
      srchStr = `&sh=${srchRole}`;
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
      console.log("fetchRoles " + error.message);
      setRoleserr(error.response.data);
      return { data: [{ err: error.message }] };
    });
    console.log("result", result);
    return result;
  };

  async function delClick() {
    const urldel = `${baseurl}roles/delete`;
    let data = JSON.stringify({
      Id: vappcontext.vRole.CurRoleId,
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
        setRoleserr(error.response.data);
      });
    vappcontext.pSetRole("", "", "");
    fetchRoles().then((result) => vappcontext.pSetRoles(result.data));
  }

  useEffect(() => {
    fetchRoles().then((result) => vappcontext.pSetRoles(result.data));
  }, [vappcontext.vRolesPn, vappcontext.vRolesRp]);

  function listRoles() {
    return (
      <div>
        {(() => {
          console.log("roleserr", roleserr);
          if (roleserr) {
            return (
              <Alert errmsg={roleserr} pSetParentErr={(p) => setRoleserr(p)} />
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
              <label htmlFor="fname">Role:</label>
            </div>
            <div className={a.algncenter}>
              <input
                type="text"
                id="fname"
                name="fname"
                value={srchRole}
                onChange={(event) => {
                  setSrchRole(event.target.value);
                }}
              />
            </div>
            <div className={a.algncenter}>
              <button
                className={(a.btn, a.btnoper)}
                onClick={() => {
                  vappcontext.pSetRole("");
                  fetchRoles().then((result) =>
                    vappcontext.pSetRoles(result.data)
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
              <th>Role</th>
              <th>Descr</th>
            </tr>
          </thead>
          <tbody>
            {vappcontext.vRoles.map((item) => (
              <tr
                className={
                  vappcontext.vRole.CurRoleId === item.Id
                    ? cn(a.selectedrow)
                    : cn(a.unselectedrow)
                }
                key={item.Id}
                onClick={() => {
                  vappcontext.pSetRole(item.Id);
                }}
                onDoubleClick={() => vappcontext.pSetState("roles", "edit")}
              >
                <td> {item.Id}</td>
                <td> {item.Role}</td>
                <td> {item.Descr}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <CRUDbtns
          pDelShowConfirm={() => setShowConfirm(a)}
          pSetParentRecs={(roles) => vappcontext.pSetRoles(roles)}
          pFetchParentRecs={() => fetchRoles()}
          pParentStateEdit={{
            CurProcess: "roles",
            CurFunc: "edit",
          }}
          pParentStateInsert={{
            CurProcess: "roles",
            CurFunc: "insert",
          }}
          pEmptyCurRec={{
            CurRoleId: "",
          }}
          pSetParentState={(cur) =>
            vappcontext.pSetState(cur.CurProcess, cur.CurFunc)
          }
          pSetParentCurRec={(h) => vappcontext.pSetRole(h.CurRoleId)}
          pParentCurId={vappcontext.vRole.CurRoleId}
        />
        <Paging
          rp={vappcontext.vRolesRp}
          setRp={(vrp) => vappcontext.pSetRolesRp(vrp)}
          pn={vappcontext.vRolesPn}
          setPn={(vrp) => vappcontext.pSetRolesPn(vrp)}
        />
      </div>
    );
  }

  if (vappcontext.vState.CurFunc === "list") {
    return listRoles();
  } else {
    return <EditRoles pFetchRoles={() => fetchRoles()} />;
  }
}

export default Roles;
