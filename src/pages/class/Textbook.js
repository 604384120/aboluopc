import React, { useState, useEffect } from "react";
import { Divider, Form as Forms, Table } from "antd";
import { $, Form, Modals, Inputs, Btn, Popconfirms, Page, TablePagination } from "../comlibs";
import ClassTextbookAdd from "./ClassTextbookAdd";

export default function() {

  // const [tableList, setTableList] = useState([]);

  let { addTextbook, tableList }={}

  useEffect(() => { getQuery() }, []);

  async function getQuery () {
  };

	const columns = [
    {
			title: "序号",
			dataIndex: "_key"
		},
		{
			title: "教材名称",
      dataIndex: "product_name",
      key: 'product_name',
      width: 800
		},
		{
			title: "操作",
			width: 280,
			align:'center',
			render: (text, record) => {
        return <Popconfirms title="确定移除？" content='移除' onConfirm={async () => {
            let res = await $.post('/product/course/remove/material', {product_uuid: $.getQueryString('product_uuid'), material_uuid: record.product_uuid});
            $.msg('操作成功');
            tableList.reload()
          }} />
      }
    }
  ];

	return (
		<div>
      <Btn onClick={() => addTextbook.open("添加教材", {}, {width: 700})} className="mr_15" >添加教材</Btn>
      <TablePagination className='mt_10' api="/product/course/materials" params={{product_uuid: $.getQueryString('product_uuid')}} columns={columns} ref={(rs) => tableList = rs} />
      <Page ref={(rs) => addTextbook = rs} background='#ffffff' onClose={()=> tableList.reload() }>
        <ClassTextbookAdd/>
      </Page>
		</div>
	);
}
