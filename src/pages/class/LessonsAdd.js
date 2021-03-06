import React, { useState, useEffect } from "react";
import { Form as Forms, Card } from "antd";
import { $, Img, Form, FixedBox, Btn, Inputs, Uploadaudio, Uploadvideo, Video, BreadcrumbBar, Voice } from "../comlibs";

const col = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 }
};

export default function(props) {

  const Parent = props.Parent;

  const [infoData, setInfoData] = useState();
  const [tableList, setTableList] = useState([]);
  const [tableMap, setTableMap] = useState({});

  let { uploadvideo, video, setVideo, uploadaudio, audio, setAudio }={}

  useEffect(() => { getQuery() }, []);

  async function getQuery(){
    let res = await $.get('/course/catalogs', {product_uuid: $.getQueryString('product_uuid')});
    if (!res) return;
    let tempMap = {};
    let list  = res.map((item) => {
      item.text = item.file_name;
      item.value = item.file_uuid;
      if (item.childrens.length > 0) {
        item.childrens.forEach(_item => {
          _item.text = _item.file_name;
          _item.value = _item.file_uuid;
          if (_item.childrens.length > 0) {
            _item.children = _item.childrens
          }
        });
        item.children = item.childrens
      }
      tempMap[item.file_uuid] = item;
      return item
    });
    setTableMap(tempMap)
    setTableList([...list]);
    if (!Parent) {
      res = await $.get('/course/lesson/detail', {file_uuid: $.getQueryString('file_uuid')});
      if (!res) return;
      setInfoData(res);
    }
  };

  const AddMedia = ({ form, set, getByName, setByName }) => {
    
    [video, setVideo] = useState();
    [audio, setAudio] = useState();

    useEffect(()=>{
      if (!Parent && infoData?.lesson_content) {
        handleFor(infoData?.lesson_content)
      }
    },[]);

    let handleFor = (str) => {
      setByName('lesson_type', infoData?.lesson_type)
      if (str?.split(".").slice(-1).toString() === 'mp4') {
        setVideo({video_url: str});
      } else {
        setAudio({url: str})
      }
    };

    return (
      (infoData?.lesson_type !== 'TEXT' || getByName("lesson_type") !== "TEXT") &&
      <Forms.Item labelCol= {{ span: 4 }} wrapperCol= {{ offset: 4, span: 16 }}>
        {set(
          {name: 'lesson_content', value: infoData?.lesson_content, required: true},
          (valueSet) => {
            return <div>
              <div className="dis_f box-ps" width={230} >
                <Btn onClick={() => {
                  if (getByName("lesson_type") === "VIDEO") {
                    uploadvideo.open('????????????')
                  } else {
                    uploadaudio.open('????????????')
                  }
                }} className={Parent ? "mr_15 mt_25" : 'mr_15'} >????????????</Btn>
                <span className="fs_12" >{
                getByName("lesson_type") === "VIDEO" ? '??????mp4???avi???wmv???mov???flv???rmvb???3gp???m4v???mkv??????????????????????????????5G???' :
                '????????????mp3???m4a???????????????????????????????????????????????????????????????????????????500M'}</span>
              </div>
              <div>
                {(video && (getByName("lesson_type") === "VIDEO") || (getByName("lesson_type") === "VIDEO" && infoData?.lesson_type === "VIDEO")) && <Video isTrans={true} {...video} />}
                {(audio && (getByName("lesson_type") === "AUDIO") || (getByName("lesson_type") === "AUDIO" && infoData?.lesson_type === "AUDIO")) && <Voice {...audio} />}
                <Uploadvideo
                  ref={e => uploadvideo = e}
                  multiple={false}
                  onSure={async (rs) => {
                    setVideo(rs[0]);
                    valueSet(rs[0].url);
                    $.msg("????????????!");
                  }}
                />
                <Uploadaudio
                  ref={e => uploadaudio = e}
                  multiple={false}
                  onSure={(ary) => {
                    setAudio(ary[0]);
                    valueSet(ary[0].url);
                    $.msg("????????????!");
                  }}
                />
              </div>
            </div>
          }
        )}
      </Forms.Item>
    )
  };

  const CreatFormItem = ({form, setByName, getByName}) => {
    return <Forms.Item label="????????????" >
      <Inputs form={form} name="parent_file_uuid" select={tableList.filter((item) => item.file_type === "CATALOG")} className="mr_15" allowClear width={160} 
        onChange={() => setByName("file_uuid", "")}
        value={infoData?.parent_file_uuids && infoData?.parent_file_uuids[0]} placeholder='?????????????????????' />
      <Inputs form={form} name="file_uuid" type="select" allowClear width={160}
        select={tableMap[getByName("parent_file_uuid") || infoData?.parent_file_uuids && infoData?.parent_file_uuids[0]]?.childrens?.filter((item) => item.file_type === "CATALOG") || []}
        value={infoData?.parent_file_uuids && infoData?.parent_file_uuids[1]} placeholder='?????????????????????' />
    </Forms.Item>
  };

  const Content = () => {
    return (
      <Form
        className="mb_70"
        {...col}
        onSubmit={async (values, btn, ext) => {
          values.product_uuid = $.getQueryString('product_uuid');
          values.parent_file_uuid = values.file_uuid || values.parent_file_uuid;
          if (values.lesson_type === "TEXT") {
            values.lesson_content = []
          }
          if (Parent) {
            let rs = await $.post("/course/lesson/add", values);
            Parent && Parent.close(true)
          } else {
            values.file_uuid = $.getQueryString('file_uuid');
            let rs = await $.post("/course/lesson/update", values);
            getQuery()
          }
          btn.loading = false;  //??????????????????loading????????????
          $.msg("????????????");
        }}
      >
        {({set, form, submit, setByName, getByName}) => (
          <div>
            <CreatFormItem form={form} setByName={setByName} getByName={getByName} />
            <Forms.Item label="????????????" required={true} >
              <Inputs form={form} name="file_name" value={infoData?.file_name} required={true} width={340} />
            </Forms.Item>
            <Forms.Item label="??????" required={true} >
              <Inputs form={form} name="is_trial" value={infoData?.is_trial || "NO"} radios={[
                {text: '????????????', value: 'NO'},
                {text: '?????????', value: 'YES'},
              ]} width={340} />
            </Forms.Item>
            <Forms.Item label="??????" required={true} >
              <Inputs form={form} name="sort" width={340} type="inputNumber" placeholder="?????????????????????" value={infoData?.sort} required={true} />
            </Forms.Item>
            <Forms.Item label="????????????" required={true} >
              <Inputs form={form} name="lesson_type" value={infoData?.lesson_type || "AUDIO"} required={true} radios={[
                {text: '??????', value: 'AUDIO'},
                {text: '??????', value: 'VIDEO'},
                {text: '??????', value: 'TEXT'},
              ]} width={340} onChange={(val) => {
                if (val === 'TEXT') form.setFieldsValue({'lesson_content': ''})
              }} />
            </Forms.Item>
            {(!getByName("lesson_type") || getByName("lesson_type") === "AUDIO" || getByName("lesson_type") === "VIDEO") ? <Forms.Item label="??????????????????" >
              <Inputs form={form} name="limit_duration" width={340} type="inputNumber" placeholder="?????????????????????" value={infoData?.limit_duration} /> ???
            </Forms.Item> :
            <Forms.Item label="??????????????????" >
            <Inputs form={form} name="limit_duration" width={340} type="inputNumber" value={infoData?.limit_duration} /> ???
          </Forms.Item>}
            {getByName("lesson_type") !== "TEXT" &&  <AddMedia form={form} set={set} getByName={getByName} setByName={setByName} />}
            <Forms.Item label="????????????" required={true} >
              <Inputs form={form} name="summary" required={true} type="editor" placeholder="?????????????????????" value={infoData?.summary} />
            </Forms.Item>
            {/* {Parent ? <FixedBox>
              <Btn className="mr_10" type='default' onClick={() => Parent.close()} >??????</Btn>
              <Btn htmlType="submit" >??????</Btn>
            </FixedBox> :
            <div className='ta_c pt_30' >
              <Btn htmlType="submit" >??? ???</Btn>
            </div>} */}
            <FixedBox>
              <Btn className="mr_10" type='default' onClick={() => {
                if (Parent) {
                  Parent.close()
                } else {
                  window.location.href = `/adminPc/ClassInfo?product_uuid=${$.getQueryString('product_uuid')}`
                }
              }} >??????</Btn>
              <Btn htmlType="submit" >??????</Btn>
            </FixedBox>
          </div>
        )}
      </Form>
    )
  }

	return (
    Parent ? <Card title={Parent?.state?.title} bordered={false} >
      <Content/>
    </Card>: 
    <div className="br_3 bg_white pall_15">
      <BreadcrumbBar pathList={['/adminPc/class', `/adminPc/ClassInfo?product_uuid=${$.getQueryString('product_uuid')}`, `${$.store().BCB_setBarPath}?product_uuid=${$.getQueryString('product_uuid')}&file_uuid=${$.getQueryString('file_uuid')}`]} />
      <Content/>
    </div>
	);
}
