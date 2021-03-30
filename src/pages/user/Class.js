import React, { useState, useEffect } from "react";
import { Divider } from "antd";
import { $, Form, TablePagination, Popconfirms, Inputs, Btn, BreadcrumbBar } from "../comlibs";
import { Page_Combo } from '../works'

export default function() {

  // const [roleList, setRoleList] = useState();

  let { tableList, comboRef }={}

  useEffect(() => { getQuery() }, []);

  async function getQuery () {
  };

	let columns = [
    {
			title: "序号",
			dataIndex: "_key"
		},
		{
			title: "课程名称",
      dataIndex: "product_name",
      width: 220
		},
		{
      title: "学习进度",
      dataIndex: "cnt_study_finished",
      render: (text, record) => {
        return `${text}/${record?.cnt_lesson_finished}`
      }
		},
		{
      title: "开通方式",
      dataIndex: "channel",
		},
		{
      title: "开通时间",
      dataIndex: "time_create",
		},
		{
			title: "操作",
			width: 220,
			align:'center',
			render: (text, record) => {
        return (<div>
          <a href={`/adminPc/UserLessonInfo?user_uuid=${$.getQueryString('user_uuid')}&product_uuid=${record.product_uuid}`}>查看</a>
          <Divider type="vertical" />
          <Popconfirms title='删除后，用户无法继续查看课程' onConfirm={async () => {
            let res = await $.post('/product/permission/record/cancel', {record_uuid: record.record_uuid});
            tableList.reload();
          }} />
        </div>)
      }
    }
  ];

	return (
		<div className="br_3 bg_white">
      <Btn onClick={() => {
        comboRef.open("开通课程", {
          value: [],
          onSure: async (d) => {
            let product_uuids = d.map((item) => item.product_uuid);
            let res = await $.post('/product/permission/batch/add', {product_uuids: product_uuids.toString(), user_uuids: $.getQueryString('user_uuid')});
            tableList.reload();
          },
        })
      }}>开通课程</Btn>
      <TablePagination className='mt_10' api="/user/course/records" params={{user_uuid: $.getQueryString('user_uuid')}} columns={columns} ref={(rs) => tableList = rs} />
      <Page_Combo ref={(rs) => comboRef = rs} />
		</div>
	);
}
