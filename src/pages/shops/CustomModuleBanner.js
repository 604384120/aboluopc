import React, { useState, useEffect } from "react";
import { Form as Forms, Divider, Card, Table } from "antd";
import { $, Form, Img, FixedBox, Btn, Inputs, BreadcrumbBar, Popconfirms, Page } from "../comlibs";
import CarouselAdd from './CarouselAdd'

export default function(props) {

  const Parent = props.Parent;

  const [infoData, setInfoData] = useState();

  let { add, customentry_title }={}

  useEffect(()=> {getQuery()}, []);

  async function getQuery(){
    if (!Parent) {
      let rs = await $.get("/customentry/detail", {customentry_uuid: $.getQueryString('customentry_uuid')});
      if (!rs) return;
      setInfoData(rs)
    }
  };

  const Content = () => {
    const [tableList, setTableList] = useState();

    useEffect(()=> {setTableList(infoData?.banners)}, []);

    const columns = [
      {
        title: "图片",
        dataIndex: "banner_img",
        width: 160,
        render: (text, record) => {
          return <Img width={137} height={66} src={text} />
        }
      },
      {
        title: "标题",
        dataIndex: "banner_title",
        width: 120,
      },
      {
        title: "跳转",
        dataIndex: "redirect_content",
        width: 180,
        render: (text, record) => {
          if (record?.redirect_type !== 'H5' && record?.redirect_type !== 'NULL') {
            return record?.product_name || record?.file_name
          }
          return text || "无"
        }
      },
      {
        title: "操作",
        render: (text, record, index) => {
          return <div>
            <a className='link' onClick={() => add.open("编辑轮播图", { ...record, pageIndex: '自定义'}, {width: 800})}>编辑</a>
            <Divider type="vertical" />
            <Popconfirms title='确认删除？' onConfirm={async () => {
              let list = tableList.filter((item) => {
                if (item.banner_uuid !== record.banner_uuid) {
                  return item
                }
              })
              setTableList(list)
              if (!Parent) {//  编辑轮播图组
                let param = {
                  banner_uuids : list.map((item) => item.banner_uuid).toString() || " ",
                  customentry_uuid : infoData.customentry_uuid
                };
                let rs = await $.post("/customentry/update", param);
                getQuery()
              }
            }} />
            <Divider type="vertical" />
            <a className='link' onClick={async () => {
              if (index === 0) {
                return
              }
              let list = [];
              tableList.forEach((item, key) => {
                if (index-1 === key) {
                  list.push(tableList[index])
                } else if (index === key) {
                  list.push(tableList[index - 1])
                } else {
                  list.push(item)
                }
              });
              setTableList(list)
              if (!Parent) {//  编辑轮播图组
                let param = {
                  banner_uuids : list.map((item) => item.banner_uuid).toString() || " ",
                  customentry_uuid : infoData.customentry_uuid
                };
                let rs = await $.post("/customentry/update", param);
                getQuery()
              }
            }} >上移</a>
            <Divider type="vertical" />
            <a className='link' onClick={async () => {
              if (index === tableList.length - 1) {
                return
              }
              let list = [];
              tableList.forEach((item, key) => {
                console.log(index)
                if (index === key) {
                  list.push(tableList[index + 1])
                } else if (index + 1 === key) {
                  list.push(tableList[index])
                } else {
                  list.push(item)
                }
              });
              setTableList(list)
              if (!Parent) {//  编辑轮播图组
                console.log(list)
                let param = {
                  banner_uuids : list.map((item) => item.banner_uuid).toString() || " ",
                  customentry_uuid : infoData.customentry_uuid
                };
                let rs = await $.post("/customentry/update", param);
                getQuery()
              }
            }} >下移</a>
          </div>
        }
      }
    ];

    return (
      <div className="oy_h pst_rel" >
        <Form
          className="mb_15"
          onSubmit={async (values, btn, ext) => {
            if (!tableList || tableList?.length < 0) {
              $.warning('请添加轮播图!');
              return
            }
            values.banner_uuids = tableList.map((item) => item.banner_uuid).toString() || " ";
            values.customentry_type = 'BANNER';
            values.customentry_title = customentry_title;
            if (Parent) {// 添加轮播图组
              let rs = await $.post("/customentry/add", values);
              Parent.close(true);
              btn.loading = false;  //关闭提交按钮loading加载状态
              $.msg("操作成功");
            }
          }}
        >
          {({set, form, submit, setByName, getByName}) => (
            <div>
              <Forms.Item label="标题" required={true} labelCol={{span: 2}} wrapperCol={{span: 20}} >
                <Inputs form={form} name="customentry_title" value={customentry_title || infoData?.customentry_title} width={190} onChange={(val) => customentry_title = val} required={true} />
              </Forms.Item>
              {Parent ? <FixedBox>
                <Btn className="mr_10" type='default' onClick={() => Parent && Parent.close()} >取消</Btn>
                <Btn htmlType="submit" >确定</Btn>
              </FixedBox> :
              <Btn htmlType="submit" className="ml_15" style={{position: 'absolute', bottom: 20, left: 'calc(50% - 30px)'}} onClick={async () => {
                let param = {
                  customentry_uuid: infoData.customentry_uuid,
                  customentry_type: 'BANNER',
                  customentry_title: getByName('customentry_title') || " ",
                  banner_uuids: tableList.map((item) => item.banner_uuid).toString() || " "
                }
                let rs = await $.post("/customentry/update", param);
                $.msg("操作成功");
                getQuery()
              }} >保存</Btn>}
            </div>
          )}
        </Form>
        <Btn onClick={() => add.open('添加轮播图', {pageIndex: '自定义'}, {width: 800})} disabled={tableList?.length >= 10} >添加轮播图</Btn>
        <span className='lh_36 fs_12 ml_34' >建议尺寸16:9，JPG、PNG格式， 图片小于2M，最多添加10张轮播图</span>
        <Table columns={columns} dataSource={tableList || []} pagination={false} className='mt_10 mb_70' />
        <Page ref={(rs) => add = rs} background='#ffffff' onClose={async (e)=> {
          let list = tableList || [];
          if (Parent) {// 添加轮播图组
            if (e.pageIndex === '编辑轮播图') {
              list = list.map((item) => {
                if (item.banner_uuid === e.banner_uuid) {
                  return item = {...e, banner_uuid: e.banner_uuid};
                }
              })
            } else {
              console.log(e)
              list.push(e)
            }
          } else {//  编辑轮播图组
            if (e.pageIndex === '编辑轮播图') {
              getQuery()
            } else {
              list.push(e);
              let param = {};
              param.banner_uuids = list.map((item) => item.banner_uuid).toString() || " ";
              param.customentry_uuid = infoData.customentry_uuid;
              let rs = await $.post("/customentry/update", param);
              getQuery()
            }
          }
          setTableList([...list])
        }}>
          <CarouselAdd/>
        </Page>
      </div>
    )
  };

	return (
    Parent ? <Card title={Parent?.state?.title} bordered={false} >
      <Content/>
    </Card>: 
    <div className="br_3 bg_white pall_15">
      <BreadcrumbBar pathList={['/adminPc/shops', `${$.store().BCB_setBarPath}?customentry_uuid=${$.getQueryString('customentry_uuid')}`]} />
      <Content/>
    </div>
	);
}
