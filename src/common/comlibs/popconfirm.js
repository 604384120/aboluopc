import React from "react";
import { Popconfirm, Icon } from "antd";
import Method from "../method";

/*
 * 气泡确认框组件
 */
export default class Popconfirms extends React.PureComponent {
	constructor(props) {
		super();
		this.$ = new Method();
		this.state = {};
	}

	render() {
		let { title, onConfirm, content } = this.props;

		return (
			<Popconfirm
        title={title}
        icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
        onConfirm={onConfirm}
      >
        <a href="#">{content || '删除'}</a>
      </Popconfirm>
		);
	}
}
