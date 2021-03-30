/*
 * 公共登录窗口组件
 * 命名规则：驼峰命名
 */
import React from "react";
import { withRouter } from "react-router-dom";
import { Form as Forms, Icon, Modal, notification } from "antd";
import { Method, Inputs, Form, Btn, Img } from "../pages/comlibs";
import "./style/login";

class Login extends React.PureComponent {
	constructor(props) {
		super();
		this.$ = new Method(props);
		this.vistor_uuid = "";
		this.loginSuccess = this.loginSuccess.bind(this);
		this.state = {
			modalVisible: false
		};
	}

	open() {
		this.$.store("LG_open", () => {
			let { collapsed = "", version = "", update = "" } = localStorage;
			localStorage.clear();
			localStorage.collapsed = collapsed;
			localStorage.version = version;
			localStorage.update = update;
			this.setModalVisible(true);
		});
	}

	setModalVisible(modalVisible) {
		this.setState({ modalVisible });
	}

	async loginSuccess(post, { btn }) {
		let $ = this.$;
		localStorage.token = post.token || "";
		localStorage.uuid = post.oper_uuid || "";
		this.setModalVisible(false);
		if (post.status === "failure") {
			notification.open({
				message: <font color="#ed4343">帐号提醒</font>,
				description: <font color="#ed4343">{post.message}</font>,
				icon: <Icon type="frown" style={{ color: "#ed4343" }} />,
				duration: 10
			});
		} else {
			notification.open({
				message: "帐号提醒",
				description: "登录成功！请记好您的帐号和密码哦~",
				icon: <Icon type="smile" style={{ color: "#108ee9" }} />,
				duration: 3
			});
		}
		let store = $.store();
		let history = this.props.history;
		let location = history.location;
		btn.loading = false;
		if (location.pathname.split("/").length < 3) {
			location.pathname = store.GlobalIndexPage;
		}
		await store.SMT_getUserData();
		history.push(location);
	}

	render() {
		this.open();
		return (
			<Modal
				className="loginModal"
				centered
				closable={false}
				keyboard={false}
				maskClosable={false}
				visible={this.state.modalVisible}
				footer={null}
				width={740}
				bodyStyle={{ padding: 0 }}
				style={{ borderRadius: 10, overflow: "hidden" }}
			>
				{this.state.modalVisible && (
					<Form
						action="/oper/login"
						method="POST"
						className="login-form"
						style={{ marginBottom: "10px" }}
						success={this.loginSuccess}
					>
						{({ form, submit }) => (
							<div className="box box-rev">
								<div className="box">
									<Img
										style={{ borderRadius: "10px 0px 0px 10px" }}
										width="330"
										src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/2ab8ab52-7288-11eb-a837-00163e04cc20.png"
									/>
								</div>
								<div className="box-1">
									<h2
										className="fs_20 fc_blue ta_c pt_15"
										style={{ fontWeight: 600, marginTop: 40 }}
									>
										欢迎登录
									</h2>
									<div style={{ width: 316, boxSizing: "content-box", paddingLeft: 60 }}>
										<Inputs
											className="input_wrap"
											form={form}
											name="username"
											item={true}
											required={true}
											placeholder="请输入帐号"
										/>
										<Inputs
											className="input_wrap"
											item={true}
											form={form}
											name="passwd"
											required={true}
											placeholder="请输入密码"
										/>
										<Forms.Item className="input_wrap" style={{ border: "none", marginTop: 35 }}>
											<Btn width="100%" size="large" onClick={e => submit(e)}>
												登 录
											</Btn>
										</Forms.Item>
									</div>
								</div>
							</div>
						)}
					</Form>
				)}
			</Modal>
		);
	}
}

export default withRouter(Login);
