import React, { forwardRef } from "react";
import $$ from "jquery";
import { Button, Checks } from "react-ant-comlibs";
import Method, { $ } from "../common/method";
import Img from "../common/comlibs/img";
import Inputs from "../common/comlibs/inputs";
import Upload from "../common/comlibs/upload";
import Uploadfile from "../common/comlibs/uploadfile";
import Uploadimgs from "../common/comlibs/uploadimgs";
import Modals from "../common/comlibs/modals";
import Form from "../common/comlibs/createForm";
import TableEdit from "../common/comlibs/tableEdit";
import TablePagination from "../common/comlibs/tablePagination";
import DrawerTop from "../common/comlibs/drawerTop";
import Page from "../common/comlibs/drawerRight";
import Unlimitedload from "../common/comlibs/unlimitedload";
import Unlimitedfalls from "../common/comlibs/unlimitedfalls";
import Dropdown from "../common/comlibs/dropdown";
import Uploadvideo from "../common/comlibs/uploadvideo";
import Uploadaudio from "../common/comlibs/uploadaudio";
import Voice from "../common/comlibs/voice";
import Video from "../common/comlibs/video";
import BreadcrumbBar from "../common/comlibs/breadcrumbBar";
import Popconfirms from "../common/comlibs/popconfirm";
import UploadfileImport from "../common/comlibs/uploadfileImport";

const Btn = forwardRef((props, ref) => <Button ref={ref} iconId={$.iconId} {...props} />);

class FixedBox extends React.PureComponent {
	constructor(props) {
		super();
		this.state = {
			width: 0,
		}
	}
	render() {
		let { children, left } = this.props;
		let { width } = this.state;
		return (
			<div
				className="bs bg_white_90 zidx_999 _on_drawerWidth"
				ref={e => {
					let node = $$(e).closest(".CUSTOM_detailslayer .ant-drawer-content-wrapper");
					this.setState({
						width: node.width()
					})
				}}
				style={{
					position: "fixed",
					right: 0,
					bottom: 0,
					width: this?.props?.width || width || $.drawerWidth(false) - 18,
				}}
			>
				<div className={left ? "box pall_10 box-as box-ps" : "box box-allc pall_10"}>{children}</div>
			</div>
		);
	}
}

export {
	Method,
	$,
	Img,
	Btn,
	Checks,
	Inputs,
	Upload,
	Uploadfile,
	Uploadimgs,
	Modals,
	Form,
	TableEdit,
	TablePagination,
	DrawerTop,
	Page,
	Unlimitedload,
	Unlimitedfalls,
	Dropdown,
	FixedBox,
	Uploadvideo,
	Uploadaudio,
	Voice,
	Video,
	BreadcrumbBar,
	Popconfirms,
	UploadfileImport
};
