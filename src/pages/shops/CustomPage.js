import React, { useState, useEffect } from "react";
import { Divider } from "antd";
import { $, Page, TablePagination, Btn, Popconfirms } from "../comlibs";
import CustomPageAdd from "./CustomPageAdd";

export default function() {
  let {add, tableList }={}

  useEffect(()=>{getQuery()},[]);

  async function getQuery(){
  };

  const columns = [
    {
			title: "序号",
			dataIndex: "_key"
		},
		{
      title: "标题",
      dataIndex: "custompage_title",
		},
		{
      title: "链接地址",
      dataIndex: "url",
		},
		{
      title: "操作",
      // dataIndex: "img",
      render: (text, record) => {
        return <div>
          <a className='link' target="_blank" href={`/adminPc/CustomPageAdd?custompage_uuid=${record.custompage_uuid}`}>编辑</a>
					<Divider type="vertical" />
          <Popconfirms title='确认删除？' onConfirm={async () => {
            let res = await $.post('/custompage/remove', {custompage_uuid: record.custompage_uuid});
            tableList.reload();
          }} />
        </div>
      }
		}
  ]

	return (
		<div>
      <Btn onClick={() => add.open('添加自定义页面', {}, {width: 700})} >添加自定义页面</Btn>
      <TablePagination className='mt_10' api="/custompage/query" columns={columns} ref={(rs) => tableList = rs} />
      <Page ref={(rs) => add = rs} background='#ffffff' onClose={()=> tableList.reload() }>
        <CustomPageAdd/>
      </Page>
		</div>
	);
}
