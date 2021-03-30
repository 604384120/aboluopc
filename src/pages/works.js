import React from "react";
import { Method, Page } from "./comlibs";

import WorksData from "../common/works/data";
import Subject from "../common/works/subject";
import Address from "../common/works/address";
import Career from "../common/works/career";
import Edulevel from "../common/works/edulevel";
import BatchSelect from "../common/works/batch";
import Traininglevel from "../common/works/traininglevel";
import Combo from "../common/works/combo";
import ComboTextbook from "../common/works/comboTextbook";
import ComboAlbum from "../common/works/comboAlbum";

const $ = new Method();

class Page_Combo extends React.PureComponent {
	constructor(props) {
		super(props);
		this.Page = {};
		this.cfgs = props.configs || {};
	}
	open(title, data) {
		this.Page.open(title, data, this.cfgs);
	}
	// open(title, params, data) {
	// 	this.Page.open(title, params, data);
	// }
	render() {
		return (
			<Page {...this.props} ref={(ref) => (this.Page = ref)} background='#fff'>
				<Combo />
			</Page>
		);
	}
}

class Page_ComboTextbook extends React.PureComponent {
	constructor(props) {
		super(props);
		this.Page = {};
		this.cfgs = props.configs || {};
	}
	open(title, data) {
		this.Page.open(title, data, this.cfgs);
	}
	// open(title, params, data) {
	// 	this.Page.open(title, params, data);
	// }
	render() {
		return (
			<Page {...this.props} ref={(ref) => (this.Page = ref)} background='#fff'>
				<ComboTextbook />
			</Page>
		);
	}
}

class Page_ComboAlbum extends React.PureComponent {
	constructor(props) {
		super(props);
		this.Page = {};
		this.cfgs = props.configs || {};
	}
	open(title, data) {
		this.Page.open(title, data, this.cfgs);
	}
	// open(title, params, data) {
	// 	this.Page.open(title, params, data);
	// }
	render() {
		return (
			<Page {...this.props} ref={(ref) => (this.Page = ref)} background='#fff'>
				<ComboAlbum />
			</Page>
		);
	}
}

export { WorksData, Subject, Address, Career, BatchSelect, Edulevel, Traininglevel, Combo, Page_Combo, Page_ComboTextbook, Page_ComboAlbum };
