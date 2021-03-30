import React, { useState, useEffect } from "react";
import { Divider, Form as Forms, Table } from "antd";
import { $, Form, Modals, Inputs, Btn, Popconfirms, BreadcrumbBar } from "../comlibs";

export default function() {

  const [tableList, setTableList] = useState([]);
  const [tableMap, setTableMap] = useState({});

  let { addFile }={}

  useEffect(() => { getQuery() }, []);

  async function getQuery () {
    let res = await $.get('/course/catalogs', {product_uuid: $.getQueryString('product_uuid')});
    if (!res) return;
    let tempMap = {};
    let list  = res.map((item) => {
      item.text = item.file_name;
      item.value = item.file_uuid;
      if (item.childrens.length > 0) {
        item.childrens.forEach(_item => {
          _item.text = _item.file_name;
          _item.value = _item.file_uuid;
          if (_item.childrens.length > 0) {
            _item.children = _item.childrens
          }
        });
        item.children = item.childrens
      }
      tempMap[item.file_uuid] = item;
      return item
    });
    setTableMap(tempMap)
    setTableList([...list]);
  };

	const FileModal = () => {
		return (
			<Modals ref={(rs) => addFile = rs} width={440} >
        <Form
          onSubmit={async (values, btn, ext) => {
            values.product_uuid = $.getQueryString('product_uuid');
            if (addFile?.data) {
              if (addFile?.data?.parent_file_uuid) {
                values.parent_file_uuid = addFile?.data?.parent_file_uuid;
                values.file_uuid = addFile?.data?.file_uuid
              } else {
                values.file_uuid = addFile?.data?.file_uuid
              }
              let rs = await $.post("/course/catalog/update", values, () => {
                btn.loading = false;
              });
            } else {
              let rs = await $.post("/course/catalog/add", values, () => {
                btn.loading = false;
              });
            }
            btn.loading = false;  //关闭提交按钮loading加载状态
            $.msg("操作成功");
            addFile.close();
            getQuery();
          }}
        >
          {({set, form, submit, setByName, getByName}) => {
            if (addFile?.data && !addFile?.data?.text) {
              setByName("fileType", "VFP")
            }
            return <div>
              <div className="mb_15 ta_c" >
                <div className="mb_10">
                  <Inputs form={form} name="fileType" value={(!addFile?.data || !addFile?.data?.parent_file_uuid) ? "stair" : "VFP"} disabled={addFile?.data} radios={[
                    {text: "一级目录", value: "stair"},
                    {text: "二级目录", value: "VFP"}
                  ]} width={280} />
                </div>
                <div className="mb_15" >
                  {(!getByName("fileType") || getByName("fileType") === "stair")? <Inputs form={form} name="file_name" required={true} placeholder="输入一级目录名称" width={280} value={addFile?.data?.file_name} /> :
                  <Inputs form={form} name="parent_file_uuid" required={true} placeholder="选择一级目录" select={tableList} width={280} value={addFile?.data?.parent_file_uuid} />}
                </div>
                {getByName("fileType") === "VFP" && <div className="mb_15" >
                  <Inputs form={form} name="file_name" required={true} placeholder="输入二级目录名称" className="lh_36" width={280} value={addFile?.data?.file_name} />
                </div>}
                <Inputs form={form} name="sort" required={true} placeholder="输入排序，序号越大越靠前" type="inputNumber" min={0} width={280} value={addFile?.data?.sort} />
              </div>
              <div style={{display: "flex", justifyContent: "center"}}>
                <Btn htmlType="submit">确定</Btn>
                <Btn className="ml_20" type="default" onClick={() => addFile.close() }>取消</Btn>
              </div>
            </div>
          }}
        </Form>
			</Modals>
		);
  };

	const columns = [
		{
			title: "目录",
      dataIndex: "file_name",
      key: 'file_name',
		},
		{
			title: "操作",
			width: 280,
			align:'center',
			render: (text, record) => {
        return (record.file_type === "LESSON" &&
          <span>  {/* 判断课节和目录 */}
            <a className='link' href={`/adminPc/Practice?product_uuid=${$.getQueryString('product_uuid')}&file_uuid=${record.file_uuid}&type=user`} >查看练习</a>
          </span>)
      }
    }
  ];

	return (
		<div className="br_3 bg_white pall_15" >
      <BreadcrumbBar pathList={['/adminPc/user', `/adminPc/UserInfo?user_uuid=${$.getQueryString('user_uuid')}`, `${$.store().BCB_setBarPath}?user_uuid=${$.getQueryString('user_uuid')}`]} />
      <Table columns={columns} dataSource={tableList} rowKey={(rs) => rs.file_name } className="mt_15" />
      <FileModal/>
		</div>
	);
}
