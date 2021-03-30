import React from "react";
import { Progress, Upload, Button, Icon, message } from "antd";
import Method from "../method";
import Modals from "./modals";

const { Dragger } = Upload;

/*
 * uploadFile组件
 */
export default class uploadimgs extends React.PureComponent {
	constructor(props) {
		super();
		this.$ = new Method();
		this.fileCount = 0;
		this.init = this.init.bind(this);
		this.open = this.open.bind(this);
		this.beforeUpload = this.beforeUpload.bind(this);
		this.state = {
			count: 0,
			fileList: [],
			data: {}
		};
	}

	beforeUpload(file) {
		// this.setState(state => ({
		// 	fileList: [...state.fileList, file],
		// }));
		this.sure([...this.state.fileList, file])
		return false
	}

	open(title, data) {
		this.init(data);
		this.mod.status({
			title: title
		});
		this.setState({
			data: {...data}
		});
	}

	sure(data) {
		let { fileList } = this.state;
		this.props.onSure(data || fileList);
		this.init();
		this.mod.status({
			show: false
		});
	}

	init() {
		this.fileCount = 0;
		this.setState({
			count: 0,
			fileList: [],
		});
	}

	render() {
		let { action, params = {}, multiple, zIndex } = this.props;
		let { count, fileList } = this.state;

		let _props = {
			name: "upload",
			multiple: multiple === false ? false : true,
			className: "upload-list-inline",
			beforeUpload: this.beforeUpload,
			// onRemove: () => {
			// 	this.fileCount--;
			// },
		};

		let going = this.fileCount - count;

		return (
			<Modals
				zIndex={zIndex}
				ref={rs => (this.mod = rs)}
				maskClosable={false}
				onCancel={() => this.init()}
			>
				<Dragger {..._props}>
					<p className="ant-upload-drag-icon">
						<Icon type="inbox" />
					</p>
					<p className="ant-upload-text">单击或拖动文件到此区域上传</p>
				</Dragger>
				<div className="ta_r mt_15">
					{this.fileCount > 0 && (
						<div className="dis_ib fs_12 pr_10 ta_l" style={{ width: 388 }}>
							共{this.fileCount}个
							<Progress
								percent={(count / this.fileCount) * 100}
								status="active"
								showInfo={false}
								style={{
									width: 290,
									margin: "0 10px"
								}}
							/>
							{going > 0 ? `剩${going}个` : `完成`}
						</div>
					)}
					<Button
						onClick={() => this.sure()}
						disabled={fileList.length !== this.fileCount || fileList.length === 0}
						type="primary"
						icon="check"
					>
						确 定
					</Button>
				</div>
			</Modals>
		);
	}
}
