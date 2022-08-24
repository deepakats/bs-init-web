/* eslint-disable @typescript-eslint/no-var-requires */
import * as React from "react";
import engagements from "apis/engagements";
import { Funnel, MagnifyingGlass } from "phosphor-react";
import AutoComplete from "./AutoComplete";
import { unmapEngagementList } from "../../../mapper/engagement.mapper";

const Header = ({
  isAdminUser,
  setFilterVisibilty,
}) => {

  const searchCallBack = async (searchString, setDropdownItems) => {
    await engagements.get(new URLSearchParams(searchString).toString())
      .then((res) => {
        const dropdownList = unmapEngagementList(res);
        setDropdownItems(dropdownList.list);
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
        <h2 className="header__title">Resource Engagement</h2>
      </span>
      <div className="header__searchWrap">
        <div className="header__searchInnerWrapper">
          <AutoComplete searchCallBack={searchCallBack} />
          <button className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
            <MagnifyingGlass size={12} />
          </button>
        </div>
        <button className="ml-7" onClick={() => setFilterVisibilty(true)}>
          <Funnel size={16} />
        </button>
      </div>
      <div className="flex"></div>
      <div className="flex"></div>
    </div>
  );
};

export default Header;
