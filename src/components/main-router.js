import '../themes/schinfo.css';
import React, {Component} from 'react';
import {HashRouter, Route,  Switch, Redirect} from 'react-router-dom';
import {message} from 'antd';
import store from '../utils/store';
import myUtils from '../utils/myUtils';
import storekeyname from '../utils/storeKeyName';
import GrdAndCls from './schinfo/grd-cls';
import CollegeDep from './schinfo/college_department';
import Major from './schinfo/major';
import Subject from './schinfo/subject';
import TeachingEdition from  './schinfo/teaching_edition'
import Fascicle from  './schinfo/fascicle'
import Semester from  './schinfo/semester'
import SubjectType from './schinfo/subject_type'
import EquipmentType from './schinfo/equipment_type'
import BasicInfo from './school_prop_up/basic_information/basic_info'
import SystemNameIcon from './school_prop_up/system_name_icon/system_name_icon'
import GrdClsSub from './school_prop_up/grd_cls_sub/grd_cls_sub'
import TeacherCard from './school_admin_manage/teacher_card/teacher_card'
import TeacherHeadImg from './school_admin_manage/teacher_card/teacher_head_img'
import StudentCard from './school_admin_manage/student_card/student_card'
import StudentHeadImg from './school_admin_manage/student_card/student_head_img'

import Test from './test'
//路由
class MainRouter extends Component {

    constructor(props){
        super(props)
    }


    componentWillMount() {
        // let search=myUtils.getUrlSearch();
        // let utoken= "";
        // if(search){
        //     utoken=search.access_token;
        //     store.set(storekeyname.TOKEN, utoken);
        // }else{
        //     utoken="ZDM4ZjQ5YjItZmUzYi00Y2U0LTllYjktMTcyNTE5ZTg4ZDM4";
        //     store.set(storekeyname.TOKEN, utoken);
        // }
        // http://139.129.252.49:8080/support/#/error/0006
        window.addEventListener('message', function(ev) {
            let data=ev.data.cache;
            if(data){
                let personal=JSON.parse(data);
                console.log("personal:"+JSON.stringify(personal))
            }
        }, false);
        if(storekeyname.testType===0){
            let personal =
                    {"access_token":"NTc4MzA3NzAtOGIzYi00ZWZkLTk0MDItNmMzMzdlZDM0OTgx","id":"1108922281310027776","img_url":"http://qn-educds.jiaobaowang.net/xiaoxuntong/notice/1..关联学生标注.png","login_name":"zxxadmin","name":"中小学平台管理员","platform_code":"PT0001","platform_name":"中小学平台","school_code":"100000","school_name":"南宁二中","sex":0,"type_code":"YHLX0001","app_code":"support#","unit_code":"-1","system_url":"http://localhost:3000","error_page_url":"http://localhost:3000/#/error/","modifyFlag":999}
                ;
            let utoken=personal.access_token;
            store.set(storekeyname.TOKEN, utoken);
            store.set(storekeyname.PERSONALINFO, personal);
        }
    }


    render() {
        return (
            <div>
                <HashRouter>
                    {/*<Switch>*/}
                    <Route exact  path='/' component={Test}/>{/*学段及年级*/}
                    {/*中小学统一信息*/}
                    <Route  path='/grd_cls' component={GrdAndCls}/>{/*学段及年级*/}
                    <Route  path='/college_department' component={CollegeDep}/>{/*院系*/}
                    <Route  path='/major' component={Major}/>{/*专业*/}
                    <Route  path='/subject' component={Subject}/>{/*科目*/}
                    <Route  path='/teaching_edition' component={TeachingEdition}/>{/*教版*/}
                    <Route  path='/fascicle' component={Fascicle}/>{/*教材分册*/}
                    <Route  path='/semester' component={Semester}/>{/*季期*/}
                    <Route  path='/subject_type' component={SubjectType}/>{/*分科*/}
                    <Route  path='/equipment_type' component={EquipmentType}/>{/*设备类型*/}
                    {/*中小学支撑*/}
                    <Route  path='/basic_info' component={BasicInfo}/>{/*基础信息*/}
                    <Route  path='/system_name_icon' component={SystemNameIcon}/>{/*学校系统名称与图标*/}
                    <Route  path='/grd_cls_sub' component={GrdClsSub}/>{/*学段年级与科目*/}
                    {/*学校后台管理*/}
                    <Route  path='/teacher_card' component={TeacherCard}/>{/*教师卡录入*/}
                    <Route  path='/teacher_head_img' component={TeacherHeadImg}/>{/*教师人脸头像入*/}
                    <Route  path='/student_card' component={StudentCard}/>{/*学生卡录入*/}
                    <Route  path='/student_head_img' component={StudentHeadImg}/>{/*学生人脸头像入*/}
                    {/*</Switch>*/}
                </HashRouter>
            </div>
        )
    }
}
export default MainRouter;
