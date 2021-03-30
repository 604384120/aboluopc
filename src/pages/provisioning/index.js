import React, { useState, useEffect } from "react";
import { Table, Form as Forms, Icon } from "antd";
import { $, Form, TablePagination, Modals, Inputs, Btn, BreadcrumbBar, Popconfirms, Page, Img, UploadfileImport } from "../comlibs";
import BatchOpen from "./BatchOpen";

export default function() {
		
	const columns = [
    {
			title: "序号",
			dataIndex: "_key"
		},
		{
			title: "名称",
      dataIndex: "product_name",
      width: 220
		},
		{
      title: "类型",
      render: (rs) => {
        return rs.product_type === "COURSE" ? "课程" :
        rs.product_type === "MATERIAL" ? "教材" : 
        rs.product_type === "ALBUM" ? "合辑" : "-"
      }
		},
		{
      title: "用户",
      dataIndex: "user_name",
		},
		{
      title: "开通方式",
      dataIndex: "channel",
    },
    {
      title: "开通时间",
      dataIndex: "time_create",
    },
    {
      title: "操作",
      render: (rs) => {
        return rs.product_type === "COURSE" ?
        <Popconfirms title="删除后，用户无法继续查看课程" onConfirm={async () => {
          const res = await $.post("/product/permission/record/cancel", {
            record_uuid: rs.record_uuid
          })
          tab.reload();
        }}>
          <a className="fc_err">
            删除
          </a>
        </Popconfirms> :
        rs.product_type === "MATERIAL" ?
        <Popconfirms title="删除后，用户无法继续查看教材，教材下创建的笔记内容也会被删除" onConfirm={async () => {
          const res = await $.post("/product/permission/record/cancel", {
            record_uuid: rs.record_uuid
          })
          tab.reload();
        }}>
          <a className="fc_err">
            删除
          </a>
        </Popconfirms> :
        rs.product_type === "ALBUM" ?
        <Popconfirms title="删除后，用户无法继续查看合辑" onConfirm={async () => {
          const res = await $.post("/product/permission/record/cancel", {
            record_uuid: rs.record_uuid
          })
          tab.reload();
        }}>
          <a className="fc_err">
            删除
          </a>
        </Popconfirms> : ""
      }
		},
  ];

  let { tab, upload, update_modal, failue_modal, batchOpen } = {};

  const UploadModal = () => {
		return (
			<Modals
        width="950px"
        bodyStyle={{padding:0}}
        ref={ref => update_modal = ref}
			>
				<div style={{padding:'15px 70px 30px',display:'flex',justifyContent:'space-between'}}>
          <div className="br_4 pall_10 b_1 fc_black2" style={{width:372}}>
              <div>下载开通记录基本信息模板</div>
              <div className="mv_10 br_4 b_1 box box-ac box-pc box-ver">
                  <img style={{width:78,height:100}} className="mb_15 mt_24" src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/421ad862-cedb-11e9-8203-00163e04cc20.png"/>
                  <div className="mb_10">
                      <a className="link mr_5" onClick={()=>{
                          $.download('/user/select/tmpl', {token: $.token()})
                      }} download="开通记录基本信息模版">点击下载</a>
                      <span>开通记录信息模板</span>
                  </div>
              </div>
              <div className="ta_c fs_12 fc_black5">下载对应模板，阅读注意点后填写模板文件，模板表头不可删，手机号为必填项</div>
          </div>
          
          <div className="br_4 pall_10 b_1 fc_black2" style={{width:372}}>
              <div>上传记录文件</div>
              <div className="mv_10 br_4 b_1 box box-ac box-pc box-ver">
                  <img style={{width:78,height:100}} className="mb_15 mt_24" src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/421ad862-cedb-11e9-8203-00163e04cc20.png"/>
                  <div className="mb_10">
                      <span className="link mr_5" onClick={()=>{
                          upload.open()
                      }}>点击上传</span>
                      <span>开通记录基本信息名单</span>
                  </div>
              </div>
              <div className="ta_c fs_12 fc_black5">将开通记录基本信息名单按照模板格式填写，完成编辑后上传</div>
          </div>
        </div>
			</Modals>
		);
	};

  let FailueBox = () => {
    let columns=[
      {
        title:'手机号',
        dataIndex:'phone',
        align:'center',
        render: (rs) => (
            <div>{rs || '-'}</div>
        )
      }
    ]
    return (
        <Modals width="500px" ref={ref => failue_modal = ref}>
            {(data) => (
                <div>
                    <div className="box box-ac mb_15">
                        <div className="box-1 box box-ac">
                            {/* <div className="circle fc_white mr_5 box box-ac box-pc" style={{width:18, height:18, background:'#f9af36'}}>
                                <Icon type="exclamation" />
                            </div> */}
                            共{data?.fail?.length}个用户在系统中不存在，请先创建后再进行开通
                        </div>
                    </div>
                    <Table dataSource={data?.success} columns={columns} pagination={false} />
                    <Btn disabled={data?.success?.length === 0} onClick={async () => {
                      failue_modal.close();
                      batchOpen.open('批量开通', data?.success)
                    } } className='tb_c mt_24' >开通已有用户(共{data?.success?.length}个用户)</Btn>
                </div>
            )}
        </Modals>
    )
  };

	return (
		<div className="br_3 bg_white pall_15" style={{height: "100%"}}>
      <BreadcrumbBar pathList={[$.store().BCB_setBarPath]} />
      <Form onSubmit={(values) => {
        tab.search(values)
      }}>
        {({form}) => (
          <div>
            <div  style={{display: "flex", justifyContent: "space-between"}}>
              <div>
                <Inputs style={{ width: 250 }} form={form} name="name_or_phone" placeholder="输入用户昵称或手机号搜索" className="mr_15"/>
                <Btn htmlType="submit" iconfont="sousuo"> 搜索 </Btn>
              </div>
              <div>
                <Btn width={100} onClick={() => {
                  window.location.href = "/adminPc/batchOpen";
                }}>批量开通</Btn>
                <Btn className="ml_20" width={100} onClick={() => {
                  update_modal.open("导入开通记录")
                }}>导入开通</Btn>
              </div>
            </div>
          </div>
        )}
      </Form>
      <TablePagination ref={(rs) => tab = rs} className='mt_10' api="/product/permission/record/logs" columns={columns}/>
      <UploadModal/>
      <UploadfileImport
        zIndex={1200}
        action="/api/user/select/import"
        multiple={false}
        ref={ref => (upload = ref)}
        onSure={rs => {
          if(rs.status==='failure'){
              $.warning(rs.message)
          }else{
            let par = {
              fail: rs.data.fail,
              success: rs.data.success,
            }
            failue_modal.open('导入结果', par)
            update_modal.close()
            // tab.reload()
          }
        }}
      />
      <FailueBox/>
      <Page ref={(rs) => batchOpen = rs} background='#ffffff' onClose={()=> tab.reload() }>
        <BatchOpen/>
      </Page>
		</div>
	);
}
