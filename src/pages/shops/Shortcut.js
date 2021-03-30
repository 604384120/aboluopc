import React, { useState, useEffect } from "react";
import { Divider } from "antd";
import { $, Page, Img, TablePagination, Btn, Popconfirms } from "../comlibs";
import ShortcutAdd from "./ShortcutAdd";

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
      title: "图片",
      dataIndex: "quickentry_img",
      render: (text, record) => {
        return <Img width={66} height={66} src={text} />
      }
		},
		{
      title: "标题",
      dataIndex: "quickentry_title",
		},
		{
      title: "跳转",
      dataIndex: "redirect_content",
      render: (text, record) => {
        if (record?.redirect_type !== 'H5' && record?.redirect_type !== 'NULL') {
          return record?.product_name || record?.file_name
        }
        return text || "无"
      }
		},
		{
      title: "操作",
      // dataIndex: "img",
      render: (text, record) => {
        return <div>
          <a className='link' onClick={() => add.open("编辑快捷入口", record, {width: 700})}>编辑</a>
					<Divider type="vertical" />
          <Popconfirms title='确认删除？' onConfirm={async () => {
            let res = await $.post('/quickentry/remove', {quickentry_uuid: record.quickentry_uuid});
            tableList.reload();
          }} />
					<Divider type="vertical" />
          <a className='link' onClick={async () => {
            let res = await $.post('/quickentry/up', {quickentry_uuid: record.quickentry_uuid});
            tableList.reload();
          }} >上移</a>
					<Divider type="vertical" />
          <a className='link' onClick={async () => {
            let res = await $.post('/quickentry/down', {quickentry_uuid: record.quickentry_uuid});
            tableList.reload();
          }} >下移</a>
        </div>
      }
		}
  ];

	return (
		<div>
      <Btn onClick={() => add.open('添加快捷入口', {}, {width: 700})} >添加快捷入口</Btn>
      <span className='lh_36 fs_12 ml_34' >建议尺寸120*120，JPG、PNG格式， 图片小于2M，最多添加8个快捷入口</span>
      <TablePagination className='mt_10' api="/quickentry/query" columns={columns} ref={(rs) => tableList = rs} pagination />
      <Page ref={(rs) => add = rs} background='#ffffff' onClose={()=> tableList.reload() }>
        <ShortcutAdd/>
      </Page>
		</div>
	);
}
