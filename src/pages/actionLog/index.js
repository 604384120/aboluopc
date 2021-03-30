import React, { useState, useEffect } from "react";
import { Divider } from "antd";
import { $, Form, TablePagination, Modals, Inputs, Btn, BreadcrumbBar } from "../comlibs";

export default function() {

  // const [roleList, setRoleList] = useState();

  let { tableList, add, passwordModal, user = $.store().GlobalData.user }={}

  useEffect(() => { getQuery() }, []);

  async function getQuery () {
  };

	let columns = [
    {
			title: "序号",
			dataIndex: "_key"
		},
		{
			title: "操作账号",
      dataIndex: "username",
      width: 220
		},
		{
      title: "操作时间",
      dataIndex: "time_create",
		},
		{
      title: "操作模块",
      dataIndex: "module",
		},
		{
      title: "动作",
      dataIndex: "action",
		},
		{
			title: "内容",
			width: 220,
			align:'target',
			// render: (text, record) => {
      //   return (<div>
          
      //   </div>)
      // }
    }
  ];

	return (
		<div className="br_3 bg_white pall_15">
      <BreadcrumbBar pathList={[$.store().BCB_setBarPath]} />
      <Form
        className="mb_20"
        onSubmit={async (values, btn, ext) => {
          values.min_date = values.date[0];
          values.max_date = values.date[1];
          tableList.search(values)
        }}>
        {({form})=>(
          <div>
            <Inputs autoSubmit form={form} className="mr_15" type="rangePicker" name="date" placeholder={['开始日期','结束日期']}/>
            <Inputs form={form} name="username" style={{width:260}} className="mr_15" placeholder="输入操作者账号查询"/>
            <Btn htmlType="submit">搜索</Btn>
          </div>
        )}
      </Form>
      <TablePagination className='mt_10' api="/oper/logs" columns={columns} ref={(rs) => tableList = rs} />
		</div>
	);
}
