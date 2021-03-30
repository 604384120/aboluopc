import React, { useState, useEffect } from "react";
import { Divider, Form as Forms, Button } from "antd";
import { $, Form, TablePagination, Modals, Inputs, Btn, BreadcrumbBar, Popconfirms, Page, Img, Uploadimgs } from "../comlibs";

export default function() {

  const col = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
  };
		
	const columns = [
    {
			title: "序号",
			dataIndex: "_key"
		},
		{
			title: "名称",
      dataIndex: "product_name",
      width: 280,
      render: (text, record) => {
        return <div>
          <div>{`用户订单：${record.show_id}`}</div>
          <div>{text}</div>
        </div>
      }
		},
		{
      title: "支付金额",
      dataIndex: "price",// TODO
		},
		{
      title: "支付方式",
      // dataIndex: "pay_channel",
      render: (rs) => {
        return rs?.pay_channel === "WXPAY" ? "微信" :
        rs?.pay_channel === "ALIPAY" ? "支付宝" : 
        rs?.pay_channel === "SXZPAY" ? "免费" : "-"
      }
		},
		{
      title: "用户",
      dataIndex: "user_name",
    },
    {
      title: "创建时间",
      dataIndex: "time_create",
    },
    {
      title: "支付时间",
      render: (rs) => {
        return rs?.time_success ? rs?.time_success : "-";
      }
    },
    {
      title: "状态",
      dataIndex: "pretty_status"
    },
    {
      title: "操作",
      render: (rs) => {
        return <span className="link" onClick={() => {
          window.location.href = `/adminPc/details?order_uuid=${rs.order_uuid}`
        }}>查看</span>
      }
		},
  ];

  let { tab, exportSxl } = {};

  const TimeModal = () => {
    return (
			<Modals ref={(rs) => exportSxl = rs} >
        <Form
          {...col}
          onSubmit={async (values, btn, ext) => {
            await $.download('/order/export', values)
            btn.loading = false;  //关闭提交按钮loading加载状态
            $.msg("操作成功");
            exportSxl.close();
          }}
        >
          {({ form, submit }) => (
            <div>
              <Forms.Item label="开始时间" required={true} >
                <Inputs name="time_success_min" form={form} type="datePicker" required={true} />
              </Forms.Item>
              <Forms.Item label="结束时间" required={true} >
                <Inputs name="time_success_max" form={form} type="datePicker" required={true} />
              </Forms.Item>
              <div className="dis_f box-pc mt_24" >
                <Btn htmlType="submit">确定</Btn>
                <Btn className="ml_20" type="default" onClick={() => exportSxl.close() }>取消</Btn>
              </div>
            </div>
          )}
        </Form>
			</Modals>
		);
  };

	return (
		<div className="br_3 bg_white pall_15">
      <BreadcrumbBar pathList={[$.store().BCB_setBarPath]} />
      <Form onSubmit={(values) => {
        tab.search(values)
      }}>
        {({form}) => (
          <div>
            <div style={{display: "flex", justifyContent: "space-between"}}>
              <div>
                <Inputs style={{ width: 220 }} form={form} name="name_or_phone" placeholder="输入用户昵称或手机号搜索" className="mr_15"/>
                <Inputs form={form} name="show_id" placeholder="输入订单号搜索" className="mr_15" />
                <Inputs form={form} name="channel_trade_id" placeholder="输入第三方账单号搜索" className="mr_15"/>
                <Btn htmlType="submit" iconfont="sousuo"> 搜索 </Btn>
              </div>
              <div>
                <Btn width={100} onClick={() => exportSxl.open('导出订单')}>导出订单</Btn>
              </div>
            </div>
          </div>
        )}
      </Form>
      <TimeModal/>
      <TablePagination ref={(rs) => tab = rs} className='mt_10' api="/order/query" columns={columns}/>
		</div>
	);
}
