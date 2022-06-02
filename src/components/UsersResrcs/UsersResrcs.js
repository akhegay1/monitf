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

const urlcreate = `${baseurl}user_resrc/create`;
const urldelete = `${baseurl}user_resrc/delete`;

//222
function UsersResrcs(props) {
  const vappcontext = useContext(appcontext);

  const [users, setUsers] = useState([]);
  const [resrcs, setResrcs] = useState([]);
  const [usersResrcs, setUsersResrcs] = useState([]);
  //const [selectedUser, setSelectedUser] = useState();
  const [selectedResrc, setSelectedResrc] = useState();
  const [selectedUserResrc, setSelectedUserResrc] = useState();

  let [userresrcErr, setUserResrcErr] = useState("");

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
      return { data: [{ err: error.message }] };
    });
    console.log("result", result);
    return result;
  };

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
      setUserResrcErr(error.response.data);
      return { data: [{ err: error.message }] };
    });
    console.log("result", result);
    return result;
  };

  const fetchUsersResrcsByUid = async () => {
    let url = `${baseurl}user_resrcsbyid?uid=${vappcontext.vUserResrc.CurUser_ResrcId}`;
    console.log(url);
    const result = await axios(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      timeout: ctimeout,
    }).catch((error) => {
      console.log("fetchUsersResrcsByUid " + error.message);
      return { data: [{ err: error.message }] };
    });
    return result;
  };

  async function createUserResrc() {
    let data = JSON.stringify({
      Id: 0,
      Usrid: parseInt(vappcontext.vUserResrc.CurUser_ResrcId),
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
        fetchUsers().then((result) => setUsers(result.data));
        fetchResrcs().then((result) => setResrcs(result.data));
        fetchUsersResrcsByUid().then((result) => setUsersResrcs(result.data));
      })
      .catch((error) => {
        console.log(error.response.data);
        setUserResrcErr(error.response.data);
      });
  }

  async function deleteUserResrc() {
    let data = JSON.stringify({
      Id: parseInt(selectedUserResrc),
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
        fetchResrcs().then((result) => setResrcs(result.data));
        fetchUsersResrcsByUid().then((result) => setUsersResrcs(result.data));
      })
      .catch((error) => {
        console.log(error.response.data);
        setUserResrcErr(error.response.data);
      });
  }

  useEffect(() => {
    fetchUsers().then((result) => setUsers(result.data));
    fetchResrcs().then((result) => setResrcs(result.data));
  }, []);

  useEffect(() => {
    fetchUsersResrcsByUid().then((result) => setUsersResrcs(result.data));
  }, [vappcontext.vUserResrc.CurUser_ResrcId]);

  return (
    <Fragment>
      {(() => {
        if (userresrcErr) {
          return (
            <Alert
              errmsg={userresrcErr}
              pSetParentErr={(p) => setUserResrcErr(p)}
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
              <th>Resorces</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={cn(a.tdcenter)} width="50%">
                <select
                  size="10"
                  style={{ width: "200px" }}
                  value={vappcontext.vUserResrc.CurUser_ResrcId}
                >
                  {users.map((items) => (
                    <option
                      key={items.Id}
                      value={items.Id}
                      onClick={(event) => {
                        vappcontext.pSetUser_Resrc(event.target.value);
                        console.log(vappcontext.vUserResrc.CurUser_ResrcId);
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
                    setSelectedResrc(event.target.value);
                  }}
                  onDoubleClick={(event) => {
                    console.log("event.target.value", event.target.value);
                    setSelectedResrc(event.target.value);
                    createUserResrc();
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
                    setSelectedUserResrc(event.target.value);
                  }}
                  onDoubleClick={(event) => {
                    console.log("event.target.value", event.target.value);
                    setSelectedResrc(event.target.value);
                    deleteUserResrc();
                  }}
                  value={selectedUserResrc}
                >
                  {usersResrcs.map((items) => (
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

export default UsersResrcs;
