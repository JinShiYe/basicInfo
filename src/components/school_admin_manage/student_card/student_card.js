import '../../../themes/student_card.css';
import React, {Component} from 'react';
import store from '../../../utils/store';
import storekeyname from '../../../utils/storeKeyName';
import myUtils from '../../../utils/myUtils';
import {Table, Button, Form, Input, Select, message, Col, Row,} from 'antd';
import {withRouter} from 'react-router-dom';
import {getColumns} from "../../../utils/commom-colums";

class AdvancedSearchForm extends React.Component {
        constructor(props){
            super(props)
            this.state={
                clss:[],//班级数组
            }
        }

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
        // console.log(`selected ${value}`);
        let grdCls=this.props.grdClsData;
        this.setState({
            clss:[],
        })
        grdCls.map(item=>{
            if(value===item.grdid){
                let clss=item.child;
                this.setState({
                    clss,
                })
            }
        })
        this.props.form.resetFields("cls_id");
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

        let grds=this.props.grdClsData;
        let grdOptions=[];
        if(grds!==undefined){
            let qboption=<Option key={0} value={0}>全部年级</Option>;
            grdOptions.push(qboption);
            grds.map(item=>{
                let option=<Option key={item.grdid} value={item.grdid}>{item.grdname}</Option>;
                grdOptions.push(option)
            })
        }
        let clss=this.state.clss;
        let clsOptions=[];
        let clsoption=<Option key={0} value={0}>全部班级</Option>;
        clsOptions.push(clsoption);
        clss.map(item=>{
            let option=<Option key={item.clsid} value={item.clsid}>{item.clsname}</Option>;
            clsOptions.push(option)
        })
        let addBtn=null;
        if(this.props.editPermission){
            addBtn=<Button type="primary" style={{ marginLeft: 8 }} onClick={this.props.onSubmitRecordPL}>批量保存</Button>
        }
        return (
            <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
                <Row gutter={24} className={"form-item-search"}>
                    <Col span={6}  >
                        <Form.Item label={"年级"} labelCol={{span:6}}>
                            {getFieldDecorator("grd_id", {
                                initialValue:0
                            })(
                                <Select onChange={this.handleChange}>
                                    {grdOptions}
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={6}  >
                        <Form.Item label={"班级"} labelCol={{span:6}}>
                            {getFieldDecorator("cls_id", {
                                initialValue:0,
                            })(
                                <Select>
                                    {clsOptions}
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={6} >
                        <Form.Item label={"学生姓名"} labelCol={{span:6}}>
                            {getFieldDecorator("uname", {
                            })(<Input placeholder="请输入学生姓名" />)}
                        </Form.Item>
                    </Col>
                    <Col span={6}  >
                        <Form.Item label={"卡地址"} labelCol={{span:6}}>
                            {getFieldDecorator("cardId", {
                            })(<Input placeholder="请输入卡地址" />)}
                        </Form.Item>
                    </Col>
                    <Col span={6}  >
                        <Form.Item label={"是否有卡"} labelCol={{span:6}}>
                            {getFieldDecorator("haveCard", {
                                initialValue:-1,
                            })(
                                <Select>
                                    <Option value={-1}>全部</Option>
                                    <Option value={1}>有</Option>
                                    <Option value={0}>无</Option>
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={6}  >
                        <Form.Item label={"卡类型"} labelCol={{span:6}}>
                            {getFieldDecorator("cardType", {
                                initialValue:this.props.cardType.length>0?this.props.cardType[0].code:"",
                            })(
                                <Select>
                                    {options}
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                    {/*<Col span={12} style={{ textAlign: 'right' }}>*/}
                    {/*    {addBtn}*/}
                    {/*    <Button type="primary" htmlType="submit" style={{ marginLeft: 8,marginTop:8 }}>*/}
                    {/*        查找*/}
                    {/*    </Button>*/}
                    {/*    <Button  onClick={this.handleReset} style={{ marginLeft: 8,marginTop:8 }}>*/}
                    {/*        重置*/}
                    {/*    </Button>*/}
                    {/*</Col>*/}
                </Row>
                <Row className={"form-item-btn"}>
                    <Col span={24} style={{ textAlign: 'right' }}>
                        {addBtn}
                        <Button type="primary" htmlType="submit" style={{ marginLeft: 8 }}>
                            查找
                        </Button>
                        <Button  onClick={this.handleReset} style={{ marginLeft: 8 }}>
                            重置
                        </Button>
                    </Col>
                </Row>
            </Form>
        );
    }
}
const WrappedAdvancedSearchForm = Form.create({ name: 'advanced_search' })(AdvancedSearchForm);



class StudentCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],//列表数据
            cardType:[],//卡类型
            grdAndCls:[],//年级数组
            searchData:{
                cardid:"",//卡id
                uname:"",//用户姓名
                cardtp:0,//卡类型
                iscard:-1,//是否有卡
                grd_id:0,//年级ID
                cls_id:0,//班级ID
            },//搜索框数据
            add_edit:false,//增加 修改 权限
            loading:true,//正在加载中
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
    //获取卡类型
    getCardType=(callback)=>{
        let utoken =store.get(storekeyname.TOKEN);
        let personal=store.get(storekeyname.PERSONALINFO);
        let paramsUserInfo = {
            platform_code:personal.platform_code,
            app_code:personal.app_code,
            access_token: utoken,
            isimg:0
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

    //查找模块点击事件
    changeSearchData=data=>{
        console.log(data)
        let searchData={}
        searchData.cardid=data.cardId||""//卡id
        searchData.uname=data.uname||""//用户姓名
        searchData.cardtp=data.cardType//卡类型
        searchData.iscard=data.haveCard//是否有卡
        searchData.grd_id=data.grd_id//年级ID
        searchData.cls_id=data.cls_id//班级ID
        this.getTableDataSearch_NextPage(searchData,1);
    }

    //获取默认表格数据
    getTableData=(searchData,page)=>{
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

            cardid:searchData.cardid,
            uname:searchData.uname,
            cardtp:parseInt(searchData.cardtp),
            iscard:searchData.iscard,
            grade_id:searchData.grd_id,
            cls_id:searchData.cls_id,

            school_id:personal.school_code,
        };
        myUtils.post(1, "HrStuCardP", paramsUserInfo, res => {
            console.log(res)
            if (res.code == 0) {
                let data=[];
                if(res.data!==null){
                    let datas =res.data.list;
                    datas.map((item,index)=>{
                        item.xh=index+1;
                        item.showBtn=false;//是否显示提交btn
                        item.showError=false;//是否显示错误提醒
                        item.newCardId=item.cardid;
                        item.cardtp=this.state.searchData.cardtp
                        item.msg="";
                        data.push(item)
                    });
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

    //获取学校年级班级数据
    getGrdCls=(callback)=>{
        let utoken =store.get(storekeyname.TOKEN);
        let paramsUserInfo = {
            is_finish:0,
            access_token: utoken,
        };
        myUtils.post(2, "api/grd/list", paramsUserInfo, res => {
            // console.log("api/grd/list:"+JSON.stringify(res))
            if (res.code == 0) {
                let grds = res.data;
                let grdids=[];
                grds.map(item=>{
                    grdids.push(item.grdid)
                })
                let paramsUserInfo = {
                    is_finish:0,
                    grade_ids: grdids.join(","),
                    access_token: utoken,
                };
                myUtils.post(2, "api/cls/list", paramsUserInfo, res2 => {
                    // console.log("api/cls/list:"+JSON.stringify(res2))
                    if (res.code == 0) {
                        let child=[];
                        let clss=res2.data;
                        grds.map(item=>{
                            let pgrdid=item.grdid;
                            clss.map(itemChild=>{
                                let grdid=itemChild.grdid;
                                if(pgrdid===grdid){
                                    child.push(itemChild)
                                }
                            })
                            item.child=child;
                        })
                        this.setState({
                            grdAndCls:grds
                        })
                        // console.log(JSON.stringify(grds));
                        callback();
                    }else{
                        message.error(res.msg)
                    }
                });
            }else{
                message.error(res.msg)
            }
        });
    }

    //获取权限
    getPermission=(callback)=>{
        //1.9: 查询权限符（前端调用，判断按钮是否显示）
        let utoken =store.get(storekeyname.TOKEN);
        let personal=store.get(storekeyname.PERSONALINFO);
        let permissions = [
            storekeyname.student_card_add,
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
                    add_edit:permissionsObj.get(storekeyname.student_card_add),
                })
                callback();
            } else {
                message.error(res.msg)
            }
        });
    }

    //行数据编辑事件
    onchange=(e,rowdata)=>{
        // console.log(e.target.value)
        // console.log(cardid)
        // console.log(rowdata)
        let value=e.target.value;
        let data =this.state.data;
        let uid=rowdata.uid;
        let newData=[];
        let reg="^[A-Za-z0-9-_]+$";
        let regus = new RegExp(reg);
        let isError=regus.test(value);
        let showBtn=false;
        let showError=false;
        let msg="";
        if(!isError&&value.length>0){
            showBtn=false;
            showError=true;
            msg="只允许输入数字或字母"
        }else{
            showError=false;
            if(value.length>0 && value.length<8){
                showBtn=false;
                showError=true;
                msg="卡地址不能小于8位"
            }else{
                showBtn=true;
                showError=false;
                msg=""
            }
        }
        data.map(item=>{
            if(item.uid===uid){
                item.newCardId=value;
                if(item.cardid===value){
                    item.showBtn=false;
                    item.showError=false;
                    item.msg=msg;
                }else if(value.length===0&&item.cardid!==value){
                    item.showBtn=true;
                    item.showError=false;
                    item.msg=msg;
                }else{
                    item.showBtn=showBtn;
                    item.showError=showError;
                    item.msg=msg;
                }
            }
            newData.push(item)
        })
        // console.log(newData)
        this.setState({
            data:newData
        })
    }

    //提交行修改的数据
    onSubmitRecord=(rowdata,type)=>{
        // console.log(rowdata)
        let utoken =store.get(storekeyname.TOKEN);
        let personal=store.get(storekeyname.PERSONALINFO);
        let paramsUserInfo = {
            platform_code:personal.platform_code,
            app_code:personal.app_code,
            access_token: utoken,
            rid:rowdata.rid,
            uid:rowdata.uid,
            cardid:rowdata.newCardId,
            uname:rowdata.uname,
            cardtp:parseInt(this.state.searchData.cardtp),
            school_id:personal.school_code,
        };
        console.log(paramsUserInfo)
        myUtils.post(1, "HrStuCardAorE", paramsUserInfo, res => {
            console.log(res)
            if (res.code == 0) {
                if(type==="PL"){
                    let searchData=this.state.searchData;
                    let page=this.state.pageindex;
                    this.getTableData(searchData,page);
                }else if(type==="DG"){
                    let data =this.state.data;
                    let cardid=rowdata.cardid;
                    data.map(item=>{
                        if(cardid===item.cardid){
                            item.showBtn=false;//是否显示提交btn
                            item.showError=false;//是否显示错误提醒
                            item.newCardId=rowdata.newCardId;
                            item.cardid=rowdata.newCardId;
                            item.msg="";
                        }
                    })
                    this.setState({
                        data
                    })
                }
                message.success("修改成功！")
            }else{
                message.error(res.msg)
            }
        });
    }
    //批量提交行修改的数据
    onSubmitRecordPL=()=>{
        console.log(this.state.data)
        let data =this.state.data;
        let cardids=new Map();
        let cardidsList=[];
        data.map(item=>{
            if(item.showBtn){
                cardidsList.push(item.newCardId)
                cardids.set(item.newCardId,"666");
            }
        })
        if(cardids.size===cardidsList.length){
            data.map(item=>{
                if(item.showBtn){
                    this.onSubmitRecord(item,"PL")
                }
            })
        }else{
            message.error("卡地址重复，请检查卡地址！")
        }
    }

    componentDidMount() {
        this.getPersonalInfo(()=>{
            // this.getCardType(()=>{
            //     this.getGrdCls(()=>{
            //         this.getPermission(()=>{
            //             this.getTableData();
            //         })
            //     })
            // })
            this.getGrdCls(()=>{})
            this.getPermission(()=>{})
            this.getCardType(()=>{
                this.getTableData();
            })
        })
    }

    render() {
        let columns= getColumns("stu_card",this)
        return (
            <div>
                <Row className={"search-box"}>
                    <Col span={24}>
                        <WrappedAdvancedSearchForm cardType={this.state.cardType} editPermission={this.state.add_edit} changeSearchData={this.changeSearchData} onSubmitRecordPL={this.onSubmitRecordPL} grdClsData={this.state.grdAndCls}/>
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
                                       let canNext=true;
                                       data.map(item=>{
                                           if(item.showBtn){
                                               canNext=false;
                                           }
                                       })
                                       if(canNext){
                                           let searchData=this.state.searchData;
                                           this.getTableData(searchData,page);
                                       }else{
                                           message.error("请先保存当前页面卡地址")
                                       }
                                   },
                                   pageSize: this.state.pagesize,
                                   hideOnSinglePage:true,
                                   total:this.state.total
                               }}
                        />
                    </Col>
                </Row>
            </div>
        )
    }
}
const StudentCards = Form.create({ name: 'student_card' })(StudentCard);

let _StudentCards = withRouter(StudentCards)
export default _StudentCards;
