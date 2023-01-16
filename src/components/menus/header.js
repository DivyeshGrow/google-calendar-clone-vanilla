import locales from "../../locales/en"
import { formatStartEndDate } from "../../utilities/dateutils"
export default function setHeader(context, component, store) {
  let temp = new Date()
  const btntoday = document.querySelector(".btn-today")
  btntoday.setAttribute("data-tooltip", `${locales.labels.weekdaysLong[temp.getDay()]}, ${locales.labels.monthsLong[temp.getMonth()]} ${temp.getDate()}`)
  
  const dateTimeTitle = document.querySelector(".datetime-content--title")
  const header = document.querySelector(".header")
  const selectElement = document.querySelector(".select__modal")
  const btnprev = document.querySelector('.prev');
  const btnnext = document.querySelector('.next');
  const datetimeWrapper = document.querySelector(".h-col-2");
  const datetimeContent = document.querySelector(".datetime-content")

  const configHeader = (borderstyle, componentTitle) => {
    dateTimeTitle.textContent = componentTitle;
    btnprev.removeAttribute("style");
    btnnext.removeAttribute("style");
    datetimeWrapper.classList.remove("datetime-inactive");
    header.style.borderBottom = borderstyle;
    datetimeWrapper.style.paddingRight = "0";
    datetimeContent.removeAttribute("style")
  }

  const configListHeader = (componentTitle) => {
    console.log("rna")
    dateTimeTitle.textContent = componentTitle;
    // 1px solid var(--mediumgrey1)
    header.style.borderBottom = "1px solid var(--mediumgrey1)"
    btnprev.style.display = "none";
    btnnext.style.opacity = "0";
    btnnext.style.width = "8px";
    datetimeWrapper.classList.add("datetime-inactive");
  }

  const setHeaderAttributes = (view) => {
    if (view !== "list") {
      btnprev.setAttribute("data-tooltip", `prev ${view}`);
      btnnext.setAttribute("data-tooltip", `next ${view}`);
    }
    selectElement.textContent = view[0].toUpperCase() + view.slice(1);
    selectElement.setAttribute("data-value", view.slice(0, 1).toUpperCase());
  }

  switch (component) {
    case "day":
      configHeader("1px solid transparent", `${context.getMonthName()} ${context.getDay()}, ${context.getYear()}`);
      setHeaderAttributes("day");
      break;
    case "week":
      configHeader("1px solid transparent", context.getWeekRange());
      setHeaderAttributes("week");
      break;
    case "month":
      configHeader("var(--bordergrey)", `${context.getMonthName()} ${context.getYear()}`);
      setHeaderAttributes("month");
      break;
    case "year":
      configHeader("1px solid transparent", context.getYear());
      setHeaderAttributes("year");
      break;
    case "list":
      setHeaderAttributes("list");
      let [start, end] = store.getFirstAndLastEntry();
      
      !start || !end 
        ? configListHeader("No entries") 
        : configListHeader(formatStartEndDate(new Date(start), new Date(end)));
      break;
    default:
      break;
  }
}