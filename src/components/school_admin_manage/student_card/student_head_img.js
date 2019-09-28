import './student_card.css';
import React, {Component} from 'react';
import store from '../../../utils/store';
import storekeyname from '../../../utils/storeKeyName';
import myUtils from '../../../utils/myUtils';
import {Table, Modal, Button, Icon, Form, Input, Select, message, Row, Col,} from 'antd';
import {withRouter} from 'react-router-dom';
import {getColumns} from "../../../utils/commom-colums";
import PicturesWall from "../student_card/head_image";
import Container from "../../../common_from_baseframe/Container";
import Header from "../../../common_from_baseframe/Header";
import {ContentDark} from "../../../common_from_baseframe/Content";


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
            if(value===item.grd_code){
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

        let grds=this.props.grdClsData===undefined?[]:this.props.grdClsData;
        let grdOptions=[];
        if(grds!==undefined){
            let qboption=<Option key={0} value={0}>全部年级</Option>;
            grdOptions.push(qboption);
            grds.map(item=>{
                let option=<Option key={item.grd_code} value={item.grd_code}>{item.grd_name}</Option>;
                grdOptions.push(option)
            })
        }
        let clss=this.state.clss;
        let clsOptions=[];
        let clsoption=<Option key={0} value={0}>全部班级</Option>;
        clsOptions.push(clsoption);
        clss.map(item=>{
            let option=<Option key={item.cls_code} value={item.cls_code}>{item.cls_name}</Option>;
            clsOptions.push(option)
        })

        return (
            <div className='common-search-form'>
                <Form layout="inline" onSubmit={this.handleSearch}>
                    <Form.Item label={"年级"} >
                        {getFieldDecorator("grd_id", {
                            initialValue:0
                        })(
                            <Select onChange={this.handleChange}>
                                {grdOptions}
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label={"班级"} >
                        {getFieldDecorator("cls_id", {
                            initialValue:0,
                        })(
                            <Select>
                                {clsOptions}
                            </Select>
                        )}
                    </Form.Item>
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
                    <Form.Item label={"卡类型"} >
                        {getFieldDecorator("cardType", {
                            initialValue:this.props.cardType.length>0?this.props.cardType[0].code:"",
                        })(
                            <Select onChange={this.handleChange}>
                                {options}
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label={"学生姓名"} >
                        {getFieldDecorator("uname", {
                        })(<Input placeholder="请输入学生姓名" />)}
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            查找
                        </Button>
                        <Button  onClick={this.handleReset} style={{ marginLeft:8 }}>
                            重置
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}
const WrappedAdvancedSearchForm = Form.create({ name: 'advanced_search' })(AdvancedSearchForm);



class StudentHeadImg extends Component {

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
                grd_id:0,//年级ID
                cls_id:0,//班级ID
            },//搜索框数据
            visible_edit:false,//显示修改头像对话框
            rowData:{},//行数据
            pagesize:10,//每页显示条数
            pageindex:1,//默认当前页
            total:0,//数据总数
        }
    }


    //获取默认表格数据
    getTableData=(searchData,page)=>{
        let utoken =store.get(storekeyname.TOKEN);
        let personal=store.get(storekeyname.PERSONALINFO);

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
            grade_id:searchData.grd_id,
            cls_id:searchData.cls_id,

            school_id:personal.unit_code,
        };
        myUtils.post(storekeyname.INTERFACEGU+"HrStuVCardP", paramsUserInfo, res => {
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


    //查找模块点击事件
    changeSearchData=data=>{
        console.log(data)
        let searchData={}
        searchData.uname=data.uname||""//用户姓名
        searchData.cardtp=data.cardType//卡类型
        searchData.iscard=data.haveCard//是否有卡
        searchData.grd_id=data.grd_id//年级ID
        searchData.cls_id=data.cls_id//班级ID
        this.getTableData(searchData,1);
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
        myUtils.post(storekeyname.INTERFACEGU+"SysMcType", paramsUserInfo, res => {
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
        if(previewImage!==''){
            let rowData=this.state.rowData;
            rowData.previewImg=previewImage;
            rowData.isNewHead=true;
            this.setState({rowData})
        }
    }

    //获取学校年级班级数据
    getGrdCls=(callback)=>{
        let utoken =store.get(storekeyname.TOKEN);
        let paramsUserInfo = {
            is_finish:0,
            access_token: utoken,
        };
        myUtils.post(storekeyname.INTERFACEMENG +"api/grd", paramsUserInfo, res => {
            console.log("api/grd/list:"+JSON.stringify(res));
            if (res.code == 0) {
                let grds = res.data.list;
                let grdids=[];
                grds.map(item=>{
                    grdids.push(item.grd_code)
                })
                if(grds && grds.length>0){
                    let paramsUserInfo = {
                        is_finish:0,
                        grd_codes: grdids.join(","),
                        access_token: utoken,
                    };
                    myUtils.post(storekeyname.INTERFACEMENG +"api/cls", paramsUserInfo, res2 => {
                        console.log("api/cls/list:"+JSON.stringify(res2))
                        if (res.code == 0) {
                            let clss=res2.data.list;
                            grds.map(item2=>{
                                let child=[];
                                let pgrdid=item2.grd_code;
                                clss.map(itemChild=>{
                                    let grdid=itemChild.grd_code;
                                    if(pgrdid===grdid){
                                        child.push(itemChild)
                                    }
                                })
                                item2.child=child;
                            })
                            console.log(JSON.stringify(grds))
                            this.setState({
                                grdAndCls:grds
                            })
                            // console.log(JSON.stringify(grds));
                            callback();
                        }else{
                            message.error(res.msg)
                        }
                    });
                }
            }else{
                message.error(res.msg)
            }
        });
    }

    //刷新表格
    onRefreshTable=()=>{
        this.setState({
            visible_edit: false,
        });
        this.getTableData(this.state.searchData,this.state.pageindex);
    }

    //获取权限
    getPermission=(callback)=>{
        //1.9: 查询权限符（前端调用，判断按钮是否显示）
        let utoken =store.get(storekeyname.TOKEN);
        let personal=store.get(storekeyname.PERSONALINFO);
        let permissions = [
            storekeyname.card_add,
        ]
        let access = [];
        permissions.map(item => {
            access.push(personal.app_code + item)
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
                    add_edit:permissionsObj.get(storekeyname.card_add),
                })
                callback();
            } else {
                message.error(res.msg)
            }
        });
    }

    componentDidMount() {
        // this.getPersonalInfo(()=>{
        //     // this.getCardType(()=>{
        //     //     this.getPermission(()=>{
        //     //         this.getTableData();
        //     //     })
        //     // })
        //     this.getPermission(()=>{})
        //     this.getGrdCls(()=>{})
        //     this.getCardType(()=>{
        //         this.getTableData();
        //     })
        // })
            this.getPermission(()=>{})
            this.getGrdCls(()=>{})
            this.getCardType(()=>{
                this.getTableData(this.state.searchData,this.state.pageindex);
            })
    }

    render() {
        let columns= getColumns("stu_face",this)
        let uname=this.state.rowData.uname;
        return (
            <Container>
                <Header refresh={true}/>
                <ContentDark>
            <div>
                <Row className={"search-box"}>
                    <Col span={24}>
                        <WrappedAdvancedSearchForm cardType={this.state.cardType} editPermission={this.state.add_edit} changeSearchData={this.changeSearchData}  grdClsData={this.state.grdAndCls}/>
                    </Col>
                    <Col span={24}>
                        <Table className={"info-table"}
                               columns={columns}
                               dataSource={this.state.data}
                               bordered
                               size='middle'
                               rowKey={record=>record.uid}
                               loading={this.state.loading}
                               pagination={{
                                   current:this.state.pageindex,
                                   onChange: page => {
                                       this.getTableData(this.state.searchData,page);
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
                </ContentDark>
            </Container>
        )
    }
}

let _StudentHeadImg = withRouter(StudentHeadImg)
export default _StudentHeadImg;
