import React from "react";
import { Breadcrumb } from "antd";
import Method from "../method";
// import { createBrowserHistory } from "history";

const routes = require(`../../config/routes_adminPc`);

/*
 * 面包屑组件
 */
export default class BreadcrumbBar extends React.PureComponent {
	constructor(props) {
		super();
		this.$ = new Method(props);
	}

	creatBreadcrumb () {
		let { pathList } = this.props;
		let routeList;
		let tempList = [];
		routes.forEach((route, index) => {
			routeList = [];
			if (route.component) {
				pathList.filter((node) => {
					if (node?.indexOf(route?.path) >= 0) {
						routeList.push(<Breadcrumb.Item>
							<a href={node|| 'javascript:;'} >{route.name}</a>
						</Breadcrumb.Item>);
						tempList.push(...routeList);
					}
				})
			} else {
				// routeList.push(<Breadcrumb.Item>
				// 	<a href={route.path || 'javascript:;'} >{route.name}</a>
				// </Breadcrumb.Item>)
				if (route.sublist.length > 0) {
					route.sublist.forEach((_route, num) => {
						pathList.filter((node) => {
							if (node?.indexOf(_route.path) >= 0) {
								routeList.push(<Breadcrumb.Item key={num}>
									<a href={node || 'javascript:;'} >{_route.name}</a>
								</Breadcrumb.Item>);
								tempList = routeList;
							}
						})
					})
				}
			}
		})
		return tempList
	}

	render() {
		let $ = this.$;
		let { pathName, pathUrl, pathList } = this.props;
		return <Breadcrumb style={{position: 'absolute', top: '70px', left: '218px'}} >
      <Breadcrumb.Item> </Breadcrumb.Item>
			{this.creatBreadcrumb()}
    </Breadcrumb>;
	}
}
