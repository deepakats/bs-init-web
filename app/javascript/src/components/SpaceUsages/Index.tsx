/* eslint-disable no-unexpected-multiline */
import React from "react";
import { ToastContainer } from "react-toastify";
import { setAuthHeaders, registerIntercepts } from "apis/axios";
import companyUsersApi from "apis/company-users";
import spaceUsagesApi from "apis/space-usages";
import * as dayjs from "dayjs";
import * as updateLocale from "dayjs/plugin/updateLocale";
import * as weekday from "dayjs/plugin/weekday";
import { isInThePast } from "helpers/date-parser";
import _ from "lodash";

import { TOASTER_DURATION } from "constants/index";

// import AddEntry from "./AddEntry";
import CurrentHourLine from "./CurrentHourLine";
import DatesInWeek from "./DatesInWeek";
import EditEntry from "./EditEntry";
import EntryCardDayView from "./EntryCardDayView";
import './style.scss';
import NewEntryCardDayView from "./NewEntryCardDayView";

const SPACES = [
  { id: "1", name: "Conference Room", alias: "CR" },
  { id: "2", name: "HR Cabin", alias: "HRC" },
  { id: "3", name: "Sales Cabin", alias: "SC" }
];

const { useState, useEffect } = React;
dayjs.extend(updateLocale);
dayjs.extend(weekday);

const monthsAbbr = "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_");
dayjs.updateLocale("en", { monthShort: monthsAbbr });

// Day start from monday
dayjs.Ls.en.weekStart = 1;

const TimeReserving: React.FC<Iprops> = ({
  entries,
  userId,
  userDepartmentId,
  departments,
}) => {
  const [dayInfo, setDayInfo] = useState<any[]>([]);
  const [newEntryView, setNewEntryView] = useState<boolean>(false);
  const [selectDate, setSelectDate] = useState<number>(dayjs().weekday());
  const [weekDay, setWeekDay] = useState<number>(0);
  const [entryList, setEntryList] = useState<object>(entries);
  const [selectedFullDate, setSelectedFullDate] = useState<string>(
    dayjs().format("YYYY-MM-DD")
  );
  const [groupingEntryList, setGroupingEntryList] = useState<object>({});
  const [editEntryId, setEditEntryId] = useState<number>(0);
  const [editEntryColor, setEditEntryColor] = useState<string>("");
  const [allEmployeesEntries, setAllEmployeesEntries] = useState<object>({});
  const [currentTime, setCurrentTime] = useState<any>({
    hour: dayjs().hour(),
    minute: dayjs().minute(),
    second: dayjs().second(),
    ampm: dayjs().format("A")
  });
  const [selectedSpaceId, setSelectedSpaceId] = useState<1 | 2 | 3 | undefined>();
  const [newEntryId, setNewEntryId] = useState<number | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [selectedStartTime, setSelectedStartTime] = useState<number | undefined>();
  const [selectedEndTime, setSelectedEndTime] = useState<number | undefined>();
  const [newEntry, setNewEntry] = useState<object>({});
  const [isPastDate, setIsPastDate] = useState<boolean>(false);
  const [allMemberList, setAllMemberList] = useState([]);

  const excludeCurrentUser = (allMembers: any) => allMembers.filter((memberFromAllMembers: any) => (userId !== memberFromAllMembers.id));

  const fetchCurrentWorkspaceUsers = async () => {
    try {
      const resp = await companyUsersApi.get();
      setAllMemberList(excludeCurrentUser(resp.data.users));
    } catch (error) {
      return error;
    }
  };

  const calendarTimes = () => {
    const product = (...a: any[][]) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));
    return product([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24], [0]).map((k) => {
      const [i, m] = [k[0], k[1]]
      if (i>=24 && m > 0)
        return (null)

      let ii = i - 12
      ii = (i === 0 || ii === 0) ? 12 : (ii < 0) ? i : ii
      return ({
        id: `${i<10 ? 0 : '' }${i}:${m<10 ? 0 : ''}${m}`,
        name: `${ii < 10 ? 0 : '' }${ii}:${m<10 ? 0 : ''}${m} ${i < 12 || i == 24 ? 'AM' : 'PM'}`
      })
    }).filter((el) => el != null)
  }

  useEffect(() => {
    setAuthHeaders();
    registerIntercepts();
    const currentEmployeeEntries = {};
    currentEmployeeEntries[userId] = entries;
    setAllEmployeesEntries(currentEmployeeEntries);
    fetchCurrentWorkspaceUsers();
    const timer = setInterval(() => {
      setCurrentTime({
        hour: dayjs().hour(),
        minute: dayjs().minute(),
        second: dayjs().second(),
        ampm: dayjs().format("A")
      });
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    handleWeekInfo();
  }, [weekDay]);

  useEffect(() => {
    parseWeeklyViewData();
  }, [weekDay, entryList]);

  useEffect(() => {
    setSelectedFullDate(
      dayjs()
        .weekday(weekDay + selectDate)
        .format("YYYY-MM-DD")
    );
  }, [selectDate, weekDay]);

  useEffect(() => {
    setIsPastDate(
      isInThePast(new Date(selectedFullDate))
    );
  }, [selectedFullDate]);

  useEffect(() => {
    const spaces = SPACES.reduce((out, i) => {
      out[i.id] = []; return out
    }, {});
    if (selectedSpaceId && selectedStartTime && editEntryId === 0) {
      spaces[selectedSpaceId] = [{
        id: 0,
        user_id: userId,
        start_duration: selectedStartTime,
        end_duration: selectedEndTime,
        space_code: selectedSpaceId.toString()
      }];
    }
    setNewEntry(spaces);
    return () => {
      setNewEntry({});
    }
  }, [selectedSpaceId, selectedStartTime, selectedEndTime, userId, editEntryId])

  const handleWeekInfo = () => {
    const daysInWeek = Array.from(Array(7).keys()).map((weekCounter) => {
      const [day, month, date, year] = dayjs()
        .weekday(weekCounter + weekDay)
        ["$d"].toString()
        .split(" ");
      const fullDate = dayjs()
        .weekday(weekCounter + weekDay)
        .format("YYYY-MM-DD");
      return {
        day: day,
        month: month,
        date: date,
        year: year,
        fullDate: fullDate
      };
    });
    setDayInfo(() => daysInWeek);
  };

  const fetchEntries = async (from: string, to: string) => {
    const res = await spaceUsagesApi.list(from, to, 1);
    if (res.status >= 200 && res.status < 300) {
      const ns = { ...allEmployeesEntries };
      ns[userId] = { ...ns[userId], ...res.data.entries };
      setAllEmployeesEntries(ns);
      setEntryList(ns[userId]);
      return true;
    } else {
      return false;
    }
  };

  const handleDeleteEntry = async id => {
    const res = await spaceUsagesApi.destroy(id);
    if (!(res.status === 200)) return;
    const newValue = { ...entryList };
    newValue[selectedFullDate] = newValue[selectedFullDate].filter(e => e.id !== id);
    setAllEmployeesEntries({ ...allEmployeesEntries, [userId]: newValue });
    setEntryList(newValue);
  };

  // const handleNextWeek = () => {
  //   setWeekDay(p => p + 7);
  //   const from = dayjs()
  //     .weekday(weekDay + 7)
  //     .format("YYYY-MM-DD");
  //   const to = dayjs()
  //     .weekday(weekDay + 13)
  //     .format("YYYY-MM-DD");
  //   fetchEntries(from, to);
  // };

  // const handlePrevWeek = () => {
  //   setWeekDay(p => p - 7);
  //   const from = dayjs()
  //     .weekday(weekDay - 7)
  //     .format("YYYY-MM-DD");
  //   const to = dayjs()
  //     .weekday(weekDay - 1)
  //     .format("YYYY-MM-DD");
  //   fetchEntries(from, to);
  // };

  const parseWeeklyViewData = () => {
    const weekArr = [];
    for (let weekCounter = 0; weekCounter < 7; weekCounter++) {
      const date = dayjs()
        .weekday(weekDay + weekCounter)
        .format("YYYY-MM-DD");

      if (!entryList[date]) continue;

      entryList[date].forEach(entry => {
        let entryAdded = false;
        weekArr.forEach(rowInfo => {
          if (
            rowInfo["projectId"] === entry["project_id"] &&
            !rowInfo["entries"][weekCounter] &&
            !entryAdded
          ) {
            rowInfo["entries"][weekCounter] = entry;
            entryAdded = true;
          }
          return rowInfo;
        });

        if (entryAdded) return;
        const newRow = [];
        newRow[weekCounter] = entry;
        weekArr.push({
          projectId: entry["project_id"],
          clientName: entry.client,
          projectName: entry.project,
          entries: newRow
        });
      });
    }

    // setWeeklyData(() => weekArr);
  };

  useEffect(() => {
    let spaces = {}
    if (entryList && entryList[selectedFullDate]){
      const thisGroupEntries = _.groupBy(entryList[selectedFullDate], "space_code")
      SPACES.map((i) => spaces[i.id] = thisGroupEntries[i.id] || [])
    } else {
      spaces = SPACES.reduce((out, i) => {
        out[i.id] = []; return out
      }, {});
    }
    setGroupingEntryList(spaces)
  }, [entryList, selectedFullDate]);

  return (
    <>
      <ToastContainer autoClose={TOASTER_DURATION} />
      <div className="mt-1 mx-50">
        <div>
          <div className="mb-1">
            <div className="flex items-center justify-between w-full h-10 bg-miru-han-purple-1000">
              <button
                onClick={() => {
                  setWeekDay(0);
                  setSelectDate(dayjs().weekday());
                }}
                className="flex items-center justify-center w-20 h-6 ml-4 text-xs font-bold tracking-widest text-white border-2 rounded"
              >
              TODAY
              </button>
              <div className="flex">
                {/*<button
                  onClick={handlePrevWeek}
                  className="flex flex-col items-center justify-center w-6 h-6 text-white border-2 rounded-xl"
                >
                  &lt;
                </button>*/}
                {!!dayInfo.length && (
                  <p className="w-40 mx-6 text-white">
                    {dayInfo[0]["date"]} {dayInfo[0].month} -{" "}
                    {dayInfo[6]["date"]} {dayInfo[6]["month"]}{" "}
                    {dayInfo[6]["year"]}
                  </p>
                )}
                {/*<button
                  onClick={handleNextWeek}
                  className="flex flex-col items-center justify-center w-6 h-6 text-white border-2 rounded-xl"
                >
                  &gt;
                </button>*/}
              </div>
              <button
                onClick={() => {
                  if (!isPastDate) {
                    setNewEntryView(true);
                    setEditEntryId(0);
                  }
                }}
                disabled={isPastDate}
                className={`flex items-center justify-center w-20 h-6 mr-4 text-xs font-bold tracking-widest text-white border-2 rounded disabled:bg-miru-han-purple-200 ${newEntryView || editEntryId !== 0 ? 'active-from' : ''}`}
              >
                NEW
              </button>
              {/* <div className="flex mr-1">
              </div> */}
            </div>
            <DatesInWeek
              view={"day"}
              dayInfo={dayInfo}
              selectDate={selectDate}
              setSelectDate={setSelectDate}
            />
          </div>
          {/* {!editEntryId && newEntryView && (
            <AddEntry
              selectedEmployeeId={userId}
              fetchEntries={fetchEntries}
              setNewEntryView={setNewEntryView}
              selectedDateInfo={dayInfo[selectDate]}
              selectedFullDate={selectedFullDate}
              setEntryList={setEntryList}
              entryList={entryList}
              setEditEntryId={setEditEntryId}
              editEntryId={editEntryId}
              dayInfo={dayInfo}
            />
          )} */}
          {/* {!newEntryView && (
            <button
              onClick={() => {setNewEntryView(true); setEditEntryId(0); }}
              className="w-full p-4 text-lg font-bold tracking-widest border-2 h-14 border-miru-han-purple-600 text-miru-han-purple-600"
            >
                + NEW
            </button>
          )} */}
        </div>

        <div className="ac-calendar-container">
          <div className="grid grid-cols-4 gap-0 ac-calendar-users">
            {SPACES.map((i, _index) => (
              <div key={`ac-user-name-${_index}`} className="ac-clone-col">
                <div className="ac-user-name">
                  <span>{i.name}</span>
                  <span className="alias">{i.alias}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="ac-calendar-view">
            <div className="ac-calendar">
              {calendarTimes().map((i, index) => (
                <div className="ac-cv-time-row" key={index}><div className="ac-cv-time"><span>{i.name}</span></div></div>
              ))}
            </div>
            {Object.entries(newEntry).length > 0 ?
              <div className="grid grid-cols-4 gap-0 ac-calendar-clone">
                {
                  Object.entries(newEntry).map(([_spaceCode, value], listIndex) => (<NewEntryCardDayView
                    key={listIndex}
                    spaceUsages={value}
                    departments={departments}
                    userDepartmentId={userDepartmentId}
                  />))
                }
              </div>
              : ""}
            {Object.entries(groupingEntryList).length > 0 ?
              <div className="grid grid-cols-4 gap-0 ac-calendar-clone">
                {
                  Object.entries(groupingEntryList).map(([_spaceCode, value], listIndex) => (<EntryCardDayView
                    key={listIndex}
                    spaceUsages={value}
                    setEditEntryId={setEditEntryId}
                    setEditEntryColor={setEditEntryColor}
                    editEntryId={editEntryId}
                    setNewEntryView={setNewEntryView}
                    setSelectedSpaceId={setSelectedSpaceId}
                    spaceCode={listIndex}
                    setNewEntryId={setNewEntryId}
                    newEntryId={newEntryId}
                    setSelectedTime={setSelectedTime}
                    isPastDate={isPastDate}
                    departments={departments}
                  />))
                }
              </div>
              : ""}
            <div className="grid grid-cols-4 gap-0 ac-calendar-clone current-line">
              <CurrentHourLine currentTime={currentTime} />
            </div>
          </div>
        </div>
      </div>
      {editEntryId || newEntryView ? <EditEntry
        selectedEmployeeId={userId}
        fetchEntries={fetchEntries}
        setNewEntryView={setNewEntryView}
        selectedDateInfo={dayInfo[selectDate]}
        selectedFullDate={selectedFullDate}
        setEntryList={setEntryList}
        entryList={entryList}
        setEditEntryId={setEditEntryId}
        editEntryId={editEntryId}
        dayInfo={dayInfo}
        handleDeleteEntry={handleDeleteEntry}
        editEntryColor={editEntryColor}
        setSelectedSpaceId={setSelectedSpaceId}
        selectedSpaceId={selectedSpaceId}
        setNewEntryId={setNewEntryId}
        setSelectedTime={setSelectedTime}
        selectedTime={selectedTime}
        setSelectedStartTime={setSelectedStartTime}
        setSelectedEndTime={setSelectedEndTime}
        isPastDate={isPastDate}
        allMemberList={allMemberList}
      /> : ""}
    </>
  );
};

interface Iprops {
  clients: [];
  projects: object;
  entries: object;
  isAdmin: boolean;
  userId: number;
  userDepartmentId: number;
  employees: [];
  departments: [];
}

export default TimeReserving;
