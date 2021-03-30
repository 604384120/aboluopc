import React, { useState, useEffect } from "react";
import { Form as Forms, Card, Radio, Checkbox, Input } from "antd";
import { $, Img, Form, FixedBox, Btn, Inputs, Uploadaudio, Uploadimgs, Video, BreadcrumbBar, Voice } from "../comlibs";

const col = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 }
};

export default function(props) {
  const Iconfont = $.icon();
  const { TextArea } = Input;

  const Parent = props.Parent;

  const [infoData, setInfoData] = useState();
  const [type, setType] = useState();

  let { uploadimgs, imgList, setImgList, uploadaudio, audio, setAudio, answerList = [], setAnswerList }={}

  useEffect(() => { getQuery() }, []);

  async function getQuery(){
    if (Parent.state.title === '添加单选' || Parent.state.title === '编辑单选') setType('SINGLE_CHOICE');
    if (Parent.state.title === '添加多选' || Parent.state.title === '编辑多选') setType('MULT_CHOICE');
    if (Parent.state.title === '添加填空' || Parent.state.title === '编辑填空') setType('FILL_BLANK');
    if (Parent.state.title === '添加简答' || Parent.state.title === '编辑简答') setType('EXPOUND');
    if (Parent.state.title.indexOf('编辑') >= 0) {
      setInfoData(Parent.data);
    }
  };

  const AddMedia = ({ form, set, getByName }) => {
    
    [audio, setAudio] = useState();
    [imgList, setImgList] = useState([]);

    useEffect(() => {
      if (infoData) {
        setAudio(infoData?.question_audio);
        setImgList(infoData?.question_imgs || [])
      }
    }, []);

    return (
      <Forms.Item label="附件" labelCol= {{ span: 4 }} wrapperCol= {{ span: 16 }}>
        {set(
          {name: 'question_audio', value: infoData?.question_audio},
          (valueSet) => (
            //valueSet 动态设置组件的value
            <div>
              <a onClick={() => uploadaudio.open('添加音频')} >+上传音频(支持1个)</a>
              <div>
                {audio && <div className="pst_rel dis_ib mr_10" width={120} height={70} >
                  <img alt="xxx" class="pst_abs pointer" src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/73a8853c-ce22-11e9-8203-00163e04cc20.png" class="pst_abs" style={{width: 16, height: 16, right: -20, top: -2}} onClick={() => {
                    setAudio('');
                    valueSet('');
                  }} />
                  <Voice {...audio} />
                </div>}
                <Uploadaudio
                  ref={e => uploadaudio = e}
                  multiple={false}
                  onSure={(ary) => {
                    setAudio(ary[0]);
                    valueSet(ary[0].url);
                    $.msg("导入成功!");
                  }}
                />
              </div>
            </div>
          )
        )}
        {set(
          {name: 'question_imgs', value: infoData?.question_imgs},
          (valueSet) => (
            //valueSet 动态设置组件的value
            <div>
              <a onClick={() => {
                if (imgList?.length >= 9) {
                  $.warning('最多添加9张图片');
                  return
                }
                uploadimgs.open('添加图片')
              }} >+上传图片(最多9张)</a>
              <div>
                {imgList?.map((item, index) => {
                  return <div className="pst_rel dis_ib mr_10" width={120} height={70} >
                    <img alt="xxx" class="pst_abs pointer" src="https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/73a8853c-ce22-11e9-8203-00163e04cc20.png" class="pst_abs" style={{width: 16, height: 16, right: 12, top: 2}} onClick={() => {
                      imgList.splice(index, 1)
                      setImgList([...imgList]);
                      valueSet(imgList);
                    }} />
                    <Img width={100} height={70} src={item} className="dis_ib mr_10 mb_10" />
                  </div>
                })}
              </div>
              <Uploadimgs
                multiple={false}
                prefix={`album/`}
                ref={e => (uploadimgs = e)}
                onSure={rs => {
                  console.log(imgList)
                  let dataList = imgList;
                  dataList.push(rs)
                  setImgList(dataList);
                  valueSet(dataList);
                  $.msg("导入成功!");
                }}
              />
            </div>
          )
        )}
      </Forms.Item>
    )
  };

  const CreatAnswerRadio = ({ form, set, getByName }) => {

    [answerList, setAnswerList] = useState([]);
    let { answerEng = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'] } = {};

    useEffect(() => {
      if (infoData) {
        setAnswerList(infoData.question_answer)
      } else {
        let item = {
          index: 'A',
          default_answer: '',
          choice: ''
        };
        setAnswerList([item])
      }
    }, []);

    return <Forms.Item label="选项" required={true} >
      {answerList?.map((item, index) => {
        return <div key={index} >
          {item.index + ". "} 
          <Input className="mh_10" style={{width: 260}} value={item.choice} onChange={(e) => {
            answerList[index].choice = e.target.value;
            setAnswerList([...answerList])
          }} />
          <Iconfont className="mh_10" type="icon_cha" onClick={() => {
            answerList.splice(index, 1);
            answerList.forEach((_item, _index) => {
              _item.index = answerEng[_index];
              _item.default_answer = _item.default_answer || '';
            })
            setAnswerList([...answerList])
          }} />
          <Radio checked={item.default_answer} onChange={(e) => {
            answerList.forEach((_item, _index) => {
              if (index === _index) {
                _item.default_answer = item.index
              } else {
                _item.default_answer = ''
              }
            });
            setAnswerList([...answerList])
          }} >设为答案</Radio>
        </div>  
      })}
      <a style={{paddingLeft: 100}} onClick={() => {
        if (answerList.length >= 10) {
          return $.warning('最多支持10个选项，即A-J')
        }
        let item = {
          index: answerEng[answerList.length],
          default_answer: '',
          choice: ''
        }
        answerList.push(item)
        setAnswerList([...answerList])
      }} >+新增选项</a>
    </Forms.Item>
  };

  const CreatAnswerCheckbox = ({ form, set, getByName }) => {

    [answerList, setAnswerList] = useState([]);
    let { answerEng = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'] } = {};

    useEffect(() => {
      if (infoData) {
        setAnswerList(infoData.question_answer)
      } else {
        let item = {
          index: 'A',
          default_answer: '',
          choice: ''
        };
        setAnswerList([item])
      }
    }, []);

    return <Forms.Item label="选项" required={true} >
      {answerList?.map((item, index) => {
        return <div key={index} >
          {item.index + ". "} 
          <Input className="mh_10" style={{width: 260}} value={item.choice} onChange={(e) => {
            answerList[index].choice = e.target.value;
            setAnswerList([...answerList])
          }} />
          <Iconfont className="mh_10" type="icon_cha" onClick={() => {
            answerList.splice(index, 1);
            answerList.forEach((_item, _index) => {
              _item.index = answerEng[_index];
              _item.default_answer = _item.default_answer || '';
            })
            setAnswerList([...answerList])
          }} />
          <Checkbox checked={item.default_answer} onChange={(e) => {
            answerList[index].default_answer = e.target.checked ? item.index : '';
            setAnswerList([...answerList])
          }} >设为答案</Checkbox>
        </div>  
      })}
      <a style={{paddingLeft: 100}} onClick={() => {
        if (answerList.length >= 10) {
          return $.warning('最多支持10个选项，即A-J')
        }
        let item = {
          index: answerEng[answerList.length],
          default_answer: '',
          choice: ''
        }
        answerList.push(item)
        setAnswerList([...answerList])
      }} >+新增选项</a>
    </Forms.Item>
  };

  const CreatAnswerInput = ({ form, set, getByName }) => {

    [answerList, setAnswerList] = useState([]);

    useEffect(() => {
      if (infoData) {
        setAnswerList(infoData.question_answer)
      } else {
        let item = {
          index: 1,
          default_answer: ''
        };
        setAnswerList([item])
      }
    }, []);

    return <Forms.Item label="答案" required={true} >
      {answerList?.map((item, index) => {
        return <div key={index} >
          <Input className="mh_10" value={item.default_answer} style={{width: 260}} onChange={(e) => {
            answerList[index].default_answer = e.target.value;
            setAnswerList([...answerList])
          }} />
          <Iconfont className="mh_10" type="icon_cha" onClick={() => {
            answerList.splice(index, 1);
            answerList.forEach((_item, _index) => {
              _item.index = _index;
              _item.default_answer = _item.default_answer || '';
            })
            setAnswerList([...answerList])
          }} />
        </div>
      })}
      <a style={{paddingLeft: 100}} onClick={() => {
        let item = {
          index: answerList.length + 1,
          default_answer: '',
        }
        answerList.push(item)
        setAnswerList([...answerList])
      }} >+新增选项</a>
    </Forms.Item>
  };

  const CreatAnswerTextArea = () => {
    
    [answerList, setAnswerList] = useState([]);

    useEffect(() => {
      if (infoData) {
        setAnswerList(infoData.question_answer)
      } else {
        let item = {
          index: 1,
          default_answer: ''
        };
        setAnswerList([item])
      }
    }, []);

    return <Forms.Item label="答案" required={true} >
      {answerList?.map((item, index) => {
        return <div key={index} >
          <TextArea rows={12} value={item.default_answer} onChange={(e) => {
            answerList[index].default_answer = e.target.value;
            setAnswerList([...answerList])
          }} />
        </div>
      })}
    </Forms.Item>
  };

  const Content = () => {
    return (
      <Form
        className="mb_70"
        {...col}
        onSubmit={async (values, btn, ext) => {
          if ((type === 'SINGLE_CHOICE' || type === 'MULT_CHOICE') && answerList.length === 1 && !answerList[0]?.choice) {
            $.warning('请填写选项！');
            return
          }
          if ((type === 'FILL_BLANK' || type === 'EXPOUND') && answerList.length === 1 && !answerList[0]?.default_answer) {
            $.warning('请填写答案！');
            return
          }
          let answerBoolean = true;// 答案报错
          answerList.forEach((item) => {
            if (item.default_answer) {
              answerBoolean = false
            }
          });
          if (answerBoolean && (type === 'SINGLE_CHOICE' || type === 'MULT_CHOICE')) {
            $.warning('请设置答案！');
            return
          }
          values.file_uuid = $.getQueryString('file_uuid') || '';
          values.question_answer = JSON.stringify(answerList);
          if (infoData) {
            values.question_uuid = infoData.question_uuid
          }
          if (Parent.data.pageIndex === '题目大模块') {
            if (type === 'SINGLE_CHOICE') {// 添加/编辑单选
              let rs = await $.post(infoData ? "/question/singlechoice/update" : "/question/singlechoice/add", values);
            }
            if (type === 'MULT_CHOICE') {// 添加/编辑多选
              let rs = await $.post(infoData ? "/question/multchoice/update" : "/question/multchoice/add", values);
            }
            if (type === 'FILL_BLANK') {// 添加/编辑填空
              let rs = await $.post(infoData ? "/question/fillblank/update" : "/question/fillblank/add", values);
            }
            if (type === 'EXPOUND') {// 添加/编辑简答
              let rs = await $.post(infoData ? "/question/expound/update" : "/question/expound/add", values);
            }
          } else {
            if (type === 'SINGLE_CHOICE') {// 添加/编辑单选
              let rs = await $.post(infoData ? "/lesson/question/singlechoice/update" : "/lesson/question/singlechoice/add", values);
            }
            if (type === 'MULT_CHOICE') {// 添加/编辑多选
              let rs = await $.post(infoData ? "/lesson/question/multchoice/update" : "/lesson/question/multchoice/add", values);
            }
            if (type === 'FILL_BLANK') {// 添加/编辑填空
              let rs = await $.post(infoData ? "/lesson/question/fillblank/update" : "/lesson/question/fillblank/add", values);
            }
            if (type === 'EXPOUND') {// 添加/编辑简答
              let rs = await $.post(infoData ? "/lesson/question/expound/update" : "/lesson/question/expound/add", values);
            }
          }
          Parent.close(true)
          btn.loading = false;  //关闭提交按钮loading加载状态
          $.msg("操作成功");
        }}
      >
        {({set, form, submit, setByName, getByName}) => (
          <div>
            <Forms.Item label="题目" required={true} >
              <Inputs form={form} type="textArea" rows={2} name="question_name" value={infoData?.question_name} required={true} width={260} />
            </Forms.Item>
            <Forms.Item label="题目描述" >
              <Inputs form={form} type="textArea" rows={2} name="question_summary" value={infoData?.question_summary} width={260} />
            </Forms.Item>
            {Parent.data.pageIndex !== '题目大模块' && <Forms.Item label="分值" required={true} >
              <Inputs form={form} name="score" width={260} type="inputNumber" value={infoData?.score || 0} required={true} />
            </Forms.Item>}
            <AddMedia form={form} set={set} getByName={getByName} />
            {type === 'SINGLE_CHOICE' && <CreatAnswerRadio form={form} setByName={setByName} getByName={getByName} />}
            {type === 'MULT_CHOICE' && <CreatAnswerCheckbox form={form} setByName={setByName} getByName={getByName} />}
            {type === 'FILL_BLANK' && <CreatAnswerInput form={form} setByName={setByName} getByName={getByName} />}
            {type === 'EXPOUND' && <CreatAnswerTextArea form={form} setByName={setByName} getByName={getByName} />}
            {Parent ? <FixedBox>
              <Btn className="mr_10" type='default' onClick={() => Parent.close()} >取消</Btn>
              <Btn htmlType="submit" >确定</Btn>
            </FixedBox> :
            <div className='ta_c pt_30' >
              <Btn htmlType="submit" >保 存</Btn>
            </div>}
          </div>
        )}
      </Form>
    )
  }

	return (
    Parent ? <Card title={Parent?.state?.title} bordered={false} >
      <Content/>
    </Card>: 
    <div className="br_3 bg_white pall_15">
      <BreadcrumbBar pathList={['/adminPc/class', `/adminPc/ClassInfo?product_uuid=${$.getQueryString('product_uuid')}`, `${$.store().BCB_setBarPath}?product_uuid=${$.getQueryString('product_uuid')}`]} />
      <Content/>
    </div>
	);
}
