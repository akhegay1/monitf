import React, { Fragment, useContext, useState, useEffect } from "react";
import appcontext from "../../appcontext";
//import axios from "axios";
import t from "./Emails.module.scss";
import a from "../../App.module.scss";
import cn from "classnames";
import axios from "axios";
import Alert from "../Alert/Alert";
import { ctimeout } from "../../params.js";
import { baseurl } from "../../params.js";

const urlupd = `${baseurl}emails/update`;
const urlins = `${baseurl}emails/create`;

function EditEmail(props) {
  const vappcontext = useContext(appcontext);
  const [emailstate, setEmailstate] = useState({
    Id: vappcontext.vEmail.CurEmailId,
    Email: "",
    Fio: "",
    Descr: "",
  });
  console.log("emailstate", emailstate);
  const [emailErr, setEmailErr] = useState("");

  const fetchEmail = async () => {
    console.log("start fetchEmail");

    const url = `${baseurl}email?id=${emailstate.Id}`;

    const result = await axios(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      timeout: ctimeout,
    }).catch((error) => {
      console.log("fetchEmail " + error.message);
      setEmailErr(error.response.data);
      return { data: [{ err: error.message }] };
    });

    console.log("result.data", result.data);
    if (!emailstate.Id) {
      result.data = { Id: "", Email: "", Descr: "" };
    }
    return result;
  };

  async function saveClick() {
    const oper = vappcontext.vState.CurFunc;

    if (oper === "edit") {
      const data = JSON.stringify({
        Id: vappcontext.vEmail.CurEmailId,
        Email: emailstate.Email,
        Fio: emailstate.Fio,
        Descr: emailstate.Descr,
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
          vappcontext.pSetEmail(
            response.data,
            emailstate.Email,
            emailstate.Fio,
            emailstate.Descr
          );
          props
            .pFetchEmails()
            .then((result) => vappcontext.pSetEmails(result.data));
          vappcontext.pSetState("emails", "list");
        })
        .catch((error) => {
          console.log(error.response.data);
          setEmailErr(error.response.data);
        });
    } else if (oper === "insert") {
      const data = JSON.stringify({
        Id: 0,
        Email: emailstate.Email,
        Fio: emailstate.Fio,
        Descr: emailstate.Descr,
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
          vappcontext.pSetEmail(
            response.data,
            emailstate.Emailname,
            emailstate.Descr
          );
          props
            .pFetchEmails()
            .then((result) => vappcontext.pSetEmails(result.data));
          vappcontext.pSetState("emails", "list");
          console.log("aft ins");
        })
        .catch((error) => {
          console.log(error.response.data);
          setEmailErr(error.response.data);
        });
    }
  }

  useEffect(() => {
    fetchEmail().then((result) => setEmailstate(result.data));
  }, []);

  //console.log("emailstate sss", emailstate);
  return (
    <Fragment>
      {(() => {
        if (emailErr) {
          return (
            <Alert errmsg={emailErr} pSetParentErr={(p) => setEmailErr(p)} />
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
              <td> Email </td>
              <td>
                <input
                  type="text"
                  value={emailstate.Email}
                  onChange={(event) => {
                    setEmailstate({
                      ...emailstate,
                      Email: event.target.value,
                    });
                  }}
                />
              </td>
            </tr>
            <tr>
              <td> Fio </td>
              <td>
                <input
                  type="text"
                  value={emailstate.Fio}
                  onChange={(event) => {
                    setEmailstate({
                      ...emailstate,
                      Fio: event.target.value,
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
                  value={emailstate.Descr}
                  onChange={(event) => {
                    setEmailstate({
                      ...emailstate,
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
          onClick={() => vappcontext.pSetState("emails", "list")}
        >
          Cancel
        </button>
      </div>
    </Fragment>
  );
}

export default EditEmail;
