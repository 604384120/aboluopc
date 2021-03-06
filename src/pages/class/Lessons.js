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
            btn.loading = false;  //??????????????????loading????????????
            $.msg("????????????");
            addFile.close();
            getQuery();
          }}
        >
          {({set, form, submit, setByName, getByName}) => {
            return <div>
              <div className="mb_15 ta_c" >
                <div className="mb_10">
                  <Inputs form={form} name="fileType" value={addFile?.data?._Parent ? "VFP" : "stair"} disabled={addFile?.data} radios={[
                    {text: "????????????", value: "stair"},
                    {text: "????????????", value: "VFP"}
                  ]} width={280} />
                </div>
                <div className="mb_15" >
                  {(getByName("fileType") === "VFP" || addFile?.data?._Parent) ? <Inputs form={form} name="parent_file_uuid" required={true} placeholder="??????????????????" select={tableList.filter((item) => item.file_type === "CATALOG")} width={280} value={addFile?.data?.parent_file_uuid} /> :
                  <Inputs form={form} name="file_name" required={true} placeholder="????????????????????????" width={280} value={addFile?.data?.file_name} />}
                </div>
                {(getByName("fileType") === "VFP" || addFile?.data?._Parent) && <div className="mb_15" >
                  <Inputs form={form} name="file_name" required={true} placeholder="????????????????????????" className="lh_36" width={280} value={addFile?.data?.file_name} />
                </div>}
                <Inputs form={form} name="sort" required={true} placeholder="????????????????????????????????????" type="inputNumber" min={0} width={280} value={addFile?.data?.sort} />
              </div>
              <div style={{display: "flex", justifyContent: "center"}}>
                <Btn htmlType="submit">??????</Btn>
                <Btn className="ml_20" type="default" onClick={() => addFile.close() }>??????</Btn>
              </div>
            </div>
          }}
        </Form>
			</Modals>
		);
  };

	const columns = [
		{
			title: "??????",
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
			title: "??????",
			width: 280,
			align:'center',
			render: (text, record) => {
        return (<div>
          <a className='link' onClick={() => {
            if (record.file_type === "LESSON") {
              window.location.href = `/adminPc/LessonsAdd?product_uuid=${$.getQueryString('product_uuid')}&file_uuid=${record.file_uuid}`
            } else {
              record. _construction = record?._Parent ? '????????????' : '????????????';
              addFile.open("????????????", record)
            }
          }} >??????</a>
          <Divider type="vertical" />
          {record.file_type === "LESSON" && <span>  {/* ????????????????????? */}
            <a className='link' href={`/adminPc/Practice?product_uuid=${$.getQueryString('product_uuid')}&file_uuid=${record.file_uuid}`} >??????</a>
            <Divider type="vertical" />
            <a className='link' href={`/adminPc/LessonTextbook?product_uuid=${$.getQueryString('product_uuid')}&file_uuid=${record.file_uuid}`} >??????</a>
            <Divider type="vertical" />
          </span>}
          <Popconfirms title={record.file_type === "LESSON" ? "???????????????????????????????????????????????????????????????????????????????????????" :
          "?????????????????????????????????????????????????????????????????????????????????"} onConfirm={async () => {
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
      <Btn onClick={() => addLessons.open("????????????", {tableList, tableMap}, {width: 700})} className="mr_15" >????????????</Btn>
      <Btn onClick={() => addFile.open("????????????")}>????????????</Btn>
      {tableList && tableList?.length > 0 ? <Table columns={columns} dataSource={tableList} className="mt_15" rowKey={(re) => re.file_uuid} defaultExpandAllRows /> : <Empty />}
      <FileModal/>
      <Page ref={(rs) => addLessons = rs} background='#ffffff' onClose={()=> { getQuery(); Query && Query() } }>
        <LessonsAdd/>
      </Page>
		</div>
	);
}
