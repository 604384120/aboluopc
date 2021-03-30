import React, { useState, useEffect } from "react";
import { Tabs, List, Button } from "antd";
import { $, Btn, BreadcrumbBar, Img, Modals, Form, Inputs } from "../comlibs";
import Album from "./Album";
import Textbook from "./Textbook";
import Lessons from "./Lessons";

export default function() {
  const { TabPane } = Tabs;

  const [tabKey, setTabKey] = useState("lessons");
  const [infoData, setInfoData] = useState();

  let { deleteModal } = {}

  useEffect(() => { getQuery() }, []);

  async function getQuery () {
    let res = await $.get('/product/course/detail', {product_uuid: $.getQueryString('product_uuid')});
    if (!res) return;
    setInfoData(res)
  };

  const DeleteModal = () => {
    let {num, setNum, int} = {};
    
    const CAPTCHA = () => {
      [num, setNum] = useState(60);
      return <Btn disabled={num < 60} style={num < 60 && {height: 34, marginTop: "-1px"}} onClick={async () => {
        let rs = await $.post("/approval/code", {action: '删除课程'});
        int = setInterval(() => {
          if (num < 0) {
            setNum(60);
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
            values.product_uuid = infoData?.product_uuid;
            let rs = await $.post("/product/course/remove", values);
            btn.loading = false;  //关闭提交按钮loading加载状态
            $.msg("删除成功");
            deleteModal.close();
            clearInterval(int);
            window.location.href = `/adminPc/class`
          }}
        >
          {({ form, submit }) => (
            <div>
              <div className="mb_15 ta_c" >
                <p className="ta_l" >删除后，已经购买的学员将无法继续查看对应的内容。已经产生的评论会被删除，请谨慎操作。</p>
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

	return (
		<div>
      <BreadcrumbBar pathList={['/adminPc/class', `${$.store().BCB_setBarPath}?product_uuid=${$.getQueryString('product_uuid')}`,]} />
      <List className="bg_white br_3 ph_15" style={{height: 145}} >
        <List.Item>
          <List.Item.Meta
            avatar={<Img width={150} height={120} src={infoData?.product_cover[0]} />}
            title={<h3 className='mb_16' >{infoData?.product_name}</h3>}
            description={<div className='ov_h'>
                          <span className="mr_65" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}} >{infoData?.introduction}</span>
                          <div className="pst_abs" style={{bottom: 8, width: "calc(100% - 166px)"}} >
                            更新至{(infoData?.cnt_lesson_finished || 0) + '/共' + infoData?.course_cnt_lessons || 0}节课 课程价格：￥{infoData?.showprice || 0} 售卖价格：￥{infoData?.price || 0}
                            <Btn type="default" className="fl_r" onClick={async () => {
                              // let rs = await $.post("/product/course/remove", {product_uuid: infoData?.product_uuid});
                              // window.location.href = `/adminPc/class`
                              deleteModal.open('删除课程')
                            }} >删除</Btn>
                            <Btn className="fl_r mr_15" onClick={() => window.location.href = `/adminPc/ClassAdd?product_uuid=${infoData?.product_uuid}`} >编辑</Btn>
                          </div>
                        </div>}
          />
        </List.Item>
      </List>
      <Tabs activeKey={tabKey} onChange={(key) => setTabKey(key)} className="bg_white mt_15 ph_15" >
        <TabPane tab="课节" key="lessons">
          {tabKey === "lessons" && <Lessons Query={getQuery} />}
        </TabPane>
        <TabPane tab="教材" key="textbook">
          {tabKey === "textbook" && <Textbook/>}
        </TabPane>
        <TabPane tab="相关合辑" key="album">
          {tabKey === "album" && <Album/>}
        </TabPane>
      </Tabs>
      <DeleteModal/>
		</div>
	);
}
