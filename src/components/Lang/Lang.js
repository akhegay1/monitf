import React, { useContext } from "react";
import a from "../../App.module.scss";
import b from "./Lang.module.scss";
import appcontext from "../../appcontext";
import cn from "classnames";

function Lang() {
  const vappcontext = useContext(appcontext);

  //console.log("vappcontext.CurProcess " + vappcontext.vState.CurProcess);
  return (
    <div className={cn(a.flexcontainer, a.flexcontainerend)}>
      <button
        className={cn(
          a.btn,
          b.btntransparent,
          vappcontext.vLang === "ru" ? b.topmenutext : b.topmenutexti,
          a.btnbordernone
        )}
        onClick={() => {
          vappcontext.pSetLang("ru"); //to app state, for re-rendering App
        }}
      >
        ru
      </button>
      /
      <button
        className={cn(
          a.btn,
          b.btntransparent,
          vappcontext.vLang === "en" ? b.topmenutext : b.topmenutexti,
          a.btnbordernone
        )}
        onClick={() => {
          vappcontext.pSetLang("en"); //to app state, for re-rendering App
        }}
      >
        en
      </button>
    </div>
  );
}

export default Lang;
