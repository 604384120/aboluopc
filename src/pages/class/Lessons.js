import React, { useState, useEffect } from "react";
import { Divider, Form as Forms, Table, Empty } from "antd";
import { $, Form, Modals, Inputs, Btn, Popconfirms, Page } from "../comlibs";
import LessonsAdd from "./LessonsAdd";

export default function({Query}) {

  const [tableList, setTableList] = useState();
  const [tableMap, setTableMap] = useState({});

  let { addLessons, addFile, shareModal }={}

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
          _item._Parent = item;
          if (_item.childrens.length > 0) {
            _item.children = _item.childrens
          }
        });
        item.children = item.childrens
      }
      tempMap[item.file_uuid] = item;
      return item
    });
    setTableMap(tempMap);
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
        if (record.file_type === "LESSON") {
          return <a className='link' onClick={() => {
              location.href = `/adminPc/LessonsAdd?product_uuid=${$.getQueryString('product_uuid')}&file_uuid=${record.file_uuid}`
          }} >{text}</a>
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
            if (record.file_type === "LESSON") {
              window.location.href = `/adminPc/LessonsAdd?product_uuid=${$.getQueryString('product_uuid')}&file_uuid=${record.file_uuid}`
            } else {
              record. _construction = record?._Parent ? '二级目录' : '一级目录';
              addFile.open("编辑目录", record)
            }
          }} >编辑</a>
          <Divider type="vertical" />
          {record.file_type === "LESSON" && <span>  {/* 判断课节和目录 */}
            <a className='link' href={`/adminPc/Practice?product_uuid=${$.getQueryString('product_uuid')}&file_uuid=${record.file_uuid}`} >练习</a>
            <Divider type="vertical" />
            <a className='link' href={`/adminPc/LessonTextbook?product_uuid=${$.getQueryString('product_uuid')}&file_uuid=${record.file_uuid}`} >教材</a>
            <Divider type="vertical" />
          </span>}
          <Popconfirms title={record.file_type === "LESSON" ? "删除课节会影响当前正在观看的学员，并同时删除该课节下的评论" :
          "删除目录不会删除目录下的课节，您需要对课节重新编辑目录"} onConfirm={async () => {
            if (record.file_type === "LESSON") {
              let res = await $.post('/course/lesson/remove', {file_uuid: record.file_uuid});
            } else {
              let res = await $.post('/course/catalog/remove', {file_uuid: record.file_uuid});
            }
            getQuery();
          }} />
        </div>)
      }
    }
  ];

	return (
		<div>
      <Btn onClick={() => addLessons.open("添加课节", {tableList, tableMap}, {width: 700})} className="mr_15" >添加课节</Btn>
      <Btn onClick={() => addFile.open("添加目录")}>添加目录</Btn>
      {tableList && tableList?.length > 0 ? <Table columns={columns} dataSource={tableList} className="mt_15" rowKey={(re) => re.file_uuid} defaultExpandAllRows /> : <Empty />}
      <FileModal/>
      <Page ref={(rs) => addLessons = rs} background='#ffffff' onClose={()=> { getQuery(); Query && Query() } }>
        <LessonsAdd/>
      </Page>
		</div>
	);
}
