import '../themes/schinfo.css';
import React, {Component} from 'react';
import {HashRouter, Route,  Switch, Redirect} from 'react-router-dom';
import {message} from 'antd';
import store from '../utils/store';
import myUtils,{KL} from '../utils/myUtils';
import storekeyname from '../utils/storeKeyName';
import GrdAndCls from './grd-cls';

//路由
class SchInfoMain extends Component {



    componentDidMount() {
        window.addEventListener('message', function(ev) {
            let data = ev.data;
            KL.debug(ev)
            KL.info('message from parent page:', data);
        }, false);
        async function getUserInfo(utoken){
            let paramsUserInfo = {
                access_token: utoken,
            };
            await  myUtils.post(0, "api/user/currentUserInfo", paramsUserInfo, res => {
                KL.debug(JSON.stringify(res))
                if (res.code == 0) {
                    let personal = res.data;
                    store.set(storekeyname.PERSONALINFO, personal);
                }
            });
        }
        async function permissionByPosition(){
            let personal=store.get(storekeyname.PERSONALINFO);
            //1.9: 查询权限符（前端调用，判断按钮是否显示）
            let permissions = [
                storekeyname.grd_cls_add, storekeyname.grd_cls_edit,
                storekeyname.college_department_add, storekeyname.college_department_edit,
                storekeyname.major_add, storekeyname.major_edit,
                storekeyname.subject_add, storekeyname.subject_edit,
                storekeyname.teaching_edition_add, storekeyname.teaching_edition_edit,
                storekeyname.fascicle_add, storekeyname.fascicle_edit,
                storekeyname.semester_add, storekeyname.semester_edit,
                storekeyname.subject_type_add, storekeyname.subject_type_edit,
                storekeyname.equipment_type_add, storekeyname.equipment_type_edit
            ]
            let access = "";
            permissions.map((item, index) => {
                if (index == permissions.length - 1) {
                    access += personal.app_code + item
                } else {
                    access += personal.app_code + item + ","
                }
            });
            let paramsPermissions = {
                platform_code: personal.platform_code, //平台代码
                app_code: personal.app_code, //应用系统代码
                grd_id: 0, //年级id，全部年级则传-1,不需要判断年级则传0
                cls_id: 0, //班级id，年级下全部班级则传-1，不需要判断班级则传0
                stu_id: 0, //学生id，全部学生则传-1，不需要判断学生则传0
                sub_code: 0, //科目代码，全部科目则传“-1”，不需要判断年级则传“0”
                access: access, //权限符，需要判断权限的权限符，多个则用逗号拼接
                access_token: utoken //用户令牌
            };
            await myUtils.post(0, "api/acl/permissionByPosition", paramsPermissions, res => {
                KL.debug(JSON.stringify(res))
                if (res.code == 0) {
                    let rspList = res.data.split(",");
                    let permissionsObj = new Map();
                    rspList.map((item, index) => {
                        if (item == 1) {
                            permissionsObj.set(permissions[index], true);
                        } else {
                            permissionsObj.set(permissions[index], false);
                        }
                    });
                    const mapJson = myUtils.Map2Json(permissionsObj);
                    store.set(storekeyname.PERMISSIONSWHYNOTALLOW, mapJson);
                } else {
                    message.error(res.msg)
                }
            });
        }
        let search=myUtils.getUrlSearch();
        let utoken="";
        if(search){
            utoken=search.access_token;
            store.set(storekeyname.TOKEN, utoken);
        }else{
            utoken="MzZhY2VjNmYtOGU5ZS00N2VlLTg3ZGEtNmRhY2UwMTg3Mzli";
            store.set(storekeyname.TOKEN, utoken);
        }
        getUserInfo(utoken);
        permissionByPosition()
    }

    render() {
        return (
            <div>
                <HashRouter>
                    <Switch>
                        <Route exact path='/grd_cls' component={GrdAndCls}/>{/*学段及年级*/}
                        <Route exact path='/college_department' component={GrdAndCls}/>{/*院系*/}
                        <Route exact path='/major' component={GrdAndCls}/>{/*专业*/}
                        <Route exact path='/subject' component={GrdAndCls}/>{/*科目*/}
                        <Route exact path='/teaching_edition' component={GrdAndCls}/>{/*教版*/}
                        <Route exact path='/fascicle' component={GrdAndCls}/>{/*教材分册*/}
                        <Route exact path='/semester' component={GrdAndCls}/>{/*季期*/}
                        <Route exact path='/subject_type' component={GrdAndCls}/>{/*分科*/}
                        <Route exact path='/equipment_type' component={GrdAndCls}/>{/*设备类型*/}
                    </Switch>
                </HashRouter>
            </div>
        )
    }
}
export default SchInfoMain;
