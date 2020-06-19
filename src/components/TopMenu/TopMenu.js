import React, { useContext } from "react";
import a from "../../App.module.scss";
import b from "./TopMenu.module.scss";
import appcontext from "../../appcontext";
import cn from "classnames";

function TopMenu() {
  const vappcontext = useContext(appcontext);
  //console.log("vappcontext.CurProcess " + vappcontext.vState.CurProcess);
  return (
    <div
      className={cn(a.flexcontainer, a.flexcontainerend, b.topmenubackcolor)}
    >
      <button
        className={cn(
          vappcontext.vState.CurProcess === "hostname" ? a.btnactive : a.btn,
          b.btntransparent,
          b.topmenutext,
          a.btnbordernone
        )}
        onClick={() => {
          vappcontext.pSetState("hostname", "hostname", "list"); //to app state, for re-rendering App
        }}
      >
        Hostnames
      </button>

      <button
        className={cn(
          vappcontext.vState.CurProcess === "tmetric" ? a.btnactive : a.btn,
          b.btntransparent,
          b.topmenutext,
          a.btnbordernone
        )}
        onClick={() => {
          vappcontext.pSetState("tmetric", "tmetric", "list"); //to app state, for re-rendering App
        }}
      >
        Tmetrics
      </button>

      <button
        className={cn(
          vappcontext.vState.CurProcess === "metric" ? a.btnactive : a.btn,
          b.btntransparent,
          b.topmenutext,
          a.btnbordernone
        )}
        onClick={() => {
          vappcontext.pSetState("metric", "metric", "list"); //to app state, for re-rendering App
        }}
      >
        Metrics
      </button>

      <button
        className={cn(
          vappcontext.vState.CurProcess === "monitor" ? a.btnactive : a.btn,
          b.btntransparent,
          b.topmenutext,
          a.btnbordernone
        )}
        onClick={() => {
          vappcontext.pSetState("monitor", "monitor", "list"); //to app state, for re-rendering App
        }}
      >
        Monitors
      </button>

      <button
        className={cn(
          vappcontext.vState.CurProcess === "monitortbl" ? a.btnactive : a.btn,
          b.btntransparent,
          b.topmenutext,
          a.btnbordernone
        )}
        onClick={() => {
          vappcontext.pSetState("monitortbl", "monitortbl", "list"); //to app state, for re-rendering App
        }}
      >
        MonitorsTable
      </button>

      <button
        className={cn(
          vappcontext.vState.CurProcess === "chart" ? a.btnactive : a.btn,
          b.btntransparent,
          b.topmenutext,
          a.btnbordernone
        )}
        onClick={() => {
          vappcontext.pSetState("chart", "chart", "showchart"); //to app state, for re-rendering App
        }}
      >
        Charts
      </button>
    </div>
  );
}

export default TopMenu;
