import React, { useState, useEffect } from "react";
import { Form as Forms, Card, Switch, List, Divider, Input } from "antd";
import { $, Img, Form, Page, Btn, Popconfirms, BreadcrumbBar, Voice } from "../comlibs";
import PracticeAdd from "./PracticeAdd";
import PracticeCopy from "./PracticeCopy";

export default function(props) {

  const [tableList, setTableList] = useState([]);
  const [infoData, setInfoData] = useState();

  let { copyPractice, addPractice }={}

  useEffect(() => { getQuery() }, []);

  async function getQuery(){
    let res = await $.get('/lesson/questions', {file_uuid: $.getQueryString('file_uuid')});
    if (!res) return;
    setTableList(res);
    res = await $.get('/course/lesson/detail', {file_uuid: $.getQueryString('file_uuid')});
    if (!res) return;
    setInfoData(res)
  };

  const getQuestion_type = (type) => {
    if (type === 'SINGLE_CHOICE') return '【单选】';
    if (type === 'MULT_CHOICE') return '【多选】';
    if (type === 'FILL_BLANK') return '【填空】';
    if (type === 'EXPOUND') return '【简答】';
  };

  const CreatList = () => {
    return <div>
      <List
        style={{marginTop: '-20px'}}
        // loading={initLoading}
        itemLayout="horizontal"
        // loadMore={loadMore}
        dataSource={tableList}
        renderItem={(item, index) => (
          <List.Item
            extra={<div style={{height: '100%', alignSelf: 'stretch'}}>
              <a key="list-loadmore-edit" onClick={() => {
                item.question_type === 'SINGLE_CHOICE' && addPractice.open("编辑单选", item, {width: 800});
                item.question_type === 'MULT_CHOICE' && addPractice.open("编辑多选", item, {width: 800});
                item.question_type === 'FILL_BLANK' && addPractice.open("编辑填空", item, {width: 800});
                item.question_type === 'EXPOUND' && addPractice.open("编辑简答", item, {width: 800});
              }} >编辑</a>
              <Divider type="vertical" />
              <Popconfirms title='确认删除？' onConfirm={async () => {
                let res = await $.post('/lesson/question/remove', {question_uuid: item.question_uuid});
                getQuery();
              }} />
              <Divider type="vertical" />
              <a key="list-loadmore-more" onClick={async () => {
                let res = await $.post('/lesson/question/up', {question_uuid: item.question_uuid});
                getQuery();
              }}>上移</a>
              <Divider type="vertical" />
              <a key="list-loadmore-more" onClick={async () => {
                let res = await $.post('/lesson/question/down', {question_uuid: item.question_uuid});
                getQuery();
              }}>下移</a>
            </div>}
          >
            <List.Item.Meta
              avatar={false}
              title={<span>{`${index + 1}.${getQuestion_type(item?.question_type)}${item.question_name} (${item.score || 0}分)`}</span>}
              description={<div className='pl_10' >
                <div className='mb_10' >{item?.question_audio && <Voice url={item.question_audio} />}</div>
                <div className='mb_10' >
                  {item?.question_imgs?.map((img, key) => {
                    return <Img key={key} width={120} height={70} src={img} className="dis_ib mr_10 mb_10" />
                  })}
                </div>
                {item?.question_answer?.map((_item, _index) => {
                  if (item.question_type === "FILL_BLANK") {
                    return <div key={_item.index + '_' + _index} className='mb_10' >
                      <Input disabled value={_item.default_answer} style={{width: 260}} />
                    </div>
                  }
                  if (item.question_type === "EXPOUND") {
                    return <div key={_item.index + '_' + _index} className='mb_10' >
                      {_item.default_answer}
                    </div>
                  }
                  return <div key={_item.index + '_' + _index} className={_item.default_answer && 'fc_suc'} >
                    {_item.index + '.'}
                    <span className='ml_10' >{_item.choice}</span>
                  </div>
                })}
              </div>}
            />
          </List.Item>
        )}
      />
    </div>
  };

	return (
    <div className="br_3 bg_white pall_15">
      <BreadcrumbBar pathList={['/adminPc/class', `/adminPc/ClassInfo?product_uuid=${$.getQueryString('product_uuid')}`, `${$.store().BCB_setBarPath}?product_uuid=${$.getQueryString('product_uuid')}`]} />
      <Card title={!$.getQueryString('type') && `所属课节：${infoData?.file_name}`} bordered={false} >
        {!$.getQueryString('type') && //  不是用户详情过来的才会有添加
        <div>
          <span className="fs_14 lh_36 mr_10" >答题后自动显示答案</span><Switch checked={infoData?.show_answer === 'YES'} className="mr_24" style={{marginTop: "-6px"}} onChange={async (e) => {
            let res = await $.post('/course/lesson/update', {file_uuid: $.getQueryString('file_uuid'), show_answer: e ? 'YES' : 'NO'});
            getQuery();
          }} />
          <Btn className="mr_15" onClick={() => copyPractice.open("复制题目", {}, {width: 800})} >从题库中复制</Btn>
          <Btn className="mr_15" onClick={() => addPractice.open("添加单选", {}, {width: 800})} >添加单选</Btn>
          <Btn className="mr_15" onClick={() => addPractice.open("添加多选", {}, {width: 800})} >添加多选</Btn>
          <Btn className="mr_15" onClick={() => addPractice.open("添加填空", {}, {width: 800})} >添加填空</Btn>
          <Btn onClick={() => addPractice.open("添加简答", {}, {width: 800})} >添加简答</Btn>
          <Divider style={{marginLeft: '-20px', width: 'calc(100% + 40px)'}} />
        </div>}
        <CreatList/>
      </Card>
      <Page ref={(rs) => copyPractice = rs} background='#ffffff' onClose={()=> getQuery() }>
        <PracticeCopy/>
      </Page>
      <Page ref={(rs) => addPractice = rs} background='#ffffff' onClose={()=> getQuery() }>
        <PracticeAdd/>
      </Page>
    </div>
	);
}
