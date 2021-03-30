import React, { useState, useEffect } from "react";
import { Form as Forms, Checkbox } from "antd";
import { $, Form, Inputs, BreadcrumbBar, Btn, TableEdit } from "../comlibs";

export default function() {
  const col = {
    labelCol: { span: 3 },
    wrapperCol: { span: 18 }
  };

  const [roleList, setRoleList] = useState([]);
  const [infoData, setInfoData] = useState();

  let { editPermissions, params = [] } = {};

  useEffect(() => { getQuery() }, []);

  async function getQuery () {
    let res = await $.get('/role/query', {totalnum: 'NO'});
    if (!res) return;
    let list = res?.data?.map((item, index) => {
      item.value = item.role_uuid;
      item.text = item.role_name;
      return item
    });
    setRoleList(list);
    res = await $.get('/oper/detail', {oper_uuid: $.getQueryString('oper_uuid')});
    if (!res) return;
    res.oper && init(res.oper);
    setInfoData({...res.oper});
  };

  const init = (data) => {
    data._permissions = [];
    let index = 0;
    data._permissions[index] = {};
    const getList = (list, parent) => {
      for(let node of list) {
        if (node.classfies) {
          // data._permissions[index] = {};
          data._permissions[index].startSpan = true;
          getList(node.classfies, node)
        }
        if (node.permissions) {
          data._permissions[index].name_VFP = node.name;
          data._permissions[index].subSpan = 1;
          data._permissions[index].name_start = parent.name;
          data._permissions[index].rowSpan = parent.classfies.length > 0 ? parent.classfies.length : 1;
          data._permissions[index].permissions = node.permissions;
          index ++;
          data._permissions[index] = {};
          // getList(node.permissions)
        }
      }
    };
    getList(data.permissions);
    data._permissions.splice(data._permissions.length - 1, data._permissions.length)
  };

  const handleChangePor = (value, key, form, data) => {
    let keyStr = parseInt(key.split('-').slice(-1).toString());
    params[keyStr] = value
  };

  const creatOptions = (list) => {
    let options = [];
    if (list) {
      for (let item of list) {
        if (JSON.stringify(item) == "{}") {
          continue
        }
        options.push({
          label : item.permission_name,
          value : item.permission_code,
        })
      }
    }
    return options
  };

  const getCol = (form) => {
    return (
      [
        {
          title: "菜单",
          dataIndex: "name_start",
          // type: "integer",
          // editable: false,
          colSpan: 2,
          render: (value, row, index) => {
            const obj = {
              children: value,
              props: {
                rowSpan: row.rowSpan
              },
            };
            obj.props.colSpan = !row.startSpan && 0
            return obj
          },
        },
        {
          title: '二级菜单',
          dataIndex: 'name_VFP',
          colSpan: 0,
        },
        {
          title: "权限点",
          // dataIndex: "permissions",
          render: ({key}, record) => {
            let keyStr = parseInt(key.split('-').slice(-1).toString());
            let defaultValues = record?.permissions?.map((item) => {
              if (item.permission === 'ON') {
                return item.permission_code
              }
            });
            params[keyStr] = defaultValues;
            return <Checkbox.Group form={form} options={creatOptions(record?.permissions)} defaultValue={defaultValues} onChange={(checkedValues, form) => handleChangePor(checkedValues, key, form, record)} />
          }
        },
      ]
    )
  };

	return (
		<div className="br_3 bg_white pall_15">
      <BreadcrumbBar pathList={['/adminPc/accounts', `${$.store().BCB_setBarPath}?oper_uuid=${$.getQueryString('oper_uuid')}`]} />
      <Form
        {...col}
        onSubmit={async (values, btn, ext) => {
          values.permission_codes = params.flat().toString();
          values.oper_uuid = $.getQueryString('oper_uuid');
          let rs = await $.post("/oper/update", values, () => {
            btn.loading = false;
          });
          btn.loading = false;  //关闭提交按钮loading加载状态
          $.msg("账号编辑成功");
          // getQuery()
        }}
      >
        {({ set, form, submit, setByName }) => {
          return <div>
            <Forms.Item label="账号" >
              <span>{infoData?.username}</span>
            </Forms.Item>
            <Forms.Item label="角色" required={true} >
              <Inputs form={form} name="role_uuid" value={infoData?.kind == "ADMIN" ? "超级管理员" : infoData?.role_uuid} select={roleList} required={true} width={190} disable={infoData?.kind == "ADMIN"} />
            </Forms.Item>
            <Forms.Item label="姓名" required={true} >
              <Inputs form={form} name="name" value={infoData?.name} required={true} />
            </Forms.Item>
            <Forms.Item label="手机号" required={true} >
              <Inputs form={form} name="phone" value={infoData?.phone} required={true} />
            </Forms.Item>
            <Forms.Item label="权限" required={true} >
              <TableEdit
                title="权限"
                columns={getCol(form)}
                data={infoData?._permissions || []}
                init={(ref) => (editPermissions = ref)}
                action={false}
                add={false}
                bordered={true}
              />
            </Forms.Item>
            <div className="ta_c mt_15">
              <Btn htmlType="submit" width={100} disabled={infoData?.kind == "ADMIN"} >确认</Btn>
            </div>
          </div>
        }}
      </Form>
		</div>
	);
}
