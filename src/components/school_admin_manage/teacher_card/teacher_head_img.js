import '../../../themes/teacher_card.css';
import React, {Component} from 'react';
import store from '../../../utils/store';
import storekeyname from '../../../utils/storeKeyName';
import myUtils from '../../../utils/myUtils';
import {Table, Modal, Button, Icon, Form, Input, Select, message, Row, Col,} from 'antd';
import {withRouter} from 'react-router-dom';
import {getColumns} from "../../../utils/commom-colums";
import PicturesWall from "./head_image";


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

    handleChange=(value)=> {
        console.log(`selected ${value}`);
    }


    render() {
        const { getFieldDecorator } = this.props.form;
        const { Option } = Select;
        let options=[];
        let cardType=this.props.cardType;
        cardType.map(item=>{
            let option=<Option key={item.code} value={item.code}>{item.name}</Option>;
            options.push(option)
        })

        return (
            <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
                <Row gutter={24} className={"form-item-search"}>
                    <Col span={6}  >
                        <Form.Item label={"是否有卡"}>
                            {getFieldDecorator("haveCard", {
                                initialValue:-1,
                            })(
                                <Select onChange={this.handleChange}>
                                    <Option value={-1}>全部</Option>
                                    <Option value={1}>有</Option>
                                    <Option value={0}>无</Option>
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={6}  >
                        <Form.Item label={"卡类型"}>
                            {getFieldDecorator("cardType", {
                                initialValue:this.props.cardType.length>0?this.props.cardType[0].code:"",
                            })(
                                <Select onChange={this.handleChange}>
                                    {options}
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={6} >
                        <Form.Item label={"老师姓名"}>
                            {getFieldDecorator("uname", {
                            })(<Input placeholder="请输入老师姓名" />)}
                        </Form.Item>
                    </Col>
                    {/*<Col span={6} style={{ textAlign: 'right' }}>*/}
                    {/*    <Button type="primary" htmlType="submit" style={{ marginTop:6 }}>*/}
                    {/*        查找*/}
                    {/*    </Button>*/}
                    {/*    <Button  onClick={this.handleReset} style={{ marginLeft:8,marginTop:6 }}>*/}
                    {/*        重置*/}
                    {/*    </Button>*/}
                    {/*</Col>*/}
                </Row>
                <Row className={"form-item-btn"}>
                    <Col span={24} style={{ textAlign: 'right' }}>
                        <Button type="primary" htmlType="submit">
                            查找
                        </Button>
                        <Button  onClick={this.handleReset} style={{ marginLeft:8 }}>
                            重置
                        </Button>
                    </Col>
                </Row>
            </Form>
        );
    }
}
const WrappedAdvancedSearchForm = Form.create({ name: 'advanced_search' })(AdvancedSearchForm);


class TeacherHeadImg extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],//列表数据
            cardType:[],//卡类型
            loading:true,//正在加载中
            add_edit:false,//增加 修改 权限
            searchData:{
                uname:"",//用户姓名
                cardtp:0,//卡类型
                iscard:-1,//是否有卡
            },//搜索框数据
            visible_edit:false,//显示修改头像对话框
            rowData:{},//行数据
            pagesize:10,//每页显示条数
            pageindex:1,//默认当前页
            total:0,//数据总数
        }
    }

    //获取用户信息
    getPersonalInfo=(callback)=>{
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
                callback();
            }else{
                message.error(res.msg)
            }
        });
    }

    //获取默认表格数据
    getTableData=()=>{
        let utoken =store.get(storekeyname.TOKEN);
        let personal=store.get(storekeyname.PERSONALINFO);
        let paramsUserInfo = {
            platform_code:personal.platform_code,
            app_code:personal.app_code,
            access_token: utoken,
            pagesize:this.state.pagesize,
            pageindex:this.state.pageindex,

            uname:this.state.searchData.uname,
            cardtp:parseInt(this.state.searchData.cardtp),
            iscard:this.state.searchData.iscard,

            school_id:personal.school_code,
        };
        console.log("liushuai:"+JSON.stringify(paramsUserInfo))
        myUtils.post(1, "HrTecVCardP", paramsUserInfo, res => {
            console.log(JSON.stringify(res))
            if (res.code == 0) {
                let data=[];
                if(res.data!==null){
                    let datas =res.data.list;
                    datas.map((item,index)=>{
                        item.xh=index+1;
                        item.cardtp=this.state.searchData.cardtp
                        item.previewImg=item.vcardimg;
                        item.isNewHead=false;
                        data.push(item)
                    });
                    console.log(JSON.stringify(data))
                    this.setState(Object.assign({}, this.state, {
                        data,
                        loading:false,
                        total:res.data.pagerowc
                    }))
                }else{
                    this.setState(Object.assign({}, this.state, {
                        data,
                        loading:false,
                        total:0
                    }))
                }
            }else{
                message.error(res.msg)
            }
        });
    }

    //获取表格数据 查找模块 和分页模块使用
    getTableDataSearch_NextPage=(searchData,page)=>{
        let utoken =store.get(storekeyname.TOKEN);
        let personal=store.get(storekeyname.PERSONALINFO);
        if(searchData===undefined){
            searchData=this.state.searchData;
        }
        if(page===undefined){
            page=this.state.pageindex;
        }

        this.setState({
            data:[],
            searchData,
            pageindex:page,//默认当前页
            loading:true,
            total:0,//数据总数
        })

        let paramsUserInfo = {
            platform_code:personal.platform_code,
            app_code:personal.app_code,
            access_token: utoken,
            pagesize:this.state.pagesize,
            pageindex:page,

            uname:searchData.uname,
            cardtp:parseInt(searchData.cardtp),
            iscard:searchData.iscard,

            school_id:personal.school_code,
        };
        myUtils.post(1, "HrTecVCardP", paramsUserInfo, res => {
            console.log(res)
            if (res.code == 0) {
                let data=[];
                if(res.data!==null){
                    let datas =res.data.list;
                    datas.map((item,index)=>{
                        item.xh=index+1;
                        item.cardtp=searchData.cardtp
                        item.previewImg=item.vcardimg;
                        item.isNewHead=false;
                        data.push(item)
                    });
                    console.log(JSON.stringify(data))
                    this.setState(Object.assign({}, this.state, {
                        data,
                        loading:false,
                        total:res.data.pagerowc
                    }))

                }else{
                    this.setState(Object.assign({}, this.state, {
                        data,
                        loading:false,
                        pageindex:1,//默认当前页
                        total:0
                    }))
                }
            }else{
                message.error(res.msg)
            }
        });
    }

    //查找模块点击事件
    changeSearchData=data=>{
        console.log(data)
        let searchData={}
        searchData.uname=data.uname||""//用户姓名
        searchData.cardtp=data.cardType//卡类型
        searchData.iscard=data.haveCard//是否有卡
        this.getTableDataSearch_NextPage(searchData,1);
    }

    //获取卡类型
    getCardType=(callback)=>{
        let utoken =store.get(storekeyname.TOKEN);
        let personal=store.get(storekeyname.PERSONALINFO);
        let paramsUserInfo = {
            platform_code:personal.platform_code,
            app_code:personal.app_code,
            access_token: utoken,
            isimg:1
        };
        myUtils.post(1, "SysMcType", paramsUserInfo, res => {
            console.log(JSON.stringify(res))
            if (res.code == 0) {
                let cardType = res.data.list;
                let searchData=this.state.searchData;
                let cardtp=cardType[0].code;
                searchData.cardtp=cardtp;
                this.setState({
                    cardType,
                    searchData
                })
                callback();
            }else{
                message.error(res.msg)
            }
        });
    }

    //显示编辑对话框
    showModal_edit = (record) => {
        this.setState({
            visible_edit: true,
            rowData:record
        });
    };
    //编辑对话框关闭事件
    handleCancel_edit = e => {
        let rowData=this.state.rowData;
        rowData.previewImg=rowData.vcardimg;
        rowData.isNewHead=false;
        this.setState({
            visible_edit: false,
        });
    };

    onChangeImg=previewImage=>{
       let rowData=this.state.rowData;
       rowData.previewImg=previewImage;
       rowData.isNewHead=true;
       this.setState({rowData})
    }

    //刷新表格
    onRefreshTable=()=>{
        this.setState({
            visible_edit: false,
        });
        let searchData=this.state.searchData;
        this.getTableDataSearch_NextPage(searchData,this.state.pageindex);
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
            grd_id: 0, //年级id，全部年级则传-1,不需要判断年级则传0
            cls_id: 0, //班级id，年级下全部班级则传-1，不需要判断班级则传0
            stu_id: 0, //学生id，全部学生则传-1，不需要判断学生则传0
            sub_code: 0, //科目代码，全部科目则传“-1”，不需要判断年级则传“0”
            access: access.join(","), //权限符，需要判断权限的权限符，多个则用逗号拼接
            access_token: utoken //用户令牌
        };
        myUtils.post(0, "api/acl/permissionByPosition", paramsPermissions, res => {
            console.log(JSON.stringify(res))
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
                this.setState({
                    add_edit:permissionsObj.get(storekeyname.teacher_card_add),
                })
                callback();
            } else {
                message.error(res.msg)
            }
        });
    }

    componentDidMount() {
        this.getPersonalInfo(()=>{
            // this.getCardType(()=>{
            //     this.getPermission(()=>{
            //         this.getTableData();
            //     })
            // })
            this.getPermission(()=>{})
            this.getCardType(()=>{
                this.getTableData();
            })
        })
    }

    render() {
        let columns= getColumns("teach_face",this)
        let uname=this.state.rowData.uname;
        return (
            <div>
                <Row className={"search-box"}>
                    <Col span={24}>
                        <WrappedAdvancedSearchForm cardType={this.state.cardType} editPermission={this.state.add_edit} changeSearchData={this.changeSearchData}/>
                    </Col>
                    <Col span={24} style={{marginTop:30}}>
                        <Table className={"info-table"}
                               columns={columns}
                               dataSource={this.state.data}
                               bordered
                               rowKey={record=>record.uid}
                               loading={this.state.loading}
                               rowClassName={(record,index)=>index %2 ===0 ? "odd":"even"}
                               locale={{emptyText: '暂无数据'}}
                               pagination={{
                                   current:this.state.pageindex,
                                   onChange: page => {
                                       let data=this.state.data;
                                       let searchData=this.state.searchData;
                                       this.getTableDataSearch_NextPage(searchData,page);
                                   },
                                   pageSize: this.state.pagesize,
                                   hideOnSinglePage:true,
                                   total:this.state.total
                               }}
                        />
                        <Modal
                            title={`修改  ${uname}    的头像`}
                            visible={this.state.visible_edit}
                            maskClosable={false}
                            footer={null}
                            width={520}
                            bodyStyle={{minHeight:220,maxHeight:520,overflow:"auto"}}
                            centered
                            onCancel={this.handleCancel_edit}
                        >
                           <PicturesWall rowData={this.state.rowData} onRefreshTable={this.onRefreshTable} onChangeImg={this.onChangeImg}/>
                        </Modal>
                    </Col>
                </Row>
            </div>
        )
    }
}

let _TeacherHeadImg = withRouter(TeacherHeadImg)
export default _TeacherHeadImg;