import React, { useState, useEffect } from "react";
import { Divider, Form as Forms, Table, Icon } from "antd";
import { $, Form, TablePagination, Modals, Inputs, Btn, BreadcrumbBar, Popconfirms, UploadfileImport } from "../comlibs";

export default function() {

  const Iconfont = $.icon();

  const col = {
    labelCol: { span: 3 },
    wrapperCol: { span: 20 }
  };

  const [channelList, setChannelList] = useState();

  let { tableList, update_modal, upload, setShowUpload, failue_modal } = {}

  useEffect(() => { getQuery() }, []);

  async function getQuery () {
    let res = await $.get('/channel/query', {totalnum: 'NO'});
    if (!res) return;
    res.data.forEach(item => {
      item.text = item.channel_title;
      item.value = item.channel_uuid
    });
    setChannelList([...res.data])
  };

	let columns = [
    {
			title: "序号",
			dataIndex: "_key"
		},
		{
			title: "用户昵称",
      dataIndex: "user_name",
      width: 220
		},
		{
      title: "手机号",
      dataIndex: "phone",
      render: (text, record) => {
        return text.replace(/(\d{3})(\d{4})(\d{4})/, "$1****$2");
      }
		},
		{
      title: "状态",
      dataIndex: "is_enable",
      render: (text) => {
        if (text === 'YES') {
          return '正常';
        } else {
          return '禁用'
        }
      }
		},
		{
      title: "来源渠道",
      dataIndex: "channel_title",
		},
		{
      title: "备注",
      dataIndex: "remark",
		},
		{
			title: "操作",
			width: 280,
			align:'center',
			render: (text, record) => {
        return (<div>
          <a className='link' target="_blank" href={`/adminPc/UserInfo?user_uuid=${record.user_uuid}`} >查看</a>
          <Divider type="vertical" />
          {record.is_enable === 'YES' ? <Popconfirms title='禁用后，用户无法登录APP' content='禁用' onConfirm={async () => {
            let res = await $.post('/user/disable', {user_uuid: record.user_uuid});
            tableList.reload();
          }} /> :
          <a className='link' onClick={async () => {
            let res = await $.post('/user/enable', {user_uuid: record.user_uuid});
            tableList.reload();
          }}>取消禁用</a>}
        </div>)
      }
    }
  ];

  const UploadModal = () => {
		return (
			<Modals
        width="950px"
        bodyStyle={{padding:0}}
        ref={ref => update_modal = ref}
			>
				<div style={{padding:'15px 70px 30px',display:'flex',justifyContent:'space-between'}}>
          <div className="br_4 pall_10 b_1 fc_black2" style={{width:372}}>
              <div>下载用户基本信息模板</div>
              <div className="mv_10 br_4 b_1 box box-ac box-pc box-ver">
                  <img style={{width:78,height:100}} className="mb_15 mt_24" src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/421ad862-cedb-11e9-8203-00163e04cc20.png"/>
                  <div className="mb_10">
                      <a className="link mr_5" onClick={()=>{
                          $.download('/user/import/tmpl', {token: $.token()})
                      }} download="用户基本信息模版">点击下载</a>
                      <span>用户信息模板</span>
                  </div>
              </div>
              <div className="ta_c fs_12 fc_black5">下载对应模板，阅读注意点后填写模板文件，模板表头不可删，手机号为必填项</div>
          </div>
          
          <div className="br_4 pall_10 b_1 fc_black2" style={{width:372}}>
              <div>上传名单文件</div>
              <div className="mv_10 br_4 b_1 box box-ac box-pc box-ver">
                  <img style={{width:78,height:100}} className="mb_15 mt_24" src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/421ad862-cedb-11e9-8203-00163e04cc20.png"/>
                  <div className="mb_10">
                      <span className="link mr_5" onClick={()=>{
                          upload.open()
                      }}>点击上传</span>
                      <span>用户基本信息名单</span>
                  </div>
              </div>
              <div className="ta_c fs_12 fc_black5">将用户基本信息名单按照模板格式填写，完成编辑后上传</div>
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
        render:(rs)=>(
            <div>{rs||'-'}</div>
        )
      },{
        title:'用户昵称',
        dataIndex:'user_name',
        align:'center',
        render:rs=>(
            <div style={{minWidth:60}}>{rs}</div>
        )
      },{
        title:'渠道来源',
        dataIndex:'channel_title',
        align:'center',
        render:(rs)=>(
            <div>{rs||'-'}</div>
        )
      },{
        title:'当前身份',
        dataIndex:'identity',
        align:'center',
        render:(rs)=>(
            <div>{rs||'-'}</div>
        )
      },{
        title:'性别',
        dataIndex:'gender',
        align:'center',
        render:(rs)=>(
            <div>{rs||'-'}</div>
        )
      },{
        title:'年级',
        dataIndex:'grade',
        align:'center',
        render:(rs)=>(
            <div>{rs||'-'}</div>
        )
      },{
        title:'生日',
        dataIndex:'birthday',
        align:'center',
        render:(rs)=>(
            <div>{rs||'-'}</div>
        )
      },{
        title:'邮箱',
        dataIndex:'email',
        align:'center',
        render:(rs)=>(
            <div>{rs||'-'}</div>
        )
      },{
        title:'是否开始英文原本阅读',
        dataIndex:'is_english_read',
        align:'center',
        render:(rs)=>(
            <div>{rs||'-'}</div>
        )
      },{
        title:'失败原因',
        dataIndex:'msg',
        align:'center',
        render:rs=>(
            <div style={{color:'#EF5E53'}}>{rs}</div>
        )
      }
    ]
    return (
        <Modals width="1200px" ref={ref => failue_modal = ref}>
            {(data)=>(
                <div>
                    <div className="box box-ac mb_15">
                        <div className="box-1 box box-ac" style={{color:'#f9af36'}}>
                            <div className="circle fc_white mr_5 box box-ac box-pc" style={{width:18, height:18, background:'#f9af36'}}>
                                <Icon type="exclamation" />
                            </div>
                            注意：以下用户导入失败！
                        </div>
                        <Btn onClick={async ()=>{
                            await $.downloadPost('/user/fail/export', {failue: JSON.stringify(data)})
                        }}>导出失败数据</Btn>
                    </div>
                    <Table dataSource={data} columns={columns} pagination={false} />
                </div>
            )}
        </Modals>
    )
  };

	return (
		<div className="br_3 bg_white pall_15">
      <BreadcrumbBar pathList={[$.store().BCB_setBarPath]} />
      <Form
        onSubmit={async (values, btn, ext) => {
          tableList.search(values)
        }}
      >
        {({set, form, submit, setByName, getByName}) => (
          <div>
            <Inputs placeholder="全部渠道" className="mr_15" form={form} name="channel_code" select={channelList} width={220} autoSubmit={true} allowClear />
            <Inputs placeholder="输入用户昵称或手机号查询" className="mr_15" form={form} name="name_or_phone" width={220} />
            <Btn htmlType="submit" iconfont="sousuo"> 搜索 </Btn>
            <Btn onClick={() => update_modal.open('导入用户')} className="fl_r" >导入用户</Btn>
          </div>
        )}
      </Form>
      <TablePagination className='mt_10' api="/user/query" columns={columns} ref={(rs) => tableList = rs} />
      <UploadModal/>
      <UploadfileImport
        zIndex={1200}
        action="/api/user/import"
        multiple={false}
        ref={ref => (upload = ref)}
        onSure={rs => {
          if(rs.status==='failure'){
              $.warning(rs.message)
          }else{
             if(rs.data.cnt_fail){
               failue_modal.open('注意',rs.data.fail)
             }else{
              $.msg('导入用户成功！')
             }
            update_modal.close()
            tableList.reload()
          }
        }}
      />
      <FailueBox/>
		</div>
	);
}
