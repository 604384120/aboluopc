import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import { $, BreadcrumbBar } from "../comlibs";
import Class from "./Class";
import Textbook from "./Textbook";
import Akapela from "./Akapela";

const { TabPane } = Tabs;

export default function() {

  const [activeKey, setActiveKey] = useState('class');

	return (
		<div className="br_3 bg_white pall_15">
      <BreadcrumbBar pathList={[$.store().BCB_setBarPath]} />
      <Tabs activeKey={activeKey} onChange={(key) => setActiveKey(key)}>
        <TabPane tab="课程标签" key="class">
          {activeKey === 'class' && <Class/>}
        </TabPane>
        <TabPane tab="教材标签" key="textbook">
          {activeKey === 'textbook' && <Textbook/>}
        </TabPane>
        <TabPane tab="合辑标签" key="akapela">
          {activeKey === 'akapela' && <Akapela/>}
        </TabPane>
      </Tabs>
		</div>
	);
}
