import React, { useState, useEffect } from "react";
import { Form as Forms, Card, Checkbox } from "antd";
import { $, Img, Form, FixedBox, Btn, Inputs, Uploadaudio, Uploadvideo, Video, BreadcrumbBar, Voice } from "../comlibs";
import { nodeName } from "jquery";

const col = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 }
};

export default function(props) {

  const Parent = props.Parent;

  const [materials, setMaterials] = useState([]);

  let { tableList, setTableList, tableMap, setTableMap, product_uuid, setProduct_uuid, parent_file_uuid, setParent_file_uuid, p_file_uuid, setP_File_uuid, file_uuid, setFile_uuid, fileList, setFileList, imgList, setImgList, imgParam, setImgParam, all, setAll } = {}

  useEffect(()=>{getQuery()},[]);

  async function getQuery(){
    let res = await $.get('/product/course/materials', {product_uuid: $.getQueryString('product_uuid'), totalnum: 'NO'});
    if (!res) return;
    res.data.forEach((item) => {
      item.text = item.product_name;
      item.value = item.product_uuid;
      return
    })
    setMaterials(res.data);
  };

  const CreatSelect = ({form, getByName}) => {

    [tableList, setTableList] = useState([]);
    [tableMap, setTableMap] = useState();
    [product_uuid, setProduct_uuid] = useState();
    [parent_file_uuid, setParent_file_uuid] = useState();
    [p_file_uuid, setP_File_uuid] = useState();
    [file_uuid, setFile_uuid] = useState();
    [fileList, setFileList] = useState();
    [imgList, setImgList] = useState([]);

    // useEffect(()=>{ init() }, []);

    async function init(e) {
      if (!e) {
        getQuery();
        return
      }
      let res = await $.get('/material/catalogs', {product_uuid: e});
      if (!res) return;
      let tempMap = {};
      let list  = [];
      res.forEach((item) => {
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
        list.push(item)
      });
      setTableMap(tempMap);
      setTableList([...list]);
      setProduct_uuid(e);
      setParent_file_uuid(undefined);
      setP_File_uuid(undefined);
      setImgList([]);
    };

    return <div>
      <Inputs form={form} name="product_uuid" value={product_uuid} width={160} placeholder='选择教材' className='mr_10' select={materials} onChange={async (e) => init(e)} allowClear />
      <Inputs form={form} name="parent_file_uuid" value={parent_file_uuid} width={160} placeholder='选择一级目录' className='mr_10' select={tableList?.filter((item) => item.file_type === "CATALOG")} allowClear onChange={(e) => {
        tableList.forEach((item) => {
          if (item.file_uuid === e) {
            setFileList(item.childrens)
          }
        })
        setParent_file_uuid(e);
        setP_File_uuid(undefined);
        setImgList([]);
      }} />
      <Inputs className='mr_10' form={form} name="p_file_uuid" value={p_file_uuid} width={160} placeholder='选择二级目录' select={parent_file_uuid && tableMap[parent_file_uuid]?.children?.filter((item) => item.file_type === "CATALOG") || []} allowClear onChange={async (e) => {
        tableList.forEach((item) => {
          if (item.childrens.length > 0) {
            item.childrens.forEach((_item) => {
              if (_item.file_uuid === e) {
                _item.childrens.forEach((node) => {
                  node.text = node.file_name;
                  node.value = node.file_uuid;
                })
                setFileList(_item.childrens)
              }
            })
          }
        })
      }} />
      <Inputs form={form} name="file_uuid" value={file_uuid} width={160} placeholder='选择教材内容' select={(fileList || tableList).filter((item) => item.file_type === "MATERIAL")} allowClear onChange={async (e) => {
        if (e) {
          let res = await $.get("/material/file/imgs", {file_uuid: e});
          setImgList(res)
        } else {
          setImgList([])
        }
      }} />
      <CreatImgs/>
    </div>
  };

  const CreatImgs = () => {
    [all, setAll] = useState(false);
    [imgParam, setImgParam] = useState([])
    
    return <div>
      <Checkbox className="ml_16 mt_10" onChange={(e) => {
        setAll(e.target.checked)
      }} >全选所有</Checkbox>
      <div className='dis_f f_wrap pv_15' style={{marginLeft: '-30px'}} >
        {imgList.map((item) => {
          return <div className='mh_10 pst_rel' style={{width: 120, height: 120}} >
            <Img width={120} height={120} src={item} />
            <Checkbox className="pst_abs" style={{top: 0, right: 0}} checked={all ? all : imgParam.indexOf(item) >= 0} onChange={(e) => {
              if (e.target.checked && imgParam.indexOf(item) < 0) {
                imgParam.push(item)
                setImgParam([...imgParam])
              } else {
                imgParam.splice(item, 1)
                setImgParam([...imgParam])
              }
            }} />
          </div>
        })}
      </div>
    </div>
  };

	return (
    <Card title={Parent?.state?.title} bordered={false} >
      <Form
        className="mb_70"
        {...col}
        onSubmit={async (values, btn, ext) => {
          if (imgParam.length === 0 && !all) {
            $.warning('请选择文件！');
            return
          }
          let param = {
            file_uuid: $.getQueryString('file_uuid'),
            lesson_material: all ? imgList.toString() : imgParam.toString()
          };
          let rs = await $.post("/course/lesson/material/add", param);
          Parent.close(true)
        }}
      >
        {({set, form, submit, setByName, getByName}) => (
          <div>
            <CreatSelect form={form} getByName={getByName} />
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
