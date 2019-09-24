import React, {Component} from 'react';
import store from '../../../utils/store';
import storekeyname from '../../../utils/storeKeyName';
import myUtils from '../../../utils/myUtils';
import {Table, Modal, Button, Icon, Form, Input, Select, message, Row, Col,} from 'antd';
import {withRouter} from 'react-router-dom';
import {getColumns} from "../../../utils/commom-colums";
import Container from "../../../common_from_baseframe/Container";
import Header from "../../../common_from_baseframe/Header";
import {ContentDark} from "../../../common_from_baseframe/Content";


class AdvancedSearchForm extends React.Component {
    handleSearch = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            this.props.changeSearchData(values);
        });
    };

    handleReset = () => {
        this.props.form.resetFields();
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className='divSearch'>
                <Form layout="inline" onSubmit={this.handleSearch}>
                    <Form.Item label={"关键字"}>
                        {getFieldDecorator("keywords", {

                        })(<Input placeholder="请输入“名称”关键字" />)}
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            查找
                        </Button>
                        <Button  onClick={this.handleReset} style={{ marginLeft: 8 }}>
                            重置
                        </Button>
                     </Form.Item>
                </Form>
            </div>
        );
    }
}

const WrappedAdvancedSearchForm = Form.create({ name: 'advanced_search' })(AdvancedSearchForm);


class SystemNameIcon extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],//列表数据
            loading:true,//正在加载中
            add_edit:true,//显示新增对话框
            searchData:{
                keywords:"",//年级ID
            },//搜索框数据
            pagesize:10,//每页显示条数
            pageindex:1,//默认当前页
            total:0,//数据总数
        }
    }

    //获取列表数据
    getTableData=(searchData,page)=>{
        if(searchData==undefined){
            searchData=this.state.searchData;
        }
        if(page===undefined){
            page=this.state.pageindex;
        }

        let resData={"totalRow":8,"pageNumber":1,"lastPage":true,"firstPage":true,"totalPage":1,"pageSize":20,"list":[{"acl_name":"学校后台管理","tempcolumn":0,"img_url":"https://qn-educds.jiaobaowang.net/OfficeAutomation/app/20190726/01e8320caf6d446eaef4a94f9c087260.jpg","edit":true,"name":"南宁二中后台管理系统","school_name":"南宁二中","id":2,"temprownumber":1,"status":1},{"acl_name":"学校考务系统","tempcolumn":0,"img_url":"/app/20190323/50405bb77a7041a2a7082cda29b73d42.jpg","edit":true,"name":"南宁二中考务系统","school_name":"南宁二中","id":4,"temprownumber":2,"status":1},{"acl_name":"学生管理系统","tempcolumn":0,"img_url":"/app/20190323/c4cb76b1dc474f0593e09f4359565371.jpg","edit":true,"name":"南宁二中学生管理系统","school_name":"南宁二中","id":5,"temprownumber":3,"status":1},{"acl_name":"OA系统","tempcolumn":0,"img_url":"https://qn-educds.jiaobaowang.net/OfficeAutomation/app/20190628/8ee988bdbc094687b8f2ebe72fe3a171.png","edit":true,"name":"济南第十三中学OA系统1","school_name":"南宁二中","id":14,"temprownumber":4,"status":1},{"acl_name":"智慧校园APP","tempcolumn":0,"img_url":"https://qn-educds.jiaobaowang.net/OfficeAutomation/app/20190723/7b31c01e612e4f5386fb0c5436b1ac07.png","edit":true,"name":"666","school_name":"南宁二中","id":21,"temprownumber":5,"status":1},{"acl_name":"中小学服务","tempcolumn":0,"img_url":null,"edit":true,"name":"","school_name":"南宁二中","id":29,"temprownumber":6,"status":1},{"acl_name":"校讯通","tempcolumn":0,"img_url":null,"edit":true,"name":"","school_name":"南宁二中","id":55,"temprownumber":7,"status":0},{"acl_name":"前端测试项目","tempcolumn":0,"img_url":null,"edit":true,"name":"","school_name":"南宁二中","id":66,"temprownumber":8,"status":1}]}
        let datas=resData.list;
        let data=[];
        datas.map((item,index)=>{
            item.xh=index+1;
            data.push(item)
        });
        this.setState({
            loading:false,
            data,
            total:resData.totalRow
        })
    }

    //获取权限
    getPermission=(callback)=>{
        //1.9: 查询权限符（前端调用，判断按钮是否显示）
        let utoken =store.get(storekeyname.TOKEN);
        let personal=store.get(storekeyname.PERSONALINFO);
        let permissions = [
            storekeyname.teacher_card_add,
        ]
        let access = [];
        permissions.map(item => {
            access.push(item)
        });
        let paramsPermissions = {
            platform_code: personal.platform_code, //平台代码
            app_code: personal.app_code, //应用系统代码
            grd_code: 0, //年级id，全部年级则传-1,不需要判断年级则传0
            cls_code: 0, //班级id，年级下全部班级则传-1，不需要判断班级则传0
            stu_code: 0, //学生id，全部学生则传-1，不需要判断学生则传0
            sub_code: 0, //科目代码，全部科目则传“-1”，不需要判断年级则传“0”
            access: access.join(","), //权限符，需要判断权限的权限符，多个则用逗号拼接
            access_token: utoken //用户令牌
        };
        myUtils.post(storekeyname.INTERFACEZENG+"api/acl/permissionByPosition", paramsPermissions, res => {
            console.log(JSON.stringify(res))
            if (res.code == 0) {
                let rspList = res.data.result.split(",");
                let permissionsObj = new Map();
                rspList.map((item, index) => {
                    if (item == 1) {
                        permissionsObj.set(permissions[index], true);
                    } else {
                        permissionsObj.set(permissions[index], false);
                    }
                });
                this.setState({
                    add_edit:permissionsObj.get(storekeyname.teacher_card_add),
                })
                callback();
            } else {
                message.error(res.msg)
            }
        });
    }

    //查找模块点击事件
    changeSearchData=data=>{
        console.log(data)
        let searchData={}
        searchData.province=data.province//省
        searchData.city=data.city//市
        searchData.area=data.area//县/区
        searchData.keywords=data.keywords//关键字
        console.log(JSON.stringify(searchData))
        this.getTableData(searchData,1);
    }

    componentDidMount() {
            // this.getPermission(()=>{})
            this.getTableData();
    }

    render() {
        let columns= getColumns("system_name_icon",this)
        return (
            <Container>
                <Header refresh={true}/>
                <ContentDark>
            <Row className={"search-box"}>
                <Col span={24}>
                    <WrappedAdvancedSearchForm province={this.state.province} city={this.state.city} area={this.state.area} changeSearchData={this.changeSearchData} onSelectChange={this.onSelectChange} />
                </Col>
                <Col span={24}>
                    <Table className={"info-table"}
                           columns={columns}
                           dataSource={this.state.data}
                           bordered
                           size='middle'
                           rowKey={record=>record.id}
                           loading={this.state.loading}
                           rowClassName={(record,index)=>index %2 ===0 ? "odd":"even"}
                           pagination={{
                               current:this.state.pageindex,
                               onChange: page => {
                                   let searchData=this.state.searchData;
                                   this.getTableData(searchData,page);
                               },
                               pageSize: this.state.pagesize,
                               hideOnSinglePage:true,
                               total:this.state.total
                           }}
                    />
                </Col>
            </Row>
                </ContentDark>
            </Container>
        )
    }
}

let _SystemNameIcon = withRouter(SystemNameIcon)
export default _SystemNameIcon;
