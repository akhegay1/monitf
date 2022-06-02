import React, { Fragment, useContext, useState, useEffect } from "react";
import appcontext from "../../appcontext";
//import axios from "axios";
import t from "./Roles.module.scss";
import a from "../../App.module.scss";
import cn from "classnames";
import axios from "axios";
import Alert from "../Alert/Alert";
import { ctimeout } from "../../params.js";
import { baseurl } from "../../params.js";

const urlupd = `${baseurl}roles/update`;
const urlins = `${baseurl}roles/create`;

function EditRole(props) {
  const vappcontext = useContext(appcontext);
  const [rolestate, setRolestate] = useState({
    Id: vappcontext.vRole.CurRoleId,
    Role: "",
    Descr: "",
  });
  console.log("rolestate", rolestate);
  let [roleErr, setRoleErr] = useState("");

  const fetchRole = async () => {
    console.log("start fetchRole");

    let url = `${baseurl}role?id=${rolestate.Id}`;

    const result = await axios(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      timeout: ctimeout,
    }).catch((error) => {
      console.log("fetchRole " + error.message);
      setRoleErr(error.response.data);
      return { data: [{ err: error.message }] };
    });

    console.log("result.data", result.data);
    if (!rolestate.Id) {
      result.data = { Id: "", Role: "", Descr: "" };
    }
    return result;
  };

  async function saveClick() {
    const oper = vappcontext.vState.CurFunc;

    if (oper === "edit") {
      let data = JSON.stringify({
        Id: vappcontext.vRole.CurRoleId,
        Role: rolestate.Role,
        Descr: rolestate.Descr,
      });
      console.log("access_token", localStorage.getItem("access_token"));
      await axios
        .post(urlupd, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          timeout: ctimeout,
        })
        .then((response) => {
          console.log("response.data " + response.data);
          vappcontext.pSetRole(response.data, rolestate.Role, rolestate.Descr);
          props
            .pFetchRoles()
            .then((result) => vappcontext.pSetRoles(result.data));
          vappcontext.pSetState("roles", "list");
        })
        .catch((error) => {
          console.log(error.response.data);
          setRoleErr(error.response.data);
        });
    } else if (oper === "insert") {
      let data = JSON.stringify({
        Id: 0,
        Role: rolestate.Role,
        Descr: rolestate.Desct,
      });
      await axios
        .post(urlins, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          timeout: ctimeout,
        })
        .then((response) => {
          console.log("response.data ins " + response.data);
          vappcontext.pSetRole(response.data, rolestate.Role, rolestate.Descr);
          props
            .pFetchRoles()
            .then((result) => vappcontext.pSetRoles(result.data));
          vappcontext.pSetState("roles", "list");
          console.log("aft ins");
        })
        .catch((error) => {
          console.log(error.response.data);
          setRoleErr(error.response.data);
        });
    }
  }

  useEffect(() => {
    fetchRole().then((result) => setRolestate(result.data));
  }, []);

  //console.log("rolestate sss", rolestate);
  return (
    <Fragment>
      {(() => {
        if (roleErr) {
          return (
            <Alert errmsg={roleErr} pSetParentErr={(p) => setRoleErr(p)} />
          );
        }
      })()}
      <div className={cn(t.flexcontainer, t.flexcontainercenter)}>
        <table className={a.tablerows}>
          <thead>
            <tr className={a.headerrow}>
              <th>Name</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td> Role </td>
              <td>
                <input
                  type="text"
                  value={rolestate.Role}
                  onChange={(event) => {
                    setRolestate({
                      ...rolestate,
                      Role: event.target.value,
                    });
                  }}
                />
              </td>
            </tr>
            <tr>
              <td> Descr </td>
              <td>
                <input
                  type="text"
                  value={rolestate.Descr}
                  onChange={(event) => {
                    setRolestate({
                      ...rolestate,
                      Descr: event.target.value,
                    });
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className={cn(a.flexcontainer, a.flexcontainerend)}>
        <button
          className={cn(a.btn, a.btnoper)}
          onClick={() => {
            saveClick();
          }}
        >
          Save
        </button>
        <button
          className={cn(a.btn, a.btnoper)}
          onClick={() => vappcontext.pSetState("roles", "list")}
        >
          Cancel
        </button>
      </div>
    </Fragment>
  );
}

export default EditRole;
