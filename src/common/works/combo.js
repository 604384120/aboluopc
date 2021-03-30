import React, { useState } from "react";
import { List, Empty, Avatar } from "antd";
import { $ } from "../method";
import { FixedBox } from "../../pages/comlibs";
import Form from "../comlibs/createForm";
import Btn from "../comlibs/btnloading";
import Inputs from "../comlibs/inputs";
import TablePagination from "../comlibs/tablePagination";

export default function (props) {
  let { Parent } = props;
  let { type, value = [], max, onSure } = Parent.data;
  let { tab, list, setList } = {};

  let columns = [
    {
			title: "课程名称",
			dataIndex: "product_name",
			width: 400
		}
  ];

  let Sure = (data) => {
    Parent.close(data);
    onSure && onSure(data);
  };

  let Sel = () => {
    [list, setList] = useState([]);
    let height = 460;
    let width = 270;

    if (max === 1 && list.length >= 1 && tab.sureType === "selectRow") {
      Sure(list[list.length - 1]);
    }

    return (
      <div className="box box-ver">
        <div style={{ height: 46 }} className="box box-pc box-ver bb_1 bg_gray">
          已选{list.length}个课程
        </div>
        <div style={{ height, width }} className="box box-ver bb_1 bl_1">
          {list.length > 0 ? (
            <List
              style={{ height, width }}
              className="choiceCourseList CUSTOM_scroll oy_a pl_20"
              itemLayout="horizontal"
              dataSource={list}
              renderItem={(item) => {
                return <List.Item
                actions={[
                  <span
                    onClick={() => tab.delSelection(item.product_uuid || item.uuid)}
                    className="link"
                    key="0"
                  >
                    删除
                  </span>,
                ]}
              >
                <List.Item.Meta
                  // avatar={<Avatar src={item.avatar} />}
                  title={item.product_name}
                  // description={item.courselabel_title || "暂无联系方式"}
                />
              </List.Item>
              }}
            />
          ) : (
            <Empty className="mt_30" />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className='' >
      <Form
        onSubmit={(values) => {
          tab.search(values);
        }}
      >
        {({ form }) => (
          <div className="bg_white ph_15 pv_15 mt_15">
            <div className="mb_10">
              <div className="dis_ib mr_10">
                {/* <Inputs
                  width={120}
                  className="mr_10"
                  name="user_kind"
                  placeholder="全部权限"
                  form={form}
                  value={type}
                  select={userkindlist}
                  autoSubmit={true}
                  disabled={type ? true : false}
                />
                <Inputs
                  width={120}
                  className="mr_10"
                  name="fulltime"
                  placeholder="全部岗位"
                  form={form}
                  select={fulltimelist}
                  autoSubmit={true}
                />
                <Inputs
                  width={120}
                  className="mr_10"
                  name="wxuser"
                  placeholder="绑定微信"
                  form={form}
                  select={wxuserlist}
                  autoSubmit={true}
                /> */}
                <Inputs
                  name="product_name"
                  placeholder="请输入课程名称"
                  style={{ width: 150 }}
                  form={form}
                />
              </div>
              <Btn htmlType="submit" iconfont="sousuo">
                搜索
              </Btn>
            </div>
          </div>
        )}
      </Form>
      <div className="box">
        <div className="box-1">
          <TablePagination
            className="CUSTOM_choiceScroll nPointer"
            api="/product/course/query"
            params={{
              // status: "INSERVICE",
              // limit: 1000,
              // totalnum: "NO",
              // user_kind: type || "",
            }}
            columns={columns}
            keyName="product_uuid"
            rowSelection={true}
            setSelection={value}
            onRow={true}
            rowType={max === 1 ? "radio" : "checkbox"}
            onSelection={(keys) => {
              setList && setList(Object.values(keys));
            }}
            scroll={{ y: 460, x: "max-content" }}
            ref={(ref) => (tab = ref)}
          />
        </div>
        <Sel />
      </div>
      <FixedBox className="ta_l">
        <Btn style={{ background: "#ccc" }} onClick={() => Parent.close()}>
          取消
        </Btn>
        <Btn
          className="fl_r ml_15"
          onClick={() => {
            if (max === 1) {
              Sure(list[0] || {});
            } else {
              Sure(list);
            }
          }}
        />
      </FixedBox>
    </div>
  );
}
