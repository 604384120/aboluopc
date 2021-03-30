import React, { useState, useEffect } from "react";
import { Divider } from "antd";
import { $, Form, TablePagination, Modals, Inputs, Btn, BreadcrumbBar, Popconfirms, Page } from "../comlibs";
import Info from "./Info";

export default function() {

  const [roleList, setRoleList] = useState();

  let { tableList, pageAdd, passwordModal, user = $.store().GlobalData.user }={}

  useEffect(() => { getQuery() }, []);

  async function getQuery () {
  };

	let PasswordModal = () => {
		return (
			<Modals ref={(rs) => passwordModal = rs} >
        <Form
          onSubmit={async (values, btn, ext) => {
            values.oper_uuid = passwordModal?.data?.oper_uuid
            let rs = await $.post("/oper/resetpwd", values);
            btn.loading = false;  //关闭提交按钮loading加载状态
            $.msg("重置密码成功");
            passwordModal.close();
            tableList.reload();
          }}
        >
          {({ form, submit }) => (
            <div>
              <div style={{ marginLeft: 110 }} >
                密码：
                <Inputs
                  className="input_wrap"
                  form={form}
                  name="passwd"
                  required={true}
                  placeholder="请输入新密码"
                />
              </div>
              <div style={{display: "flex", justifyContent: "center"}}>
                <Btn htmlType="submit">确定</Btn>
                <Btn className="ml_20" type="default" onClick={() => passwordModal.close() }>取消</Btn>
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
			title: "角色",
      dataIndex: "role_name",
      width: 220
		},
		{
      title: "权限数",
      dataIndex: "permission_codes",
      render: (text, record) => {
        return text?.length
      }
		},
		{
			title: "操作",
			width: 220,
			align:'center',
			render: (text, record) => {
        return (<div>
          <span className='link' onClick={() => {
              return window.location.href = `/adminPc/roleInfo?role_uuid=${record.role_uuid}`;
          }}>编辑</span>
          <Divider type="vertical" />
          <Popconfirms title='确认删除？' onConfirm={async () => {
              let res = await $.post('/role/remove', {role_uuid: record.role_uuid});
              tableList.reload();
            }} />
        </div>)
      }
    }
  ];

	return (
		<div className="br_3 bg_white pall_15">
      <BreadcrumbBar pathList={[$.store().BCB_setBarPath]} />
      <Btn onClick={() => pageAdd.open('新增角色', {}, {width: 900})}>新增角色</Btn>
      <TablePagination className='mt_10' api="/role/query" columns={columns} ref={(rs) => tableList = rs} />
      <PasswordModal/>
      <Page ref={(rs) => pageAdd = rs} onClose={() => tableList.reload()} background='#ffffff' >
        <Info/>
      </Page>
		</div>
	);
}
