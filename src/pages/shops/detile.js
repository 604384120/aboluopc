import React, { useState, useEffect } from "react";
import { Divider, Tabs, Cascader } from "antd";
import { createBrowserHistory } from "history";
import { $, Page, Form, TablePagination, Modals, Inputs, BreadcrumbBar } from "../comlibs";
// import info from "./info";
// import OldCarsInfo from "./oldCarsInfo";

const { TabPane } = Tabs;

export default function() {
  let {infoOpen, tableList }={}

  useEffect(()=>{getQuery()},[]);

  async function getQuery(){
  };

	return (
		<div className="br_3 bg_white pall_15">
      <BreadcrumbBar pathList={['/adminPc/shops', '/adminPc/shops_detile', $.store().BCB_setBarPath]} />
      第三层
		</div>
	);
}
