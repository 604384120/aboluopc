import React, { useState, useEffect } from "react";
import { Form as Forms, Card } from "antd";
import { $, Img, Form, FixedBox, Btn, Inputs, Uploadimgs, BreadcrumbBar } from "../comlibs";
import { indexOf } from "../../config/routes_adminPc";

const col = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 }
};

export default function(props) {
  const Iconfont = $.icon();

  const Parent = props.Parent;

  const [infoData, setInfoData] = useState();

  let { uploadimg, avatar, setAva, courselabelList, setCourselabelList }={}

  useEffect(()=>{ getQuery() }, []);

  async function getQuery(){
    if (!Parent) {
      let rs = await $.get("/product/course/detail", {product_uuid: $.getQueryString('product_uuid')});
      if (!rs) return;
      setInfoData(rs)
    }
  };

  const AddImges = ({ form, set }) => {
    [avatar, setAva] = useState(infoData?.product_cover || "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/360ceda8-6138-11eb-a832-00163e04cc20.png");
    return (
      <Forms.Item label="教材封面" required={true} >
        {set(
          {name: 'product_cover', value: infoData?.product_cover, required: true},
          (valueSet) => (
            //valueSet 动态设置组件的value
            <div className="box-w1 f_wrap" >
              <Img width={140} height={160} src={avatar} />
              <div className="pl_15" width={260} >
                <Btn onClick={() => uploadimg.open('添加轮播图')} >选择文件</Btn>
                <br/>
                <p className="fs_12" >建议尺寸 3 : 4，JPG、PNG格式， 图片小于5M。</p>
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
      let rs = await $.get("/materiallabel/query", {totalnum: "NO"});
      if (!rs) return;
      let list = rs.data.map((item, index) => {
        if (infoData?.materiallabel_uuids && infoData?.materiallabel_uuids.length >= 3 && infoData?.materiallabel_uuids.indexOf(item.materiallabel_uuid) < 0) {
          item.disable = true
        }
        item.text = item.materiallabel_title;
        item.value = item.materiallabel_uuid;
        return item
      });
      setCourselabelList(list)
    };

    return <Forms.Item label="教材标签" >
      <Inputs form={form} name="materiallabel_uuids" value={infoData?.materiallabel_uuids} type="checkbox" checkboxs={courselabelList} onChange={(val) => {
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
          if (values?.sort === 0) values.sort = '0';
          if (values?.showprice === 0) values.showprice = '0';
          if (values?.price === 0) values.price = '0';
          if (values?.limit_stock === 0) values.limit_stock = '0';
          if (Parent) {
            let rs = await $.post("/product/material/add", values);
            Parent.close(true)
          } else {
            values.product_uuid = $.getQueryString('product_uuid');
            let rs = await $.post("/product/material/update", values);
          }
          btn.loading = false;  //关闭提交按钮loading加载状态
          $.msg("操作成功");
        }}
      >
        {({set, form, submit, setByName, getByName}) => (
          <div>
            <div className="fs_16 fw_600 mb_15" >教材信息</div>
            <Forms.Item label="教材名称" required={true} >
              <Inputs form={form} name="product_name" value={infoData?.product_name} required={true} width={260} />
            </Forms.Item>
            <AddImges form={form} set={set} />
            <CheckboxGroup form={form} />
            <Forms.Item label="教材排序" required={true} >
              <Inputs form={form} name="sort" value={infoData?.sort} width={260} type="inputNumber" placeholder="数字越小越靠前" required={true} />
            </Forms.Item>
            <Forms.Item label="推荐语" required={true} >
              <Inputs className="mb_15" name="introduction" form={form} rows={3} required={true} value={infoData?.introduction} placeholder="最多输入120个字" type="textArea" maxLength={120} />
            </Forms.Item>
            <Forms.Item label="教材介绍" required={true} >
              <Inputs form={form} name="summary" value={infoData?.summary} required={true} type="editor" placeholder="请输入详细介绍" />
            </Forms.Item>
            <div className="fs_16 fw_600 mb_15" >售卖信息</div>
            <Forms.Item label="教材价格" >
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
              <Inputs form={form} name="onsell" value={infoData?.onsell || "NO"} disabled={Parent} radios={[
                {text: '上架', value: 'YES'},
                {text: '下架', value: 'NO'},
              ]} width={260} />
              <span className="fc_red ml_25" >下架时，会将未支付的订单关闭</span>
            </Forms.Item>
            <Forms.Item label="教材角标" >
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
                  window.location.href = `/adminPc/TextbookInfo?product_uuid=${$.getQueryString('product_uuid')}`
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
      <BreadcrumbBar pathList={['/adminPc/textbook', `/adminPc/TextbookInfo?product_uuid=${$.getQueryString('product_uuid')}`, `${$.store().BCB_setBarPath}?product_uuid=${$.getQueryString('product_uuid')}`]} search={`?product_uuid=${$.getQueryString('product_uuid')}`} />
      <Content/>
    </div>
	);
}
