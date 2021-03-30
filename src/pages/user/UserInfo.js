
import React, { useState, useEffect } from "react";
import { Tabs, Modal, Row, Col, Form as Forms, List, Avatar } from "antd";
import { $, Form, Inputs, Btn, Modals, Popconfirms, BreadcrumbBar } from "../comlibs";
import Class from "./Class";
import Textbook from "./Textbook";
import Album from "./Album";
import "./index.css";

const { TabPane } = Tabs;
export default function (props) {
  // let history = useHistory();
  const Iconfont = $.icon();
  let [infoData, setInfoData] = useState();
  let [tabKey, setTabKey] = useState('class');

  let { modalProps } = {};

  useEffect(()=>{ init() },[]);

  async function init(){
    let res = await $.get("/user/info", {user_uuid: $.getQueryString('user_uuid')});
    if (!res) return;
    setInfoData({...res});
  };

  const ModalInfo = (props) => {
    return (<Modals ref={(rs) => (modalProps = rs)} width={535}>
      {() => {
        return (<Form
          onSubmit={async (values, btn, ext) => {
            values.user_uuid = $.getQueryString('user_uuid');
            let res = await $.post("/user/remark/update", values, ()=>{
              btn.loading = false;
              modalProps.close(true)
            });
            modalProps.close(true);
            $.msg('操作成功');
            init();
            setTabKey(tabKey)
          }}>
        {({form, submit, set})=>(
          <div>
            <div className="mb_15 ta_c" >
              <Inputs form={form} name="remark" required={true} rows={5} value={infoData?.remark} type="textArea" />
            </div>
            <div style={{display: "flex", justifyContent: "center"}}>
              <Btn htmlType="submit">确定</Btn>
              <Btn className="ml_20" type="default" onClick={() => modalProps.close(true) }>取消</Btn>
            </div>
          </div>
        )}
      </Form>)
      }}
    </Modals>)
  };

  return (<div className="ph_10">
    <BreadcrumbBar pathList={['/adminPc/user', `${$.store().BCB_setBarPath}?user_uuid=${$.getQueryString('user_uuid')}`,]} />
    <List className="bg_white" >
      <List.Item>
        <List.Item.Meta
          avatar={<Avatar size={80} src={infoData?.avatar || 'https://sxzimgs.oss-cn-shanghai.aliyuncs.com/sxzlogo/avatar.jpg'} />}
          title={<div>
            <h3 className='mb_16' >
              {infoData?.user_name}
              <Iconfont type={infoData?.gender == 'male' ? "icon-nan" : "icon-nv"} style={{ fontSize: 12, margin: '0 10px' }} />
            </h3>
          </div>}
          description={<Row className="lh_30" style={{}} >
            <Col span={7}>当前身份：{infoData?.identity || '未设置'}</Col>
            <Col span={5}>手机号：{infoData?.phone}</Col>
            <Col span={6} offset={1} >年级：{infoData?.grade || '未设置'}</Col>
            <Col span={3} >微信：{infoData?.unionid ? '已绑定' : '未绑定'}</Col>
            <Col span={2} ></Col>
            <Col span={8}>是否开始英文原版阅读：{infoData?.is_english_read || '未设置'}</Col>
            <Col span={4} >生日：{infoData?.birthday || '未设置'}</Col>
            <Col span={6} offset={1} >邮箱：{infoData?.email}</Col>
            <Col span={4} >渠道来源：{infoData?.channel_title}</Col>
            <Col span={24}>备注：{infoData?.remark || '无'}</Col>
          </Row>}
        />
        <div className="btnRight">
          <Btn className="mr_10" onClick={() => modalProps.open('编辑备注')} >编辑备注</Btn>
          {infoData?.is_enable === 'YES' ? <Popconfirms title='禁用后，用户无法登录APP' content={<Btn>禁用</Btn>} onConfirm={async () => {
            let res = await $.post('/user/disable', {user_uuid: infoData.user_uuid});
            init();
          }} /> : 
          <Btn onClick={async () => {
            let res = await $.post('/user/enable', {user_uuid: infoData.user_uuid});
            init();
          }}>取消禁用</Btn>}
        </div>
      </List.Item>
    </List>
    <Tabs activeKey={tabKey} className="bg_white mt_24 mb_24 ph_15" onChange={(key) => {
      setTabKey(key);
      init()
    }} >
      <TabPane tab="已购课程" key="class">
        {tabKey === 'class' && <Class infoData={infoData} />}
      </TabPane>
      <TabPane tab="已购教材" key="textbook">
        {tabKey === 'textbook' && <Textbook infoData={infoData} />}
      </TabPane>
      <TabPane tab="已购合辑" key="album">
        {tabKey === 'album' && <Album infoData={infoData} />}
      </TabPane>
    </Tabs>
    <ModalInfo />
  </div>)
}