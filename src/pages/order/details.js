import React, { useState, useEffect } from "react";
import { Divider, Form as Forms, Button, Table } from "antd";
import { $, Form, TablePagination, Modals, Inputs, Btn, BreadcrumbBar, Popconfirms, Page, Img, Uploadimgs } from "../comlibs";
import moment from "moment";

export default function() {
  const [info, setInfo] = useState({});
  const [dataSource, setDataSource] = useState([]);

  const order_uuid = window.location.href.split("=")[1];

  const col = {
    labelCol: { span: 6 },
    wrapperCol: { span: 10 }
  };

  let { tab, modals_monkey } = {};

  useEffect(() => { init() }, [0])

  const init = async () => {
    const res = await $.get("/order/detail", {order_uuid})
    if (res.order.product_type === 'ALBUM') {
      setDataSource(res?.order?.products)
    } else {
      let list = [{
        ...res?.order
      }]
      setDataSource(list)
    }
    setInfo(res);
  }

  const columns = [
    {
      title: "名称",
      dataIndex: 'product_name',
      key: 'product_name',
    },
    {
      title: "商品价格",
      width: 200,
      dataIndex: 'showprice',
      key: 'showprice',
      render (text, record) {
        return text || record.price
      } 
    },
    {
      title: "售卖价格",
      width: 200,
      dataIndex: 'price',
      key: 'price',
    },
  ];

  const MonkeyModals = () => {
    return <Modals ref={rs => modals_monkey = rs}>
      {(props) => (
        <div>
          <Form {...col} onSubmit={async (values) => {
            const res = await $.post("/order/refund", {
              refund_fee: values.refund_fee,
              order_uuid: props,
              permission_cancel: values.isRefund
            })
            if (res.status === "success") {
              $.warning("退款成更！");
              modals_monkey.close();
            }
          }}>
            {({form}) => (
              <div>
                <Forms.Item label="退款金额">
                  <Inputs required form={form} name="refund_fee" placeholder="不得大于订单支付金额"/>
                </Forms.Item>
                <Forms.Item label="是否退课/教程">
                  <Inputs form={form} name="isRefund" value="YES" radios={[
                    {
                      text: "是",
                      value: "YES"
                    },
                    {
                      text: "否",
                      value: "NO"
                    }
                  ]}/>
                </Forms.Item>
                <div className="mt_20" style={{display: "flex", justifyContent: "center"}}>
                  <Btn htmlType="submit">确定</Btn>
                  <Btn className="ml_20" onClick={() => {
                    modals_monkey.close();
                  }}>取消</Btn>
                </div>
              </div>
            )}
          </Form>
        </div>
      )}
    </Modals>
  }

	return (
		<div className="br_3 bg_white pall_15">
      <BreadcrumbBar pathList={['/adminPc/order', `${$.store().BCB_setBarPath}?order_uuid=${order_uuid}`]} />
      <div>
        <h3>用户信息</h3>
        <div style={{display: "flex"}}>
          <span style={{flex: 1}} className="mt_20">昵称：{info?.order?.product_name}</span>
          <span style={{flex: 3}} className="mt_20">手机号：{info?.order?.phone}</span>
        </div>
      </div>
      <div className="mt_30">
        <h3>订单信息</h3>
        <div className="mt_20" style={{display: "flex"}}>
          <div style={{flex: 1}}>
            <p>订单状态：{info?.order?.pretty_status}</p>
            <p>商户单号：{info?.order?.order_id}</p>
            <p>创建时间：{info?.order?.time_create}</p>
            <p>支付方式：{info?.order?.pay_channel === "WXPAY" ? "微信" :
        info?.order?.pay_channel === "ALIPAY" ? "支付宝" : 
        info?.order?.pay_channel === "SXZPAY" ? "免费" : "-"}</p>
          </div>
          <div style={{flex: 1}}>
            <p>订单编号：{info?.order?.show_id}</p>
            <p>交易单号：{info?.order?.order_uuid}</p>
            <p>支付时间：{info?.order?.time_success}</p>
            <p>第三方交易号：{info?.order?.channel_trade_id}</p> 
          </div>
        </div>
      </div>
      <div className="mt_30">
      {/* 暂无数据 */}
        <h3>商品信息</h3> 
        <Table bordered className="mt_20" pagination={false} dataSource={dataSource} columns={columns} />
        <div className="mt_20" style={{textAlign: "right"}}>
          <p className="ml_20">总价格：{info?.order?.showprice}</p>
          <p className="ml_20">售卖价格：{info?.order?.price}</p>
        </div>
      </div>
      {/* info?.refund?.status === "SUCCESS"判断是否退款 */}
      {info?.refund?.status === "SUCCESS" && <div className="mt_30">
        <h3>退款信息</h3>
        <div className="mt_20" style={{display: "flex"}}>
          <span style={{flex: 2}}>退款时间：{info?.refund?.time_refund}</span>
          <span style={{flex: 1}}>退款金额：{info?.refund?.refund_fee}</span>
          <span style={{flex: 5}}>操作账号：{info?.refund?.username}</span>
        </div>
      </div>}
      {/* 
        置灰退款 
        1、订单超过支付时间一个月（30天）
        2、已有退款信息
      */}
      <div className="mt_30" style={{display: "flex", justifyContent: "center"}}>
        <Btn width={120} disabled={info?.refund?.status === "SUCCESS" || moment() > moment(info?.order?.time_success).add(30, 'd')} onClick={() => {
          modals_monkey.open("退款", order_uuid);
        }}>退款</Btn>
      </div>
      <MonkeyModals/>
		</div>
	);
}
