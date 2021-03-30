import React, { useState, useEffect } from "react";
import { Form as Forms, Card, Icon, Divider, Popconfirm } from "antd";
import { $, Img, Form, FixedBox, Btn, Inputs, Popconfirms, Uploadfile, BreadcrumbBar, Page, } from "../comlibs";
import reqwest from "reqwest"
import Photo from "./photo";

const col = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 }
};

export default function(props) {

  const Parent = props.Parent;

  const [infoData, setInfoData] = useState();
  const [tableList, setTableList] = useState([]);
  const [tableMap, setTableMap] = useState({});

  let { upload, file, setFile, fileList, uploadImg, pagePhoto }={}

  useEffect(()=>{getQuery()},[]);

  async function getQuery(){
    let res = await $.get('/material/catalogs', {product_uuid: $.getQueryString('product_uuid')});
    if (!res) return;
    let tempMap = {};
    let list  = [];
    res.forEach((item) => {
      if (item.file_type === 'MATERIAL') {
        return
      }
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
    setTableMap(tempMap)
    setTableList([...list]);
    if (!Parent) {
      res = await $.get('/material/file/detail', {file_uuid: $.getQueryString('file_uuid')});
      if (!res) return;
      setInfoData(res);
    }
  };

  const AddMedia = ({ form, set, getByName }) => {
    
    [file, setFile] = useState();

    useEffect(()=>{
      if (!Parent) {
        handleFor(infoData?.lesson_content)
      }
    },[]);

    let handleFor = (str) => {
      // if (str?.split(".").slice(-1) === 'mp4') {
      //   setVideo({url: str})
      // } else {
      //   setAudio({url: str})
      // }
    };

    return (
      <Forms.Item label="上传教材" labelCol= {{ span: 4 }} wrapperCol= {{ span: 16 }} required= {true}>
        {set(
          {name: 'file'},
          (valueSet) => (
            //valueSet 动态设置组件的value
            <div>
              {infoData?.imgs?.length > 0 ? <Popconfirm title='重新上传教材会删除之前的教材内容，并删除学员已记录的笔记内容' onConfirm={() => upload.open('添加文件')} okText="确定" cancelText="取消" >
                <Btn className='mr_15' >选择文件</Btn>
              </Popconfirm> :
              <Btn onClick={() => upload.open('添加文件')} className='mr_15' >选择文件</Btn>}
              <span className="fs_12" >支持一个PDF文件上传，不得超过200M。</span>
              <div className="dis_f box-ps" >
                {file && <a><Icon type="file" className="mr_10" />{file}</a>}
                <Uploadfile
                  zIndex={1200}
                  multiple={false}
                  ref={ref => upload = ref}
                  onSure={data => {
                    fileList = data;
                    // const formData = new FormData();
                    fileList.forEach(item => {
                      setFile(item.name)
                    });
                    // valueSet(fileList)
                  }}
                />
              </div>
            </div>
          )
        )}
      </Forms.Item>
    )
  };

  const CreatFormItem = ({form, setByName, getByName}) => {
    return <Forms.Item label="选择目录" >
      <Inputs form={form} name="parent_file_uuid" select={tableList} placeholder='请选择一级目录' className="mr_15" allowClear width={160} 
        onChange={() => setByName("file_uuid", "")}
        value={infoData?.parent_file_uuids && infoData?.parent_file_uuids[0]} />
      <Inputs form={form} name="file_uuid" type="select" allowClear width={160} placeholder='请选择二级目录'
        select={tableMap[getByName("parent_file_uuid") || infoData?.parent_file_uuids && infoData?.parent_file_uuids[0]]?.childrens?.filter((item) => item.file_type === "CATALOG") || []}
        value={infoData?.parent_file_uuids && infoData?.parent_file_uuids[1]} />
    </Forms.Item>
  };

  const Imgs = () => {
    return <Forms.Item label="内容预览" >
      <div className="dis_f f_wrap" >
        {infoData?.imgs?.map((item, index) => {
          return <div width={170} height={170} className="mr_10" key={index} >
            <Img width={170} height={170} src={item} onClick={e => pagePhoto.open("相册", { index, imgsList: infoData?.imgs, selectedImg: item })} />
            <div>
              <a onClick={async () => {
                if (index === 0) {
                  return
                }
                const tempimg = infoData?.imgs[index];
                infoData.imgs[index] = infoData?.imgs[index - 1];
                infoData.imgs[index - 1] = tempimg;
                const rs = await $.post("/material/file/update", {imgs: infoData.imgs.toString(), file_uuid: $.getQueryString('file_uuid')});
                getQuery()
              }} >上移</a>
              <Divider type="vertical" />
              <a onClick={async () => {
                if (index === infoData.imgs.length - 1) {
                  return
                }
                const tempimg = infoData?.imgs[index];
                infoData.imgs[index] = infoData?.imgs[index + 1];
                infoData.imgs[index + 1] = tempimg;
                const rs = await $.post("/material/file/update", {imgs: infoData.imgs.toString(), file_uuid: $.getQueryString('file_uuid')});
                getQuery()
              }} >下移</a>
              <Divider type="vertical" />
              <Popconfirms title="更换教材不会影响已记录的笔记内容。学员会查看到新的教材内容。" content="更换" onConfirm={async () => {
                uploadImg.open('更换文件', {imgUrl: item})
              }} />
              <Divider type="vertical" />
              <Popconfirms title="删除教材会影响当前正在观看的学员，并同时删除已经记录的笔记内容。" onConfirm={async () => {
                infoData.imgs.splice(index, 1)
                let res = await $.post('/material/file/update', {imgs: infoData.imgs.toString(), file_uuid: $.getQueryString('file_uuid')});
                getQuery()
              }} />
            </div>
          </div>
        })}
      </div>
      <Uploadfile
        zIndex={1200}
        multiple={false}
        ref={ref => uploadImg = ref}
        onSure={data => {
          const formData = new FormData();
          data.forEach(file => {
            formData.append('upload', file);
          });
          formData.append('file_uuid', $.getQueryString('file_uuid'));
          formData.append('origin_img', uploadImg?.state?.data?.imgUrl);
          formData.append('token', $.token());
          reqwest({
            url: $.getProxyIdentify + "/api/material/file/page/change",
            method: 'post',
            processData: false,
            data: formData,
            success: () => {
              getQuery();
              $.msg("操作成功");
            },
            error: () => {
            },
          });
        }}
      />
    </Forms.Item>
  };

  const Content = () => {
    return (
      <Form
        className="mb_70"
        {...col}
        onSubmit={async (values, btn, ext) => {
          if (!fileList && !infoData) {
            $.warning('请上传文件');
            return;
          }
          const formData = new FormData();
          fileList && fileList.forEach(file => {
            formData.append('upload', file);
          });
          values.product_uuid = $.getQueryString('product_uuid');
          values.parent_file_uuid = values.file_uuid || values.parent_file_uuid;
          values.token = localStorage.token;
          values.orgtype = 'ADMINPC';
          if (!Parent) values.file_uuid = $.getQueryString('file_uuid');
          for (let item in values) {
            formData.append(item, values[item]);
          };
          // formData.append('product_uuid', $.getQueryString('product_uuid'));
          // formData.append('parent_file_uuid', values.file_uuid || values.parent_file_uuid);
          // formData.append('token', localStorage.token);
          // formData.append('orgtype', 'ADMINPC');
          let api = Parent ? "/api/material/file/add" : '/api/material/file/update';
          reqwest({
            url: $.getProxyIdentify + api,
            method: 'post',
            processData: false,
            data: formData,
            success: () => {
              Parent ? Parent.close(true) : window.location.href = `/adminPc/TextbookInfo?product_uuid=${$.getQueryString('product_uuid')}`;
              btn.loading = false;  //关闭提交按钮loading加载状态
              $.msg("操作成功");
            },
            error: () => {
            },
          });
          
        }}
      >
        {({set, form, submit, setByName, getByName}) => (
          <div>
            <CreatFormItem form={form} setByName={setByName} getByName={getByName} />
            <Forms.Item label="教材名称" required={true} >
              <Inputs form={form} name="file_name" value={infoData?.file_name} required={true} width={340} />
            </Forms.Item>
            <Forms.Item label="排序" required={true} >
              <Inputs form={form} name="sort" width={340} type="inputNumber" placeholder="数字越小越靠前" value={infoData?.sort} required={true} />
            </Forms.Item>
            <Forms.Item label="试看" required={true} >
              <Inputs form={form} name="is_trial" value={infoData?.is_trial || "NO"} required={true} radios={[
                {text: '不可试看', value: 'NO'},
                {text: '可试看', value: 'YES'},
              ]} width={340} />
            </Forms.Item>
            <AddMedia form={form} set={set} getByName={getByName} />
            {infoData && <Imgs form={form} set={set} getByName={getByName} />}
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
    <div className="br_3 bg_white pall_15" style={{minHeight: 900}} >
      <BreadcrumbBar pathList={['/adminPc/textbook', `/adminPc/TextbookInfo?product_uuid=${$.getQueryString('product_uuid')}`, `${$.store().BCB_setBarPath}?product_uuid=${$.getQueryString('product_uuid')}&file_uuid=${$.getQueryString('file_uuid')}`]} />
      <Content/>
      <Page background="rgb(0,0,0,0.95)" full={true} ref={rs => (pagePhoto = rs)}>
				<Photo />
			</Page>
    </div>
	);
}
