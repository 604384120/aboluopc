import React, { useState } from "react";
import { Form as Forms, Card } from "antd";
import { $, TablePagination, Form, FixedBox, Btn } from "../comlibs";

export default function (props) {
  let { Parent } = props;
  let { type, value = [], tableList, onSure, tableKeys } = Parent.data;
  let { tab } = {};

  let [list, setList] = useState();

  let columns = [
    {
			title: "教材",
			dataIndex: "product_name",
			width: 400
		}
  ];

  let Sure = async () => {
    let res = await $.post('/product/course/add/material', {product_uuid: $.getQueryString('product_uuid'), material_uuids: tableKeys.toString()})
    Parent.close(tableList);
    onSure && onSure(tableList);
  };

  return (
    <Card title={Parent?.state?.title} bordered={false} >
      <TablePagination
        api="/product/material/query"
        params={{
          totalnum: "NO",
        }}
        columns={columns}
        keyName="product_uuid"
        rowSelection={true}
        setSelection={value}
        pagination={false}
        onRow={true}
        rowType="checkbox"
        onSelection={(keys) => {
          tableKeys = Object.keys(keys);
          tableList = Object.values(keys);
        }}
        ref={(ref) => (tab = ref)}
      />
      <FixedBox className="ta_l">
        <Btn style={{ background: "#ccc" }} onClick={() => Parent.close()}> 取消 </Btn>
        <Btn className="fl_r ml_15" onClick={() => Sure()} />
      </FixedBox>
      </Card>
  );
}
