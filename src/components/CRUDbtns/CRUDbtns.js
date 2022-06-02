import React from "react";
import a from "../../App.module.scss";
import cn from "classnames";

function CRUDbtns(props) {
  return (
    <div className={cn(a.flexcontainer, a.flexcontainerend)}>
      <button
        className={cn(a.btn, a.btnoper)}
        onClick={() =>
          props
            .pFetchParentRecs()
            .then((result) => props.pSetParentRecs(result.data))
        }
      >
        Refresh
      </button>
      <button
        className={cn(
          a.btnoper,
          props.pParentCurId ? a.btn : cn(a.btn, a.btndisabled)
        )}
        onClick={() => {
          props.pSetParentState(props.pParentStateEdit);
        }}
        disabled={!props.pParentCurId}
      >
        Edit
      </button>
      <button
        className={cn(a.btn, a.btnoper)}
        onClick={() => {
          props.pSetParentCurRec(props.pEmptyCurRec);
          console.log("props.pParentStateInsert", props.pParentStateInsert);
          props.pSetParentState(props.pParentStateInsert);
        }}
      >
        Insert
      </button>
      <button
        className={cn(
          a.btnoper,
          props.pParentCurId ? a.btn : cn(a.btn, a.btndisabled)
        )}
        onClick={() => {
          props.pDelShowConfirm(true);
        }}
        disabled={!props.pParentCurId}
      >
        Delete
      </button>
    </div>
  );
}

export default CRUDbtns;
