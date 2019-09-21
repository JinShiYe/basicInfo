import React, {Component} from 'react';
import {HashRouter, withRouter} from 'react-router-dom';
import {Link} from 'react-router-dom';
import {Button,Input,message} from 'antd';
import store from '../utils/store';
import storekeyname from '../utils/storeKeyName';
import myUtils from "../utils/myUtils";
import {MD5} from 'crypto-js'
//路由
class Test extends Component {
    constructor(props){
        super(props)
        this.state={
            name:'',
            password:'',
            encryptKey:''
        }
    }

    componentDidMount() {
        this.getEncryptKey();
    }

    getEncryptKey = () => {
        let paramsPermissions = {
            platform_code: 'PT0001',
        };
        myUtils.post(storekeyname.INTERFACEZENG+"api/login/getEncryptKey", paramsPermissions, res => {
            console.log(JSON.stringify(res))
            this.setState({
                encryptKey: res.data.encryptKey
            })
        });
    }

    saveUname=(e)=>{
        this.setState({
            name:e.target.value
        })
    }
    savePsw=(e)=>{
        this.setState({
            password:e.target.value
        })
    }
    login=()=>{
        console.log(this.state.name);
        console.log(this.state.password);
        console.log(this.state.encryptKey);
        let paramsPermissions = {
            platform_code: 'PT0001',
            app_code: 'support#',
            login_name: this.state.name,
            password: MD5(this.state.encryptKey + this.state.password).toString()
        };
        myUtils.post(storekeyname.INTERFACEZENG+"api/login", paramsPermissions, res => {
            let url=window.location.href;
            let arr=url.split("#");
            let system_url='http://localhost:3000/';
            if(arr&&arr.length>0){
                system_url=arr[0];
            }
            let responseData=res.data;
            let personal={
                access_token: responseData.access_token,
                id: responseData.user.id,
                img_url: responseData.user.img_url,
                login_name: responseData.user.login_name,
                name: responseData.user.name,
                platform_code: responseData.user.platform_code,
                platform_name: responseData.user.platform_name,
                school_code: responseData.user.school_code,
                school_name: responseData.user.school_name,
                sex: responseData.user.sex,
                type_code: responseData.user.type_code,

                user_name: responseData.user.user_name,
                unit_name: responseData.user.unit_name,
                user_code: responseData.user.user_code,
                unit_code: responseData.user.unit_code,

                app_code: responseData.user.app_code,
                system_url: system_url,
                error_page_url: `${system_url}#/error/`,

                modifyFlag: 999,
            }
            console.log(personal,JSON.stringify(personal));
            let utoken=personal.access_token;
            store.set(storekeyname.TOKEN, utoken);
            store.set(storekeyname.PERSONALINFO, personal);
            message.success("登录成功，数据已获取！")
        });
    }


    render() {
        return (
            <div>
                <Input
                    placeholder="用户名"
                    size="large"
                    style={{width:350}}
                    onChange={this.saveUname}
                />
                <Input.Password
                    placeholder="密码"
                    size="large"
                    style={{width:350}}
                    onChange={this.savePsw}
                />
                <Button className="create-notice-btn" type="primary" icon="form" onClick={this.login}>登录</Button>
                <br/><br/><br/>
                <br/><br/><br/>
                <Link to={`/basic_info`}>
                    <Button className="create-notice-btn" type="primary" icon="form">基础信息</Button>
                </Link>
                <br/><br/><br/>
                <Link to={`/system_name_icon`}>
                    <Button className="create-notice-btn" type="primary" icon="form">学校系统名称与图标</Button>
                </Link>
                <br/><br/><br/>
                <Link to={`/grd_cls_sub`}>
                    <Button className="create-notice-btn" type="primary" icon="form">学段年级与科目</Button>
                </Link>
                <br/><br/><br/>
                <Link to={`/grd_cls`}>
                    <Button className="create-notice-btn" type="primary" icon="form">学段及年级</Button>
                </Link>
                <br/><br/><br/>
                <Link to={`/college_department`}>
                    <Button className="create-notice-btn" type="primary" icon="form">院系</Button>
                </Link>
                <br/><br/><br/>
                <Link to={`/major`}>
                    <Button className="create-notice-btn" type="primary" icon="form">专业</Button>
                </Link>
                <br/><br/><br/>
                <Link to={`/subject`}>
                    <Button className="create-notice-btn" type="primary" icon="form">科目</Button>
                </Link>
                <br/><br/><br/>
                <Link to={`/teaching_edition`}>
                    <Button className="create-notice-btn" type="primary" icon="form">教版</Button>
                </Link>
                <br/><br/><br/>
                <Link to={`/fascicle`}>
                    <Button className="create-notice-btn" type="primary" icon="form">教材分册</Button>
                </Link>
                <br/><br/><br/>
                <Link to={`/semester`}>
                    <Button className="create-notice-btn" type="primary" icon="form">季期</Button>
                </Link>
                <br/><br/><br/>
                <Link to={`/subject_type`}>
                    <Button className="create-notice-btn" type="primary" icon="form">分科</Button>
                </Link>
                <br/><br/><br/>
                <Link to={`/equipment_type`}>
                    <Button className="create-notice-btn" type="primary" icon="form">设备类型</Button>
                </Link>
                <br/><br/><br/>
                <Link to={`/teacher_card`}>
                    <Button className="create-notice-btn" type="primary" icon="form">教师卡录入</Button>
                </Link>
                <br/><br/><br/>
                <Link to={`/teacher_head_img`}>
                    <Button className="create-notice-btn" type="primary" icon="form">教师人脸头像录入</Button>
                </Link>
                <br/><br/><br/>
                <Link to={`/student_card`}>
                    <Button className="create-notice-btn" type="primary" icon="form">学生卡录入</Button>
                </Link>
                <br/><br/><br/>
                <Link to={`/student_head_img`}>
                    <Button className="create-notice-btn" type="primary" icon="form">学生人脸头像录入</Button>
                </Link>
            </div>
        )
    }
}
let _Test=withRouter(Test)
export default _Test;
