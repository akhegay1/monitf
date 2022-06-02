import React, { Fragment, useContext, useState, useEffect } from "react";
import appcontext from "../../appcontext";
//import t from "./Metrics.module.scss";
import a from "../../App.module.scss";
import cn from "classnames";
import axios from "axios";
import Alert from "../Alert/Alert";
import { ctimeout } from "../../params.js";
import { baseurl } from "../../params.js";

const urlcreate = `${baseurl}user_role/create`;
const urldelete = `${baseurl}user_role/delete`;

//222
function UsersRoles(props) {
  const vappcontext = useContext(appcontext);

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [usersRoles, setUsersRoles] = useState([]);
  //const [selectedUser, setSelectedUser] = useState();
  const [selectedRole, setSelectedRole] = useState();
  const [selectedUserRole, setSelectedUserRole] = useState();

  let [userRoleErr, setUserRoleErr] = useState("");

  const fetchUsers = async () => {
    console.log("start fetchUsers");

    let url = `${baseurl}users`;

    const result = await axios(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      timeout: ctimeout,
    }).catch((error) => {
      console.log("fetchUsers " + error.message);
      setUserRoleErr(error.response.data);
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
      setUserRoleErr(error.response.data);
      return { data: [{ err: error.message }] };
    });
    console.log("result", result);
    return result;
  };

  const fetchUsersRolesByUid = async () => {
    let url = `${baseurl}user_rolesbyid?uid=${vappcontext.vUserRole.CurUser_RoleId}`;
    console.log(url);
    const result = await axios(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      timeout: ctimeout,
    }).catch((error) => {
      console.log("fetchUsersRolesByUid " + error.message);
      setUserRoleErr(error.response.data);
      return { data: [{ err: error.message }] };
    });
    return result;
  };

  async function createUserRole() {
    let data = JSON.stringify({
      Id: 0,
      Userid: parseInt(vappcontext.vUserRole.CurUser_RoleId),
      Roleid: parseInt(selectedRole),
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
        fetchUsers().then((result) => setUsers(result.data));
        fetchRoles().then((result) => setRoles(result.data));
        fetchUsersRolesByUid().then((result) => setUsersRoles(result.data));
      })
      .catch((error) => {
        console.log(error.response.data);
        setUserRoleErr(error.response.data);
      });
  }

  async function deleteUserRole() {
    let data = JSON.stringify({
      Id: parseInt(selectedUserRole),
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
        fetchUsers().then((result) => setUsers(result.data));
        fetchRoles().then((result) => setRoles(result.data));
        fetchUsersRolesByUid().then((result) => setUsersRoles(result.data));
      })
      .catch((error) => {
        console.log(error.response.data);
        setUserRoleErr(error.response.data);
      });
  }

  useEffect(() => {
    fetchUsers().then((result) => setUsers(result.data));
    fetchRoles().then((result) => setRoles(result.data));
  }, []);

  useEffect(() => {
    fetchUsersRolesByUid().then((result) => setUsersRoles(result.data));
  }, [vappcontext.vUserRole.CurUser_RoleId]);

  return (
    <Fragment>
      {(() => {
        if (userRoleErr) {
          return (
            <Alert
              errmsg={userRoleErr}
              pSetParentErr={(p) => setUserRoleErr(p)}
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
              <th>Users</th>
              <th>Roles</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={cn(a.tdcenter)} width="50%">
                <select
                  size="10"
                  style={{ width: "200px" }}
                  value={vappcontext.vUserRole.CurUser_RoleId}
                >
                  {users.map((items) => (
                    <option
                      key={items.Id}
                      value={items.Id}
                      onClick={(event) => {
                        console.log("event.target.value", event.target.value);
                        vappcontext.pSetUser_Role(event.target.value);
                      }}
                    >
                      {items.Username}
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
                    setSelectedRole(event.target.value);
                  }}
                  onDoubleClick={(event) => {
                    console.log("event.target.value", event.target.value);
                    setSelectedRole(event.target.value);
                    createUserRole();
                  }}
                  value={selectedRole}
                >
                  {roles.map((items) => (
                    <option key={items.Id} value={items.Id}>
                      {items.Role}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr className={a.headerrow}>
              <th colSpan={"2"}>Granted Roles</th>
            </tr>
            <tr>
              <td className={cn(a.tdcenter)} colSpan={"2"}>
                <select
                  size="10"
                  style={{ width: "400px" }}
                  onClick={(event) => {
                    console.log("event.target.value", event.target.value);
                    setSelectedUserRole(event.target.value);
                  }}
                  onDoubleClick={(event) => {
                    console.log("event.target.value", event.target.value);
                    setSelectedRole(event.target.value);
                    deleteUserRole();
                  }}
                  value={selectedUserRole}
                >
                  {usersRoles.map((items) => (
                    <option key={items.Id} value={items.Id}>
                      {items.Role}
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

export default UsersRoles;
