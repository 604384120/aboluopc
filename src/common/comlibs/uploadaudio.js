import React from "react";
import { Progress, Upload, Button, Icon, message } from "antd";
import Method from "../method";
import Modals from "./modals";
const { Dragger } = Upload;

/*
 * uploadaudio组件
 */
export default class uploadaudio extends React.PureComponent {
	constructor(props) {
		super();
		this.$ = new Method(props);
		this.prefix = props.prefix || "upload/audio/";
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
		let data = await this.$.get("/oss/token", { file_type: "audio" });
		let ossToken = data.token;
		file._name = `${this.$.guid()}.${file.name.split(".")[1]}`;
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
			const isLt2M = file.size / 1024 / 1024 < 100;
			const isM4A = file.type === "audio/x-m4a";
			const isMP3 = file.type === "audio/mp3" || "audio/mpeg";

			if (!isM4A && !isMP3) {
				message.error("目前只支持MP3或M4A格式音频上传哦!");
				reject();
			}
			if (!isLt2M) {
				message.error("目前最大只支持100M的音频上传哦!");
				reject();
			}
			await this.oss(file);
			resolve();
		});
	}

	open() {
		this.init();
		this.mod.status({
			title: "音频上传",
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
			accept: "audio/x-m4a, audio/mp3, audio/mpeg",
			multiple: multiple === false ? false : true,
			listType: "picture",
			className: "upload-list-inline",
			action: certificate.url,
			data: certificate.data,
			beforeUpload: this.beforeUpload,
			onRemove: () => {
				this.fileCount--;
			},
			onChange: ({ fileList }) => {
				fileList.forEach(async (v, k) => {
					let fileStatus = false;
					let src = `${certificate.url}/${this.prefix + v._name}`;
					if (this.trding.indexOf(src) > -1) {
						fileStatus = true;
					}
					if (v.status === "done" && !fileStatus) {
						this.trding.push(src);
						fileList[k].thumbUrl = "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/static/audio.jpg";
						let buffer = await this.$.audioBuf(src);
						let duration = parseInt(buffer.duration);
						this.state.list.push({
							name: v.name,
							url: src,
							duration,
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
					<p className="ant-upload-text">单击或拖动音频文件到此区域上传</p>
					<p className="ant-upload-hint">
						{multiple === false
							? "当前操作只需上传一个音频文件哦~"
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
