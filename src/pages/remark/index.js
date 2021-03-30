import React, { useState, useEffect } from "react";
import { Divider, Form as Forms, Table, Button } from "antd";
import { $, Form, Modals, Inputs, Btn, BreadcrumbBar, Popconfirms, Img } from "../comlibs";

export default function() {

  const Iconfont = $.icon();

  const col = {
    labelCol: { span: 3 },
    wrapperCol: { span: 20 }
  };

  const [tableList, setTableList] = useState();
  const [showUuids, setShowUuids] = useState([]);
  const [page, setPage] = useState();
  const [total, setTotal] = useState();

  useEffect(() => { getQuery() }, []);

  async function getQuery (params) {
    let res = await $.get('/comment/query', params);
    if (!res) return;
    let tempList = res.data.map((item, index) => {
      item._id = item._id + '_' + index;
      return item
    })
    setTableList(tempList);
    setPage(params?.page || page);
    setTotal(res.totalnum);
  };

  let columns = [
    {
      title: "姓名",
      dataIndex: "user_name",
      width: 220
    },
    {
      title: "评论时间",
      dataIndex: "time_create",
    },
    {
      title: "回复状态",
      dataIndex: "is_replied",
      render: (text) => {
        return <span>
          {text === 'YES' && '已回复'}
          {text === 'NO' && '未回复'}
        </span>
      }
    },
    {
      title: "评论状态",
      dataIndex: "selected",
      render: (text) => {
        return <span>
          {text === 'YES' && '精选'}
          {text === 'NO' && '未精选'}
        </span>
      }
    },
    {
      title: "操作",
      width: 280,
      align:'center',
      render: (text, record) => {
        return (<div>
          {record.selected === 'YES' ? <a className='link' onClick={async () => {
            let res = await $.post('/comment/select/cancel', {comment_uuid: record.comment_uuid});
            getQuery();
          }} >取消精选</a> :
          <a className='link' onClick={async () => {
            let res = await $.post('/comment/select', {comment_uuid: record.comment_uuid});
            getQuery();
          }} >精选</a>}
          <Divider type="vertical" />
          <Popconfirms title='确定删除？' onConfirm={async () => {
            let res = await $.post('/comment/remove', {comment_uuid: record.comment_uuid});
            getQuery();
          }} />
          <Divider type="vertical" />
          {showUuids.indexOf(record._id) >= 0 ? <span className="link" onClick={e => {
              showUuids.splice(record._id, 1);
              setShowUuids([...showUuids])
            }}
          >收起</span> :
          <span className="link" onClick={e => {
              setShowUuids([...showUuids, record._id])
            }}
          >展开</span>}
        </div>)
      }
    },
  ];

	return (
		<div className="br_3 bg_white pall_15">
      <BreadcrumbBar pathList={[$.store().BCB_setBarPath]} />
      <Table
        columns={columns}
        dataSource={tableList}
        rowKey={(record, index) => record._id}
        expandIcon={() => <span></span>}
        expandedRowKeys={showUuids}
        pagination={{
					hideOnSinglePage: false,
					current: page,
					defaultPageSize: 10,
					size: "middle",
					total: total,
          showTotal:total => `共${total} 条`,
          onChange: (page) => {
            getQuery({page: page})
          }
				}}
        expandedRowRender={record => {
          return <div className="dis_f f_wrap">
            <Form
              onSubmit={async (values, btn, ext) => {
                values.comment_uuid = record.comment_uuid;
                let rs = await $.post("/comment/reply", values);
                btn.loading = false;  //关闭提交按钮loading加载状态
                $.msg("操作成功");
                getQuery();
              }}
            >
          {({ form, submit }) => (
            <div>
              <div className="mb_15" >
                <p className="ta_l" >所属课节：{record?.file_name}</p>
                <p className="ta_l" >评论内容：{record?.comment}</p>
                <Forms.Item label="" >
                  <Inputs form={form} type='textArea' name="reply" style={{width: '100%', minWidth: '1000px', maxwidth: '1500px'}} required={true} placeholder="请输入您的回复内容" rows={5} />
                </Forms.Item>
                <div>最后回复人：{record.oper_name}</div>
              </div>
              <div>
                <Btn htmlType="submit">回复</Btn>
              </div>
            </div>
          )}
        </Form>
          </div>
        }}
      />
		</div>
	);
}
