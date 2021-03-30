import React, { useState, useEffect } from "react";
import { Divider, Form as Forms, } from "antd";
import { $, Form, TablePagination, Modals, Inputs, Btn, BreadcrumbBar } from "../comlibs";

const col = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

export default function() {

  const [roleList, setRoleList] = useState();

  let { tableList, add, passwordModal, user = $.store().GlobalData.user }={}

  useEffect(() => { getQuery() }, []);

  async function getQuery () {
    let res = await $.get('/role/query', {totalnum: 'NO'});
    if (!res) return;
    let list = res?.data?.map((item, index) => {
      item.value = item.role_uuid;
      item.text = item.role_name;
      return item
    });
    setRoleList(list)
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

	let AddModal = () => {
		return (
			<Modals ref={(rs) => add = rs}>
        <Form
          {...col}
          onSubmit={async (values, btn, ext) => {
            let rs = await $.post("/oper/add", values, () => {
              btn.loading = false;
            });
            btn.loading = false;  //关闭提交按钮loading加载状态
            $.msg("账号添加成功");
            add.close();
            tableList.reload();
          }}
        >
          {({ form, submit }) => (
            <div>
              <Forms.Item label="账号" required={true} >
                <Inputs
                  className="input_wrap"
                  form={form}
                  name="username"
                  required={true}
                  placeholder="请输入账号"
                />
              </Forms.Item>
              <Forms.Item label="密码" required={true} >
                <Inputs
                  className="input_wrap"
                  form={form}
                  name="passwd"
                  required={true}
                  placeholder="请输入密码"
                />
              </Forms.Item>
              <Forms.Item label="角色" required={true} >
                <Inputs
                  className="input_wrap"
                  width={190}
                  form={form}
                  name="role_uuid"
                  required={true}
                  select={roleList}
                  placeholder="请选择"
                />
              </Forms.Item>
              <Forms.Item label="姓名" required={true} >
                <Inputs
                  className="input_wrap"
                  form={form}
                  name="name"
                  required={true}
                  placeholder="请输入姓名"
                />
              </Forms.Item>
              <Forms.Item label="手机号" required={true} >
                <Inputs
                  className="input_wrap"
                  form={form}
                  name="phone"
                  required={true}
                  placeholder="请输入手机号"
                />
              </Forms.Item>
              <div style={{display: "flex", justifyContent: "center", marginTop: 24}}>
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
			title: "账号",
      dataIndex: "username",
      width: 220
		},
		{
      title: "角色",
      dataIndex: "role_name",
		},
		{
      title: "姓名",
      dataIndex: "name",
		},
		{
      title: "手机号",
      dataIndex: "phone",
		},
		{
			title: "操作",
			width: 220,
			align:'center',
			render: (text, record) => {
        return (<div>
          <span className='link' onClick={() => {
            if (record?.username === "admin" && user.username === 'admin') {
              return window.location.href = `/adminPc/accountInfo?oper_uuid=${record.oper_uuid}`;
            } else {
              if (record?.username !== "admin") {
                return window.location.href = `/adminPc/accountInfo?oper_uuid=${record.oper_uuid}`;
              }
              $.confirm("当前账号没有权限!");
              return
            }
          }}>编辑</span>
          {record?.username !== "admin" && <span>
            <Divider type="vertical" />
            <span className={record.status === "DISABLE" ? 'fc_dis' : 'link'} onClick={() => {
              if (record.status === "DISABLE") {
                return
              }
              passwordModal.open("重置密码", record)
            }}>重置密码</span>
            <Divider type="vertical" />
            {record.status === "ENABLE" && <span className='link' onClick={async () => {//  ENABLE代表已在职
                let res = await $.post('/oper/disable', {oper_uuid: record.oper_uuid});
                tableList.reload();
                $.msg("操作成功~");
                return res;
              }}
            >
              离职
            </span>}
            {record.status === "DISABLE" && <span className='link' onClick={async () => {//  ENABLE代表已离职
                let res = await $.post('/oper/enable', {oper_uuid: record.oper_uuid});
                tableList.reload();
                $.msg("操作成功~");
                return res;
              }}
            >
              复职
            </span>}
            <Divider type="vertical" />
            <a onClick={async () => {
              let res = await $.post('/oper/remove', {oper_uuid: record.oper_uuid});
              $.msg('操作成功');
              tableList.reload();
            }}>删除</a>
          </span>}
        </div>)
      }
    }
  ];

	return (
		<div className="br_3 bg_white pall_15">
      <BreadcrumbBar pathList={[$.store().BCB_setBarPath]} />
      <Btn onClick={() => add.open("新增账号")}>新增账号</Btn>
      <TablePagination className='mt_10' api="/oper/query" columns={columns} ref={(rs) => tableList = rs} />
      <AddModal/>
      <PasswordModal/>
		</div>
	);
}
