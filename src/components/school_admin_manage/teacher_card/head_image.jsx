import React, {Component} from 'react';
import {Icon, Avatar,message,Upload,Button,Row,Col} from 'antd';
import storekeyname from '../../../utils/storeKeyName';
import Store from '../../../utils/store';
import myUtils from '../../../utils/myUtils';
import desEncrypt from "../../../utils/encrypt/des";
import qiniuUtils from "../../../utils/qiniuUtils";
// import image from "../../../images/headimg.png";
import * as qiniuse from "qiniu"
import * as qiniu from "qiniu-js"

//本地文件转base64
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
//上传头像组件
class PicturesWall extends React.Component {
    constructor(props){
        super(props);
        this.subscriptionList = []//上传线程，用于点击取消上传按钮时，结束上传动作
        this.state = {
            canUpload:true,//防止按钮多次点击
            fileList:"", //待上传文件
            imgMaxSize: 2, //单张图片限制大小 M
            accept: ".bmp,.png,.gif,.jpg,.jpeg", //上传文件格式限制
            listType: "picture",//预览类型
        };
    }


    //注销组件
    // componentWillUnmount() {
    //     let list = this.subscriptionList;
    //     list.map((itemAsyn, index) => { //结束正在上传的线程
    //             itemAsyn.unsubscribe() // 上传取消
    //             list.splice(index, 1)
    //         }
    //     )
    //     this.setState(preState => ({
    //             fileList: "",
    //             canUpload:true,
    //             isNew:false
    //         })
    //     )
    // }
    //检查文件是否符合限定要求
    checkFile = file => {
        const isImg2M = file.size / 1024 / 1024 < this.state.imgMaxSize;
        let fileName = file.name;
        let index = fileName.split(".");
        fileName = "."+index[index.length-1];
        let jsonStr = ""
        if (fileName == ".bmp" || fileName == ".png" || fileName == ".gif" || fileName == ".jpg" || fileName == ".jpeg") {
            if (isImg2M) {
                jsonStr = "{\"msg\":\"\",\"fileType\":\"img\",\"canUpload\":true}"
            } else {
                jsonStr = "{\"msg\":\"图片文件最大不能超过" + this.state.imgMaxSize + "M\",\"fileType\":\"img\",\"canUpload\":false}"
            }
        }
        return JSON.parse(jsonStr)
    }
    // 上传之前事件
    beforeUpload = (file) => {
        let jsonStr = this.checkFile(file);
        if (jsonStr.canUpload) {
            let fileList = file;
            this.setState(preState => ({
                fileList: fileList
            }))
        } else {
            this.props.onChangeImg('');
            message.error(jsonStr.msg);
            return false
        }
        return false;
    }
    // 文件上传改变事件
    onChange =async (info) => {
        let file=info.fileList[info.fileList.length-1];
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        let previewImage=file.url || file.preview;
        this.props.onChangeImg(previewImage);
    }
    //文件上传 头像
    onUploadImg=()=>{
        let that=this;
        if(!this.props.rowData.isNewHead){
            message.warn('请重新选择图片')
            return
        }
        if(this.state.canUpload&&this.props.rowData.isNewHead){
            this.setState({
                canUpload:false,
            })
            //获取七牛token
            let file=this.state.fileList;
            let datas=[];
            let data= {"bucket":storekeyname.QNPUBSPACE,"key":storekeyname.XXTNOTICE+file.name,"pops":"","notifyUrl":""}
            datas.push(data);
            console.log(JSON.stringify(datas))
            let params={
                AppID: 4,
                Param: desEncrypt(storekeyname.QNPUBXXT, JSON.stringify(datas))
            }
            qiniuUtils.post(storekeyname.QNGETUPLOADTOKEN, params, res => {
                if(res.Status==1){
                    res.Data.map(item=>{
                        let p_key=item.P_Key;
                        if((storekeyname.XXTNOTICE+file.name)==p_key){
                            let key=item.Key;
                            let uploadToken=item.Token;
                            let domain=item.Domain;
                            const observable = qiniu.upload(file, key, uploadToken, new qiniuse.form_up.PutExtra(), null);//开始上传
                            const subscription = observable.subscribe(function (res) {
                            }, function (err) {
                                console.log(err)
                                message.error("头像上传异常!")
                            }, function (res) {
                                let rowData=that.props.rowData;
                                // let obj={fileName:file.name,url:domain+key}
                                // console.log(JSON.stringify(obj))
                                let utoken =Store.get(storekeyname.TOKEN);
                                let personal=Store.get(storekeyname.PERSONALINFO);
                                let comData1 = {
                                    platform_code:personal.platform_code,
                                    app_code:personal.app_code,
                                    access_token:utoken,
                                    rid:rowData.rid,
                                    uid:rowData.uid,
                                    vcardimg:domain+key,

                                    school_id:personal.unit_code,

                                    uname:rowData.uname,
                                    cardtp:parseInt(rowData.cardtp),
                                }
                                console.log(JSON.stringify(comData1))
                                myUtils.post(storekeyname.INTERFACEGU+"HrTecVCardAorE", comData1, res => {
                                    console.log(JSON.stringify(res))
                                    if (res.code == 0) {
                                        that.props.onRefreshTable();
                                        message.success("人脸信息上传成功")
                                    }else{
                                        message.error(res.msg)
                                    }
                                });
                            })
                            subscription.uid = file.uid;//将上传文件的唯一表示与上传订阅绑定
                            this.subscriptionList.push(subscription);//缓存上传订阅，用于取消动作
                        }
                    })
                }else{
                    message.error("获取七牛token上传异常!")
                }
            });
        }
    }

    render() {
        return (
            <Row style={{textAlign:"center"}}>
                <Col style={{color:"red",textAlign:"left",marginBottom:15,marginTop:-20}}>
                    <span>关闭对话框但未保存头像，将需要重新选择头像并进行上传!</span>
                </Col>
                <Col>
                    <Upload
                        accept={this.state.accept}
                        action={this.state.action}   //上传文件地址
                        beforeUpload={this.beforeUpload}   //上传之前触发事件
                        onChange={this.onChange}
                        listType={this.state.listType}>
                        <Col>
                            <Avatar shape="square" size={256} icon="user"
                                    src={this.props.rowData.previewImg}
                                    style={{textAlign:"center",border:"solid 1px RGBA(210,210,210,30)",borderRadius:"10px"}}/>
                        </Col>
                            <Button  style={{marginTop:15,marginLeft:-150}} type="upload">
                                <Icon type="zoom-in" />选择头像
                            </Button>
                    </Upload>
                    <Button type="primary" style={{marginTop:15,marginLeft:-110}}   onClick={this.onUploadImg}>
                        <Icon type="upload" />保存头像
                    </Button>
                </Col>
            </Row>
        );
    }
}
export default PicturesWall;
