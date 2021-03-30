import React, { useState, useEffect } from "react";
import { Card, Form as Forms } from "antd";
import { $, Form, Inputs, Btn, BreadcrumbBar, FixedBox } from "../comlibs";
import "./index.css"


export default function(props) {

  const col = {
    labelCol: { span: 2 },
    wrapperCol: { span: 20 },
  };

  const Parent = props.Parent;

  const [infoData, setInfoData] = useState();

  useEffect(()=>{getQuery()}, []);

  async function getQuery(){
    if (!Parent) {
      let rs = await $.get("/custompage/detail", {custompage_uuid: $.getQueryString('custompage_uuid')});
      if (!rs) return;
      setInfoData(rs)
    }
  };

  const Content = () => {
    return (
      <Form
        {...col}
        onSubmit={async (values, btn, ext) => {
          if (Parent) {
            let rs = await $.post("/custompage/add", values);
            btn.loading = false;  //关闭提交按钮loading加载状态
            $.msg("操作成功");
            Parent.close(true)
          } else {
            values.custompage_uuid = $.getQueryString('custompage_uuid');
            let rs = await $.post("/custompage/update", values);
            $.msg("操作成功");
            getQuery()
          }
        }}
      >
        {({ form, submit }) => (
          <div>
            <Forms.Item label="标题：">
              <Inputs form={form} name="custompage_title" value={infoData?.custompage_title} required={true} />
            </Forms.Item>
            <Forms.Item label="内容：">
              <Inputs form={form} type="editor" name="custompage_memo" value={infoData?.custompage_memo}  placeholder="请输入页面内容" />
            </Forms.Item>
            {Parent ? <FixedBox>
              <Btn style={{float: "left"}} className="mr_10" type='default' onClick={() => Parent.close(true)} >取消</Btn>
              <Btn htmlType="submit" >确定</Btn>
            </FixedBox> :
            <div className='ta_c pt_30' >
              <Btn htmlType="submit" >保 存</Btn>
            </div>}
          </div>
        )}
      </Form>
    )
  };

	return (
    Parent ? <Card title={Parent?.state?.title} bordered={false} >
      <Content/>
    </Card>: 
    <div className="br_3 bg_white pall_15">
      <BreadcrumbBar pathList={['/adminPc/shops', `${$.store().BCB_setBarPath}?custompage_uuid=${$.getQueryString('custompage_uuid')}`]} />
      <Content/>
    </div>
	);
}
