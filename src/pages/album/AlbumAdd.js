import React, { useState, useEffect } from "react";
import { Form as Forms, Card, Table } from "antd";
import { $, Img, Form, FixedBox, Btn, Inputs, Uploadimgs, Uploadvideo, Video, BreadcrumbBar, Popconfirms } from "../comlibs";
import { Page_Combo } from '../works'

const col = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 }
};

export default function(props) {

  const Parent = props.Parent;

  const [infoData, setInfoData] = useState();

  let { uploadimgs, imgList, setImgList, uploadvideo, video, setVideo, uploadimg, avatar, setAva, imge, setImge, uploadimge, tableList, setTableList, comboRef, courselabelList, setCourselabelList } = {};

  useEffect(() => { getQuery() }, []);

  async function getQuery(){
    if (!Parent) {
      let rs = await $.get("/product/album/detail", {product_uuid: $.getQueryString('product_uuid')});
      if (!rs) return;
      // if (rs?.product_uuids?.length > 0) {
      //   rs.productsList = [];
      //   let getdata = async (uuid) => {
      //     let res = await $.get("/product/course/detail", {product_uuid: uuid});
      //     if (!res) return;
      //     rs.productsList.push(res);
      //     return rs
      //   }
      //   for (let item of rs?.product_uuids) {
      //     getdata(item)
      //   }
      // }
      setInfoData({...rs})
    }
  };

  const AddMedia = ({ form, set, getByName }) => {
    let defaultImg = "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/10e559f6-557c-11eb-a82d-00163e04cc20.png";
    [imgList, setImgList] = useState(infoData?.product_cover || [defaultImg]);
    [video, setVideo] = useState(infoData?.product_video || defaultImg);
    return (
      <Forms.Item label="合辑封面" required={true} >
        {set(
          {name: 'product_cover', value: infoData?.product_cover, required: true},
          (valueSet) => (
            //valueSet 动态设置组件的value
            <div>
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
                    imgList.splice(index, 1)
                    setImgList([...imgList])
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
                  setImgList([...imgList, ...rs.split(',')]);
                  valueSet(rs);
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
            <div className="mb_10" >
              <div className="pl_10" width={230} >
                <Btn onClick={() => uploadvideo.open('添加视频')} className="mr_15" >选择文件</Btn>
                <span className="fs_12" >仅支持上传一个视频，小于200M。</span>
              </div>
              {video === defaultImg ? <Img width={120} height={70} src={defaultImg} /> :
              (getByName("product_video") === infoData?.product_video ? <video width={260} height={146} src={infoData?.product_video} autoPlay={false} controls /> :
              <Video isTrans={true} {...video[0]} />)}
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
    [avatar, setAva] = useState(infoData?.product_list_cover || "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/1ef9805e-5611-11eb-a82d-00163e04cc20.png");
    return (
      <Forms.Item label="合辑列表封面" required={true} >
        {set(
          {name: 'product_list_cover', value: infoData?.product_list_cover, required: true},
          (valueSet) => (
            //valueSet 动态设置组件的value
            <div className="box-w1 f_wrap" >
              <Img width={100} height={100} src={avatar} />
              <div className="pl_15" width={260} >
                <Btn onClick={() => uploadimg.open('添加轮播图')} >选择文件</Btn>
                {/* <br/>
                <p className="fs_12" >请上传助教二维码，JPG、PNG格式， 图片小于2M。</p> */}
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

  const AddImg = ({ form, set }) => {
    [imge, setImge] = useState(infoData?.assistant_qr || "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/1ef9805e-5611-11eb-a82d-00163e04cc20.png");
    return (
      <Forms.Item label="课程助教" >
        {set(
          {name: 'assistant_qr', value: infoData?.assistant_qr},
          (valueSet) => (
            //valueSet 动态设置组件的value
            <div className="box-w1 f_wrap" >
              <Img width={100} height={100} src={imge} />
              <div className="pl_15" width={260} >
                <Btn onClick={() => uploadimge.open('添加轮播图')} >选择文件</Btn>
                <br/>
                <p className="fs_12" >请上传助教二维码，JPG、PNG格式， 图片小于2M。</p>
              </div>
              <Uploadimgs
                multiple={false}
                prefix={`album/`}
                ref={e => (uploadimge = e)}
                onSure={rs => {
                  $.msg("导入成功!");
                  setImge(rs)
                  valueSet(rs);
                }}
              />
            </div>
          )
        )}
      </Forms.Item>
    )
  };

  const TableEdit = ({form, getByName}) => {
    [tableList, setTableList] = useState(infoData?.products || []);

    useEffect(() => init(), []);

    let init = () => {
      if (infoData?.products?.length > 0) {
        tableList = infoData?.products;
        tableList.push({ add: true });
        setTableList([...tableList])
      } else {
        tableList.push({ add: true });
        setTableList([...tableList])
      }
    };

    let columns = [
      {
        title: '名称',
        dataIndex: 'product_name',
        render: (text, record, index) => {
          if (index === tableList?.length - 1) {
            return {
              children: <a disabled={getByName('onsell') === 'YES'} style={{position: "relative", left: 220}} onClick={() => {
                comboRef.open('选择课程', {
                  max: 1,
                  value: [...tableList],
                  onSure: (d) => {
                    setTableList([{...d}, ...tableList])
                  },
                })
              }} >添加课程</a>,
              props: {
                colSpan: 1,
              },
            };
          } else {
            return text
          }
        }
      },
      {
        title: '总价',
        dataIndex: 'showprice',
        render: (text, record) => {
          return text || record.price
        }
      },
      {
        title: '折后价',
        dataIndex: 'price',
      },
      {
        title: '操作',
        render: (text, record, index) => {
          if (index === tableList.length - 1) {
            return
          } else {
            return <Popconfirms title="确定移除吗？" content="移除" onConfirm={() => {
              if (getByName('onsell') === 'YES') {
                $.warning('请先下架后，再移除课程！')
                return
              }
              tableList.splice(index, 1)
              setTableList([...tableList])
            }} />
          }
        }
      },
    ];

    return <Table columns={columns} dataSource={tableList} pagination={false} style={{maxWidth: 700}} />
  };

  const CheckboxGroup = ({form}) => {
    
    [courselabelList, setCourselabelList] = useState([]);

    useEffect(() => { init() }, []);

    async function init(){
      let rs = await $.get("/albumlabel/query", {totalnum: "NO"});
      if (!rs) return;
      let list = rs.data.map((item, index) => {
        if (infoData?.albumlabel_uuids && infoData?.albumlabel_uuids.length >= 3 && infoData?.albumlabel_uuids.indexOf(item.albumlabel_uuid) < 0) {
          item.disable = true
        }
        item.text = item.albumlabel_title;
        item.value = item.albumlabel_uuid;
        return item
      })
      setCourselabelList(list)
    };

    return courselabelList.length > 0 ? <Forms.Item label="合辑标签" >
      <Inputs form={form} name="albumlabel_uuids" value={infoData?.albumlabel_uuids} type="checkbox" checkboxs={courselabelList} onChange={(val) => {
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
    </Forms.Item> : ''
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
          if (tableList.length > 0) {
            let paramlist = [];
            tableList.forEach(item => {
              if (item.product_uuid) {
                paramlist.push(item.product_uuid)
              }
            });
            values.product_uuids = paramlist.toString()
          } else {
            $.warning('请选择课程！')
          }
          if (Parent) {
            let rs = await $.post("/product/album/add", values);
            Parent.close(true)
          } else {
            values.product_uuid = $.getQueryString('product_uuid');
            let rs = await $.post("/product/album/update", values);
            getQuery()
          }
          btn.loading = false;  //关闭提交按钮loading加载状态
          $.msg("操作成功");
        }}
      >
        {({set, form, submit, setByName, getByName}) => (
          <div>
            <div className="fs_16 fw_600 mb_15" >合辑信息</div>
            <Forms.Item label="合辑名称" required={true} >
              <Inputs form={form} name="product_name" value={infoData?.product_name} required={true} width={260} />
            </Forms.Item>
            <AddMedia form={form} set={set} getByName={getByName} />
            <AddImges form={form} set={set} />
            <Forms.Item label="合辑列表简介" >
              <Inputs form={form} name="album_intro_1" value={infoData?.album_intro_1} width={260} className="dis_b" />
              <Inputs form={form} name="album_intro_2" value={infoData?.album_intro_2} width={260} className="dis_b" />
              <Inputs form={form} name="album_intro_3" value={infoData?.album_intro_3} width={260} className="dis_b" />
            </Forms.Item>
            <CheckboxGroup form={form} />
            <Forms.Item label="排序" required={true} >
              <Inputs form={form} name="sort" value={infoData?.sort} width={260} type="inputNumber" placeholder="数字越小越靠前" required={true} />
            </Forms.Item>
            <AddImg form={form} set={set} />
            <Forms.Item label="简介" required={true} >
              <Inputs className="mb_15" name="introduction" form={form} rows={3} required={true} value={infoData?.introduction} placeholder="最多输入120个字" type="textArea" maxLength={120} />
            </Forms.Item>
            <div className="fs_16 fw_600 mb_15" >售卖信息</div>
            <Forms.Item label="售卖内容" required={true} >
              <TableEdit form={form} getByName={getByName} />
            </Forms.Item>
            <Forms.Item label="合辑总价" required={true} >
              <Inputs form={form} name="showprice" value={infoData?.showprice} width={260} type="inputNumber" min={0} required={true} />
            </Forms.Item>
            <Forms.Item label="合辑折后价" required={true} >
              <Inputs form={form} name="price" value={infoData?.price} required={true} width={260} type="inputNumber" min={0} />
            </Forms.Item>
            <Forms.Item label="售卖时间" >
              <Inputs name="start_time" form={form} type="dateTimePicker" placeholder="开始时间" className="mr_15" showTime={{ format: 'HH:mm' }} format={"YYYY-MM-DD HH:mm"} value={infoData?.start_time} />
              <Inputs name="end_time" form={form} type="dateTimePicker" placeholder="结束时间" showTime={{ format: 'HH:mm' }} format={"YYYY-MM-DD HH:mm"} value={infoData?.end_time} />
            </Forms.Item>
            <Forms.Item label="展示/隐藏" required={true} >
              <Inputs form={form} name="show" value={infoData?.show || "YES"} required={true} radios={[
                {text: '展示', value: 'YES'},
                {text: '隐藏', value: 'NO'},
              ]} width={260} />
            </Forms.Item>
            <Forms.Item label="上/下架" required={true} >
              <Inputs form={form} name="onsell" value={infoData?.onsell || "NO"} disabled={Parent} required={true} radios={[
                {text: '上架', value: 'YES'},
                {text: '下架', value: 'NO'},
              ]} width={260} />
              <span className="fc_red ml_25" >下架时，会将未支付的订单关闭</span>
            </Forms.Item>
            <Forms.Item label="合辑角标" >
              <Inputs form={form} name="tag" value={infoData?.tag || ''} radios={[
                {text: '无', value: ''},
                {text: '最新', value: '最新'},
                {text: '最热', value: '最热'},
                {text: '限时免费', value: '限时免费'},
                {text: '免费', value: '免费'},
              ]} width={360} />
            </Forms.Item>
            {Parent ? <FixedBox>
              <Btn className="mr_10" type='default' onClick={() => Parent.close()} >取消</Btn>
              <Btn htmlType="submit" >确定</Btn>
            </FixedBox> :
            <div className='ta_c pt_30' >
              <Btn htmlType="submit" >保 存</Btn>
            </div>}
          </div>
        )}
      </Form>
    )
  }

	return (
    Parent ? <Card title={Parent?.state?.title} bordered={false} >
      <Content/>
      <Page_Combo ref={(rs) => comboRef = rs} />
    </Card>: 
    <div className="br_3 bg_white pall_15">
      <BreadcrumbBar pathList={['/adminPc/album', `${$.store().BCB_setBarPath}?product_uuid=${$.getQueryString('product_uuid')}`]} />
      <Content/>
      <Page_Combo ref={(rs) => comboRef = rs} />
    </div>
	);
}
