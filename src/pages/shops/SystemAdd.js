import React, { useState, useEffect } from "react";
import { Form as Forms, Card } from "antd";
import { $, Form, FixedBox, Btn, Inputs, BreadcrumbBar } from "../comlibs";

const col = {
  labelCol: { span: 2 },
  wrapperCol: { span: 20 }
};

export default function(props) {

  const Parent = props.Parent;

  const [infoData, setInfoData] = useState();

  useEffect(()=>{getQuery()}, []);

  async function getQuery(){
    let rs = await $.get("/presetpage/detail", {presetpage_id: $.getQueryString('presetpage_id')});
    if (!rs) return;
    setInfoData(rs)
  };

  const Content = () => {
    return (
      <Form
        {...col}
        onSubmit={async (values, btn, ext) => {
          values.presetpage_id = $.getQueryString('presetpage_id');
          let rs = await $.post("/presetpage/update", values);
          btn.loading = false;  //关闭提交按钮loading加载状态
          $.msg("操作成功");
        }}
      >
        {({set, form, submit, setByName, getByName}) => (
          <div>
            <Forms.Item label="标题">
              <span>{infoData?.presetpage_title}</span>
            </Forms.Item>
            <Forms.Item label="内容">
              <Inputs form={form} type="editor" name="presetpage_memo" value={infoData?.presetpage_memo} placeholder="请输入页面内容"/>
            </Forms.Item>
            {Parent ? <FixedBox>
              <Btn className="mr_10" type='default' onClick={() => Parent && Parent.close()} >取消</Btn>
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
      {/* <Content/> */}
    </Card>: 
    <div className="br_3 bg_white pall_15">
      <BreadcrumbBar pathList={['/adminPc/shops', `${$.store().BCB_setBarPath}?presetpage_id=${$.getQueryString('presetpage_id')}`]} />
      <Content/>
    </div>
	);
}
