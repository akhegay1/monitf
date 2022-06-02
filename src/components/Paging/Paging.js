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
    } else {
      props.setRp(num);
    }
  }

  return (
    <div className={cn(b.flexcontainercenter, b.flexcontainercenter)}>
      <ul className={a.pages}>
        {(() => {
          if (props.pn > 1) {
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
              if (props.pn <= 5) {
                //если номер страницы меньше или равно 5 то выводим номера страниц от 1 до 5
                if (props.pn !== item) {
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
                } else return item; //если текущий номер страницы совпадает с item, то выводим просто номер страницы без подчеркивания
              } else if (props.pn !== item + props.pn - 5) {
                //если номер страницы больше 5 то надо добавить разницу между текущим номером страницы и 5, чтобы вывелись другие номера страниц, например 2,3,4,5,6
                return (
                  <a
                    href="/#"
                    onClick={() => {
                      setPnRp("pn", item + props.pn - 5); //при клике записываем в глобальный стейт номер выбранной страницы
                    }}
                  >
                    {item + props.pn - 5}
                  </a>
                );
              } else return item + props.pn - 5;
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
        {props.rp !== 5 ? (
          <li className={a.pagenum}>
            <a
              href="/#"
              onClick={() => {
                setPnRp("rp", 5); //при клике записываем в глобальный стейт кл-во записей на странице
              }}
            >
              5
            </a>
          </li>
        ) : (
          5
        )}
        {props.rp !== 10 ? (
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
        ) : (
          10
        )}
        {props.rp !== 20 ? (
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
        ) : (
          20
        )}
        {props.rp !== 50 ? (
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
        ) : (
          50
        )}
      </ul>
      <br />
      <br />
    </div>
  );
}

export default Paging;
