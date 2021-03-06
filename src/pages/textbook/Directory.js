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
            btn.loading = false;  //??????????????????loading????????????
            $.msg("????????????");
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
        if (record.file_type === "MATERIAL") {
          if (record.transform_status === 'TRANSFORMING') {
            $.warning('?????????????????????????????????');
            getQuery();
            return
          }
          return <a className='link' href={`/adminPc/TextbookFileAdd?product_uuid=${$.getQueryString('product_uuid')}&file_uuid=${record.file_uuid}`} >{text}</a>
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
            if (record.file_type === "MATERIAL") {
              if (record.transform_status === 'TRANSFORMING') {
                $.warning('?????????????????????????????????');
                getQuery();
                return
              }
              window.location.href = `/adminPc/TextbookFileAdd?product_uuid=${$.getQueryString('product_uuid')}&file_uuid=${record.file_uuid}`
            } else {
              addFile.open("????????????", record)
            }
          }} >??????</a>
          <Divider type="vertical" />
          <Popconfirms title={record.file_type === "MATERIAL" ? "????????????????????????????????????????????????????????????????????????????????????????????????" :
          "?????????????????????????????????????????????????????????????????????????????????"} onConfirm={async () => {
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
      <Btn onClick={() => addTextbookFile.open("????????????", {tableList, tableMap}, {width: 700})} className="mr_15" >????????????</Btn>
      <Btn onClick={() => addFile.open("????????????")}>????????????</Btn>
      {tableList && tableList.length > 0 ? <Table columns={columns} dataSource={tableList} rowKey={(rs) => rs.file_name } className="mt_15" defaultExpandAllRows /> : <Empty />}
      <FileModal/>
      <Page ref={(rs) => addTextbookFile = rs} background='#ffffff' onClose={()=> getQuery() }>
        <TextbookFileAdd/>
      </Page>
		</div>
	);
}
