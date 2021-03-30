import React, { useState, useEffect } from "react";
import { Divider, Form as Forms, Table, Empty } from "antd";
import { $, Form, Modals, Inputs, Btn, Popconfirms, Page } from "../comlibs";
import TextbookFileAdd from "./TextbookFileAdd";

export default function() {

  const [tableList, setTableList] = useState([]);
  const [tableMap, setTableMap] = useState({});

  let { addTextbookFile, addFile, shareModal }={}

  useEffect(() => { getQuery() }, []);

  async function getQuery () {
    let res = await $.get('/material/catalogs', {product_uuid: $.getQueryString('product_uuid')});
    if (!res) return;
    let tempMap = {};
    let list  = [];
    res.forEach((item) => {
      // if (item.file_type === 'MATERIAL') {
      //   return
      // }
      item.text = item.file_name;
      item.value = item.file_uuid;
      if (item.childrens.length > 0) {
        item.childrens.forEach(_item => {
          _item.text = _item.file_name;
          _item.value = _item.file_uuid;
          _item._Parent = item;
          if (_item.childrens.length > 0) {
            _item.children = _item.childrens
          }
        });
        item.children = item.childrens
      }
      tempMap[item.file_uuid] = item;
      list.push(item)
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
              let rs = await $.post("/material/catalog/update", values, () => {
                btn.loading = false;
              });
            } else {
              let rs = await $.post("/material/catalog/add", values, () => {
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
                  <Inputs form={form} name="fileType" value={addFile?.data?._Parent ? "VFP" : "stair"} disabled={addFile?.data} radios={[
                    {text: "一级目录", value: "stair"},
                    {text: "二级目录", value: "VFP"}
                  ]} width={280} />
                </div>
                <div className="mb_15" >
                  {(getByName("fileType") === "VFP" || addFile?.data?._Parent) ? <Inputs form={form} name="parent_file_uuid" required={true} placeholder="选择一级目录" select={tableList.filter((item) => item.file_type === "CATALOG")} width={280} value={addFile?.data?.parent_file_uuid} /> :
                  <Inputs form={form} name="file_name" required={true} placeholder="输入一级目录名称" width={280} value={addFile?.data?.file_name} />}
                </div>
                {(getByName("fileType") === "VFP" || addFile?.data?._Parent) && <div className="mb_15" >
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
      render: (text, record) => {
        if (record.file_type === "MATERIAL") {
          if (record.transform_status === 'TRANSFORMING') {
            $.warning('内容转换中，无法编辑！');
            getQuery();
            return
          }
          return <a className='link' href={`/adminPc/TextbookFileAdd?product_uuid=${$.getQueryString('product_uuid')}&file_uuid=${record.file_uuid}`} >{text}</a>
        }
        return text
      }
		},
		{
			title: "操作",
			width: 280,
			align:'center',
			render: (text, record) => {
        return (<div>
          <a className='link' onClick={() => {
            if (record.file_type === "MATERIAL") {
              if (record.transform_status === 'TRANSFORMING') {
                $.warning('内容转换中，无法编辑！');
                getQuery();
                return
              }
              window.location.href = `/adminPc/TextbookFileAdd?product_uuid=${$.getQueryString('product_uuid')}&file_uuid=${record.file_uuid}`
            } else {
              addFile.open("编辑目录", record)
            }
          }} >编辑</a>
          <Divider type="vertical" />
          <Popconfirms title={record.file_type === "MATERIAL" ? "删除教材会影响当前正在观看的学员，并同时删除已经记录的笔记内容。" :
          "删除目录不会删除目录下的教材，您需要对教材重新编辑目录"} onConfirm={async () => {
            if (record.file_type === "MATERIAL") {
              let res = await $.post('/material/file/remove', {file_uuid: record.file_uuid});
            } else {
              let res = await $.post('/material/catalog/remove', {file_uuid: record.file_uuid});
            }
            getQuery();
          }} />
        </div>)
      }
    }
  ];

	return (
		<div>
      <Btn onClick={() => addTextbookFile.open("添加内容", {tableList, tableMap}, {width: 700})} className="mr_15" >添加内容</Btn>
      <Btn onClick={() => addFile.open("添加目录")}>添加目录</Btn>
      {tableList && tableList.length > 0 ? <Table columns={columns} dataSource={tableList} rowKey={(rs) => rs.file_name } className="mt_15" defaultExpandAllRows /> : <Empty />}
      <FileModal/>
      <Page ref={(rs) => addTextbookFile = rs} background='#ffffff' onClose={()=> getQuery() }>
        <TextbookFileAdd/>
      </Page>
		</div>
	);
}
