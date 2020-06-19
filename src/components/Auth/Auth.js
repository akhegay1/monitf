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
  let [authErr, setAuthErr] = useState("");

  async function login() {
    let data = JSON.stringify({
      Username: username,
      Password: password,
    });
    await axios
      .post(`${baseurl}auth`, data, { timeout: ctimeout })
      .then((response) => {
        vappcontext.pSetAuthorized(response.data);
        localStorage.setItem("access_token", response.data.token);
        vappcontext.pSetState("hostname", "hostname", "list");
      })
      .catch((error) => {
        console.log(error.response.data.error);
        setAuthErr(error.response.data.error);
      });
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
          </tbody>
        </table>
        <div>
          <button
            className={a.btn}
            onClick={() => {
              console.log(login());
            }}
          >
            Login
          </button>
        </div>
      </div>
    </Fragment>
  );
}

export default Auth;
