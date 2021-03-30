import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import { $, BreadcrumbBar } from "../comlibs";
import Carousel from "./Carousel";
import Shortcut from "./Shortcut";
import CustomModule from "./CustomModule";
import System from "./System";
import CustomPage from "./CustomPage";

const { TabPane } = Tabs;

export default function() {
  const [tabsKey, setTabsKey] = useState('carousel');

	return (
		<div className="br_3 bg_white pall_15">
      <BreadcrumbBar pathList={[$.store().BCB_setBarPath]} />
      <Tabs defaultActiveKey="carousel" onChange={(key) => setTabsKey(key)}>
        <TabPane tab="轮播图" key="carousel">
          {tabsKey === 'carousel' && <Carousel/>}
        </TabPane>
        <TabPane tab="快捷入口" key="shortcut">
          {tabsKey === 'shortcut' && <Shortcut/>}
        </TabPane>
        <TabPane tab="自定义模块" key="customModule">
          {tabsKey === 'customModule' && <CustomModule/>}
        </TabPane>
        <TabPane tab="系统页面" key="system">
          {tabsKey === 'system' && <System/>}
        </TabPane>
        <TabPane tab="自定义页面" key="customPage">
          <CustomPage/>
        </TabPane>
      </Tabs>
      {/* <a onClick={() => info.open('详情')} >详情</a>
      <Page ref={(rs) => info = rs} >
        <Info/>
      </Page> */}
		</div>
	);
}
