import React, { useState, useEffect } from "react";
import { Divider, Form as Forms, Button, List, Empty } from "antd";
import { $, Form, TablePagination, Modals, Inputs, Btn, BreadcrumbBar, Popconfirms, Page, Img, Uploadimgs } from "../comlibs";
import LessonTextbookAdd from "./LessonTextbookAdd";
import Photo from "../textbook/photo";

export default function() {
  const Iconfont = $.icon();

  const col = {
    labelCol: { span: 3 },
    wrapperCol: { span: 20 }
  };

  const [infoData, setInfoData] = useState();

  let { add, pagePhoto }={}

  useEffect(() => { getQuery() }, []);

  async function getQuery () {
    let res = await $.get('/course/lesson/detail', {file_uuid: $.getQueryString('file_uuid')});
    if (!res) return;
    setInfoData({...res})
  };

	return (
		<div className="br_3 bg_white pall_15" >
      <BreadcrumbBar pathList={['/adminPc/class', `/adminPc/ClassInfo?product_uuid=${$.getQueryString('product_uuid')}`, `${$.store().BCB_setBarPath}?product_uuid=${$.getQueryString('product_uuid')}`]} />
      <h3>所属课节：{infoData?.file_name}</h3>
      <Btn onClick={() => add.open('选择教材', {}, {width: 800})} >添加教材</Btn>
      <div className="dis_f f_wrap mt_15" >
        {infoData?.lesson_material?.length > 0 ? infoData?.lesson_material?.map((item, index) => {
          return <div width={170} height={170} className="mr_10" key={index} >
            <Img width={170} height={170} src={item} onClick={e => pagePhoto.open("相册", { index, imgsList: infoData?.lesson_material, selectedImg: item })} />
            <div className='ta_c' >
              <a onClick={async () => {
                if (index === 0) {
                  return
                }
                let rs = await $.post("/course/lesson/material/up", {index: index, file_uuid: $.getQueryString('file_uuid')});
                getQuery()
              }} >前移</a>
              <Divider type="vertical" />
              <a onClick={async () => {
                if (index === infoData?.lesson_material.length - 1) {
                  return
                }
                let rs = await $.post("/course/lesson/material/down", {index: index || '0', file_uuid: $.getQueryString('file_uuid')});
                getQuery()
              }} >后移</a>
              <Divider type="vertical" />
              <Popconfirms title="确定移除？" onConfirm={async () => {
                let res = await $.post('/course/lesson/material/remove', {index: index || '0', file_uuid: $.getQueryString('file_uuid')});
                getQuery()
              }} />
            </div>
          </div>
        }) :
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className="m_auto" />}
      </div>
      <div>
        {/* <Img width={120} height={120} src={avatar} /> */}
      </div>
      <Page ref={(rs) => add = rs} background='#ffffff' onClose={()=> getQuery() }>
        <LessonTextbookAdd/>
      </Page>
      <Page background="rgb(0,0,0,0.95)" full={true} ref={rs => (pagePhoto = rs)}>
				<Photo />
			</Page>
		</div>
	);
}
