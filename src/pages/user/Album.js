import React, { useState, useEffect } from "react";
import { Divider } from "antd";
import { $, Form, TablePagination, Popconfirms, Inputs, Btn, BreadcrumbBar } from "../comlibs";
import { Page_ComboAlbum } from '../works'

export default function() {

  // const [roleList, setRoleList] = useState();

  let { tableList, comboRef } = {}

  useEffect(() => { getQuery() }, []);

  async function getQuery () {
  };

	let columns = [
    {
			title: "序号",
			dataIndex: "_key"
		},
		{
			title: "合辑名称",
      dataIndex: "product_name",
      key: 'product_name',
      ellipsis: true,
      width: 220,
		},
		{
      title: "课程数量",
      dataIndex: "products",
      key: 'products',
      // align: 'center',
      width: 80,
      render: (text, record) => {
        return text?.length
      }
		},
		{
      title: "开通方式",
      dataIndex: "channel",
      key: 'channel',
      width: 80,
		},
		{
      title: "开通时间",
      dataIndex: "time_create",
      key: 'time_create',
      width: 120,
		},
		{
			title: "操作",
			width: 220,
			align:'center',
			render: (text, record) => {
        if (record.product_type === 'COURSE') {
          return <a href={`/adminPc/UserLessonInfo?user_uuid=${$.getQueryString('user_uuid')}&product_uuid=${record.product_uuid}`}>查看</a>
        }
        return <Popconfirms title='删除后，用户无法继续查看课程' onConfirm={async () => {
          let res = await $.post('/product/permission/record/cancel', {record_uuid: record.record_uuid});
          tableList.reload();
        }} />
      }
    }
  ];

	return (
		<div className="br_3 bg_white">
      <Btn onClick={() => {
        comboRef.open("开通合辑", {
          value: [],
          onSure: async (d) => {
            let product_uuids = d.map((item) => item.product_uuid);
            let res = await $.post('/product/permission/batch/add', {product_uuids: product_uuids.toString(), user_uuids: $.getQueryString('user_uuid'), product_type: "ALBUM"});
            tableList.reload();
          },
        })
      }}>开通合辑</Btn>
      <TablePagination className='mt_10' api="/user/album/records" params={{user_uuid: $.getQueryString('user_uuid')}} columns={columns} ref={(rs) => tableList = rs} childrenColumnName={['products']} />
      <Page_ComboAlbum ref={(rs) => comboRef = rs} />
		</div>
	);
}
