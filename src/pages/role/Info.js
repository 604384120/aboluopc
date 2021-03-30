import React, { useState, useEffect } from "react";
import { Form as Forms, Checkbox, Card } from "antd";
import { $, Form, Inputs, BreadcrumbBar, Btn, TableEdit } from "../comlibs";

export default function(props) {
  const col = {
    labelCol: { span: 2 },
    wrapperCol: { span: 22 }
  };

  const Parent = props?.Parent;

  const [roleList, setRoleList] = useState([]);
  const [infoData, setInfoData] = useState();
  const [permissionsData, setPermissionsData] = useState();

  let { editPermissions, params = [] } = {};

  useEffect(() => { getQuery() }, []);

  async function getQuery () {
    let res = await $.get('/role/query', {totalnum: 'NO'});
    if (!res) return;
    let list = res.data.map((item, index) => {
      item.value = item.role_uuid;
      item.text = item.role_name;
      return item
    });
    setRoleList(list);
    if (Parent) {// 添加
      res = await $.get('/oper/permissions');
      if (!res) return;
      res && init(res);
      setPermissionsData(res)
    } else {//  编辑
      res = await $.get('/role/detail', {role_uuid:  $.getQueryString('role_uuid')});
      if (!res) return;
      res && init(res);
      setInfoData(res)
    }
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
          width: 80,
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
          width: 80,
          colSpan: 0,
        },
        {
          title: "权限点",
          // dataIndex: "permissions",
          render: ({key}, record) => {
            let defaultValues = [];
            if (!Parent) {
              let keyStr = parseInt(key.split('-').slice(-1).toString());
              defaultValues = record?.permissions?.map((item) => {
                if (item.permission === 'ON') {
                  return item.permission_code
                }
              });
              params[keyStr] = defaultValues;
            };
            return <Checkbox.Group form={form} options={creatOptions(record?.permissions)} defaultValue={defaultValues} onChange={(checkedValues, form) => handleChangePor(checkedValues, key, form, record)} />
          }
        },
      ]
    )
  };

  const Content = () => {
    return <Form
      {...col}
      onSubmit={async (values, btn, ext) => {
        if (params.flat().length <= 0) {
          $.msg('请选择权限');
          return
        }
        values.permission_codes = params.flat().toString();
        if (Parent) {
          let rs = await $.post("/role/add", values, () => {
            btn.loading = false;
          });
          btn.loading = false;  //关闭提交按钮loading加载状态
          $.msg("角色添加成功");
          Parent && Parent.close(true)
        } else {
          values.role_uuid = $.getQueryString('role_uuid')
          let rs = await $.post("/role/update", values, () => {
            btn.loading = false;
          });
          btn.loading = false;  //关闭提交按钮loading加载状态
          $.msg("角色编辑成功");
          window.location.href = '/adminPc/role'
        }
        // return
      }}
    >
      {({ set, form, submit, setByName }) => (
        <div>
          <Forms.Item label="角色名称" >
            <Inputs form={form} name="role_name" value={infoData?.role_name} required={true} />
          </Forms.Item>
          <Forms.Item label="权限" >
            <TableEdit
              title="权限"
              columns={getCol(form)}
              data={permissionsData?._permissions || infoData?._permissions || []}
              init={(ref) => (editPermissions = ref)}
              action={false}
              add={false}
              bordered={true}
            />
          </Forms.Item>
          <div className="ta_c mt_15">
            <Btn htmlType="submit" width={100}>确认</Btn>
          </div>
          <div className='ta_c mt_16' >修改权限不影响之前已经分配了该角色账号的权限。</div>
        </div>
      )}
    </Form>
  };

	return (
    Parent ? <Card title={Parent?.state?.title} bordered={false} >
    <Content/>
  </Card> :
		<div className="br_3 bg_white pall_15">
      <BreadcrumbBar pathList={['/adminPc/roles', `${$.store().BCB_setBarPath}?role_uuid=${$.getQueryString('role_uuid')}`]} />
      <Content/>
		</div>
	);
}
