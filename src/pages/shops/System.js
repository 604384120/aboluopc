import React, { useState, useEffect } from "react";
import { Form as Forms } from "antd";
import { $, TablePagination } from "../comlibs";

export default function() {

  let { tableList } = {};

  const columns = [
    {
      title: "序号",
      align:'center',
      dataIndex: "_key"
    },
    {
      title: "标题",
      dataIndex: "presetpage_title"
    },
    {
      title: "操作",
			align:'center',
      render: (text, record) => {
        return <a className='link' target="_blank" href={`/adminPc/SystemAdd?presetpage_id=${record.presetpage_id}`} >编辑</a>
      }
    }
  ];
  
	return (
		<div className="br_3 bg_white pall_15">
      {/* <Btn onClick={() => modals_add.open("添加渠道") }>创建系统页面</Btn> */}
      <TablePagination 
        className="mt_10"
        api="/presetpage/query"
        columns={columns}
        ref={rs => (tableList = rs)}
      />
		</div>
	);
}
