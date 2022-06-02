import React, { useContext, useState, useEffect } from "react";
import appcontext from "../../appcontext";
import axios from "axios";
import a from "../../App.module.scss";
import Alert from "../Alert/Alert";
import Confirmation from "../Confirmation/Confirmation";
import Paging from "../Paging/Paging";
import EditUsers from "./EditUsers";
import CRUDbtns from "../CRUDbtns/CRUDbtns";
import cn from "classnames";
import { ctimeout } from "../../params.js";
import { baseurl } from "../../params.js";

function Users() {
  console.log("start Users");
  const vappcontext = useContext(appcontext);

  let [userserr, setUserserr] = useState("");
  const [srchUser, setSrchUser] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  let rp = vappcontext.vUsersRp;
  let pn = vappcontext.vUsersPn;

  const fetchUsers = async () => {
    console.log("start fetchUsers");

    let url = `${baseurl}users?rp=${rp}&pn=${pn}`;

    let srchStr;
    if (srchUser) {
      srchStr = `&sh=${srchUser}`;
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
      console.log("fetchUsers " + error.message);
      setUserserr(error.response.data);
      return { data: [{ err: error.message }] };
    });
    console.log("result", result);
    return result;
  };

  async function delClick() {
    const urldel = `${baseurl}users/delete`;
    let data = JSON.stringify({
      Id: vappcontext.vUser.CurUserId,
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
        setUserserr(error.response.data);
      });
    vappcontext.pSetUser("", "", "");
    fetchUsers().then((result) => vappcontext.pSetUsers(result.data));
  }

  useEffect(() => {
    fetchUsers().then((result) => vappcontext.pSetUsers(result.data));
  }, [vappcontext.vUsersPn, vappcontext.vUsersRp]);

  function listUsers() {
    return (
      <div>
        {(() => {
          if (userserr) {
            return (
              <Alert errmsg={userserr} pSetParentErr={(p) => setUserserr(p)} />
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
              <label htmlFor="fname">User:</label>
            </div>
            <div className={a.algncenter}>
              <input
                type="text"
                id="fname"
                name="fname"
                value={srchUser}
                onChange={(event) => {
                  setSrchUser(event.target.value);
                }}
              />
            </div>
            <div className={a.algncenter}>
              <button
                className={(a.btn, a.btnoper)}
                onClick={() => {
                  vappcontext.pSetUser("");
                  fetchUsers().then((result) =>
                    vappcontext.pSetUsers(result.data)
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
              <th>Fio</th>
              <th>Username</th>
              <th>DtStart</th>
            </tr>
          </thead>
          <tbody>
            {vappcontext.vUsers.map((item) => (
              <tr
                className={
                  vappcontext.vUser.CurUserId === item.Id
                    ? cn(a.selectedrow)
                    : cn(a.unselectedrow)
                }
                key={item.Id}
                onClick={() => {
                  vappcontext.pSetUser(item.Id);
                }}
                onDoubleClick={() => vappcontext.pSetState("users", "edit")}
              >
                <td> {item.Id}</td>
                <td> {item.Fio}</td>
                <td> {item.Username}</td>
                <td> {item.DtStart}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <CRUDbtns
          pDelShowConfirm={() => setShowConfirm(a)}
          pSetParentRecs={(users) => vappcontext.pSetUsers(users)}
          pFetchParentRecs={() => fetchUsers()}
          pParentStateEdit={{
            CurProcess: "users",
            CurFunc: "edit",
          }}
          pParentStateInsert={{
            CurProcess: "users",
            CurFunc: "insert",
          }}
          pEmptyCurRec={{
            CurUserId: "",
          }}
          pSetParentState={(cur) =>
            vappcontext.pSetState(cur.CurProcess, cur.CurFunc)
          }
          pSetParentCurRec={(h) => vappcontext.pSetUser(h.CurUserId)}
          pParentCurId={vappcontext.vUser.CurUserId}
        />
        <Paging
          rp={vappcontext.vUsersRp}
          setRp={(vrp) => vappcontext.pSetUsersRp(vrp)}
          pn={vappcontext.vUsersPn}
          setPn={(vrp) => vappcontext.pSetUsersPn(vrp)}
        />
      </div>
    );
  }

  if (vappcontext.vState.CurFunc === "list") {
    return listUsers();
  } else {
    return <EditUsers pFetchUsers={() => fetchUsers()} />;
  }
}

export default Users;
