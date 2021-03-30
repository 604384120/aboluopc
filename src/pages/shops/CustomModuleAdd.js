import React, { useState, useEffect } from "react";
import { Form as Forms, Table, Card } from "antd";
import { $, Form, FixedBox, Btn, Inputs, BreadcrumbBar, Popconfirms } from "../comlibs";
import { Page_Combo, Page_ComboTextbook, Page_ComboAlbum } from '../works'

const col = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 }
};

export default function(props) {

  const Parent = props.Parent;

  const [infoData, setInfoData] = useState();

  let { comboRef, comboBookRef, comboAlbumRef, tableList, setTableList } = {};

  useEffect(() => { getQuery() }, []);

  async function getQuery(){
    if (!Parent) {
      let rs = await $.get("/customentry/detail", {customentry_uuid: $.getQueryString('customentry_uuid')});
      if (!rs) return;
      setInfoData({...rs})
    }
  };

  const handleCustomentry_type = (getByName) => {
    if (getByName("customentry_type") === 'ALBUM' || infoData?.customentry_type === 'ALBUM') {
      return [
        {text: '列表', value: 'LIST'},
      ]
    } else if (getByName("customentry_type") === 'MATERIAL' || infoData?.customentry_type === 'MATERIAL') {
      return [
        {text: '小图', value: 'THUMB'},
      ]
    }
    return [
      {text: '列表', value: 'LIST'},
      {text: '小图', value: 'THUMB'},
    ]
  };

  const CreatTable = ({form, getByName}) => {

    [tableList, setTableList] = useState([]);
    let { customentry_type } = {};

    useEffect(() => {
      if (infoData && infoData.products && infoData.products.length > 0) {
        setTableList([...infoData.products])
      }
     }, []);

    const columns = [
      {
        title: '名称',
        dataIndex: 'product_name',
        key: 'product_name',
      },
      {
        title: "操作",
        width: 60,
        render: (text, record, index) => {
          return <Popconfirms title='确认移除？' content='移除' onConfirm={async () => {
            tableList.splice(index, 1);
            setTableList([...tableList])
          }} />
        }
      }
    ];

    if (getByName("customentry_type") === 'COURSE' || (infoData?.customentry_type === 'COURSE' && getByName("customentry_type") === 'COURSE')) {
      customentry_type = 'COURSE';
    } else if (getByName("customentry_type") === 'MATERIAL' || (infoData?.customentry_type === 'MATERIAL' && getByName("customentry_type") === 'MATERIAL')) {
      customentry_type = 'MATERIAL'
    } else if (getByName("customentry_type") === 'ALBUM' || (infoData?.customentry_type === 'ALBUM' && getByName("customentry_type") === 'ALBUM')) {
      customentry_type = 'ALBUM'
    }

    return <Forms.Item wrapperCol={{offset: 3}} >
      <Btn className="mr_10" onClick={() => {
        if (customentry_type == 'COURSE') {
          comboRef.open('选择课程',
          {
            max: 1,
            value: [...tableList],
            onSure: (d) => {
              setTableList([...tableList, {...d}]);
            }
          });
        } else if (customentry_type == 'MATERIAL') {
          comboBookRef.open('选择教材',
          {
            max: 1,
            value: [...tableList],
            onSure: (d) => {
              setTableList([...tableList, {...d}]);
            }
          });
        } else if (customentry_type == 'ALBUM') {
          comboAlbumRef.open('选择合辑',
          {
            max: 1,
            value: [...tableList],
            onSure: (d) => {
              setTableList([...tableList, {...d}]);
            }
          });
        }
      }} >
        添加
        {customentry_type == 'COURSE' && '课程'}
        {customentry_type == 'MATERIAL' && '教材'}
        {customentry_type == 'ALBUM' && '合辑'}
      </Btn>
      <span>最多支持添加20个</span>
      <Table dataSource={tableList} columns={columns} size="middle" pagination={false} />
    </Forms.Item>
  };

  const Content = () => {
    return (
      <Form
        {...col}
        onSubmit={async (values, btn, ext) => {
          if (!tableList || tableList?.length < 0) {
            values.customentry_type === 'COURSE' && $.warning('请添加课程!');
            values.customentry_type === 'MATERIAL' && $.warning('请添加教程!');
            values.customentry_type === 'ALBUM' && $.warning('请添加合辑!');
            return
          }
          values.product_uuids = tableList.map((item) => item.product_uuid).toString() || " ";
          if (Parent) {
            let rs = await $.post("/customentry/add", values);
            Parent.close(true)
          } else {
            values.customentry_uuid = infoData.customentry_uuid;
            let rs = await $.post("/customentry/update", values);
          }
          getQuery();
          btn.loading = false;  //关闭提交按钮loading加载状态
          $.msg("操作成功");
        }}
      >
        {({set, form, submit, setByName, getByName}) => (
          <div>
            <Forms.Item label="标题" required={true} >
              <Inputs form={form} name="customentry_title" value={infoData?.customentry_title} required={true} width={190} />
            </Forms.Item>
            <Forms.Item label="模块说明" >
              <Inputs form={form} name="customentry_illustrate" value={infoData?.customentry_illustrate} width={190} />
            </Forms.Item>
            <Forms.Item label="模块颜色" required={true} >
              <Inputs form={form} name="customentry_colour" value={infoData?.customentry_colour} required={true} width={190} placeholder="请输入16进制的色值" />
            </Forms.Item>
            <Forms.Item label="内容" required={true} >
              <Inputs form={form} name="customentry_type" value={infoData?.customentry_type || "COURSE"} required={true} radios={[
                {text: '课程', value: 'COURSE'},
                {text: '教材', value: 'MATERIAL'},
                {text: '合辑', value: 'ALBUM'},
              ]} width={220} onChange={(e, val) => {
                if (infoData && infoData.products && infoData.products.length > 0 && infoData.customentry_type == e) {
                  setTableList([...infoData.products])
                } else {
                  setTableList([])
                }
              }} />
            </Forms.Item>
            <Forms.Item label="布局方式" required={true} >
              <Inputs form={form} name="customentry_layout" value={(infoData?.redirect_type === 'COURSE' && infoData?.customentry_layout) || handleCustomentry_type(getByName)[0]?.value} required={true} radios={handleCustomentry_type(getByName)} width={190} />
            </Forms.Item>
            <CreatTable form={form} getByName={getByName} />
            {Parent ? <FixedBox>
              <Btn className="mr_10" type='default' onClick={() => Parent && Parent.close()} >取消</Btn>
              <Btn htmlType="submit" >确定</Btn>
            </FixedBox> :
            <div className='ta_c pt_30' >
              <Btn htmlType="submit" >保 存</Btn>
            </div>}
          </div>
        )}
      </Form>
    )
  };

	return (
    Parent ? <Card title={Parent?.state?.title} bordered={false} >
      <Content/>
      <Page_Combo ref={(rs) => comboRef = rs} />
      <Page_ComboTextbook ref={(rs) => comboBookRef = rs} />
      <Page_ComboAlbum ref={(rs) => comboAlbumRef = rs} />
    </Card>: 
    <div className="br_3 bg_white pall_15">
      <BreadcrumbBar pathList={['/adminPc/shops', `${$.store().BCB_setBarPath}?customentry_uuid=${$.getQueryString('customentry_uuid')}`]} />
      <Content/>
      <Page_Combo ref={(rs) => comboRef = rs} />
      <Page_ComboTextbook ref={(rs) => comboBookRef = rs} />
      <Page_ComboAlbum ref={(rs) => comboAlbumRef = rs} />
    </div>
	);
}
