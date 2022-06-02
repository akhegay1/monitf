/*Parent component, 
1)Contains in state current variables, such as current process or current table. 
2)Renders TopMenu and depending on current process, renders form. For example hostnames.
3)Create context and wraps Context Provider around TopMenu and form.
4)Using Context passes functions to change state of App from child components
*/

import React, { useState } from "react";
import "./App.css";
import appcontext from "./appcontext";
import Hostnames from "./components/Hostnames/Hostnames";
import Tmetrics from "./components/Tmetrics/Tmetrics";
import Srvgrps from "./components/Srvgrps/Srvgrps";
import ListReports from "./components/Reports/ListReports";
import Rep001 from "./components/Reports/AllReports/Rep001";
import Metrics from "./components/Metrics/Metrics";
import TopMenu from "./components/TopMenu/TopMenu";
import Monitors from "./components/Monitors/Monitors";
import MonitorsAll from "./components/MonitorsAll/MonitorsAll";
import MonitorsTbl from "./components/MonitorsTbl/MonitorsTbl";
import Charts from "./components/Charts/Charts";
import Emails from "./components/Emails/Emails";
import Users from "./components/Users/Users";
import Roles from "./components/Roles/Roles";
import Resrcs from "./components/Resrcs/Resrcs";
import UsersResrcs from "./components/UsersResrcs/UsersResrcs";
import UsersRoles from "./components/UsersRoles/UsersRoles";
import RolesResrcs from "./components/RolesResrcs/RolesResrcs";
import ChangeMyPwd from "./components/ChangeMyPwd/ChangeMyPwd";
import Auth from "./components/Auth/Auth";

function App() {
  //init state
  const [state, setState] = useState({
    CurProcess: "xxx",
    CurFunc: "list",
  });

  const [authorized, setAuthorized] = useState(false);

  //list of user roles
  const [uroles, setUroles] = useState([]);

  //list of hosts
  const [hostnames, setHostnames] = useState([{}]);
  //selected host
  const [hostname, setHostname] = useState({
    CurHostId: 0,
  });

  //Lang
  const [lang, setLang] = useState("ru");

  //Rp - rows per page, Pn - page number
  const [hostsRp, setHostsRp] = useState(10);
  const [hostsPn, setHostsPn] = useState(1);

  //list of emails
  const [emails, setEmails] = useState([]);
  //selected host
  const [email, setEmail] = useState({
    CurEmailId: 0,
  });
  //Rp - rows per page, Pn - page number
  const [emailsRp, setEmailsRp] = useState(10);
  const [emailsPn, setEmailsPn] = useState(1);

  //list of users
  const [users, setUsers] = useState([]);
  //selected host
  const [user, setUser] = useState({
    CurUserId: 0,
  });
  //Rp - rows per page, Pn - page number
  const [usersRp, setUsersRp] = useState(10);
  const [usersPn, setUsersPn] = useState(1);

  //list of users
  const [resrcs, setResrcs] = useState([]);
  //selected
  const [resrc, setResrc] = useState({
    CurUserId: 0,
  });
  //Rp - rows per page, Pn - page number
  const [resrcsRp, setResrcsRp] = useState(10);
  const [resrcsPn, setResrcsPn] = useState(1);

  //list of roles
  const [roles, setRoles] = useState([]);
  //selected role
  const [role, setRole] = useState({
    CurRoleId: 0,
  });
  //Rp - rows per page, Pn - page number
  const [rolesRp, setRolesRp] = useState(10);
  const [rolesPn, setRolesPn] = useState(1);

  //selected user_resrc
  const [user_resrc, setUser_resrc] = useState({
    CurUser_resrcId: 0,
  });

  //selected role_resrc
  const [role_resrc, setRole_resrc] = useState({
    CurRole_resrcId: 0,
  });

  //selected user_role
  const [user_role, setUser_role] = useState({
    CurUser_roleId: 0,
  });

  //list of Tmetrics
  const [tmetrics, setTmetrics] = useState([]);
  //selected Tmetric
  const [tmetric, setTmetric] = useState({
    CurTmetricId: 0,
  });

  //list of Srvgrps
  const [srvgrps, setSrvgrps] = useState([]);
  //selected Srvgrp
  const [srvgrp, setSrvgrp] = useState({
    CurTmetricId: 0,
  });

  //list of vmetrics
  const [vmetrics, setVmetrics] = useState([]);

  //list of vmetricsAll
  const [vmetricsAll, setVmetricsAll] = useState([]);

  //list of metrics
  const [metrics, setMetrics] = useState([]);
  //selected metric
  const [metric, setMetric] = useState({
    CurMetricId: 0,
  });
  //Rp - rows per page, Pn - page number
  const [metricsRp, setMetricsRp] = useState(20);
  const [metricsPn, setMetricsPn] = useState(1);

  //list of vmetricsCh for Chart
  const [vmetricsCh, setVmetricsCh] = useState([]);
  const [vmetricCh, setVmetricCh] = useState({
    CurHostCh: 0,
    CurDtStartCh: "2006-01-02T15:00",
    CurDtFinishCh: "2006-01-02T15:00",
  });

  //list of reports
  //const [reports, setReports] = useState([]);
  //selected report
  const [report, setReport] = useState({
    CurReport: "",
  });

  const [tmetricMon, setTmetricMon] = useState(1);
  const [interval, setInterval] = useState(0);

  const [srvgrpMon, setSrvgrpMon] = useState(1);

  return (
    <div className="App">
      <appcontext.Provider
        value={{
          vState: state,
          pSetState: (proc, fnc) => {
            setState({
              ...state,
              CurProcess: proc,
              CurFunc: fnc,
            });
          },
          ////////////////Hostnames///////////////////////////
          vHostnames: hostnames,
          pSetHosts: (hostnames) => {
            setHostnames(hostnames);
          },
          vHostname: hostname,
          pSetHostname: (id) =>
            setHostname({
              ...hostname,
              CurHostId: id,
            }),
          vHostsRp: hostsRp,
          pSetHostsRp: (rp) => {
            setHostsRp(rp);
          },
          vHostsPn: hostsPn,
          pSetHostsPn: (pn) => {
            setHostsPn(pn);
          },
          ////////////////Reports///////////////////////////
          vReport: report,
          pSetReport: (reportname) =>
            setReport({
              ...report,
              CurReport: reportname,
            }),
          ////////////////Emails///////////////////////////
          vEmails: emails,
          pSetEmails: (emails) => {
            setEmails(emails);
          },
          vEmail: email,
          pSetEmail: (id) =>
            setEmail({
              ...email,
              CurEmailId: id,
            }),
          vEmailsRp: emailsRp,
          pSetEmailsRp: (rp) => {
            setEmailsRp(rp);
          },
          vEmailsPn: emailsPn,
          pSetEmailsPn: (pn) => {
            setEmailsPn(pn);
          },

          ////////////////Lang///////////////////////////
          vLang: lang,
          pSetLang: (l) => {
            setLang(l);
          },

          ////////////////Uroles///////////////////////////
          vUroles: uroles,
          pSetUroles: (uroles) => {
            setUroles(uroles);
          },

          ////////////////Users///////////////////////////
          vUsers: users,
          pSetUsers: (users) => {
            setUsers(users);
          },
          vUser: user,
          pSetUser: (id) =>
            setUser({
              ...user,
              CurUserId: id,
            }),
          vUsersRp: usersRp,
          pSetUsersRp: (rp) => {
            setUsersRp(rp);
          },
          vUsersPn: usersPn,
          pSetUsersPn: (pn) => {
            setUsersPn(pn);
          },

          ////////////////Roles///////////////////////////
          vRoles: roles,
          pSetRoles: (roles) => {
            setRoles(roles);
          },
          vRole: role,
          pSetRole: (id) =>
            setRole({
              ...role,
              CurRoleId: id,
            }),
          vRolesRp: rolesRp,
          pSetRolesRp: (rp) => {
            setRolesRp(rp);
          },
          vRolesPn: rolesPn,
          pSetRolesPn: (pn) => {
            setRolesPn(pn);
          },

          ////////////////Rescrc///////////////////////////
          vResrcs: resrcs,
          pSetResrcs: (resrcs) => {
            setResrcs(resrcs);
          },
          vResrc: resrc,
          pSetResrc: (id) =>
            setResrc({
              ...resrc,
              CurResrcId: id,
            }),
          vResrcsRp: resrcsRp,
          pSetResrcsRp: (rp) => {
            setResrcsRp(rp);
          },
          vResrcsPn: resrcsPn,
          pSetResrcsPn: (pn) => {
            setResrcsPn(pn);
          },

          ////////////////Users_Resrcs///////////////////////////
          vUserResrc: user_resrc,
          pSetUser_Resrc: (id) =>
            setUser_resrc({
              ...user_resrc,
              CurUser_ResrcId: id,
            }),

          ////////////////Roles_Resrcs///////////////////////////
          vRoleResrc: role_resrc,
          pSetRole_Resrc: (id) =>
            setRole_resrc({
              ...role_resrc,
              CurRole_ResrcId: id,
            }),

          ////////////////Users_Roles///////////////////////////
          vUserRole: user_role,
          pSetUser_Role: (id) =>
            setUser_role({
              ...user_role,
              CurUser_RoleId: id,
            }),

          ////////////////Tmetrics/////////////////////////
          vTmetrics: tmetrics,
          pSetTmetrics: (tmetrics) => {
            setTmetrics(tmetrics);
          },
          vTmetric: tmetric,
          pSetTmetric: (id) => {
            setTmetric({
              ...tmetric,
              CurTmetricId: id,
            });
          },

          ////////////////Srvgrps/////////////////////////
          vSrvgrps: srvgrps,
          pSetSrvgrps: (srvgrps) => {
            setSrvgrps(srvgrps);
          },
          vSrvgrp: srvgrp,
          pSetSrvgrp: (id) => {
            setSrvgrp({
              ...srvgrp,
              CurSrvgrpId: id,
            });
          },

          ////////////////Metrics/////////////////////////
          vMetrics: metrics,
          pSetMetrics: (metrics) => {
            setMetrics(metrics);
          },
          vMetric: metric,
          pSetMetric: (id) =>
            setMetric({
              ...metric,
              CurMetricId: id,
            }),
          vMetricsRp: metricsRp,
          pSetMetricsRp: (rp) => {
            setMetricsRp(rp);
          },
          vMetricsPn: metricsPn,
          pSetMetricsPn: (pn) => {
            setMetricsPn(pn);
          },

          ////////////////Vmetrics/////////////////////////
          vVmetrics: vmetrics,
          pSetVmetrics: (vmetrics) => {
            setVmetrics(vmetrics);
          },
          vTmetricMon: tmetricMon,
          pSetTmetricMon: (vtmetricmon) => {
            setTmetricMon(vtmetricmon);
          },
          vSrvgrpMon: srvgrpMon,
          pSetSrvgrpMon: (vsrvgrpmon) => {
            setSrvgrpMon(vsrvgrpmon);
          },

          ////////////////VmetricsAll/////////////////////////
          vVmetricsAll: vmetricsAll,
          pSetVmetricsAll: (vmetricsAll) => {
            setVmetricsAll(vmetricsAll);
          },

          ////////////////VmetricsCh/////////////////////////
          vVmetricsCh: vmetricsCh,
          pSetVmetricsCh: (vmetricsCh) => {
            setVmetricsCh(vmetricsCh);
          },
          vVmetricCh: vmetricCh,
          pSetVmetricCh: (host, dtStart, dtFinish) => {
            setVmetricCh({
              ...vmetricCh,
              CurHostCh: host,
              CurDtStartCh: dtStart,
              CurDtFinishCh: dtFinish,
            });
          },
          ////////////////////Interval//////////////////
          vInterval: interval,
          pSetInterval: (interval) => {
            setInterval(interval);
          },
          vAuthorized: authorized,
          pSetAuthorized: (a) => {
            setAuthorized(a);
          },
        }}
      >
        {(() => {
          //console.log("authorized=" + authorized);

          if (authorized) {
            return <TopMenu />;
          } else {
            return <Auth />;
          }
        })()}
        {(() => {
          if (authorized) {
            if (state.CurProcess === "hostnames") {
              return <Hostnames />;
            } else if (state.CurProcess === "srvgrps") {
              return <Srvgrps />;
            } else if (state.CurProcess === "tmetrics") {
              return <Tmetrics />;
            } else if (state.CurProcess === "metrics") {
              return <Metrics />;
            } else if (state.CurProcess === "monitors") {
              return <Monitors />;
            } else if (state.CurProcess === "monitorsAll") {
              return <MonitorsAll />;
            } else if (state.CurProcess === "charts") {
              return <Charts />;
            } else if (state.CurProcess === "monitortbls") {
              return <MonitorsTbl />;
            } else if (state.CurProcess === "emails") {
              return <Emails />;
            } else if (state.CurProcess === "users") {
              return <Users />;
            } else if (state.CurProcess === "resrcs") {
              return <Resrcs />;
            } else if (state.CurProcess === "userresrcs") {
              return <UsersResrcs />;
            } else if (state.CurProcess === "roles") {
              return <Roles />;
            } else if (state.CurProcess === "userroles") {
              return <UsersRoles />;
            } else if (state.CurProcess === "roleresrcs") {
              return <RolesResrcs />;
            } else if (state.CurProcess === "changemypd") {
              return <ChangeMyPwd />;
            } else if (state.CurProcess === "reports") {
              return <ListReports />;
            } else if (state.CurProcess === "rep_001") {
              return <Rep001 />;
            }
          }
        })()}
      </appcontext.Provider>
    </div>
  );
}

export default App;
