import React, { useState, useEffect } from "react";
import { Divider, Tabs, Cascader, Form as Forms } from "antd";
import { $, Page, Form, TablePagination, Modals, Inputs, BreadcrumbBar, Btn, Popconfirms } from "../comlibs";

const col = {
  labelCol: { span: 4 },
  wrapperCol: { span: 15 },
};

export default function() {

  let { modals_add, tableList } = {};

  const columns = [
    {
      title: "序号",
      align:'center',
      dataIndex: "_key"
    },
    {
      title: "渠道名称",
      width: 220,
      dataIndex: "channel_title"
    },
    {
      title: "渠道码",
      width: 220,
      dataIndex: "channel_code"
    },
    {
      title: "备注",
      width: 220,
      dataIndex: "remark"
    },
    {
      title: "操作",
      width: 220,
			align:'center',
      render: (rs) => {
        return (
          <div>
            <span className='link' onClick={() => {
              modals_add.open("编辑渠道", rs)
            }}>编辑</span>
            <Divider type="vertical" />
            <Popconfirms title='确认删除？' onConfirm={async () => {
              const list = await $.post("/channel/remove", {channel_uuid: rs.channel_uuid});
              tableList.reload();
            }} />
          </div>
        )
      }
    }
  ];

  const EditModals = () => {
    return (
      <Modals ref={res => modals_add = res}>
        {(modalePro) => (
          <div>
            <Form {...col} onSubmit={async (values, btn) => {
              if (modalePro) {//  编辑
                values.channel_uuid = modalePro.channel_uuid;
                let res = await $.post("/channel/update", values, () => {
                  btn.loading = true;
                });
              } else {//  添加
                let res = await $.post("/channel/add", {...values}, () => {
                  btn.loading = true;
                });
              }
              btn.loading = false;
              tableList.reload();
              modals_add.close();
            }}>
              {({form}) => (
                <div>
                  <Forms.Item label="渠道名称">
                    <Inputs form={form} name="channel_title" value={modalePro?.channel_title} required={true}/>
                  </Forms.Item>
                  <Forms.Item label="渠道码">
                    <Inputs form={form} name="channel_code" value={modalePro?.channel_code} disabled={modalePro?.channel_code} required={true}/>
                  </Forms.Item>
                  <Forms.Item label="备注">
                    <Inputs name="remark" type="textArea" rows={4} form={form} value={modalePro?.remark} required={true}/>
                  </Forms.Item>
                  <div style={{display: "flex", justifyContent: "center"}}>
                    <Btn htmlType="submit">确定</Btn>
                    <Btn className="ml_20" type="default" onClick={() => modals_add.close() }>取消</Btn>
                  </div>
                </div>
              )}
            </Form>
          </div>
        )}
      </Modals>
    )
  }
  
	return (
		<div className="br_3 bg_white pall_15">
      <BreadcrumbBar pathList={[$.store().BCB_setBarPath]} />
      <Btn onClick={() => modals_add.open("添加渠道") }>增加渠道</Btn>
      <TablePagination 
        className="mt_10"
        api="/channel/query"
        columns={columns}
        ref={rs => (tableList = rs)}
      />
      <EditModals/>
		</div>
	);
}
