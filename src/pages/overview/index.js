import React, { useState, useEffect } from "react";
import { Divider, Tabs, Breadcrumb } from "antd";
import { $, Page, Form, TablePagination, Modals, Inputs, BreadcrumbBar } from "../comlibs";
// import OldCarsInfo from "./oldCarsInfo";

const { TabPane } = Tabs;

export default function() {
  let {info, tableList }={}

  useEffect(()=>{getQuery()},[]);

  async function getQuery(){
  };

	return (
		<div className="br_3 bg_white pall_15">
      <BreadcrumbBar pathList={[$.store().BCB_setBarPath]} />
      <span>概览</span>
		</div>
	);
}
