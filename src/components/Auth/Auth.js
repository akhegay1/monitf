import React, { Fragment, useState, useContext } from "react";
import b from "./Auth.module.scss";
import a from "../../App.module.scss";
import cn from "classnames";
import { ctimeout } from "../../params.js";
import { baseurl } from "../../params.js";
import axios from "axios";
import Alert from "../Alert/Alert";
import appcontext from "../../appcontext";

function Auth() {
  const vappcontext = useContext(appcontext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authErr, setAuthErr] = useState("");

  const [JWTErr, setJWTErr] = useState("");

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };

  const fetchRolesByUser = async () => {
    console.log("start fetchRolesByUser");

    const token = parseJwt(localStorage.getItem("access_token"));
    console.log("token", token);
    console.log('token["user"]', token["user"]);

    const url = `${baseurl}user_rolesbyuserid?un=${token["user"]}`;

    console.log(localStorage.getItem("access_token"));

    const result = await axios(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }).catch((error) => {
      console.log("fetchRolesByUser " + error.message);
      setJWTErr(error.response.data);
      return { data: [{ err: error.message }] };
    });

    vappcontext.pSetUroles(result.data);

    return result;
  };

  async function login() {
    const data = JSON.stringify({
      Username: username,
      Password: password,
    });
    console.log(data);
    await axios
      .post(`${baseurl}auth`, data, { timeout: ctimeout })
      .then((response) => {
        vappcontext.pSetAuthorized(response.data);
        localStorage.setItem("access_token", response.data.token);

        //vappcontext.pSetState("monitors", "list");
      })
      .catch((error) => {
        console.log(error.response.data.error);
        setAuthErr(error.response.data.error);
      });
    fetchRolesByUser();
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      login();
    }
  };

  return (
    <Fragment>
      {(() => {
        if (authErr) {
          return (
            <Alert errmsg={authErr} pSetParentErr={(p) => setAuthErr(p)} />
          );
        }
      })()}
      <div className={cn(b.flexcontainer, b.flexborder)}>
        <table>
          <tbody>
            <tr>
              <td>Username</td>
              <td>
                <input
                  key="Username"
                  type="text"
                  value={username}
                  onChange={(event) => {
                    setUsername(event.target.value);
                  }}
                />
              </td>
            </tr>

            <tr>
              <td>Password</td>
              <td>
                <input
                  key="Password"
                  type="password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                  onKeyDown={handleKeyDown}
                />
              </td>
            </tr>
            <tr>
              <td colSpan="2" className={b.noborder}>
                <button
                  className={cn(a.btn, b.button)}
                  onClick={() => {
                    console.log(login());
                  }}
                >
                  Login
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Fragment>
  );
}

export default Auth;
