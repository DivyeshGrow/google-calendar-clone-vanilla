import { getDateForStore } from "../../utilities/dateutils";
import setViews from "../../config/setViews";
import { getClosest } from "../../utilities/helpers"


const datepicker = document.querySelector(".datepicker-sidebar");
const datepickerBody = document.querySelector(".sbdatepicker__body--dates");
const datepickerTitle = document.querySelector(".sbdatepicker-title");
export default function setSidebarDatepicker(context, store, datepickerContext) {

  datepickerContext.setDate(
    context.getYear(), 
    context.getMonth(), 
    context.getDay()
  );

  let montharray = datepickerContext.getMonthArray();
  let groupedEntries = store.getMonthEntryDates(montharray);
  let currentWeekStart = context.getWeek();
  let hasweek = false;
  let count = 0;

  function setDatepickerHeader() {
    const month = datepickerContext.getMonthName()
    const year = datepickerContext.getYear()
    datepickerTitle.textContent = `${month} ${year}`
  }

  function createCells(montharray) {
    datepickerBody.innerText = "";
    const component = context.getComponent();

    for (let i = 0; i < montharray.length; i++) {
      const cell = document.createElement("div");
      const datename = document.createElement("div");
      cell.classList.add("sbdatepicker__body--dates-cell");
      datename.classList.add("sbdatepicker__body--datename");

      if (montharray[i].getMonth() !== datepickerContext.getMonth()) {
        datename.classList.add("sbdatepicker__body--datename-disabled");
      }

      if (component === "week") {
        if (currentWeekStart.getDate() === montharray[i].getDate()) {
          if (currentWeekStart.getMonth() === montharray[i].getMonth()) {
            if (currentWeekStart.getFullYear() === montharray[i].getFullYear()) {
            hasweek = true;
            } 
          }
        } 
      } 

      if (hasweek) {
        count++
        if (count <= 7) {
          cell.classList.add("sbdatepicker__body--dates-week")
        }
      } else {
        cell.classList.remove("sbdatepicker__body--dates-week")
      }

      if (context.isToday(montharray[i])) {
        datename.setAttribute("class", "sbdatepicker__body--datename")
        datename.classList.add("sbdatepicker__body--datename-today");
      }

      if (montharray[i].getDate() === context.getDateSelected() && montharray[i].getMonth() === datepickerContext.getMonth()) {
        if (!datename.classList.contains("sbdatepicker__body--datename-today")) {
          datename.setAttribute("class", "sbdatepicker__body--datename")
          datename.classList.add("sbdatepicker__body--datename-selected");
        }
      }

      datename.textContent = montharray[i].getDate();
      const formattedDate = getDateForStore(montharray[i])
      datename.setAttribute("data-datepicker-date", formattedDate);
      if (groupedEntries.includes(formattedDate)) {
        if (!datename.classList.contains("sbdatepicker__body--datename-selected") && !datename.classList.contains("sbdatepicker__body--datename-today")) {
          datename.setAttribute("class", "sbdatepicker__body--datename")
          datename.classList.add("sbdatepicker__body--datename-entries")
        }
      } else {
        datename.classList.remove("sbdatepicker__body--datename-entries")
      }

      cell.appendChild(datename)
      datepickerBody.appendChild(cell);
    }
  }

  function resetpickerData() {
    montharray = datepickerContext.getMonthArray()
    groupedEntries = store.getMonthEntryDates(montharray)
    currentWeekStart = context.getWeek()
    count = 0;
    hasweek = false;
  }  

  function renderpicker(y, m, d) {
    context.setDate(y, m, d)
    context.setDateSelected(d)
    datepickerContext.setDate(y, m, d)
    setViews(
      context.getComponent(),
      context,
      store,
      datepickerContext,
    );

    resetpickerData()
    createCells(montharray)
    setDatepickerHeader()
    montharray = []
  }

  function renderSelectedDay(e, d) {
    context.setDateSelected(d)
    const selected = document.querySelectorAll(".sbdatepicker__body--datename-selected")
    selected.forEach((x) => {
      x.classList.remove("sbdatepicker__body--datename-selected")
    })
    e.target.setAttribute("class", "sbdatepicker__body--datename")
    e.target.classList.add("sbdatepicker__body--datename-selected")
  }

  function renderprevMonth() {
    datepickerContext.setPrevMonth();
    resetpickerData()
    createCells(montharray);
    setDatepickerHeader();
    montharray = [];
  }

  function rendernextMonth() {
    datepickerContext.setNextMonth();
    resetpickerData()
    createCells(montharray);
    setDatepickerHeader();
    montharray = [];
  }

  function setNewDate(e) {
    const target = e.target;
    let [y, m, d] = target.getAttribute("data-datepicker-date").split('-').map(x => parseInt(x));

    const component = context.getComponent()

    if (component === "list") {
      renderSelectedDay(e, d);
      return;
    }

    if (component === "year") {
      if (context.getYear() !== y) {
        renderpicker(y, m, d);
        return;
      } else {
        renderSelectedDay(e, d);
        return;
      }
    }

    if (component === "month") {
      if (context.getMonth() !== m) {
        renderpicker(y, m, d);
        return;
      } else {
        renderSelectedDay(e, d);
        return;
      }
    }

    if (component === "week") {
      if (e.target.parentElement.classList.contains("sbdatepicker__body--dates-week")) {
        renderSelectedDay(e, d);
        return;
      } else {
        renderpicker(y, m, d);
      }
      return;
    }

    if (component === "day") {
      if (context.isToday(new Date(y, m, d))) {
        renderSelectedDay(e, d);
        return;
      } else {
        renderpicker(y, m, d);
        return;
      }
    }
  }

  function delegateDatepickerEvents(e) {
    const datenumber = getClosest(e, ".sbdatepicker__body--datename")
    const navnext = getClosest(e, ".sbdatepicker-nav--next")
    const navprev = getClosest(e, ".sbdatepicker-nav--prev")

    if (datenumber) {
      setNewDate(e)
      return;
    }

    if (navnext) {
      rendernextMonth()
      return;
    }

    if (navprev) {
      renderprevMonth()
      return;
    }
  }

  setDatepickerHeader();
  createCells(montharray);
  datepicker.onmousedown = delegateDatepickerEvents;
  montharray = [];
}