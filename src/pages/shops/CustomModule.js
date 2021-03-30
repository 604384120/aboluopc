import React, { useState, useEffect } from "react";
import { Divider } from "antd";
import { $, Page, TablePagination, Btn, Popconfirms } from "../comlibs";
import CustomModuleAdd from "./CustomModuleAdd";
import CustomModuleBanner from "./CustomModuleBanner";

export default function() {
  let {add, tableList, addBanner }={}

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
      dataIndex: "customentry_title",
		},
		{
      title: "布局方式",
      dataIndex: "customentry_layout",
      render: (text, record) => {
        if (text === 'LIST') return '列表';
        if (text === 'THUMB') return '小图';
        return '轮播'
      }
		},
		{
      title: "内容",
      dataIndex: "customentry_type",
      render: (text, record) => {
        if (text === 'COURSE') return '课程';
        if (text === 'MATERIAL') return '教材';
        if (text === 'ALBUM') return '合辑';
        return '图片'
      }
		},
		{
      title: "操作",
      render: (text, record) => {
        return <div>
          <a className='link' onClick={() => {
            if (record.customentry_layout === 'BANNER') {
              window.open(`/adminPc/CustomModuleBanner?customentry_uuid=${record.customentry_uuid}`)
              // window.location.href = `/adminPc/CustomModuleBanner?customentry_uuid=${record.customentry_uuid}`
            } else {
              window.open(`/adminPc/CustomModuleAdd?customentry_uuid=${record.customentry_uuid}`)
              // window.location.href = `/adminPc/CustomModuleAdd?customentry_uuid=${record.customentry_uuid}`
            }
          }}>编辑</a>
					<Divider type="vertical" />
          <Popconfirms title='确认删除？' onConfirm={async () => {
            let res = await $.post('/customentry/remove', {customentry_uuid: record.customentry_uuid});
            tableList.reload();
          }} />
					<Divider type="vertical" />
          <a className='link' onClick={async () => {
            let res = await $.post('/customentry/up', {customentry_uuid: record.customentry_uuid});
            tableList.reload();
          }} >上移</a>
					<Divider type="vertical" />
          <a className='link' onClick={async () => {
            let res = await $.post('/customentry/down', {customentry_uuid: record.customentry_uuid});
            tableList.reload();
          }} >下移</a>
        </div>
      }
		}
  ];

	return (
		<div>
      <Btn onClick={() => add.open('添加商品模块', {}, {width: 800})} >添加商品模块</Btn>
      <Btn className="ml_15" onClick={() => addBanner.open('添加轮播图组', {}, {width: 800})} >添加轮播图组</Btn>
      <TablePagination className='mt_10' api="/customentry/query" columns={columns} ref={(rs) => tableList = rs} />
      <Page ref={(rs) => add = rs} background='#ffffff' onClose={()=> tableList.reload() }>
        <CustomModuleAdd/>
      </Page>
      <Page ref={(rs) => addBanner = rs} background='#ffffff' onClose={()=> tableList.reload() }>
        <CustomModuleBanner/>
      </Page>
		</div>
	);
}
