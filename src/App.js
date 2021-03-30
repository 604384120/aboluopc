import { BrowserRouter as Router } from "react-router-dom";
import React from "react";
import { ConfigProvider, Layout } from "antd";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import Moment from "moment";
import {
	TopProgress,
	// MainTitleBar,
	SuspenseSwitchRoute,
	SiderMenuLeft,
	SiderMenuTop
} from "./common/base";
import Login from "./common/login";
import "moment/locale/zh-cn";
import "./App.css";

Moment.locale("zh-cn");

const { Content } = Layout;

class App extends React.PureComponent {
	constructor() {
		super();
		this.toggle = this.toggle.bind(this);
		this.state = {
			collapsed: localStorage.collapsed === "true" ? 1 : 0
		};
	}

	toggle() {
		localStorage.collapsed = !this.state.collapsed;
		this.setState({
			collapsed: !this.state.collapsed
		});
	}

	render() {
		return (
			<ConfigProvider locale={zh_CN}>
				<Router>
					<TopProgress store={this.store} />
					<Layout style={{ height: "100%" }}>
						<SiderMenuLeft store={this.store} collapsed={this.state.collapsed} />
						<Layout>
							<SiderMenuTop
								store={this.store}
								toggle={this.toggle}
                collapsed={this.state.collapsed}
							/>
							<Layout
								style={{
									padding: 0,
									marginTop: 60,
									marginLeft: !this.state.collapsed ? 200 : 80
								}}
							>
								{/* <MainTitleBar store={this.store} /> */}
								<Content
									style={{
										padding: '38px 24px 24px 24px',
										margin: "0 0 0 0",
										minHeight: "86vh",
										minWidth: "1192px"
									}}
								>
									<SuspenseSwitchRoute store={this.store} />
								</Content>
							</Layout>
						</Layout>
					</Layout>
					<Login store={this.store} />
				</Router>
			</ConfigProvider>
		);
	}
}

export default App;
