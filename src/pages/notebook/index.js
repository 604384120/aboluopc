import React, { useState, useEffect } from "react";
import { Divider, Form as Forms, Table } from "antd";
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
    let res = await $.get('/study/notes', params);
    if (!res) return;
    let tempList = res.data.map((item, index) => {
      item._id = item._id + '_' + index;
      return item
    })
    setTableList(tempList);
    setPage(params?.page || page);
    setTotal(res.totalnum);
  };

  let TableBox = () => {
    let columns = [
      {
        title: "姓名",
        dataIndex: "user_name",
        width: 220,
      },
      {
        title: "笔记内容",
        dataIndex: "note",
        render: (text, record) => {
          return text?.note || ''
        }
      },
      {
        title: "创建时间",
        dataIndex: "time_create",
      },
      {
        title: "操作",
        width: 280,
        align:'center',
        render: (text, record) => {
          return (<div>
            {(!record?.notes?.is_mark || record?.notes?.is_mark === 'NO') ? <a className='link' onClick={async () => {
              let res = await $.post('/study/note/mark', {user_uuid: record.user_uuid, file_uuid: record.file_uuid, img: record.notes.img});
              getQuery();
            }} >标记</a> :
            <a className='link' onClick={async () => {
              let res = await $.post('/study/note/mark/cancel', {user_uuid: record.user_uuid, file_uuid: record.file_uuid, img: record.notes.img});
              getQuery();
            }} >取消标记</a>}
            <Divider type="vertical" />
            <Popconfirms title='确定删除学员的笔记内容吗？删除后不可恢复！' onConfirm={async () => {
              let res = await $.post('/study/note/remove', {user_uuid: record.user_uuid, file_uuid: record.file_uuid, img: record.notes.img});
              getQuery();
            }} />
            <Divider type="vertical" />
            {showUuids.indexOf(record._id) >= 0 ? <span className="link" onClick={e => {
                showUuids.splice(record._id, 1);
                setShowUuids([...showUuids])
              }}
            >收起</span> :
            <span className="link" onClick={e => {
              console.log(showUuids)
                setShowUuids([...showUuids, record._id])
              }}
            >展开</span>}
          </div>)
        }
      },
    ];

    return (
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
            <div>
              <Img width={120} height={120} src={record?.notes?.img} />
            </div>
            <div className='pl_15' >
              <span>{record?.notes?.note}</span>
            </div>
          </div>
        }}
      />
    );
  };

	return (
		<div className="br_3 bg_white pall_15">
      <BreadcrumbBar pathList={[$.store().BCB_setBarPath]} />
      <Form
        className='mb_18'
        onSubmit={async (values, btn, ext) => {
          getQuery(values);
        }}
      >
        {({set, form, submit, setByName, getByName}) => (
          <div>
            <Inputs placeholder="全部笔记" className="mr_15" form={form} name="is_mark" select={[
              {text: '标记', value: 'YES'},
              {text: '未标记', value: 'NO'}
            ]} width={220} autoSubmit={true} allowClear />
          </div>
        )}
      </Form>
      <TableBox/>
		</div>
	);
}
