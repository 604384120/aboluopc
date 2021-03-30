import React, { useState, useEffect } from "react";
import { Form as Forms, Card } from "antd";
import { $, Form, Inputs, Btn, FixedBox, TablePagination } from "../comlibs";

export default function(props) {

  let Parent = props.Parent;

  // let [list, setList] = useState();

  let { tableList, value = [], onSure, tableKeys, tab } = {};

  // useEffect(() => { getInit() }, []);

  let Sure = async () => {
    let res = await $.post('/lesson/question/copy', {file_uuid: $.getQueryString('file_uuid'), question_uuids: tableKeys.toString()});
    Parent.close(true);
    onSure && onSure(tableList);
  };

  const columns = [
		{
      title: "题目名称",
      dataIndex: "question_name",
      width: 500,
		},
		{
      title: "类型",
      dataIndex: "question_type",
      align: 'center',
      render: (text) => {
        if (text === 'SINGLE_CHOICE') return '单选';
        if (text === 'MULT_CHOICE') return '多选';
        if (text === 'FILL_BLANK') return '填空';
        if (text === 'EXPOUND') return '简答';
      }
		}
  ];

	return (
    <Card title={Parent?.state?.title} bordered={false} className="pb_30" >
      <Form
        className="mb_10"
        onSubmit={(values, btn, ext) => {
          tab.search(values)
        }}
      >
        {({ form, submit }) => (
          <div>
            <Inputs form={form} name="question_name" placeholder="输入题目名称搜索" className="mr_10" />
            <Btn htmlType="submit" iconfont="sousuo"> 搜索 </Btn>
            <FixedBox className="ta_l">
              <Btn style={{ background: "#ccc" }} onClick={() => Parent.close()}> 取消 </Btn>
              <Btn className="fl_r ml_15" onClick={() => Sure()} />
            </FixedBox>
          </div>
        )}
      </Form>
      <TablePagination
        className="pb_100"
        api="/question/query"
        params={{
          totalnum: "NO",
        }}
        columns={columns}
        keyName="question_uuid"
        rowSelection={true}
        setSelection={value}
        // pagination='none'
        onRow={true}
        rowType="checkbox"
        onSelection={(keys) => {
          tableKeys = Object.keys(keys);
          tableList = Object.values(keys);
        }}
        ref={(ref) => (tab = ref)}
        scroll={{ y: 'auto', x: "auto" }}
      />
    </Card>
	);
}

