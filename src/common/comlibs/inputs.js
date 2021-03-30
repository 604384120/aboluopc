import React, { useState } from "react";
import Moment from "moment";
import { Form as Forms, Input, Select, Radio, TimePicker, DatePicker, Button, Icon, Switch, InputNumber, Checkbox } from "antd";
import Method from "../method";
import Editor from "../plugins/editor";
import PickerMap from "../plugins/pickerMap";
import moment from 'moment';

const { TextArea } = Input;
const { Option } = Select;
const { RangePicker,MonthPicker,WeekPicker } = DatePicker;


/*
 * 表单输入框
 */
export default class Inputs extends React.PureComponent {
	constructor() {
		super();
		this.$ = new Method();
		this.save = this.save.bind(this);
		this.state = {
			loading: true,
			suffix: "",
			list: [],
		};
	}

	async save(e) {
		let props = this.props;
		let targetval = e.target.value || "";
		let { onChange, onSure, save, name, value, required, store } = props;
		let valuePro = typeof this.valuePro === "undefined" ? value || "" : this.valuePro;
		onChange && onChange(targetval);
		onSure && onSure(targetval);
		if (valuePro === targetval) {
			return false;
		}
		if (save) {
			let $ = this.$;
			if (required && !targetval) {
				$.warning(this.placeholder);
				return false;
			}
			$.loading();
			this.setState({
				suffix: <Icon type="loading" />,
			});
			let end = () =>
				this.setState({
					suffix: "",
				});
			await $[save.method || "post"](
				save.api,
				Object.assign({}, this.paramsReturn(name, targetval), save.params || {}),
				() => end()
			);
			this.valuePro = targetval;
			end();
			let Reload = store().Reload;
			Reload && Reload();
			$.msg("已保存");
		}
	}

	render() {
		let {
			form,
			save,
			name,
			type,
			value,
			required = false,
			placeholder = "",
			rows,
			radios,
			checkboxs,
			select,
			label,
			item,
			prefix,
			className,
			style = {},
      maxLength,
			width,
			showTime,
			// defaultValue,
			allowClear,
			showSearch,
			optionFilterProp,
			itemStyle = {},
			disable,
			disabled,
			renderExtraFooter,
			onChange,
			minuteStep,
      autoSubmit,
      defaultChecked = true,
      disabledDate,
			showToday = true,
			format,
			onPressEnter=null,
			labelCol: _labelCol,
			wrapperCol: _wrapperCol,
			mode,
      onFocus,
      min,
      max
		} = this.props;
		const { getFieldDecorator, labelCol, wrapperCol } = form;
		if (!placeholder && label) {
			placeholder = `请输入${label}`;
		}

		if (rows) {
			type = "textArea";
		}
		if (radios) {
			type = "radio";
		}
		if (select) {
			type = "select";
		}
		if (type === "timePicker") {
			placeholder = placeholder || "请设置时间";
			value && (value = Moment(value, format || "HH:mm"));
			getFieldDecorator(name + "_format", {
				initialValue: "HH:mm",
			});
		}
		if (type === "datePicker") {
			placeholder = placeholder || "请设置日期";
      value && (value = Moment(value, "YYYY-MM-DD"));
			getFieldDecorator(name + "_format", {
				initialValue: "YYYY-MM-DD",
			});
		}
		if (type === "dateTimePicker") {
			placeholder = placeholder || "请设置日期时间";
			value && (value = Moment(value, format || "YYYY-MM-DD HH:mm"));
			getFieldDecorator(name + "_format", {
				initialValue: "YYYY-MM-DD HH:mm",
			});
		}
		if (type === "rangePicker" && value) {
			value = [Moment(value[0], "YYYY-MM-DD"), Moment(value[1], "YYYY-MM-DD")];
		}
		if (type === "rangeTimePicker") {
			value &&
				(value = [
					Moment(value[0], "YYYY-MM-DD HH:mm:ss"),
					Moment(value[1], "YYYY-MM-DD HH:mm:ss"),
				]);
			getFieldDecorator(name + "_format", {
				initialValue: "YYYY-MM-DD HH:mm:ss",
			});
		}

		this.type = type;
		this.placeholder = placeholder;
		this.paramsReturn = (name, value) => {
			if (Array.isArray(name)) {
				let params = {};
				name.map((n, key) => {
					params[n] = value[key];
					return n;
				});
				return params;
			}
			return {
				[name]: value,
			};
		};
		let inputDom = () => {
			switch (type) {
				case "radio":
					if (disabled) {
						let text = "";
						for (let i in radios) {
							if (radios[i].value === value) {
								text = radios[i].text;
							}
						}
						return (
							<span>
								{text}
								<input type="hidden" />
							</span>
						);
					}
					return (
            <Radio.Group
							style={{
								width: width || 120,
								...style,
							}}
							disabled={disable}
							// defaultValue={value}
              onChange={(e, val) => {
							// this.save.bind(this);
							this.save({
								target: {
									value: e.target.value,
								},
							});
              if (autoSubmit && form._handleSubmit) {
                let _set = setTimeout(() => {
                  form._handleSubmit({});
                  clearTimeout(_set);
                }, 50);
              }
              onChange && onChange(e.target.value)
            }}>
							{radios.map((v, k) => (
								<Radio style={style} key={k} value={v.value} disabled={v.disable}>
									{v.text}
								</Radio>
							))}
						</Radio.Group>
					);
				case "checkbox":
					if (disabled) {
						let text = "";
						for (let i in checkboxs) {
							if (checkboxs[i].value === value) {
								text = checkboxs[i].text;
							}
						}
						return (
							<span>
								{text}
								<input type="hidden" />
							</span>
						);
					}
					return (
						<Checkbox.Group
							onChange={(e) => {
								this.save({
									target: {
										value: e,
									},
								});
								if (autoSubmit && form._handleSubmit) {
									let _set = setTimeout(() => {
										form._handleSubmit({});
										clearTimeout(_set);
									}, 50);
								}
							}}
						>
							{checkboxs.map((v, k) => (
								<Checkbox style={style} key={k} value={v.value} disabled={v.disable} >
									{v.text}
								</Checkbox>
							))}
						</Checkbox.Group>
					);
				case "select":
					if (disabled) {
						let text = "";
						for (let i in select) {
							if (select[i].value === value) {
								text = select[i].text;
							}
						}
						return (
							<span>
								{text}
								<input type="hidden" />
							</span>
						);
					}
					return (
						<Select
							style={{
								width: width || 120,
								...style,
							}}
							mode={mode}
							placeholder={placeholder}
							disabled={disable}
							showSearch={showSearch}
							optionFilterProp={optionFilterProp}
							onChange={(e, val) => {
								this.save({
									target: {
										value: e,
									},
								});
								if (autoSubmit && form._handleSubmit) {
									let _set = setTimeout(() => {
										form._handleSubmit({});
										clearTimeout(_set);
									}, 50);
                }
                onChange && onChange(e, val)
							}}
							allowClear={allowClear}
						>
							{select.map((v, k) => (
								<Option key={k} value={v.value}>
									{v.text}
								</Option>
							))}
						</Select>
					);
				case "textArea":
					if (disabled) {
						return (
							<span>
								{value}
								<input type="hidden" />
							</span>
						);
					}
					if (value && !this._textAreaVal) {
						this._textAreaVal = value;
					}
					return (
						<span>
							<TextArea
								defaultValue={value}
								style={style}
								placeholder={placeholder}
								autoSize={{ minRows: rows ,maxRows:rows}}
								maxLength={maxLength}
								onBlur={this.save.bind(this)}
								suffix={this.state.suffix}
								onChange={(e) => {
									if (e.target) {
										let value = e.target.value;
										this._textAreaVal = value;
										onChange && onChange(value);
									}
								}}
							/>
							{/* {maxLength && (
								<div className="ta_r">
									字数: {(this._textAreaVal && this._textAreaVal.length) || 0} / {maxLength}
								</div>
							)} */}
						</span>
					);
				case "editable":
					return (
						<span>
							<input type="hidden" />
							<div
								style={style}
								className="contentEditable"
								contentEditable={true}
								placeholder={placeholder}
								onInput={(e) => {
									form.setFieldsValue({
										[name]: e.target.innerHTML,
									});
								}}
								onBlur={(e) =>
									this.save({
										target: {
											value: e.target.innerHTML,
										},
									})
								}
								disabled={disabled}
							/>
						</span>
					);
				case "editor":
					return (
						<div>
							<Editor
								value={value}
								placeholder={placeholder}
								disabled={disabled}
								onChange={(data) => {
									form.setFieldsValue({
										[name]: data,
									});
								}}
							/>
							{save && (
								<Button
									className="tb_c mt_15"
									type="primary"
									onClick={this.save.bind(this, {
										target: {
											value: form.getFieldsValue([name])[name],
										},
									})}
									icon="save"
									loading={this.state.suffix ? true : false}
									disabled={disabled}
								>
									保 存
								</Button>
							)}
						</div>
					);
				case "password":
					return <Input.Password style={style} placeholder={placeholder} disabled={disabled} />;
				case "datePicker":
					return (
						<DatePicker
              style={{
                width: width || 230,
                ...style,
              }}
							format={format || "YYYY-MM-DD"}
							placeholder={placeholder}
							suffixIcon={this.state.suffix}
							disabled={disabled}
              // onChange={onChange}
              onChange={(e,val)=>{
								if (autoSubmit && form._handleSubmit) {
									let _set = setTimeout(() => {
										form._handleSubmit({});
										clearTimeout(_set);
									}, 50);
								}
								onChange&&onChange(e,val)
							}}
              disabledDate={disabledDate}
							allowClear={allowClear}
						/>
					);
				case "timePicker":
					return (
						<TimePicker
              style={style}
							format="HH:mm"
							onFocus={onFocus}
							minuteStep={minuteStep}
							placeholder={placeholder}
							suffixIcon={this.state.suffix}
							disabled={disabled}
							allowClear={allowClear}
							onChange={(e,val)=>{
								if (autoSubmit && form._handleSubmit) {
									let _set = setTimeout(() => {
										form._handleSubmit({});
										clearTimeout(_set);
									}, 50);
								}
								onChange&&onChange(e,val)
							}}
							minuteStep={minuteStep}
						/>
					);
				case "dateTimePicker":
					return (
						<DatePicker
            style={{
              width: width || 230,
              ...style,
            }}
							format={format || "YYYY-MM-DD HH:mm:ss"}
							renderExtraFooter={renderExtraFooter}
							showTime={
								showTime || {
									defaultValue: Moment("00:00:00", "HH:mm:ss"),
								}
							}
							showToday={showToday}
							placeholder={placeholder}
							suffixIcon={this.state.suffix}
							disabled={disabled}
							onChange={(dates, dateStrings) => {
								this.save({
									target: {
										value: dateStrings,
									},
								});
								this.DatePickerValue = dateStrings;
                onChange && onChange(dateStrings);
                if (autoSubmit && form._handleSubmit) {
                  let _set = setTimeout(() => {
                    form._handleSubmit({});
                    clearTimeout(_set);
                  }, 50);
                }
							}}
							onOk={this.save.bind(this, {
								target: {
									value: this.DatePickerValue,
								},
							})}
						/>
					);
				case "rangePicker":
					return (
						<RangePicker
							style={{
								width: width || 230,
								...style,
							}}
							placeholder={placeholder}
							suffixIcon={this.state.suffix}
							mode={mode||['date','date']}
							showTime={showTime}
							format={format}
							allowClear={allowClear}
							onChange={(dates, dateStrings) => {
								this.RangePickerValue = dateStrings;
                onChange && onChange(dateStrings,dates);
                if (autoSubmit && form._handleSubmit) {
                  let _set = setTimeout(() => {
                    form._handleSubmit({});
                    clearTimeout(_set);
                  }, 50);
                }
							}}
							onOk={this.save.bind(this, {
								target: {
									value: this.RangePickerValue,
								},
							})}
							disabledDate={disabledDate}
							disabled={disabled}
						/>
					);
				case "monthPicker":
					return (
						<MonthPicker onChange={(dates, dateStrings) => {
							if (autoSubmit && form._handleSubmit) {
								let _set = setTimeout(() => {
									form._handleSubmit({});
									clearTimeout(_set);
								}, 50);
							}
							onChange && onChange(dateStrings,dates);
						}} placeholder={placeholder} initialValue={value} allowClear={allowClear}/>
					);
				case "weekPicker":
					return (
						<WeekPicker onChange={(date, dateStrings) => {
							if (autoSubmit && form._handleSubmit) {
								let _set = setTimeout(() => {
									form._handleSubmit({});
									clearTimeout(_set);
								}, 50);
							}
							onChange && onChange(date,dateStrings);
						}} 
						format={format||"YYYY-MM-DD"}
						placeholder={placeholder} initialValue={value} allowClear={allowClear}/>
					);
				case "rangeTimePicker":
					return (
						<RangePicker
							style={{
								width: width || 320,
								...style,
							}}
							placeholder={placeholder}
							suffixIcon={this.state.suffix}
							format="YYYY-MM-DD HH:mm:ss"
							showTime={{
								defaultValue: [Moment("00:00:00", "HH:mm:ss"), Moment("23:59:59", "HH:mm:ss")],
							}}
							onChange={(dates, dateStrings) => {
								this.RangePickerValue = dateStrings;
								onChange && onChange(dateStrings);
							}}
							onOk={this.save.bind(this, {
								target: {
									value: this.RangePickerValue,
								},
							})}
							disabled={disabled}
						/>
					);
				case "address":
					return (
						<PickerMap
							center={value[1]}
							placeholder={placeholder}
							disabled={disabled}
							onOk={(value) => {
								this.save({
									target: {
										value: [value.data.address, value.data.location],
									},
								});
							}}
						/>
          );
          case "inputNumber":
						if (disabled) {
							return (
								<span>
									{value}
									<input type="hidden" />
								</span>
							);
						}
						if (value && !this._textAreaVal) {
							this._textAreaVal = value;
						}
					return (
            <InputNumber
              type="text"
              style={{
                width: width || 190,
                ...style,
              }}
			  min={min}
			  max={max}
              maxLength={maxLength}
              allowClear={disabled ? false : true}
              placeholder={placeholder}
              onPressEnter={onPressEnter}
              onFocus={onFocus}
              onBlur={this.save.bind(this)}
              prefix={prefix}
              suffix={this.state.suffix}
              onChange={(value) => {
								this.save({
									target: {
										value: value,
									},
								});
								if (autoSubmit && form._handleSubmit) {
									let _set = setTimeout(() => {
										form._handleSubmit({});
										clearTimeout(_set);
									}, 50);
								}
								onChange && onChange(value)}}
            />
					);
				case "switch":
					return (
            <Switch defaultChecked={defaultChecked}
              onChange={(e, val) => {
								this.save({
									target: {
										value: e,
									},
								});
								if (autoSubmit && form._handleSubmit) {
									let _set = setTimeout(() => {
										form._handleSubmit({});
										clearTimeout(_set);
									}, 50);
								}
								onChange && onChange(e, val)
            }}
          />
					);
				// case "inputNumber":
				// 	return (
        //     <InputNumber
        //       style={{
        //         width: width || 190,
        //         ...style,
        //       }}
        //       min={min}
        //       max={max}
        //       placeholder={placeholder}
        //       defaultValue={value}
        //       onChange={(e) => e.target && onChange && onChange(e.target.value)}
        //       // onChange={(e, val) => {
        //       //   this.save({
        //       //     target: {
        //       //       value: e,
        //       //     },
        //       //   });
        //       //   if (autoSubmit && form._handleSubmit) {
        //       //     let _set = setTimeout(() => {
        //       //       form._handleSubmit({});
        //       //       clearTimeout(_set);
        //       //     }, 50);
        //       //   }
        //       //   onChange && onChange(e, val)
        //       // }}
        //     />
				// 	);
				default:
					if (disabled) {
						return (
							<span>
								{value}
								<input type="hidden" />
							</span>
						);
					}
					return (
						<Input
							type="text"
							style={{
								width: width || 190,
								...style,
							}}
							maxLength={maxLength}
							allowClear={disabled ? false : true}
							placeholder={placeholder}
							onPressEnter={onPressEnter}
							onFocus={onFocus}
							onBlur={this.save.bind(this)}
							prefix={prefix}
							suffix={this.state.suffix}
							onChange={(e) => e.target && onChange && onChange(e.target.value)}
						/>
					);
			}
		};

		const formDom = getFieldDecorator(name, {
			initialValue: value,
			rules: required
				? [
						{
							required: true,
							message: placeholder,
						},
				  ]
				: [],
		})(inputDom());
		if (label || item) {
			return (
				<Forms.Item
					label={label}
					labelCol={_labelCol || labelCol}
					wrapperCol={_wrapperCol || wrapperCol}
					style={itemStyle}
					className={className}
				>
					{formDom}
				</Forms.Item>
			);
		} else {
			return <span className={`Custom_CreateForm_Inputs ${className}`}>{formDom}</span>;
		}
	}
}
