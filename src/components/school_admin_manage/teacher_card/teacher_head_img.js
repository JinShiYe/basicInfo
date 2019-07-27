import '../../../themes/basic_info.css';
import React, {Component} from 'react';
import store from '../../../utils/store';
import storekeyname from '../../../utils/storeKeyName';
import myUtils from '../../../utils/myUtils';
import {Table, Modal, Button, Icon, Form, Input, Select, message,} from 'antd';
import {withRouter} from 'react-router-dom';

//学段年级组件
class TeacherHeadImg extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],//列表数据
            loading:true,//正在加载中
            visible_add:false,//显示新增对话框
            visible_edit:false,//显示编辑对话框
            pagesize:10,//每页显示条数
            pageindex:1,//默认当前页
            total:0,//数据总数
        }
    }

    componentDidMount() {
        let utoken =store.get(storekeyname.TOKEN);
        let paramsUserInfo = {
            access_token: utoken,
        };
        myUtils.post(0, "api/user/currentUserInfo", paramsUserInfo, res => {
            console.log(JSON.stringify(res))
            if (res.code == 0) {
                let personal = res.data;
                if(personal.app_code==""){
                    personal.app_code="aaabbbccc"
                }
                store.set(storekeyname.PERSONALINFO, personal);
            }else{
                message.error(res.msg)
            }
        });
    }

    render() {
        return (
            <div>666666666666667</div>
        )
    }
}

let _TeacherHeadImg = withRouter(TeacherHeadImg)
export default _TeacherHeadImg;
