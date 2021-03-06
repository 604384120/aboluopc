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
      <Forms.Item label="????????????" labelCol= {{ span: 4 }} wrapperCol= {{ span: 16 }} required= {true}>
        {set(
          {name: 'file'},
          (valueSet) => (
            //valueSet ?????????????????????value
            <div>
              {infoData?.imgs?.length > 0 ? <Popconfirm title='??????????????????????????????????????????????????????????????????????????????????????????' onConfirm={() => upload.open('????????????')} okText="??????" cancelText="??????" >
                <Btn className='mr_15' >????????????</Btn>
              </Popconfirm> :
              <Btn onClick={() => upload.open('????????????')} className='mr_15' >????????????</Btn>}
              <span className="fs_12" >????????????PDF???????????????????????????200M???</span>
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
    return <Forms.Item label="????????????" >
      <Inputs form={form} name="parent_file_uuid" select={tableList} placeholder='?????????????????????' className="mr_15" allowClear width={160} 
        onChange={() => setByName("file_uuid", "")}
        value={infoData?.parent_file_uuids && infoData?.parent_file_uuids[0]} />
      <Inputs form={form} name="file_uuid" type="select" allowClear width={160} placeholder='?????????????????????'
        select={tableMap[getByName("parent_file_uuid") || infoData?.parent_file_uuids && infoData?.parent_file_uuids[0]]?.childrens?.filter((item) => item.file_type === "CATALOG") || []}
        value={infoData?.parent_file_uuids && infoData?.parent_file_uuids[1]} />
    </Forms.Item>
  };

  const Imgs = () => {
    return <Forms.Item label="????????????" >
      <div className="dis_f f_wrap" >
        {infoData?.imgs?.map((item, index) => {
          return <div width={170} height={170} className="mr_10" key={index} >
            <Img width={170} height={170} src={item} onClick={e => pagePhoto.open("??????", { index, imgsList: infoData?.imgs, selectedImg: item })} />
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
              }} >??????</a>
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
              }} >??????</a>
              <Divider type="vertical" />
              <Popconfirms title="??????????????????????????????????????????????????????????????????????????????????????????" content="??????" onConfirm={async () => {
                uploadImg.open('????????????', {imgUrl: item})
              }} />
              <Divider type="vertical" />
              <Popconfirms title="????????????????????????????????????????????????????????????????????????????????????????????????" onConfirm={async () => {
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
              $.msg("????????????");
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
            $.warning('???????????????');
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
              btn.loading = false;  //??????????????????loading????????????
              $.msg("????????????");
            },
            error: () => {
            },
          });
          
        }}
      >
        {({set, form, submit, setByName, getByName}) => (
          <div>
            <CreatFormItem form={form} setByName={setByName} getByName={getByName} />
            <Forms.Item label="????????????" required={true} >
              <Inputs form={form} name="file_name" value={infoData?.file_name} required={true} width={340} />
            </Forms.Item>
            <Forms.Item label="??????" required={true} >
              <Inputs form={form} name="sort" width={340} type="inputNumber" placeholder="?????????????????????" value={infoData?.sort} required={true} />
            </Forms.Item>
            <Forms.Item label="??????" required={true} >
              <Inputs form={form} name="is_trial" value={infoData?.is_trial || "NO"} required={true} radios={[
                {text: '????????????', value: 'NO'},
                {text: '?????????', value: 'YES'},
              ]} width={340} />
            </Forms.Item>
            <AddMedia form={form} set={set} getByName={getByName} />
            {infoData && <Imgs form={form} set={set} getByName={getByName} />}
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
                  window.location.href = `/adminPc/TextbookInfo?product_uuid=${$.getQueryString('product_uuid')}`
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
    <div className="br_3 bg_white pall_15" style={{minHeight: 900}} >
      <BreadcrumbBar pathList={['/adminPc/textbook', `/adminPc/TextbookInfo?product_uuid=${$.getQueryString('product_uuid')}`, `${$.store().BCB_setBarPath}?product_uuid=${$.getQueryString('product_uuid')}&file_uuid=${$.getQueryString('file_uuid')}`]} />
      <Content/>
      <Page background="rgb(0,0,0,0.95)" full={true} ref={rs => (pagePhoto = rs)}>
				<Photo />
			</Page>
    </div>
	);
}
