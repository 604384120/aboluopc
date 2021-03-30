import React, { useState, useEffect } from "react";
import { Form as Forms, Card } from "antd";
import { $, Img, Form, FixedBox, Btn, Inputs, Uploadimgs } from "../comlibs";

const col = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 }
};

export default function(props) {
  const Iconfont = $.icon();

  const Parent = props.Parent;

  const [typeList, setTypeList] = useState([]);
  const [typeMap, setTypeMap] = useState();
  const [infoData, setInfoData] = useState();

  let { uploadimgs, avatar, setAva, comboRef, selectMap = {}, setSelectMap }={}

  useEffect(() => { getQuery() }, []);

  async function getQuery(){
    let rs = await $.get("/banner/redirect/types");
    if (!rs) return;
    let tempMap = {};
    rs.forEach(item => {
      item.text = item.redirect_type_name;
      item.value = item.redirect_type;
      tempMap[item.redirect_type] = item
    });
    setTypeMap(tempMap);
    setTypeList(rs);
    if (Parent?.state?.title === "编辑轮播图") {
      rs = await $.get("/banner/detail", {banner_uuid: Parent?.data?.banner_uuid});
      if (!rs) return;
      setInfoData(rs)
    }
  };

  const AddImges = ({ form, set }) => {
    [avatar, setAva] = useState(infoData?.banner_img || "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/10e559f6-557c-11eb-a82d-00163e04cc20.png");
    return (
      <Forms.Item label="图片" required={true} >
        {set(
          {name: 'banner_img', value: infoData?.banner_img, required: true},
          (valueSet) => (
            //valueSet 动态设置组件的value
            <div className="box-w1 f_wrap" >
              <Img width={240} height={135} src={avatar} />
              <div className="pl_15" width={260} >
                <Btn onClick={() => uploadimgs.open('添加轮播图')} >选择文件</Btn>
                <br/>
                <p className="fs_12" >建议尺寸16:9，JPG、PNG格式， 图片小于2M</p>
              </div>
              <Uploadimgs
                multiple={false}
                prefix={`album/`}
                ref={e => (uploadimgs = e)}
                onSure={rs => {
                  $.msg("导入成功!");
                  setAva(rs)
                  valueSet(rs);
                }}
              />
            </div>
          )
        )}
      </Forms.Item>
    )
  };

  const CreatCourseSelect = ({form}) => {

    const [selectList, setSelectList] = useState();
    [selectMap, setSelectMap] = useState({});

    useEffect(() => { init() }, []);

    const init = async () => {
      let rs = await $.get('/product/course/query', {totalnum: 'NO'});
      if (!rs) return;
      let dataMap = {};
      rs.data.forEach((item) => {
        item.value = item.product_uuid;
        item.text = item.product_name;
        dataMap[item.product_uuid] = item
      })
      setSelectList([...rs.data])
      setSelectMap({...dataMap})
    };

    return <Forms.Item label="" labelCol={{ span: 3 }} wrapperCol={{ offset: 3, span: 21 }} >
      <span className='mr_15' >选择课程</span>
      <Inputs form={form} name="redirect_content" select={selectList} required={true} width={300} allowClear showSearch optionFilterProp="children" value={(infoData?.redirect_type === 'COURSE' && infoData?.redirect_content) || undefined} placeholder='请选择课程'  />
    </Forms.Item>
  };

  const CreatMaterialSelect = ({form}) => {

    const [selectList, setSelectList] = useState();
    [selectMap, setSelectMap] = useState({});

    useEffect(() => { init() }, []);

    const init = async () => {
      let rs = await $.get('/product/material/query', {totalnum: 'NO'});
      if (!rs) return;
      let dataMap = {};
      rs.data.forEach((item) => {
        item.value = item.product_uuid;
        item.text = item.product_name;
        dataMap[item.product_uuid] = item
      })
      setSelectList([...rs.data])
      setSelectMap({...dataMap})
    };

    return <Forms.Item label="" labelCol={{ span: 3 }} wrapperCol={{ offset: 3, span: 21 }} >
      <span className='mr_15' >选择教材</span>
      <Inputs form={form} name="redirect_content" select={selectList} required={true} width={300} allowClear showSearch optionFilterProp="children" value={infoData?.redirect_type === 'MATERIAL' && infoData?.redirect_content} placeholder='请选择教材' />
    </Forms.Item>
  };

  const CreatAlbumSelect = ({form}) => {

    const [selectList, setSelectList] = useState();
    [selectMap, setSelectMap] = useState({});

    useEffect(() => { init() }, []);

    const init = async () => {
      let rs = await $.get("/product/album/query", {totalnum: 'NO'});
      if (!rs) return;
      let dataMap = {};
      rs.data.forEach((item) => {
        item.value = item.product_uuid;
        item.text = item.product_name;
        dataMap[item.product_uuid] = item
      })
      setSelectList([...rs.data]);
      setSelectMap({...dataMap})
    };

    return <Forms.Item label="" labelCol={{ span: 3 }} wrapperCol={{ offset: 3, span: 21 }} >
      <span className='mr_15' >选择合辑</span>
      <Inputs form={form} name="redirect_content" select={selectList} required={true} width={300} allowClear showSearch optionFilterProp="children" value={infoData?.redirect_type === 'ALBUM' && infoData?.redirect_content} placeholder="请选择合辑" />
    </Forms.Item>
  };

  const CreatLessonSelect = ({form, getByName}) => {

    const [selectList, setSelectList] = useState();
    const [lessonList, setLessonList] = useState();
    [selectMap, setSelectMap] = useState({});

    useEffect(() => { init() }, []);

    const init = async () => {
      let rs = await $.get("/product/course/query", {totalnum: 'NO'});
      if (!rs) return;
      rs.data.forEach((item) => {
        item.value = item.product_uuid;
        item.text = item.product_name;
      })
      setSelectList([...rs.data]);
      if (infoData && infoData?.redirect_type === 'LESSON' && infoData?.product_uuid) {
        getLessonList(infoData?.product_uuid);
      } else {
        getLessonList();
      }
    };

    const getLessonList = async (product_uuid) => {
      let rs = await $.get('/course/lesson/query', {totalnum: 'NO', product_uuid: product_uuid || ''});
      if (!rs) return;
      let dataMap = {};
      rs.data.forEach((item) => {
        item.value = item.file_uuid;
        item.text = item.file_name;
        dataMap[item.file_uuid] = item
      })
      setLessonList([...rs.data]);
      setSelectMap({...dataMap})
    };

    return <Forms.Item label="" labelCol={{ span: 3 }} wrapperCol={{ offset: 3, span: 21 }} >
      <div>
        <span className='mr_15' >选择课程</span>
        <Inputs form={form} name="product_uuid" value={getByName('product_uuid')} select={selectList} width={300} onChange={(e) => getLessonList(e)} allowClear showSearch optionFilterProp="children" value={(infoData?.redirect_type === 'LESSON' && infoData?.product_uuid) || undefined} placeholder="请选择课程" />
      </div>
      <div>
        <span className='mr_15' >选择课节</span>
          <Inputs form={form} name="redirect_content" select={lessonList || []} required={true} width={300} allowClear showSearch optionFilterProp="children" value={(infoData?.redirect_type === 'LESSON' && infoData?.redirect_content) || undefined} placeholder="请选择课节" />
      </div>
    </Forms.Item>
  };

	return (
    <Card title={Parent?.state?.title} bordered={false} >
      <Form
        {...col}
        onSubmit={async (values, btn, ext) => {
          if (!values.banner_img) {
            $.warning("表单内还有内容未完成哦~");
            return
          }
          if (Parent?.data?.pageIndex === '自定义') {// 自定义轮播图组
            if (infoData) {
              values.banner_uuid = infoData.banner_uuid;
              let rs = await $.post("/banner/update", values);
              Parent.close({pageIndex: '编辑轮播图', banner_uuid: infoData.banner_uuid, ...values})
            } else {
              let rs = await $.post("/customentry/banner/add", values);
              let params = {pageIndex: '添加轮播图', banner_uuid: rs.banner_uuid, ...values};
              if (values.redirect_type === "LESSON") {//  和后端同步使用file_name来作为课程课节的跳转字段
                params.file_name = selectMap[values.redirect_content]?.file_name;
              } else {
                params.product_name = selectMap[values.redirect_content]?.product_name;
              }
              Parent.close(params)
            }
          } else {
            if (infoData) {
              values.banner_uuid = infoData.banner_uuid;
              let rs = await $.post("/banner/update", values);
            } else {
              let rs = await $.post("/banner/add", values);
            }
            Parent.close(true)
          }
          btn.loading = false;  //关闭提交按钮loading加载状态
          $.msg("操作成功");
        }}
      >
        {({set, form, submit, setByName, getByName}) => (
          <div>
            <AddImges form={form} set={set} />
            <Forms.Item label="标题" required={true} >
              <Inputs form={form} name="banner_title" value={infoData?.banner_title} required={true} width={190} />
            </Forms.Item>
            <Forms.Item label="跳转" required={true} >
              <Inputs form={form} name="redirect_type" value={infoData?.redirect_type || "NULL"} required={true} radios={typeList} width={500} onChange={(val) => {
                if (infoData?.redirect_type && val === infoData.redirect_type) {
                  form.setFieldsValue({'redirect_content': infoData?.redirect_content})
                }
                form.setFieldsValue({'redirect_content': undefined})
              }} />
              {(form.getFieldValue("redirect_type") === "H5" || (infoData?.redirect_type === 'H5' && !getByName("redirect_type"))) && <Inputs form={form} name="redirect_content" value={infoData?.redirect_content} required={true} width={320} placeholder="请输入以https://或http://开头的网址" />}
            </Forms.Item>
            {(getByName("redirect_type") === 'COURSE' || (infoData?.redirect_type === 'COURSE' && !getByName("redirect_type"))) &&
            <CreatCourseSelect form={form} />}
            {(getByName("redirect_type") === 'MATERIAL' || (infoData?.redirect_type === 'MATERIAL' && !getByName("redirect_type"))) &&
            <CreatMaterialSelect form={form} />}
            {(getByName("redirect_type") === 'ALBUM' || (infoData?.redirect_type === 'ALBUM' && !getByName("redirect_type"))) &&
            <CreatAlbumSelect form={form} />}
            {(getByName("redirect_type") === 'LESSON' || (infoData?.redirect_type === 'LESSON' && !getByName("redirect_type"))) &&
            <CreatLessonSelect form={form} getByName={getByName} />}
            <FixedBox>
              <Btn className="mr_10" type='default' onClick={() => Parent.close()} >取消</Btn>
              <Btn htmlType="submit" >确定</Btn>
            </FixedBox>
          </div>
        )}
      </Form>
    </Card>
	);
}
