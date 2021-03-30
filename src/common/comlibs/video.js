import React from "react";
import { Icon } from "antd";
import Modals from "./modals";
import Method from "../method";

/**
 * cover :视频封面
 * video_url :视频路径
 * isTrans : 是否检测
 */
export default class Video extends React.Component {
  constructor(props) {
    super(props);
    this.$ = new Method();
    this.state = { modal: {} };
  }
  async start() {
    let {isTrans=false}=this.props
    if(!isTrans){this.refs.modal.open("视频播放");return;}
    if(await this.$.videoTransStatus(this.props.video_url)){
      this.refs.modal.open("视频播放");
    }
    
  }
  render() {
    return (
      <div>
        {this.props.cover ? (
          <div className="pst_rel" style={{ width: 100, height: 100 }}>
            <img
              className="wh_full br_3 pointer"
              alt={this.props.cover}
              onClick={this.start.bind(this)}
              src={this.props.cover}
            />
            <Icon
              style={{ fontSize: 40 }}
              onClick={this.start.bind(this)}
              className="fc_white pst_abs middle center"
              type="play-circle"
            />
          </div>
        ) : (
          <div className="fs_14 fc_gray">{this.props.title}
            <video width={150} height={100} src={this.props.video_url} />
            <span onClick={this.start.bind(this)} className="link ml_8">播放</span>
          </div>
        )}
        
        <Modals ref="modal">
          {() => (
            <video
              ref="videoObj"
              src={this.props.video_url}
              autoPlay
              onCanPlay={() => {
                this.refs.modal.refs.videoObj["disablePictureInPicture"] = true;
              }}
              controls
              className="w_full"
            />
          )}
        </Modals>
      </div>
    );
  }
}
