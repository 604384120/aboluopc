import React, { useState } from "react";
import { List, Empty, Avatar, Modal } from "antd";
import { FixedBox, $ } from "../comlibs";
import Form from "../../common/comlibs/createForm";
import Btn from "../../common/comlibs/btnloading";
import Inputs from "../../common/comlibs/inputs";
import TablePagination from "../../common/comlibs/tablePagination";

export default function (props) {
  let { type, value, max, onSure } = props;
  let { tab, list, setList } = {};
  
  let columns = [
    {
			title: "用户昵称",
      dataIndex: "user_name",
      width: 200
    },
    {
			title: "手机号",
      dataIndex: "phone",
      width: 150
    },
    {
			title: "状态",
      width: 80,
      render: (rs) => {
        return rs.is_enable === "YES" ? "正常" : "禁用"
      }
    },
    {
			title: "来源渠道",
			dataIndex: "channel_title",
    },
    {
      title: "备注",
      dataIndex: "remark",
      width: 100
		}
  ];

  let Sure = (data) => {
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
      <div style={{paddingRight: "15px"}}>
        <div style={{ height: 46 }} className="box box-ac bb_1 bg_gray">
          <div className="box box-1" >已选{list.length}名学员</div>
          <div className="box link mr_15" onClick={() => {
            Modal.confirm({
              title: "提示",
              content: "确定清空吗?",
              onOk() {
                list = [];
                setList(list.concat([]));
                tab.delSelectionAll();
              },
            });
          }} >清空已选</div>
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
                    onClick={() => tab.delSelection(item.user_uuid || item.uuid)}
                    className="link"
                    key="0"
                  >
                    删除
                  </span>,
                ]}
              >
                <List.Item.Meta
                  // avatar={<Avatar src={item.avatar} />}
                  title={item.user_name}
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
    <div style={{position: "relative", overflow: "hidden"}} >
      <Form
        onSubmit={(values) => {
          tab.search(values);
        }}
      >
        {({ form }) => (
          <div className="bg_white ph_15 pv_15 mt_15">
            <div className="mb_10">
              <div className="dis_ib mr_10">
                <Inputs
                  name="name_or_phone"
                  placeholder="入用户昵称或手机号查询"
                  style={{ width: 250 }}
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
            style={{paddingLeft: "15px"}}
            className="CUSTOM_choiceScroll nPointer"
            api="/user/query"
            params={{
              // status: "INSERVICE",
              // limit: 1000,
              // totalnum: "NO",
              // user_kind: type || "",
            }}
            columns={columns}
            keyName="user_uuid"
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
      <div className="bs bg_white_90" style={{padding: "10px", display: "flex", justifyContent: "center", width: "100%", position: "relative", bottom: 0}}>
        <Btn width={100} style={{ background: "#ccc" }} onClick={() => {
          window.location.href = "/adminPc/provisioning"
        }}>
          取消
        </Btn>
        <Btn
          width={100}
          className="ml_15"
          onClick={() => {
            if (list.length == 0) {
              $.warning("请选择学员");
              return;
            }
            if (max === 1) {
              Sure(list[0] || {});
            } else {
              Sure(list);
            }
          }}
        >下一步</Btn>
      </div>
    </div>
  );
}
