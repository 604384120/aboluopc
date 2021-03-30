import React, { useState, useEffect } from "react";
import { Divider, Form as Forms, Button } from "antd";
import { $, Form, TablePagination, Modals, Inputs, Btn, BreadcrumbBar, Page, Popconfirms, Img } from "../comlibs";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import AlbumAdd from "./AlbumAdd";
import '../class/index.css';
import QRCode from 'qrcode.react';

export default function() {

  const col = {
    labelCol: { span: 3 },
    wrapperCol: { span: 20 }
  };

  const [roleList, setRoleList] = useState();

  let { tableList, add, avatar, setAva, sortModal, shareModal, deleteModal }={}

  useEffect(() => { getQuery() }, []);

  async function getQuery () {
    let res = await $.get('/role/query', {totalnum: 'NO'});
    if (!res) return;
    let list = res?.data?.map((item, index) => {
      item.value = item.role_uuid;
      item.text = item.role_name;
      return item
    });
    setRoleList(list)
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
              {/* <Img width={120} height={120} src={avatar} /> */}
              <QRCode size={120} value={`http://www.aboluo.co/h5/class?product_uuid=${shareModal?.data?.product_uuid}&type=album`} id='qrCode' />
              <div className="pl_15" width={260} >
                <Btn onClick={() => {
                  let canvasImg = document.getElementsByTagName('canvas')[0];
                  let imgData = canvasImg.toDataURL({format: "image/png", quality:1, width:120, height:120});
                  let dlLink = document.createElement('a');
                  var strDataURI = imgData.substr(22, imgData.length);
                  var blob = dataURLtoBlob(imgData);
                  var objurl = URL.createObjectURL(blob);
                  dlLink.download = "qrcode.png";
                  dlLink.href = objurl;
                  dlLink.click();
                  function  dataURLtoBlob(dataurl) {
                    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
                    while(n--){
                        u8arr[n] = bstr.charCodeAt(n);
                    }
                    return new Blob([u8arr], {type:mime});
                  }
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
        let int = setInterval(() => {
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
                  <Btn type="default" width={280} disabled className="ellipsisBtn" >{`http://www.aboluo.co/h5/class?product_uuid=${shareModal?.data?.product_uuid}&type=album` || ""}</Btn>
                  <CopyToClipboard text={`http://www.aboluo.co/h5/class?product_uuid=${shareModal?.data?.product_uuid}&type=album` || ""}  onCopy={(val) => console.log(val)}>
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
        return <a className='link' target="_blank" href={`/adminPc/AlbumAdd?product_uuid=${record.product_uuid}`} >{text}</a>
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
      title: "已购",
      dataIndex: "cnt_sold",
		},
		{
      title: "排序",
      dataIndex: "sort",
      sorter: true,
		},
		{
			title: "操作",
			width: 280,
			align:'center',
			render: (text, record) => {
        return (<div>
          <a className='link' target="_blank" href={`/adminPc/AlbumAdd?product_uuid=${record.product_uuid}`} >详情</a>
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
          <a className='link' onClick={() => {
            if (record.onsell === "YES") {
              $.warning('请先下架合辑！');
              return
            }
            deleteModal.open("删除", record)
          }}>删除</a>
        </div>)
      }
    }
  ];

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
            <Inputs placeholder="输入名称搜索" className="mr_15" form={form} name="product_name" />
            <Inputs form={form} name="onsell" placeholder="上架/下架" className="mr_15" allowClear select={[
              {text: '上架', value: 'YES'},
              {text: '下架', value: 'NO'},
            ]} />
            <Inputs form={form} name="show" placeholder="展示/隐藏" className="mr_15" allowClear select={[
              {text: '展示', value: 'YES'},
              {text: '隐藏', value: 'NO'},
            ]} />
            <Btn htmlType="submit" iconfont="sousuo"> 搜索 </Btn>
            <Btn onClick={() => add.open("创建合辑", {}, {width: 800})} className="fl_r" >创建合辑</Btn>
          </div>
        )}
      </Form>
      <TablePagination className='mt_10' api="/product/album/query" columns={columns} ref={(rs) => tableList = rs} 
        onSorter={(sort)=>{
          if (sort.order) {
            let params = {
              sort_field: 'sort',
              sort_order: sort.order === "ascend" ? 1 : -1
            };
            return params
          }
      }} />
      <SortModal/>
      <ShareModal/>
      <DeleteModal/>
      <Page ref={(rs) => add = rs} background='#ffffff' onClose={()=> tableList.reload() }>
        <AlbumAdd/>
      </Page>
		</div>
	);
}
