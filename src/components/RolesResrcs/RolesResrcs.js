import React, { Fragment, useContext, useState, useEffect } from "react";
import appcontext from "../../appcontext";
//import t from "./Metrics.module.scss";
//import axios from "axios";
import a from "../../App.module.scss";
import cn from "classnames";
import axios from "axios";
import Alert from "../Alert/Alert";
import { ctimeout } from "../../params.js";
import { baseurl } from "../../params.js";

const urlcreate = `${baseurl}role_resrc/create`;
const urldelete = `${baseurl}role_resrc/delete`;

//222
function RolesResrcs(props) {
  const vappcontext = useContext(appcontext);

  const [resrcs, setResrcs] = useState([]);
  const [roles, setRoles] = useState([]);
  const [rolesResrcs, setRolesResrcs] = useState([]);
  //const [selectedRole, setSelectedRole] = useState();
  const [selectedResrc, setSelectedResrc] = useState();
  const [selectedRoleResrc, setSelectedRoleResrc] = useState();

  let [roleResrcErr, setroleResrcErr] = useState("");

  const fetchResrcs = async () => {
    console.log("start fetchResrcs");

    let url = `${baseurl}resrcs`;

    const result = await axios(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      timeout: ctimeout,
    }).catch((error) => {
      console.log("fetchResrcs " + error.message);
      setroleResrcErr(error.response.data);
      return { data: [{ err: error.message }] };
    });
    console.log("result", result);
    return result;
  };

  const fetchRoles = async () => {
    console.log("start fetchRoles");

    let url = `${baseurl}roles`;

    const result = await axios(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      timeout: ctimeout,
    }).catch((error) => {
      console.log("fetchRoles " + error.message);
      setroleResrcErr(error.response.data);
      return { data: [{ err: error.message }] };
    });
    console.log("result", result);
    return result;
  };

  const fetchRolesResrcsByRoleid = async () => {
    let url = `${baseurl}role_resrcsbyid?rid=${vappcontext.vRoleResrc.CurRole_ResrcId}`;
    console.log(url);
    const result = await axios(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      timeout: ctimeout,
    }).catch((error) => {
      console.log("fetchRolesResrcsByRoleid " + error.message);
      setroleResrcErr(error.response.data);
      return { data: [{ err: error.message }] };
    });
    console.log("result", result);
    return result;
  };

  async function createRoleResrc() {
    let data = JSON.stringify({
      Id: 0,
      Roleid: parseInt(vappcontext.vRoleResrc.CurRole_ResrcId),
      Resrcid: parseInt(selectedResrc),
    });
    await axios
      .post(urlcreate, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        timeout: ctimeout,
      })
      .then((response) => {
        console.log("response.data create " + response.data);
        console.log("aft create");
        fetchRoles().then((result) => setRoles(result.data));
        fetchResrcs().then((result) => setResrcs(result.data));
        fetchRolesResrcsByRoleid().then((result) =>
          setRolesResrcs(result.data)
        );
      })
      .catch((error) => {
        console.log(error.response.data);
        setroleResrcErr(error.response.data);
      });
  }

  async function deleteRoleResrc() {
    let data = JSON.stringify({
      Id: parseInt(selectedRoleResrc),
    });
    await axios
      .post(urldelete, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        timeout: ctimeout,
      })
      .then((response) => {
        console.log("response.data create " + response.data);
        console.log("aft delete");
        fetchRoles().then((result) => setRoles(result.data));
        fetchResrcs().then((result) => setResrcs(result.data));
        fetchRolesResrcsByRoleid().then((result) =>
          setRolesResrcs(result.data)
        );
      })
      .catch((error) => {
        console.log(error.response.data);
        setroleResrcErr(error.response.data);
      });
  }

  useEffect(() => {
    fetchResrcs().then((result) => setResrcs(result.data));
    fetchRoles().then((result) => setRoles(result.data));
  }, []);

  useEffect(() => {
    fetchRolesResrcsByRoleid().then((result) => setRolesResrcs(result.data));
    console.log("rolesResrcs", rolesResrcs);
  }, [vappcontext.vRoleResrc.CurRole_ResrcId]);

  return (
    <Fragment>
      {(() => {
        if (roleResrcErr) {
          return (
            <Alert
              errmsg={roleResrcErr}
              pSetParentErr={(p) => setroleResrcErr(p)}
            />
          );
        }
      })()}
      <br />
      <br />

      <div className={cn(a.flexcontainer, a.flexcontainercenter)}>
        <table className={a.tablerows}>
          <thead>
            <tr className={a.headerrow}>
              <th>Roles</th>
              <th>Resources</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={cn(a.tdcenter)} width="50%">
                <select
                  size="10"
                  style={{ width: "200px" }}
                  value={vappcontext.vRoleResrc.CurRole_ResrcId}
                >
                  {roles.map((items) => (
                    <option
                      key={items.Id}
                      value={items.Id}
                      onClick={(event) => {
                        vappcontext.pSetRole_Resrc(event.target.value);
                        console.log(vappcontext.vRoleResrc.CurRole_ResrcId);
                      }}
                    >
                      {items.Role}
                    </option>
                  ))}
                </select>
              </td>

              <td className={cn(a.tdcenter)}>
                <select
                  size="10"
                  style={{ width: "200px" }}
                  onClick={(event) => {
                    console.log("event.target.value", event.target.value);
                    setSelectedResrc(event.target.value);
                  }}
                  onDoubleClick={(event) => {
                    console.log("event.target.value", event.target.value);
                    setSelectedResrc(event.target.value);
                    createRoleResrc();
                  }}
                  value={selectedResrc}
                >
                  {resrcs.map((items) => (
                    <option key={items.Id} value={items.Id}>
                      {items.Resrc}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr className={a.headerrow}>
              <th colSpan={"2"}>Granted Resources</th>
            </tr>
            <tr>
              <td className={cn(a.tdcenter)} colSpan={"2"}>
                <select
                  size="10"
                  style={{ width: "400px" }}
                  onClick={(event) => {
                    console.log("event.target.value", event.target.value);
                    setSelectedRoleResrc(event.target.value);
                  }}
                  onDoubleClick={(event) => {
                    console.log("event.target.value", event.target.value);
                    setSelectedResrc(event.target.value);
                    deleteRoleResrc();
                  }}
                  value={selectedRoleResrc}
                >
                  {rolesResrcs.map((items) => (
                    <option key={items.Id} value={items.Id}>
                      {items.Resrc}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <br />
      <br />
    </Fragment>
  );
}

export default RolesResrcs;
