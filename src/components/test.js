import '../themes/schinfo.css';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Link} from 'react-router-dom';
import {Button} from 'antd';
//路由
class Test extends Component {
    componentDidMount() {
    }

    render() {
        return (
            <div>
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
            </div>
        )
    }
}
let _Test=withRouter(Test)
export default _Test;
