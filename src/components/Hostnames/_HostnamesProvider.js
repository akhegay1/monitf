import React, { useState } from "react";
import HostnamesContext from "./HostnamesContext";
import Hostnames from "./Hostnames";

function HostnamesProvider() {
  //list of hosts
  const [hostnames, setHostnames] = useState([{}]);
  //selected host
  const [hostname, setHostname] = useState({
    CurHostId: 0,
  });
  //Rp - rows per page, Pn - page number
  const [hostsRp, setHostsRp] = useState(10);
  const [hostsPn, setHostsPn] = useState(1);
  return (
    <div className="App">
      <HostnamesContext.Provider>
        value=
        {{
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
        }}
        {(() => {
          return <Hostnames />;
        })()}
      </HostnamesContext.Provider>
      ;
    </div>
  );
}

export default HostnamesProvider;
