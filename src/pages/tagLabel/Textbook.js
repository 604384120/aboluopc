import React, { useState, useEffect } from "react";
import { Divider, Tabs } from "antd";
import { $, Form, TablePagination, Modals, Inputs, Btn, BreadcrumbBar, Popconfirms, Page } from "../comlibs";

const { TabPane } = Tabs;

export default function() {

  // const [roleList, setRoleList] = useState();

  let { tableList, add }={}

  useEffect(() => { getQuery() }, []);

  async function getQuery () {
  };

	let AddModal = () => {
		return (
			<Modals ref={(rs) => add = rs} >
        <Form
          onSubmit={async (values, btn, ext) => {
            if (add.data.materiallabel_title) {
              values.materiallabel_uuid = add.data.materiallabel_uuid;
              let rs = await $.post("/materiallabel/update", values);
            } else {
              let rs = await $.post("/materiallabel/add", values);
            }
            btn.loading = false;  //关闭提交按钮loading加载状态
            $.msg("操作成功");
            add.close();
            tableList.reload();
          }}
        >
          {({ form, submit }) => (
            <div>
              <div style={{ marginLeft: 110 }} >
                标签名：
                <Inputs
                  className="input_wrap"
                  form={form}
                  name="materiallabel_title"
                  required={true}
                  value={add?.data?.materiallabel_title}
                  placeholder="1-3个字"
                />
              </div>
              <div className="dis_f box-pc mt_24" >
                <Btn htmlType="submit">确定</Btn>
                <Btn className="ml_20" type="default" onClick={() => add.close() }>取消</Btn>
              </div>
            </div>
          )}
        </Form>
			</Modals>
		);
  };

	let columns = [
    {
			title: "序号",
			dataIndex: "_key"
		},
		{
			title: "标签名",
      dataIndex: "materiallabel_title",
      width: 220
		},
		{
			title: "操作",
			width: 220,
			align:'center',
			render: (text, record) => {
        return (<div>
          <span className='link' onClick={() => add.open('编辑标签', record, {width: 800})}>编辑</span>
          <Divider type="vertical" />
          <span className='link' onClick={async () => {
              let res = await $.post('/materiallabel/up', {materiallabel_uuid: record.materiallabel_uuid});
              tableList.reload();
          }}>上移</span>
          <Divider type="vertical" />
          <span className='link' onClick={async () => {
              let res = await $.post('/materiallabel/down', {materiallabel_uuid: record.materiallabel_uuid});
              tableList.reload();
          }}>下移</span>
          <Divider type="vertical" />
          <Popconfirms title='确认删除？' onConfirm={async () => {
              let res = await $.post('/materiallabel/remove', {materiallabel_uuid: record.materiallabel_uuid});
              tableList.reload();
            }} />
        </div>)
      }
    }
  ];

	return (
		<div>
      <Btn onClick={() => add.open('新增标签', {}, {width: 800})}>新增标签</Btn>
      <TablePagination className='mt_10' api="/materiallabel/query" columns={columns} ref={(rs) => tableList = rs} />
      <AddModal/>
		</div>
	);
}
