import '../themes/schinfo.css';
import React, {Component} from 'react';
import {HashRouter, withRouter} from 'react-router-dom';
import {Link} from 'react-router-dom';
import {Button,Input,message} from 'antd';
import store from '../utils/store';
import storekeyname from '../utils/storeKeyName';
//路由
class Test extends Component {
    componentDidMount() {
    }

    saveToken=token=>{
        store.set(storekeyname.TOKEN, token);
        message.success("token： "+token+"   保存成功")
    }

    render() {
        return (
            <div>
                <br/><br/><br/>
                <Input.Search
                    placeholder="token"
                    enterButton="保存"
                    size="large"
                    style={{width:350}}
                    onSearch={this.saveToken}
                />
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
                    <Button className="create-notice-btn" type="primary" icon="form">教师人脸头像入</Button>
                </Link>
                <br/><br/><br/>
                <Link to={`/student_card`}>
                    <Button className="create-notice-btn" type="primary" icon="form">学生卡录入</Button>
                </Link>
                <br/><br/><br/>
                <Link to={`/student_head_img`}>
                    <Button className="create-notice-btn" type="primary" icon="form">学生人脸头像入</Button>
                </Link>

                <Link to={`/test`}>
                    <Button className="create-notice-btn" type="primary" icon="form">国际化 测试</Button>
                </Link>
            </div>
        )
    }
}
let _Test=withRouter(Test)
export default _Test;
