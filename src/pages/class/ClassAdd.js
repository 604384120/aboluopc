import React, { useState, useEffect } from "react";
import { Form as Forms, Card } from "antd";
import { $, Img, Form, FixedBox, Btn, Inputs, Uploadimgs, Uploadvideo, Video, BreadcrumbBar } from "../comlibs";
import moment from 'moment';

const col = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 }
};

export default function(props) {
  const Iconfont = $.icon();

  const Parent = props.Parent;

  const [infoData, setInfoData] = useState();

  let { uploadimgs, imgList, setImgList, uploadvideo, video, setVideo, uploadimg, avatar, setAva, courselabelList, setCourselabelList }={}

  useEffect(() => { getQuery() }, []);

  async function getQuery(){
    if (!Parent) {
      let rs = await $.get("/product/course/detail", {product_uuid: $.getQueryString('product_uuid')});
      if (!rs) return;
      setInfoData(rs)
    }
  };

  const AddMedia = ({ form, set, getByName }) => {
    let defaultImg = "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/10e559f6-557c-11eb-a82d-00163e04cc20.png";
    [imgList, setImgList] = useState(infoData?.product_cover || [defaultImg]);
    [video, setVideo] = useState(infoData?.product_video || defaultImg);
    return (
      <Forms.Item label="课程封面" required={true} >
        {set(
          {name: 'product_cover', value: infoData?.product_cover, required: true},
          (valueSet) => (
            //valueSet 动态设置组件的value
            <div className="mb_10" >
              <div className="pl_10" width={230} >
                <Btn onClick={() => {
                  if (imgList.length >= 5) {
                    return $.warning('最多添加5张')
                  }
                  uploadimgs.open('添加图片')
                }} className="mr_15" >选择文件</Btn>
                <span className="fs_12" >建议尺寸750*420px，JPG、PNG格式， 图片小于2M。最多支持5张</span>
              </div>
              {imgList?.map((item, index) => {
                return <div className="pst_rel dis_ib mr_10" width={120} height={70} key={index} >
                  {!(imgList.length === 1 && imgList[0] === defaultImg) && <img alt="xxx" class="pst_abs pointer" src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/73a8853c-ce22-11e9-8203-00163e04cc20.png" class="pst_abs" style={{width: 16, height: 16, right: 2, top: 2}} onClick={() => {
                    imgList.splice(index, 1);
                    setImgList([...imgList]);
                    valueSet([...imgList]);
                  }} />}
                  <Img width={120} height={70} src={item} className='mb_10' />
                </div>
              })}
              <Uploadimgs
                multiple={false}
                prefix={`album/`}
                ref={e => (uploadimgs = e)}
                onSure={rs => {
                  if (imgList.length === 1 && imgList[0] === defaultImg) {
                    imgList = []
                  }
                  if ((imgList.length + rs.split(',').length) > 5) {
                    return $.warning('最多添加5张')
                  }
                  valueSet([...imgList, ...rs.split(',')]);
                  setImgList([...imgList, ...rs.split(',')]);
                  $.msg("导入成功!");
                }}
              />
            </div>
          )
        )}
        {set(
          {name: 'product_video', value: infoData?.product_video},
          (valueSet) => (
            //valueSet 动态设置组件的value
            <div>
              <div className="pl_10" width={230} >
                <Btn onClick={() => uploadvideo.open('添加视频')} className="mr_15" >选择文件</Btn>
                <span className="fs_12" >仅支持上传一个视频，小于200M。</span>
              </div>
              {video === defaultImg ? <Img width={120} height={70} src={defaultImg} /> :
              (getByName("product_video") === infoData?.product_video ? <video width={260} height={146} src={infoData?.product_video} autoPlay={false} controls /> :
              <div className="pst_rel dis_ib mr_10" width={120} height={70} >
                <img alt="xxx" class="pst_abs pointer" src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/73a8853c-ce22-11e9-8203-00163e04cc20.png" class="pst_abs" style={{width: 16, height: 16, right: -20, top: -2}} onClick={() => {
                  setVideo(defaultImg);
                  valueSet('');
                }} />
                <Video isTrans={true} {...video[0]} />
              </div>)}
              <Uploadvideo
                ref={e => uploadvideo = e}
                multiple={false}
                onSure={async (rs) => {
                  setVideo(rs);
                  valueSet(video[0].url);
                  $.msg("导入成功!");
                }}
              />
            </div>
          )
        )}
      </Forms.Item>
    )
  };

  const AddImges = ({ form, set }) => {
    [avatar, setAva] = useState(infoData?.assistant_qr || "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/1ef9805e-5611-11eb-a82d-00163e04cc20.png");
    return (
      <Forms.Item label="课程助教" >
        {set(
          {name: 'assistant_qr', value: infoData?.assistant_qr},
          (valueSet) => (
            //valueSet 动态设置组件的value
            <div className="box-w1 f_wrap" >
              <Img width={100} height={100} src={avatar} />
              <div className="pl_15" width={260} >
                <Btn onClick={() => uploadimg.open('添加轮播图')} >选择文件</Btn>
                <br/>
                <p className="fs_12" >请上传助教二维码，JPG、PNG格式， 图片小于2M。</p>
              </div>
              <Uploadimgs
                multiple={false}
                prefix={`album/`}
                ref={e => (uploadimg = e)}
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

  const CheckboxGroup = ({form}) => {
    
    [courselabelList, setCourselabelList] = useState([]);

    useEffect(() => { init() }, []);

    async function init(){
      let rs = await $.get("/courselabel/query", {totalnum: "NO"});
      if (!rs) return;
      let list = rs.data.map((item, index) => {
        if (infoData?.courselabel_uuids && infoData?.courselabel_uuids.length >= 3 && infoData?.courselabel_uuids.indexOf(item.courselabel_uuid) < 0) {
          item.disable = true
        }
        item.text = item.courselabel_title;
        item.value = item.courselabel_uuid;
        return item
      });
      setCourselabelList(list)
    };

    return <Forms.Item label="课程标签" >
      <Inputs form={form} name="courselabel_uuids" value={infoData?.courselabel_uuids} type="checkbox" checkboxs={courselabelList} onChange={(val) => {
        let dataList = courselabelList.map((item) => {
          if (val.length >= 3) {
            if (val.indexOf(item.value) < 0) {
              item.disable = true
            }
          } else {
            item.disable = undefined
          }
          return item
        })
        setCourselabelList([...dataList])
      }} />
    </Forms.Item>
  };

  const Content = () => {
    return (
      <Form
        className="mb_70"
        {...col}
        onSubmit={async (values, btn, ext) => {
          if (values?.course_cnt_lessons === 0) values.course_cnt_lessons = '0';
          if (values?.sort === 0) values.sort = '0';
          if (values?.showprice === 0) values.showprice = '0';
          if (values?.price === 0) values.price = '0';
          if (values?.limit_stock === 0) values.limit_stock = '0';
          if (Parent) {
            let rs = await $.post("/product/course/add", values);
            Parent.close(true)
          } else {
            values.product_uuid = $.getQueryString('product_uuid');
            let rs = await $.post("/product/course/update", values);
            getQuery()
          }
          btn.loading = false;  //关闭提交按钮loading加载状态
          $.msg("操作成功");
        }}
      >
        {({set, form, submit, setByName, getByName}) => (
          <div>
            <div className="fs_16 fw_600 mb_15" >课程信息</div>
            <Forms.Item label="课程名称" required={true} >
              <Inputs form={form} name="product_name" value={infoData?.product_name} required={true} width={260} />
            </Forms.Item>
            <AddMedia form={form} set={set} getByName={getByName} />
            <Forms.Item label="总课节数" required={true} >
              <Inputs form={form} name="course_cnt_lessons" value={infoData?.course_cnt_lessons} required={true} width={260} type="inputNumber" min={0} />
            </Forms.Item>
            <CheckboxGroup form={form} />
            <Forms.Item label="课程排序" required={true} >
              <Inputs form={form} name="sort" value={infoData?.sort} width={260} type="inputNumber" placeholder="数字越小越靠前" required={true} />
            </Forms.Item>
            <AddImges form={form} set={set} />
            <Forms.Item label="简介" required={true} >
              <Inputs className="mb_15" name="introduction" form={form} rows={3} required={true} value={infoData?.introduction} placeholder="最多输入120个字" type="textArea" maxLength={120} />
            </Forms.Item>
            <Forms.Item label="详细介绍" required={true} >
              <Inputs form={form} name="summary" value={infoData?.summary} required={true} type="editor" placeholder="请输入商品详情" />
            </Forms.Item>
            <div className="fs_16 fw_600 mb_15" >售卖信息</div>
            <Forms.Item label="课程价格" >
              <Inputs form={form} name="showprice" value={infoData?.showprice} width={260} type="inputNumber" min={0} />
            </Forms.Item>
            <Forms.Item label="售卖价格" required={true} >
              <Inputs form={form} name="price" value={infoData?.price} required={true} width={260} type="inputNumber" min={0} />
            </Forms.Item>
            <Forms.Item label="售卖时间" >
              <Inputs name="start_time" form={form} type="dateTimePicker" placeholder="开始时间" className="mr_15" showTime={{ format: 'HH:mm' }} format={"YYYY-MM-DD HH:mm"} value={infoData?.start_time} />
              <Inputs name="end_time" form={form} type="dateTimePicker" placeholder="结束时间" showTime={{ format: 'HH:mm' }} format={"YYYY-MM-DD HH:mm"} value={infoData?.end_time} />
            </Forms.Item>
            <Forms.Item label="展示/隐藏" required={true} >
              <Inputs form={form} name="show" value={infoData?.show || "YES"} radios={[
                {text: '展示', value: 'YES'},
                {text: '隐藏', value: 'NO'},
              ]} width={260} />
            </Forms.Item>
            <Forms.Item label="上/下架" required={true} >
              <Inputs form={form} name="onsell" value={infoData?.onsell || "NO"} radios={[
                {text: '上架', value: 'YES', disable: Parent ? true : false},
                {text: '下架', value: 'NO'},
              ]} width={260} />
              <span className="fc_red ml_25" >下架时，会将未支付的订单关闭</span>
            </Forms.Item>
            <Forms.Item label="课程角标" >
              <Inputs form={form} name="tag" value={infoData?.tag || ''} radios={[
                {text: '无', value: ''},
                {text: '最新', value: '最新'},
                {text: '最热', value: '最热'},
                {text: '限时免费', value: '限时免费'},
              ]} width={320} />
            </Forms.Item>
            <Forms.Item label="最低售卖数量展示" >
              <Inputs form={form} name="limit_stock" value={infoData?.limit_stock} width={260} type="inputNumber" min={0} />
            </Forms.Item>
            <FixedBox>
              <Btn className="mr_10" type='default' onClick={() => {
                if (Parent) {
                  Parent.close()
                } else {
                  location.href = `/adminPc/classInfo?product_uuid=${$.getQueryString('product_uuid')}`
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
      <BreadcrumbBar pathList={['/adminPc/class', `/adminPc/ClassInfo?product_uuid=${$.getQueryString('product_uuid')}`, `${$.store().BCB_setBarPath}?product_uuid=${$.getQueryString('product_uuid')}`]} search={`?product_uuid=${$.getQueryString('product_uuid')}`} />
      <Content/>
    </div>
	);
}
