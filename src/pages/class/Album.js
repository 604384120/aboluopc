import React, { useState, useEffect } from "react";
import { Divider, Form as Forms, Button } from "antd";
import { $, Form, TablePagination, Modals, Inputs, Btn, BreadcrumbBar, Page, Popconfirms, Img } from "../comlibs";
import { CopyToClipboard } from 'react-copy-to-clipboard';

export default function() {

  const col = {
    labelCol: { span: 3 },
    wrapperCol: { span: 20 }
  };

  // const [roleList, setRoleList] = useState();

  let { tableList, avatar, setAva, sortModal, shareModal, deleteModal }= {}

  useEffect(() => { getQuery() }, []);

  async function getQuery () {
  };

  const AddImges = ({ form, set }) => {
    [avatar, setAva] = useState("https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/1ef9805e-5611-11eb-a82d-00163e04cc20.png");
    return (
      <Forms.Item label="二维码" >
        {set(
          {name: 'quickentry_img', value: ''},
          (valueSet) => (
            //valueSet 动态设置组件的value
            <div className="box-w1 f_wrap" >
              <Img width={120} height={120} src={avatar} />
              <div className="pl_15" width={260} >
                <Btn onClick={() => {

                }} >下载</Btn>
              </div>
            </div>
          )
        )}
      </Forms.Item>
    )
  };

	const DeleteModal = () => {
    let {num, setNum, int} = {};

    const CAPTCHA = () => {
      [num, setNum] = useState(60);
      return <Btn disabled={num < 60} style={num < 60 && {height: 34, marginTop: "-1px"}} onClick={async () => {
        let rs = await $.post("/approval/code", {action: '删除合辑'});
        int = setInterval(() => {
          if (num < 0) {
            setNum(60)
            clearInterval(int)
          } else {
            setNum(num--)
          }
        }, 1000)
      }} >{num === 60 ? "获取验证码" : (num < 0 ? "重新获取" : `${num} 秒后重新获取`)}</Btn>
    };

		return (
			<Modals ref={(rs) => deleteModal = rs} >
        <Form
          onSubmit={async (values, btn, ext) => {
            if (num === 60) {
              $.warning('请先获取验证码');
              return
            }
            values.product_uuid = deleteModal?.data?.product_uuid;
            let rs = await $.post("/product/album/remove", values);
            btn.loading = false;  //关闭提交按钮loading加载状态
            $.msg("删除成功");
            deleteModal.close();
            tableList.reload();
            clearInterval(int)
          }}
        >
          {({ form, submit }) => (
            <div>
              <div className="mb_15 ta_c" >
                <p className="ta_l" >删除后，已经购买的学员将无法继续查看对应的内容。已经产生的笔记内容会被删除，请谨慎操作。</p>
                <Button.Group>
                  <Inputs form={form} name="code" required={true} placeholder="请输入验证码" style={{marginRight: "-2px"}} />
                  <CAPTCHA/>
                </Button.Group>
              </div>
              <div style={{display: "flex", justifyContent: "center"}}>
                <Btn htmlType="submit">确定</Btn>
                <Btn className="ml_20" type="default" onClick={() => deleteModal.close() }>取消</Btn>
              </div>
            </div>
          )}
        </Form>
			</Modals>
		);
  };

  const ShareModal = () => {
    return (
      <Modals ref={(rs) => shareModal = rs}>
        <Form {...col} >
          {({set, form, submit, setByName, getByName}) => (
            <div>
              <Forms.Item label="H5链接" >
                <Button.Group>
                  <Btn type="default" width={280} disabled >{shareModal?.data?.url || "sdf"}</Btn>
                  <CopyToClipboard text={shareModal?.data?.url || "sdf"}  onCopy={(val) => console.log(val)}>
                      <Btn width={100} >复制</Btn>
                  </CopyToClipboard>
                </Button.Group>
              </Forms.Item>
              <AddImges form={form} set={set} />
            </div>
          )}
        </Form>
			</Modals>
    )
  };

	const SortModal = () => {
		return (
			<Modals ref={(rs) => sortModal = rs}>
        <Form
          onSubmit={async (values, btn, ext) => {
            values.product_uuid = sortModal?.data?.product_uuid;
            let rs = await $.post("/product/album/update", values, () => {
              btn.loading = false;
            });
            btn.loading = false;  //关闭提交按钮loading加载状态
            $.msg("操作成功");
            sortModal.close();
            tableList.reload();
          }}
        >
          {({ form, submit }) => (
            <div>
              <div className="mb_15 ta_c" >
                <Inputs form={form} name="sort" required={true} placeholder="数字越大排序越靠前" value={sortModal?.data?.sort} type="inputNumber" min={0} />
              </div>
              <div style={{display: "flex", justifyContent: "center"}}>
                <Btn htmlType="submit">确定</Btn>
                <Btn className="ml_20" type="default" onClick={() => sortModal.close() }>取消</Btn>
              </div>
            </div>
          )}
        </Form>
			</Modals>
		);
  };

	let columns = [
    {
			title: "序号",
			dataIndex: "_key"
		},
		{
			title: "合辑名称",
      dataIndex: "product_name",
      width: 220,
      render: (text, record) => {
        return <a className='link' href={`/adminPc/AlbumAdd?product_uuid=${record.product_uuid}`} >{text}</a>
      }
		},
		{
      title: "关联课程数",
      dataIndex: "product_uuids",
      render: (text) => {
        return text?.length
      }
		},
		{
      title: "开始时间",
      dataIndex: "start_time",
		},
		{
      title: "结束时间",
      dataIndex: "end_time",
		},
		{
      title: "状态",
      dataIndex: "onsell",
      render: (text, record) => {
        let txt = text === 'YES' ? '上架' : '下架';
        let txtshow = record.show	 === 'YES' ? '展示' : '隐藏';
        return `${txt}/${txtshow}`
      }
		},
		{
			title: "操作",
			width: 280,
			align:'center',
			render: (text, record) => {
        return (<div>
          <a className='link' href={`/adminPc/AlbumAdd?product_uuid=${record.product_uuid}`} >详情</a>
          <Divider type="vertical" />
          <a className='link' onClick={() => sortModal.open("排序", record)}>排序</a>
          <Divider type="vertical" />
          <Popconfirms title={record.onsell === "YES" ? "下架会同时关闭当前商品中未支付的订单信息" : "确定上架吗？"} content={record.onsell === "YES" ? "下架" : "上架"} onConfirm={async () => {
            let res = await $.post('/product/album/update', {onsell: record.onsell === "YES" ? 'NO' : "YES", product_uuid: record.product_uuid});
            tableList.reload();
          }} />
          <Divider type="vertical" />
          <Popconfirms title={record.show === "YES" ? "隐藏后，商品不展示在APP端，仅可通过分享链接进行查看" : "确定展示吗？"} content={record.show === "YES" ? "隐藏" : "展示"} onConfirm={async () => {
            let res = await $.post('/product/album/update', {show: record.show === "YES" ? 'NO' : "YES", product_uuid: record.product_uuid});
            tableList.reload();
          }} />
          <Divider type="vertical" />
          <a className='link' onClick={() => shareModal.open("分享", record)}>分享</a>
          <Divider type="vertical" />
          <a className='link' onClick={() => deleteModal.open("删除", record)}>删除</a>
        </div>)
      }
    }
  ];

	return (
		<div className="br_3 bg_white pall_15">
      <TablePagination api="/product/album/query" params={{include_product_uuids: $.getQueryString('product_uuid')}} columns={columns} ref={(rs) => tableList = rs} />
      <SortModal/>
      <ShareModal/>
      <DeleteModal/>
		</div>
	);
}
