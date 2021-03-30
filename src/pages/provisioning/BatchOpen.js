import React, { useState, useEffect } from "react";
import { Divider, Form as Forms, Button, Steps, Tabs, Icon } from "antd";
import { $, Form, TablePagination, Modals, Inputs, Btn, BreadcrumbBar, Popconfirms, Page, Img, Uploadimgs } from "../comlibs";
import Combo from "./combo";

export default function(props) {

  const { Step } = Steps;

  const { TabPane } = Tabs;

  const Parent = props.Parent;

  let { step, setStep, current, setCurrent } = {}; 

  // 步骤条
  const StepsBox = () => {
    [step, setStep] = useState(0);

    let stutas=(index)=>{
        if(index > step) return 'wait'
        if(index === step) return 'process'
        if(index < step) return 'finish'
    }

    return (
        <Steps
            style={{padding: "15px 15px 0"}}
            type="navigation"
            current={step}
            >
            <Step
                title="选择用户"
                status={stutas(0)}
            />
            <Step
                title="选择开通内容"
                status={stutas(1)}
            />
            <Step
                title="完成"
                status={stutas(2)}
            />
        </Steps>
    )
  }

  // 内容组合
  const Content = () => {

    const [data, setData] = useState({
      product_uuids: [],
      user_uuids: []
    });

    [current, setCurrent] = useState(0);

    return (
        <div>
          {current === 0 && <Combo value={Parent?.data? [...Parent?.data] : data.user_uuids} onSure={async (list) => {
            data.user_uuids = list;
            setCurrent(1);
            setStep(1);
          }}/>}
          {current === 1 && <StartContent onSure={async (list) => {
            data.product_uuids = list.toString();
            const res = await $.post("/product/permission/batch/add", {
              product_uuids: data.product_uuids,
              user_uuids: data.user_uuids.map((item) => item.user_uuid).toString()
            });
            setCurrent(2);
            setStep(2);
          }}
          cancel={() => {
            setCurrent(0);
            setStep(0);
          }}
          />}
          {current === 2 && <FinishBox/>}
        </div>
    )
  }

  // 开通内容
  const StartContent = (props) => {

    let [data, setData] = useState([]);
    let [activeKey, setActiveKey] = useState('COURSE');

    const { onSure, cancel } = props;

    const columns = [
      {
        title: "名称",
        dataIndex: "product_name",
        width: 400
      }
    ];

    let { tabCourse, tabMaterial, tabAlbum } = {};

    return (
      <div style={{position: "relative"}}>
        <Tabs activeKey={activeKey} style={{padding: "0 15px"}} onChange={(val) => {
          setActiveKey(val);
          setData([])
        }}>
          <TabPane tab="课程" key="COURSE" className="ph_15">
            {activeKey === 'COURSE' && <div>
              <Form onSubmit={(values) => {
                tabCourse.search(values);
              }}>
                {({form}) => (
                  <div className="mb_15">
                    <Inputs form={form} name="product_name" placeholder="输入课程名称搜索"/>
                    <Btn className="ml_20" htmlType="submit" iconfont="sousuo"> 搜索 </Btn>
                  </div>
                )}
              </Form>
              <TablePagination
                api="/product/course/query"
                params={{
                  totalnum: "NO",
                }}
                columns={columns}
                keyName="product_uuid"
                rowSelection={true}
                setSelection={[]}
                pagination={false}
                onRow={true}
                rowType="checkbox"
                onSelection={(keys) => {
                  if (keys == null) return;
                  data = Object.keys(keys);
                  // Object.keys(keys).map(item => {
                  //   if (data.indexOf(item) == -1) {
                  //     data.push(item)
                  //   }
                  // });
                }}
                ref={(ref) => (tabCourse = ref)}
              />
            </div>}
          </TabPane>
          <TabPane tab="教材" key="MATERIAL" className="ph_15">
            {activeKey === 'MATERIAL' && <div>
              <Form onSubmit={(values) => {
                tabMaterial.search(values);
              }}>
                {({form}) => (
                  <div className="mb_15">
                    <Inputs form={form} name="product_name" placeholder="输入教材名称搜索"/>
                    <Btn className="ml_20" htmlType="submit" iconfont="sousuo"> 搜索 </Btn>
                  </div>
                )}
              </Form>
              <TablePagination
                api="/product/material/query"
                params={{
                  totalnum: "NO",
                }}
                columns={columns}
                keyName="product_uuid"
                rowSelection={true}
                setSelection={[]}
                pagination={false}
                onRow={true}
                rowType="checkbox"
                onSelection={(keys) => {
                  if (keys == null) return;
                  data = Object.keys(keys);
                }}
                ref={(ref) => (tabMaterial = ref)}
              />
            </div>}
          </TabPane>
          <TabPane tab="合辑" key="ALBUM" className="ph_15">
            {activeKey === 'ALBUM' && <div>
              <Form onSubmit={(values) => {
                tabAlbum.search(values)
              }}>
                {({form}) => (
                  <div className="mb_15">
                    <Inputs form={form} name="product_name" placeholder="输入合辑名称搜索"/>
                    <Btn className="ml_20" htmlType="submit" iconfont="sousuo"> 搜索 </Btn>
                  </div>
                )}
              </Form>
              <TablePagination
                api="/product/album/query"
                params={{
                  totalnum: "NO",
                }}
                columns={columns}
                keyName="product_uuid"
                rowSelection={true}
                setSelection={[]}
                pagination={false}
                onRow={true}
                rowType="checkbox"
                onSelection={(keys) => {
                  if (keys == null) return;
                  data = Object.keys(keys);
                }}
                ref={(ref) => (tabAlbum = ref)}
              />
            </div>}
          </TabPane>
        </Tabs>
        <div className="bs bg_white_90" style={{padding: "10px", display: "flex", justifyContent: "center", width: "100%", position: "relative", bottom: 0}}>
          <Btn width={100} style={{ background: "#ccc" }} onClick={() => {
            cancel();
          }}>
            上一步
          </Btn>
          <Btn
            width={100}
            className="ml_15"
            onClick={() => {
              if (data.length === 0) {
                $.warning("请选择开通内容");
                return;
              }
              onSure(data);
            }}
          >下一步</Btn>
        </div>
      </div>
    )
  }

  // 完成
  const FinishBox = () => {
    return (
        <div style={{height: "80vh", overflow: "hidden"}}>
            <div className="ta_c mb_30" style={{marginTop: "150px"}}>
                <Icon style={{fontSize:60}} type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
                <div className="fs_20 fb" style={{marginTop:16}}>开通完成</div>
                <Btn className="mt_20" size="large" style={{width:200}} onClick={()=>{
                  window.location.href = "/adminPc/provisioning"
                }}>返回开通列表</Btn>
            </div>
        </div>
    )
  }

	return (
    Parent ? <div className="br_3 bg_white pt_30">
      <div>
        <StepsBox/>
        <Content/>
      </div>
    </div> :
		<div className="br_3 bg_white">
      <BreadcrumbBar pathList={['/adminPc/provisioning', $.store().BCB_setBarPath]} />
      <div>
        <StepsBox/>
        <Content/>
      </div>
		</div>
	);
}
