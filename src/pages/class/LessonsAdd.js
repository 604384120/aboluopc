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
                    uploadvideo.open('添加视频')
                  } else {
                    uploadaudio.open('添加音频')
                  }
                }} className={Parent ? "mr_15 mt_25" : 'mr_15'} >选择文件</Btn>
                <span className="fs_12" >{
                getByName("lesson_type") === "VIDEO" ? '支持mp4，avi，wmv，mov，flv，rmvb，3gp，m4v，mkv格式；文件最大不超过5G。' :
                '格式支持mp3、m4a，为保证音频加载与播放的流畅性，建议上传大小不超过500M'}</span>
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
                    $.msg("导入成功!");
                  }}
                />
                <Uploadaudio
                  ref={e => uploadaudio = e}
                  multiple={false}
                  onSure={(ary) => {
                    setAudio(ary[0]);
                    valueSet(ary[0].url);
                    $.msg("导入成功!");
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
    return <Forms.Item label="选择目录" >
      <Inputs form={form} name="parent_file_uuid" select={tableList.filter((item) => item.file_type === "CATALOG")} className="mr_15" allowClear width={160} 
        onChange={() => setByName("file_uuid", "")}
        value={infoData?.parent_file_uuids && infoData?.parent_file_uuids[0]} placeholder='请选择一级目录' />
      <Inputs form={form} name="file_uuid" type="select" allowClear width={160}
        select={tableMap[getByName("parent_file_uuid") || infoData?.parent_file_uuids && infoData?.parent_file_uuids[0]]?.childrens?.filter((item) => item.file_type === "CATALOG") || []}
        value={infoData?.parent_file_uuids && infoData?.parent_file_uuids[1]} placeholder='请选择二级目录' />
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
          btn.loading = false;  //关闭提交按钮loading加载状态
          $.msg("操作成功");
        }}
      >
        {({set, form, submit, setByName, getByName}) => (
          <div>
            <CreatFormItem form={form} setByName={setByName} getByName={getByName} />
            <Forms.Item label="课节名称" required={true} >
              <Inputs form={form} name="file_name" value={infoData?.file_name} required={true} width={340} />
            </Forms.Item>
            <Forms.Item label="试看" required={true} >
              <Inputs form={form} name="is_trial" value={infoData?.is_trial || "NO"} radios={[
                {text: '不可试看', value: 'NO'},
                {text: '可试看', value: 'YES'},
              ]} width={340} />
            </Forms.Item>
            <Forms.Item label="排序" required={true} >
              <Inputs form={form} name="sort" width={340} type="inputNumber" placeholder="数字越小越靠前" value={infoData?.sort} required={true} />
            </Forms.Item>
            <Forms.Item label="课节类型" required={true} >
              <Inputs form={form} name="lesson_type" value={infoData?.lesson_type || "AUDIO"} required={true} radios={[
                {text: '音频', value: 'AUDIO'},
                {text: '视频', value: 'VIDEO'},
                {text: '图文', value: 'TEXT'},
              ]} width={340} onChange={(val) => {
                if (val === 'TEXT') form.setFieldsValue({'lesson_content': ''})
              }} />
            </Forms.Item>
            {(!getByName("lesson_type") || getByName("lesson_type") === "AUDIO" || getByName("lesson_type") === "VIDEO") ? <Forms.Item label="最少播放时长" >
              <Inputs form={form} name="limit_duration" width={340} type="inputNumber" placeholder="不填为默认时长" value={infoData?.limit_duration} /> 秒
            </Forms.Item> :
            <Forms.Item label="最少阅读时长" >
            <Inputs form={form} name="limit_duration" width={340} type="inputNumber" value={infoData?.limit_duration} /> 秒
          </Forms.Item>}
            {getByName("lesson_type") !== "TEXT" &&  <AddMedia form={form} set={set} getByName={getByName} setByName={setByName} />}
            <Forms.Item label="详细介绍" required={true} >
              <Inputs form={form} name="summary" required={true} type="editor" placeholder="请输入商品详情" value={infoData?.summary} />
            </Forms.Item>
            {/* {Parent ? <FixedBox>
              <Btn className="mr_10" type='default' onClick={() => Parent.close()} >取消</Btn>
              <Btn htmlType="submit" >确定</Btn>
            </FixedBox> :
            <div className='ta_c pt_30' >
              <Btn htmlType="submit" >保 存</Btn>
            </div>} */}
            <FixedBox>
              <Btn className="mr_10" type='default' onClick={() => {
                if (Parent) {
                  Parent.close()
                } else {
                  window.location.href = `/adminPc/ClassInfo?product_uuid=${$.getQueryString('product_uuid')}`
                }
              }} >取消</Btn>
              <Btn htmlType="submit" >确定</Btn>
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
