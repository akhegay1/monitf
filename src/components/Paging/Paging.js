import React from "react";
import a from "./Paging.module.scss";
import b from "../../App.module.scss";
import cn from "classnames";

function Paging(props) {
  let btnsArr = [1, 2, 3, 4, 5];

  //в зависимости от типа (Rp Pn) вызываем setRp или setPn и передаем кол-во строк или номер страницы
  function setPnRp(t, num) {
    if (t === "pn") {
      props.setPn(num);
      props.pSetParentPn(num);
    } else {
      props.setRp(num);
      props.pSetParentRp(num);
    }
  }

  return (
    <div className={cn(b.flexcontainercenter, b.flexcontainercenter)}>
      <ul className={a.pages}>
        {(() => {
          if (props.pn > 5) {
            return (
              <a
                href="/#"
                onClick={() => {
                  setPnRp("pn", props.pn - 1); //при клике записываем в глобальный стейт номер выбранной страницы
                }}
              >
                &lt;&lt;Previous
              </a>
            );
          }
        })()}
        {btnsArr.map((item, index) => (
          <li key={item} className={a.pagenum}>
            {(() => {
              if ((props.pn > 5 && item !== 3) || props.pn <= 5) {
                return (
                  <a
                    href="/#"
                    onClick={() => {
                      setPnRp("pn", item); //при клике записываем в глобальный стейт номер выбранной страницы
                    }}
                  >
                    {item}
                  </a>
                );
              } else return <span>..</span>;
            })()}
          </li>
        ))}
        <a
          href="/#"
          onClick={() => {
            setPnRp("pn", props.pn + 1); //при клике записываем в глобальный стейт номер выбранной страницы
          }}
        >
          Next&gt;&gt;
        </a>
        <li className={a.pagenum}>Rows On page:</li>
        <li className={a.pagenum}>
          <a
            href="/#"
            onClick={() => {
              setPnRp("rp", 10); //при клике записываем в глобальный стейт кл-во записей на странице
            }}
          >
            10
          </a>
        </li>
        <li className={a.pagenum}>
          <a
            href="/#"
            onClick={() => {
              setPnRp("rp", 20); //при клике записываем в глобальный стейт кл-во записей на странице
            }}
          >
            20
          </a>
        </li>

        <li className={a.pagenum}>
          <a
            href="/#"
            onClick={() => {
              setPnRp("rp", 50); //при клике записываем в глобальный стейт кл-во записей на странице
            }}
          >
            50
          </a>
        </li>
      </ul>
    </div>
  );
}

export default Paging;
