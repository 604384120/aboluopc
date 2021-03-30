import React from "react";
import { Progress, Upload, Button, Icon, message } from "antd";
import Method from "../method";
import Modals from "./modals";
const { Dragger } = Upload;

/*
 * uploadvideo组件
 */
export default class uploadvideo extends React.PureComponent {
	constructor(props) {
		super();
		this.$ = new Method(props);
		this.prefix = props.prefix || "upload/video/";
		this.fileCount = 0;
		this.trding = [];
		this.init = this.init.bind(this);
		this.open = this.open.bind(this);
		this.beforeUpload = this.beforeUpload.bind(this);
		this.state = {
			count: 0,
			list: [],
			ossToken: { expire: 0 },
			certificate: {},
		};
	}

	async oss(file) {
		let data = await this.$.get("/oss/token", { file_type: "video" });
    let ossToken = data.token;
    let file_list = file.name.split(".");
		file._name = `${this.$.guid()}.${file_list[file_list.length - 1]}`;
		this.setState({
			ossToken,
			certificate: {
				url: ossToken.host,
				data: {
					key: this.prefix + file._name,
					policy: ossToken.policy,
					OSSAccessKeyId: ossToken.accessid,
					success_action_status: "200",
					signature: ossToken.signature,
				},
			},
		});
	}

	beforeUpload(file) {
		return new Promise(async (resolve, reject) => {
			const isLt500M = file.size / 1024 / 1024 < 500;
			//const isJPG = file.type === "image/jpeg";
			//const isPNG = file.type === "image/png";

			// if (!isJPG && !isPNG) {
			// 	message.error("目前只支持JPG或PNG图片上传哦!");
			// 	reject();
			// }
			// if (!isLt500M) {
			// 	message.error("目前最大只支持500M的视频上传哦!");
			// 	reject();
			// }
			await this.oss(file);
			resolve();
		});
	}

	open() {
		this.init();
		this.mod.status({
			title: "视频上传",
		});
	}

	sure(ary) {
		let { list } = this.state;
		this.props.onSure(ary || list);
		this.init();
		this.mod.status({
			show: false,
		});
	}

	init() {
		this.fileCount = 0;
		this.setState({
			count: 0,
			list: [],
		});
	}

	render() {
		let { multiple } = this.props;
		let { certificate, count, list } = this.state;

		let _props = {
			name: "file",
			accept: "video/mp4,video/mpeg4,video/avi,video/mpg,video/x-ms-wmv,video/quicktime",
			multiple: multiple === false ? false : true,
			listType: "picture",
			className: "upload-list-inline",
			action: certificate.url,
			data: certificate.data,
			beforeUpload: this.beforeUpload,
			showUploadList: {
				showPreviewIcon: false,
				showDownloadIcon: false,
			},
			onRemove: () => {
				this.fileCount--;
			},
			onChange: ({ fileList }) => {
				fileList.forEach(async (v, k) => {
					let fileStatus = false;
					let src = this.prefix + v._name;
					if (this.trding.indexOf(src) > -1) {
						fileStatus = true;
					}
					if (v.status === "done" && !fileStatus) {
						this.trding.push(src);
						let trd = await this.$.get("/oss/video/transcoding", {
							video_path: src,
							duration: 300,
						});
						fileList[k].url = trd.video_url;
						fileList[k].thumbUrl = trd.cover;
						this.state.list.push({
							name: v.name,
							url: trd.video_url,
							cover: trd.cover,
						});
						if (multiple === false) {
							this.sure(this.state.list);
						}
					}
					if (!v.status) {
						fileList.splice(k, 1);
					}
					this.setState({
						count: this.state.list.length,
						list: this.state.list,
					});
				});

				if (this.fileCount < fileList.length) {
					this.fileCount = fileList.length;
				}
			},
		};

		let going = this.fileCount - count;

		return (
			<Modals
				{...this.props}
				ref={(rs) => (this.mod = rs)}
				maskClosable={false}
				onCancel={() => this.init()}
			>
				<Dragger {..._props}>
					<p className="ant-upload-drag-icon">
						<Icon type="inbox" />
					</p>
					<p className="ant-upload-text">单击或拖动视频到此区域上传</p>
					<p className="ant-upload-hint">
						{multiple === false
							? "当前操作只需上传一个视频哦~"
							: "支持单个或批量上传，批量选择支持按住Shift或Ctrl+A进行操作"}
					</p>
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
									margin: "0 10px",
								}}
							/>
							{going > 0 ? `剩${going}个` : `完成`}
						</div>
					)}
					<Button
						onClick={() => this.sure()}
						disabled={list.length !== this.fileCount || list.length === 0}
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
