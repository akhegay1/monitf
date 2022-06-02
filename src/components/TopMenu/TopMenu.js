import React, { useContext } from "react";
import a from "../../App.module.scss";
import b from "./TopMenu.module.scss";
import appcontext from "../../appcontext";
import Lang from "../Lang/Lang";
import cn from "classnames";
import TopMenuItemsLang from "./TopMenuItemsLang";

function TopMenu() {
  const vappcontext = useContext(appcontext);

  function checkRole(role) {
    let username_roles1 = vappcontext.vUroles;
    //JSON.parse(localStorage.getItem("username_roles"));
    //console.log("username_roles aaaa", username_roles1);

    for (let i of username_roles1) {
      if (role === i.Role || i.Role === "admin") {
        //console.log("username_roles i", i.Role);
        return true;
      }
    }
  }

  let z = "p1en";
  console.log(
    "TopMenuItemsLangEn ",
    TopMenuItemsLang,
    "TopMenuItemsLangEn.p1 aaa",
    TopMenuItemsLang[z]
  );
  return (
    <div>
      <Lang />
      <div
        className={cn(a.flexcontainer, a.flexcontainerend, b.topmenubackcolor)}
      >
        {checkRole("hostnames") ? (
          <button
            className={cn(
              a.btn,
              b.btntransparent,
              b.topmenutext,
              a.btnbordernone
            )}
            onClick={() => {
              vappcontext.pSetState("hostnames", "list"); //to app state, for re-rendering App
            }}
          >
            {TopMenuItemsLang["p1" + vappcontext.vLang]}
          </button>
        ) : (
          <div />
        )}

        {checkRole("tmetrics") ? (
          <button
            className={cn(
              a.btn,
              b.btntransparent,
              b.topmenutext,
              a.btnbordernone
            )}
            onClick={() => {
              vappcontext.pSetState("tmetrics", "list"); //to app state, for re-rendering App
            }}
          >
            {TopMenuItemsLang["p2" + vappcontext.vLang]}
          </button>
        ) : (
          <div />
        )}
        {checkRole("srvgrps") ? (
          <button
            className={cn(
              a.btn,
              b.btntransparent,
              b.topmenutext,
              a.btnbordernone
            )}
            onClick={() => {
              vappcontext.pSetState("srvgrps", "list"); //to app state, for re-rendering App
            }}
          >
            {TopMenuItemsLang["p3" + vappcontext.vLang]}
          </button>
        ) : (
          <div />
        )}

        {checkRole("emails") ? (
          <button
            className={cn(
              a.btn,
              b.btntransparent,
              b.topmenutext,
              a.btnbordernone
            )}
            onClick={() => {
              vappcontext.pSetState("emails", "list"); //to app state, for re-rendering App
            }}
          >
            {TopMenuItemsLang["p4" + vappcontext.vLang]}
          </button>
        ) : (
          <div />
        )}

        {checkRole("metrics") ? (
          <button
            className={cn(
              a.btn,
              b.btntransparent,
              b.topmenutext,
              a.btnbordernone
            )}
            onClick={() => {
              vappcontext.pSetState("metrics", "list"); //to app state, for re-rendering App
            }}
          >
            {TopMenuItemsLang["p5" + vappcontext.vLang]}
          </button>
        ) : (
          <div />
        )}

        {checkRole("monitor") ? (
          <button
            className={cn(
              a.btn,
              b.btntransparent,
              b.topmenutext,
              a.btnbordernone
            )}
            onClick={() => {
              vappcontext.pSetState("monitors", "list"); //to app state, for re-rendering App
            }}
          >
            {TopMenuItemsLang["p6" + vappcontext.vLang]}
          </button>
        ) : (
          <div />
        )}

        {checkRole("monitor") ? (
          <button
            className={cn(
              a.btn,
              b.btntransparent,
              b.topmenutext,
              a.btnbordernone
            )}
            onClick={() => {
              vappcontext.pSetState("monitorsAll", "list"); //to app state, for re-rendering App
            }}
          >
            {TopMenuItemsLang["p7" + vappcontext.vLang]}
          </button>
        ) : (
          <div />
        )}

        {checkRole("monitor") ? (
          <button
            className={cn(
              a.btn,
              b.btntransparent,
              b.topmenutext,
              a.btnbordernone
            )}
            onClick={() => {
              vappcontext.pSetState("monitortbls", "list"); //to app state, for re-rendering App
            }}
          >
            {TopMenuItemsLang["p8" + vappcontext.vLang]}
          </button>
        ) : (
          <div />
        )}

        {checkRole("monitor") ? (
          <button
            className={cn(
              a.btn,
              b.btntransparent,
              b.topmenutext,
              a.btnbordernone
            )}
            onClick={() => {
              vappcontext.pSetState("charts", "showchart"); //to app state, for re-rendering App
            }}
          >
            {TopMenuItemsLang["p9" + vappcontext.vLang]}
          </button>
        ) : (
          <div />
        )}

        {checkRole("security") ? (
          <div className={b.dropdown}>
            <button
              className={cn(
                a.btn,
                b.btntransparent,
                b.topmenutext,
                a.btnbordernone,
                b.dropbtn
              )}
            >
              {TopMenuItemsLang["p10" + vappcontext.vLang]}
            </button>

            <div className={b.dropdowncontent}>
              <a
                href="#"
                className={b.dropdowncontent_a}
                onClick={() => {
                  vappcontext.pSetState("users", "list"); //to app state, for re-rendering App
                }}
              >
                {TopMenuItemsLang["p101" + vappcontext.vLang]}
              </a>
              <a
                href="#"
                className={b.dropdowncontent_a}
                onClick={() => {
                  vappcontext.pSetState("resrcs", "list"); //to app state, for re-rendering App
                }}
              >
                {TopMenuItemsLang["p102" + vappcontext.vLang]}
              </a>
              <a
                href="#"
                className={b.dropdowncontent_a}
                onClick={() => {
                  vappcontext.pSetState("userresrcs", "edit"); //to app state, for re-rendering App
                }}
              >
                {TopMenuItemsLang["p103" + vappcontext.vLang]}
              </a>
              <a
                href="#"
                className={b.dropdowncontent_a}
                onClick={() => {
                  vappcontext.pSetState("roles", "list"); //to app state, for re-rendering App
                }}
              >
                {TopMenuItemsLang["p104" + vappcontext.vLang]}
              </a>
              <a
                href="#"
                className={b.dropdowncontent_a}
                onClick={() => {
                  vappcontext.pSetState("userroles", "list"); //to app state, for re-rendering App
                }}
              >
                {TopMenuItemsLang["p105" + vappcontext.vLang]}
              </a>
              <a
                href="#"
                className={b.dropdowncontent_a}
                onClick={() => {
                  vappcontext.pSetState("roleresrcs", "list"); //to app state, for re-rendering App
                }}
              >
                {TopMenuItemsLang["p106" + vappcontext.vLang]}
              </a>
            </div>
          </div>
        ) : (
          <div />
        )}

        <div className={b.dropdown}>
          <button
            className={cn(
              a.btn,
              b.btntransparent,
              b.topmenutext,
              a.btnbordernone,
              b.dropbtn
            )}
            onClick={() => {
              vappcontext.pSetState("reports", "list"); //to app state, for re-rendering App
            }}
          >
            {TopMenuItemsLang["p11" + vappcontext.vLang]}
          </button>
        </div>

        <button
          className={cn(
            vappcontext.vState.CurProcess === "changemypd"
              ? a.btnactive
              : a.btn,
            b.btntransparent,
            b.topmenutext,
            a.btnbordernone
          )}
          onClick={() => {
            vappcontext.pSetState("changemypd", ""); //to app state, for re-rendering App
          }}
        >
          {TopMenuItemsLang["p12" + vappcontext.vLang]}
        </button>
      </div>
    </div>
  );
}

export default TopMenu;
