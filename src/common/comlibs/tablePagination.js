import React from "react";
import { Table } from "antd";
import Method from "../method";

/*
 * 表格列表分页组件
 */
const TablePagination_init_searchParams = {
	page: 1,
	limit: 10,
	totalnum: "YES"
};
export default class TablePagination extends React.PureComponent {
	constructor(props) {
		super();
		this.$ = new Method();
		this.onChange = this.onChange.bind(this);
		this.searchParams = { ...TablePagination_init_searchParams };
		this.selectedRowObjs = {};
		let selectedRowKeys = [];
		let keyName = props.keyName;
		if (props.params) {
			if(props.params.limit){
				this.searchParams.limit = props.params.limit;
			}
			if(props.params.page){
				this.searchParams.page = props.params.page;
			}
		}
		if (props.setSelection) {
			let selection = props.setSelection;
			!Array.isArray(selection) && (selection = [selection]);
			selection.forEach(o => {
				let key = o[keyName] || o.uuid;
				if (key) {
					this.selectedRowObjs[key] = o;
					selectedRowKeys.push(key);
				}
			});
		}
		this.state = {
			loading: true,
			selectedRowKeys,
			list: [],
			selectKey:{}
		};
	}

	componentDidMount() {
		let {first=true}=this.props
		first&&this.first(this.props.params);
	}

	componentDidUpdate(prevProps) {
		if (this.props.params) {
			if (JSON.stringify(this.props.params) !== JSON.stringify(prevProps.params)) {
				this.searchParams = { ...TablePagination_init_searchParams };
				this.first(this.props.params);
			}
		}
	}

	async list(params = {}, change) {
		if (change) {
			this.setState({
				loading: true,
				list: []
			});
		}
		let $ = this.$;
    let keyName = this.props.keyName;
    let listName = this.props.listName;
		let onlyGroup=this.props.onlyGroup
		let get = await $.get(this.api, params);
		let lists = [];
		if (!Array.isArray(get)) {
			let keys = Object.keys(get);
			let key = keys.filter(k => Array.isArray(get[k]));
			lists = get[listName || key[0]] || [];
		} else {
			lists = get;
		}
		get.list = lists.map((obj, i) => {
			if(onlyGroup){
				obj._only = onlyGroup.map(g=>obj[g]).join('|');
			}
			obj.key = keyName ? obj[keyName] : obj.uuid;
      obj._key = (params.page - 1) * params.limit + (i + 1);
      obj._index = i + 1;
			return obj;
		});
		this.setState({
			loading: false,
			list: get.list,
			total: get.totalnum || get.list.length
		});
	}

	onChange(e,filters,sorter) {
		let {onSorter, onPageChange}=this.props
		this.searchParams.page = e.current;
		this.searchParams.limit = e.pageSize;
		let params=this.searchParams
		if(onSorter){
			let sort=onSorter(sorter)
			params=Object.assign(params,sort)
		}
    this.list(params, true);
    onPageChange && onPageChange(params);
	}

	first(params) {
		this.searchParams.page = 1;
		this.searchParams = Object.assign({}, this.searchParams, params);
		this.list(this.searchParams);
	}

	search(params) {
		let propsParams = this.props.params;
		if (JSON.stringify(params) === "{}") {
			this.searchParams = { ...TablePagination_init_searchParams };
			if (propsParams && propsParams.limit) {
				this.searchParams.limit = propsParams.limit;
			}
		}
		if (propsParams) {
			this.searchParams = Object.assign({}, propsParams, this.searchParams);
		}
		this.first(params);
	}

	reload() {
		this.search({
			page: this.searchParams.page
		});
	}

	init() {
		this.search({});
	}

	selectRow(record) {
		let selectedRowKeys = [...this.state.selectedRowKeys];
		if(this.props.rowType==='radio'){
			selectedRowKeys=[record.key]
		}else{
			if (selectedRowKeys.indexOf(record.key) >= 0) {
				selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1);
			} else {
				selectedRowKeys.push(record.key);
			}
		}
		this.sureType = "selectRow";
		this.setState({ selectedRowKeys,selectKey:record });
	}

	selectRowAll(list=[]){
		let {keyName}=this.props
		let keys=list.filter(l=>l.is_end!=='YES').map(l=>l[keyName||'uuid'])
		this.sureType = "selectRow";
		this.setState({ selectedRowKeys:keys });
	}
	selectRowPage(){
		let {list}=this.state
		let {keyName}=this.props
		let keys=list.filter(l=>l.is_end!=='YES').map(l=>l[keyName||'uuid'])
		this.sureType = "selectRow";
		this.setState({ selectedRowKeys:keys});
	}

	delSelection(key) {
		const selectedRowKeys = [...this.state.selectedRowKeys];
		// const index = selectedRowKeys.indexOf(key);
		selectedRowKeys.forEach((item, index) => {
			if (key === item) {
				selectedRowKeys.splice(index, 1);
				this.setState({ selectedRowKeys });
			}
		})
	}
	delSelectionAll() {
		this.setState({ selectedRowKeys:[]});
	}

	render() {
		let {
			api,
			params = {},
			search,
			style={},
			className,
			columns: _columns,
			rowSelection,
			rowType = "checkbox",
			onSelection,
			getCheckboxProps,
			expandedRowRender,
			expandRowByClick,
			expandedRowKeys,
			expandIconColumnIndex,
			expandIcon,
			onRow = null,
			emptyText = null,
      scroll,
      pagination,
			onChange,
			childrenColumnName
    } = this.props;
		let { list, selectedRowKeys } = this.state;
		this.api = api;
		const columns = _columns.map((cols, index) => {
			if (index === 0) {
				!expandedRowRender && (cols.fixed = "left");
				cols.width = cols.width || 60;
				if (!cols.dataIndex && !cols.key) {
					cols.key = "_key";
				}
			}
			if (index === 1) {
				!expandedRowRender && (cols.fixed = "left");
				cols.width = cols.width || 200;
			}
			return cols;
		});

		this.$.scrollmove("ant-table-header-column", ".ant-table-body");

		this.$.store(search, params => {
			this.search(params);
		});

		let objs = {};
		let keyName = this.props.keyName;
		selectedRowKeys.forEach(s => {
			objs[s] = this.selectedRowObjs[s] || {};
			list.forEach(l => {
				let key = keyName ? l[keyName] : l.uuid;
				if (key === s) {
					objs[s] = l;
				}
			});
		});
		this.selectedRowObjs = objs;
		onSelection && onSelection(objs,this.state.selectKey);

		return (
			<Table
				loading={this.state.loading}
				className={className}
				childrenColumnName={childrenColumnName}
				style={style}
				dataSource={list}
				columns={columns}
        size="middle"
				pagination={pagination ? false : {
					hideOnSinglePage: params.totalnum === "NO",
					current: this.searchParams.page,
					defaultPageSize: this.searchParams.limit,
					size: "middle",
					total: this.state.total,
					showTotal:total => `共${total} 条`
				}}
				onRow={
					onRow === true
						? record => ({
								onClick: rs => {
									let disabled = false;
									if(getCheckboxProps){
										disabled = getCheckboxProps(record).disabled;
									}
									if(disabled){
										getCheckboxProps(record).disText&&this.$.warning(getCheckboxProps(record).disText)
									}
									!disabled && this.selectRow(record);
								},
						  })
						: onRow
				}
				rowSelection={
					rowSelection && {
						type: rowType,
						selectedRowKeys,
						onSelect: () => {
							this.sureType = "selectRow";
						},
						onChange: selectedRowKeys =>{
							this.setState({
								selectedRowKeys
							})
						},
						getCheckboxProps,
					}
				}
				locale={{
					emptyText
				}}
				// onChange={(e,filters,sorter) => {
        //   onChange(e,filters,sorter);
        //   this.onChange(e,filters,sorter)
        // }}
        onChange={this.onChange}
				scroll={scroll || { x: "max-content" }}
				expandRowByClick={expandRowByClick||false}
				expandedRowRender={expandedRowRender ? expandedRowRender: null}
				expandIconColumnIndex={0}
				// expandedRowKeys={expandedRowKeys?expandedRowKeys: undefined}
				expandIcon={expandIcon?expandIcon:null}
			/>
		);
	}
}
