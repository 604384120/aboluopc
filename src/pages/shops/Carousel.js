import React, { useState, useEffect } from "react";
import { Divider } from "antd";
import { $, Page, Img, TablePagination, Btn, Popconfirms } from "../comlibs";
import CarouselAdd from "./CarouselAdd";

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
      dataIndex: "banner_img",
      render: (text, record) => {
        return <Img width={137} height={66} src={text} />
      }
		},
		{
      title: "标题",
      dataIndex: "banner_title",
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
      render: (text, record) => {
        return <div>
          <a className='link' onClick={() => add.open("编辑轮播图", record, {width: 700})}>编辑</a>
					<Divider type="vertical" />
          <Popconfirms title='确认删除？' onConfirm={async () => {
            let res = await $.post('/banner/remove', {banner_uuid: record.banner_uuid});
            tableList.reload();
          }} />
					<Divider type="vertical" />
          <a className='link' onClick={async () => {
            let res = await $.post('/banner/up', {banner_uuid: record.banner_uuid});
            tableList.reload();
          }} >上移</a>
					<Divider type="vertical" />
          <a className='link' onClick={async () => {
            let res = await $.post('/banner/down', {banner_uuid: record.banner_uuid});
            tableList.reload();
          }} >下移</a>
        </div>
      }
		}
  ];

	return (
		<div>
      <Btn onClick={() => add.open('添加轮播图', {}, {width: 700})} >添加轮播图</Btn>
      <span className='lh_36 fs_12 ml_34' >建议尺寸16:9，JPG、PNG格式， 图片小于2M，最多添加10张轮播图</span>
      <TablePagination className='mt_10' api="/banner/query" columns={columns} ref={(rs) => tableList = rs} pagination />
      <Page ref={(rs) => add = rs} background='#ffffff' onClose={()=> tableList.reload() }>
        <CarouselAdd/>
      </Page>
		</div>
	);
}
