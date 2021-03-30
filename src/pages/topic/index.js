import React, { useState, useEffect } from "react";
import { Divider, Form as Forms, Button } from "antd";
import { $, Form, TablePagination, Modals, Inputs, Btn, BreadcrumbBar, Page, Popconfirms, Img } from "../comlibs";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import PracticeAdd from "../class/PracticeAdd";

export default function() {

  const col = {
    labelCol: { span: 3 },
    wrapperCol: { span: 20 }
  };

  // const [roleList, setRoleList] = useState();

  let { tableList, addPractice, avatar, setAva, sortModal, shareModal, deleteModal }={}

  useEffect(() => { getQuery() }, []);

  async function getQuery () {
  };

	let columns = [
    {
			title: "序号",
			dataIndex: "_key",
		},
		{
			title: "题目名称",
      dataIndex: "question_name",
      width: 700,
      render(text) {
        return <span style={{textOverflow: '-o-ellipsis-lastline', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}} >
            {text}
          </span>
      }
		},
		{
      title: "类型",
      dataIndex: "question_type",
      width: 220,
      render: (text) => {
        if (text === 'SINGLE_CHOICE') return '单选'
        if (text === 'MULT_CHOICE') return '多选'
        if (text === 'FILL_BLANK') return '填空'
        if (text === 'EXPOUND') return '简答'
      }
		},
		{
			title: "操作",
			align:'center',
			render: (text, record) => {
        return (<div>
          <a className='link' onClick={() => {
            record.question_type === 'SINGLE_CHOICE' && addPractice.open("编辑单选", {pageIndex: '题目大模块', ...record}, {width: 800});
            record.question_type === 'MULT_CHOICE' && addPractice.open("编辑多选", {pageIndex: '题目大模块', ...record}, {width: 800});
            record.question_type === 'FILL_BLANK' && addPractice.open("编辑填空", {pageIndex: '题目大模块', ...record}, {width: 800});
            record.question_type === 'EXPOUND' && addPractice.open("编辑简答", {pageIndex: '题目大模块', ...record}, {width: 800});
          }} >编辑</a>
          <Divider type="vertical" />
          <Popconfirms title="确定删除吗？" content="删除" onConfirm={async () => {
            let res = await $.post('/question/remove', {question_uuid: record.question_uuid});
            tableList.reload();
          }} />
        </div>)
      }
    }
  ];

	return (
		<div className="br_3 bg_white pall_15">
      <BreadcrumbBar pathList={[$.store().BCB_setBarPath]} />
      <Form
        onSubmit={async (values, btn, ext) => {
          tableList.search(values)
        }}
      >
        {({set, form, submit, setByName, getByName}) => (
          <div>
            <Inputs placeholder="输入题目名称搜索" className="mr_15" form={form} name="question_name" />
            <Btn htmlType="submit" iconfont="sousuo"> 搜索 </Btn>
            <div className='fl_r' >
              <Btn className="mr_15" onClick={() => addPractice.open("添加单选", {pageIndex: '题目大模块'}, {width: 800})} >添加单选</Btn>
              <Btn className="mr_15" onClick={() => addPractice.open("添加多选", {pageIndex: '题目大模块'}, {width: 800})} >添加多选</Btn>
              <Btn className="mr_15" onClick={() => addPractice.open("添加填空", {pageIndex: '题目大模块'}, {width: 800})} >添加填空</Btn>
              <Btn onClick={() => addPractice.open("添加简答", {pageIndex: '题目大模块'}, {width: 800})} >添加简答</Btn>
            </div>
          </div>
        )}
      </Form>
      <TablePagination className='mt_10' api="/question/query" columns={columns} ref={(rs) => tableList = rs} />
      <Page ref={(rs) => addPractice = rs} background='#ffffff' onClose={() => tableList.reload() }>
        <PracticeAdd/>
      </Page>
		</div>
	);
}
