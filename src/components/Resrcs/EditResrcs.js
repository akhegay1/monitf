import React, { Fragment, useContext, useState, useEffect } from "react";
import appcontext from "../../appcontext";
//import axios from "axios";
import t from "./Resrcs.module.scss";
import a from "../../App.module.scss";
import cn from "classnames";
import axios from "axios";
import Alert from "../Alert/Alert";
import { ctimeout } from "../../params.js";
import { baseurl } from "../../params.js";

const urlupd = `${baseurl}resrcs/update`;
const urlins = `${baseurl}resrcs/create`;

function EditResrc(props) {
  const vappcontext = useContext(appcontext);
  const [resrcstate, setResrcstate] = useState({
    Id: vappcontext.vResrc.CurResrcId,
    Resrc: "",
    Descr: "",
  });
  console.log("resrcstate", resrcstate);
  let [resrcErr, setResrcErr] = useState("");

  const fetchResrc = async () => {
    console.log("start fetchResrc");

    let url = `${baseurl}resrc?id=${resrcstate.Id}`;

    const result = await axios(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      timeout: ctimeout,
    }).catch((error) => {
      console.log("fetchResrc " + error.message);
      setResrcErr(error.response.data);
      return { data: [{ err: error.message }] };
    });

    console.log("result.data", result.data);
    if (!resrcstate.Id) {
      result.data = { Id: "", Resrc: "", Descr: "" };
    }
    return result;
  };

  async function saveClick() {
    const oper = vappcontext.vState.CurFunc;

    if (oper === "edit") {
      let data = JSON.stringify({
        Id: vappcontext.vResrc.CurResrcId,
        Resrc: resrcstate.Resrc,
        Descr: resrcstate.Descr,
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
          vappcontext.pSetResrc(
            response.data,
            resrcstate.Resrc,
            resrcstate.Descr
          );
          props
            .pFetchResrcs()
            .then((result) => vappcontext.pSetResrcs(result.data));
          vappcontext.pSetState("resrcs", "list");
        })
        .catch((error) => {
          console.log(error.response.data);
          setResrcErr(error.response.data);
        });
    } else if (oper === "insert") {
      let data = JSON.stringify({
        Id: 0,
        Resrc: resrcstate.Resrc,
        Descr: resrcstate.Descr,
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
          vappcontext.pSetResrc(
            response.data,
            resrcstate.Resrc,
            resrcstate.Descr
          );
          props
            .pFetchResrcs()
            .then((result) => vappcontext.pSetResrcs(result.data));
          vappcontext.pSetState("resrcs", "list");
          console.log("aft ins");
        })
        .catch((error) => {
          console.log(error.response.data);
          setResrcErr(error.response.data);
        });
    }
  }

  useEffect(() => {
    fetchResrc().then((result) => setResrcstate(result.data));
  }, []);

  //console.log("resrcstate sss", resrcstate);
  return (
    <Fragment>
      {(() => {
        if (resrcErr) {
          return (
            <Alert errmsg={resrcErr} pSetParentErr={(p) => setResrcErr(p)} />
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
              <td> Resrc </td>
              <td>
                <input
                  type="text"
                  value={resrcstate.Resrc}
                  onChange={(event) => {
                    setResrcstate({
                      ...resrcstate,
                      Resrc: event.target.value,
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
                  value={resrcstate.Descr}
                  onChange={(event) => {
                    setResrcstate({
                      ...resrcstate,
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
          onClick={() => vappcontext.pSetState("resrcs", "list")}
        >
          Cancel
        </button>
      </div>
    </Fragment>
  );
}

export default EditResrc;
