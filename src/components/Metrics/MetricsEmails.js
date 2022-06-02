import React, { Fragment, useContext, useState, useEffect } from "react";
//import t from "./Metrics.module.scss";
import appcontext from "../../appcontext";
//import axios from "axios";
import a from "../../App.module.scss";
import cn from "classnames";
import axios from "axios";
import Alert from "../Alert/Alert";
import { ctimeout } from "../../params.js";
import { baseurl } from "../../params.js";

const urlcreate = `${baseurl}metrics_emails/create`;
const urldelete = `${baseurl}metrics_emails/delete`;

//222
function Addmails(props) {
  const vappcontext = useContext(appcontext);

  const [metrics_emails, setMetrics_emails] = useState([]);
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState();
  const [selectedMetricEmail, setSelectedMetricEmail] = useState();

  let [metricsemailsErr, setMetricsemailsErr] = useState("");

  const fetchMetrics_emails = async () => {
    let url = `${baseurl}metrics_emails?mid=${vappcontext.vMetric.CurMetricId}`;
    const result = await axios(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      timeout: ctimeout,
    }).catch((error) => {
      console.log("fetchMetrcs_emails " + error.message);
      return { data: [{ err: error.message }] };
    });
    return result;
  };

  const fetchEmails = async () => {
    let url = `${baseurl}metrics_emails/emails?mid=${vappcontext.vMetric.CurMetricId}`;
    const result = await axios(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      timeout: ctimeout,
    }).catch((error) => {
      console.log("fetchEmails " + error.message);
      return { data: [{ err: error.message }] };
    });
    return result;
  };

  async function createMetricEmail() {
    const oper = vappcontext.vState.CurFunc;

    if (oper === "addmails") {
      let data = JSON.stringify({
        Id: 0,
        Metricid: vappcontext.vMetric.CurMetricId,
        Emailid: parseInt(selectedEmail),
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
          fetchEmails().then((result) => setEmails(result.data));
          fetchMetrics_emails().then((result) =>
            setMetrics_emails(result.data)
          );
        })
        .catch((error) => {
          console.log(error.response.data);
          setMetricsemailsErr(error.response.data);
        });
    }
  }

  async function deleteMetricEmail() {
    const oper = vappcontext.vState.CurFunc;

    if (oper === "addmails") {
      let data = JSON.stringify({
        Id: parseInt(selectedMetricEmail),
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
          fetchEmails().then((result) => setEmails(result.data));
          fetchMetrics_emails().then((result) =>
            setMetrics_emails(result.data)
          );
        })
        .catch((error) => {
          console.log(error.response.data);
          setMetricsemailsErr(error.response.data);
        });
    }
  }

  useEffect(() => {
    fetchEmails().then((result) => setEmails(result.data));
    fetchMetrics_emails().then((result) => setMetrics_emails(result.data));
  }, []);

  return (
    <Fragment>
      {(() => {
        if (metricsemailsErr) {
          return (
            <Alert
              errmsg={metricsemailsErr}
              pSetParentErr={(p) => setMetricsemailsErr(p)}
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
              <th>Available Emails</th>
              <th></th>
              <th>Emails for notifications</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={cn(a.tdcenter)}>
                <select
                  size="10"
                  onClick={(event) => {
                    //console.log("event.target.value", event.target.value);
                    setSelectedEmail(event.target.value);
                  }}
                  value={selectedEmail}
                >
                  {emails.map((items) => (
                    <option key={items.Id} value={items.Id}>
                      {items.Fio}
                    </option>
                  ))}
                </select>
              </td>
              <td className={cn(a.tdcenter)} width="20%">
                <button
                  className={cn(a.btn, a.btnoperarr)}
                  onClick={() => {
                    console.log("selectedEmail", selectedEmail);
                    createMetricEmail();
                  }}
                >
                  &#62;&#62;
                </button>
                <br />
                <br />
                <button
                  className={cn(a.btn, a.btnoperarr)}
                  onClick={() => {
                    console.log("selectedMetricEmail", selectedMetricEmail);
                    deleteMetricEmail();
                  }}
                >
                  &#60;&#60;
                </button>
              </td>
              <td className={cn(a.tdcenter)}>
                <select
                  size="10"
                  onClick={(event) => {
                    console.log("event.target.value", event.target.value);
                    setSelectedMetricEmail(event.target.value);
                  }}
                  value={selectedMetricEmail}
                >
                  {metrics_emails.map((items) => (
                    <option key={items.Id} value={items.Id}>
                      {items.Fio}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className={cn(a.flexcontainer, a.flexcontainerend)}>
        <button
          className={cn(a.btn, a.btnoper)}
          onClick={() => vappcontext.pSetState("metrics", "edit")}
        >
          Back
        </button>
      </div>
      <br />
      <br />
    </Fragment>
  );
}

export default Addmails;
