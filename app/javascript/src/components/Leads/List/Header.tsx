/* eslint-disable @typescript-eslint/no-var-requires */
import * as React from "react";
import leads from "apis/leads";
import { Funnel, MagnifyingGlass, Plus } from "phosphor-react";
import AutoComplete from "./AutoComplete";
import { unmapLeadListForDropdown } from "../../../mapper/lead.mapper";
const taskAssignmentIcon = require("../../../../../assets/images/task_assignment.svg");

const Header = ({
  setnewLead,
  isAdminUser,
  setFilterVisibilty,
  setDisplayActions
}) => {

  const searchCallBack = async (searchString, setDropdownItems) => {
    await leads.get(new URLSearchParams(searchString).toString())
      .then((res) => {
        const dropdownList = unmapLeadListForDropdown(res);
        setDropdownItems(dropdownList);
      });
  };

  return (
    <div
      className={
        isAdminUser
          ? "sm:flex mt-6 mb-3 sm:items-center sm:justify-between"
          : "sm:flex mt-6 mb-3 sm:items-center"
      }>
      <span className="inline-flex">
        <h2 className="header__title">Leads</h2>
        <img className="rounded-lg h-8 w-8 ml-2 mr-2 cursor-pointer" title="Actions" src={taskAssignmentIcon} onClick={() => setDisplayActions(true)}/>
      </span>
      <div className="header__searchWrap">
        <div className="header__searchInnerWrapper">
          <AutoComplete searchCallBack={searchCallBack} />
          <button className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
            <MagnifyingGlass size={12} />
          </button>
        </div>
        <button className="ml-7" onClick={() => setFilterVisibilty(true)}>
          <Funnel size={16} />
        </button>
      </div>
      {isAdminUser && (
        <div className="flex">
          <button
            type="button"
            className="header__button"
            onClick={() => setnewLead(true)}
          >
            <Plus weight="fill" size={16} />
            <span className="ml-2 inline-block">NEW LEAD</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
