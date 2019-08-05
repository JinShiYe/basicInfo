import '../../themes/schinfo.css';
import React, {Component} from 'react';
import store from '../../utils/store';
import storekeyname from '../../utils/storeKeyName';
import myUtils from '../../utils/myUtils';
import {getTableData,add_editData} from '../../utils/schinfoUtils';
import {getColumns} from '../../utils/commom-colums';
import {Table, Modal, Button, Icon, Form, Input, Select, message,} from 'antd';
import {withRouter} from 'react-router-dom';

//新增学段年级组件
const { Option } = Select;
class AddComponent extends Component {
    constructor(props) {
        super(props);
        this.state={
            grdNum:0,//年级数量
        }
    }
    //提交表单数据
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                let num =this.state.grdNum;
                let grdStr=[];
                for (let i = 0; i < num; i++) {
                    let key='grd'+i;
                    grdStr.push(values[key])
                }
                let params = {
                    id:0,
                    name:values.name,
                    pyear:parseInt(values.pyear),
                    sonnames:grdStr.join(","),
                    stat:parseInt(values.stat)
                };
                add_editData("SysPerAorE",params,msg=>{
                    if(msg==="success"){
                        this.handleSuccess();
                    }
                })
            }
        });
    };
    //年级选择事件
    handleCurrencyChange = currency => {
        console.log(currency)
        this.setState({
            grdNum:currency
        })
    };

    //提交成功回调方法
    handleSuccess=()=>{
        this.setState({grdNum:0})
        this.props.form.resetFields();
        this.props.onCancelModel();
        this.props.onRefreshTable();
    }

    //取消按钮点击事件
    handleReset=()=>{
        this.setState({grdNum:0})
        this.props.form.resetFields();
        this.props.onCancelModel();
    }
    //检察是否含有英文“ ,”
    checkDH=(rule, value, callback)=>{
        if(value.indexOf(",")!=-1){
            callback(-1)
        }
        callback()
    }

    getChinese=i=>{
        switch (++i) {
            case 1:
                return "一";
            case 2:
                return "二";
            case 3:
                return "三";
            case 4:
                return "四";
            case 5:
                return "五";
            case 6:
                return "六";
            case 7:
                return "七";
            case 8:
                return "八";
            case 9:
                return "九";
            case 10:
                return "十";
            case 11:
                return "十一";
            case 12:
                return "十二";
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 15 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 14,
                    offset: 9,
                },
            },
        };

        let grdList=[];
        for(let i=0;i<this.state.grdNum;i++){
            let style=null
            if(i==this.state.grdNum-1){
                style={marginBottom:80}
            }
           let domObj=<Form.Item label={this.getChinese(i)+"年级"} key={i} hasFeedback style={style}>
                {getFieldDecorator('grd'+i, {
                    rules: [
                        {
                            required: true,
                            message: '请填写年级名称',
                        },
                        {
                            validator:this.checkDH,
                            message: '禁止输入英文逗号',
                        }
                    ],
                })(<Input />)}
            </Form.Item>
            grdList.push(domObj);
        }
        return (
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                <Form.Item label="学段名称" hasFeedback>
                    {getFieldDecorator('name', {
                        rules: [
                            {
                                required: true,
                                message: '请输入学段名称',
                            },
                        ],
                    })(<Input />)}
                </Form.Item>
                <Form.Item label="状态" hasFeedback>
                    {getFieldDecorator('stat', {
                        rules: [
                            {
                                required: true,
                                message: '请选择状态',
                            },
                        ],
                    })(
                        <Select>
                            <Option value="0">停用</Option>
                            <Option value="1">正常</Option>
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label="学年制" hasFeedback>
                    {getFieldDecorator('pyear', {
                        rules: [
                            {
                                required: true,
                                message: '请选择学年',
                            },
                        ],
                    })(
                        <Select onChange={this.handleCurrencyChange}>
                            <Option value={1}>1</Option>
                            <Option value={2}>2</Option>
                            <Option value={3}>3</Option>
                            <Option value={4}>4</Option>
                            <Option value={5}>5</Option>
                            <Option value={6}>6</Option>
                            <Option value={7}>7</Option>
                            <Option value={8}>8</Option>
                            <Option value={9}>9</Option>
                            <Option value={10}>10</Option>
                            <Option value={11}>11</Option>
                            <Option value={12}>12</Option>
                        </Select>
                    )}
                </Form.Item>
                {grdList}
                <Form.Item {...tailFormItemLayout} className={"modal-footer"}>
                    <Button type="primary" htmlType="submit">
                        添加
                    </Button>
                    <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                        取消
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}
const _AddComponent = Form.create({ name: 'add' })(AddComponent);

//编辑学段年级组件
class EditComponent extends Component {
    constructor(props) {
        super(props);
        this.state={
            rowData:this.props.rowData,//表格行数据
            grdNum:0,//年级数量
            names:[]//年级名称
        }
    }
    componentDidMount() {
        let str=this.props.rowData.sonnames;
        let num=0;
        let names=[];
        if(str!=""){
            num=str.split(",").length;
            names=str.split(",");
        }else{
            num=this.props.rowData.pyear;
            for (let i = 0; i <num ; i++) {
                let name=this.getChinese(i)+"年级"
                names.push(name);
            }
        }
        this.setState({
            rowData:this.props.rowData,//表格行数据
            grdNum:num,//年级数量
            names:names
        })
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if(this.props.rowData===nextProps.rowData){}else{
            let str=nextProps.rowData.sonnames;
            let num=0;
            let names=[];
            if(str!=""){
                num=str.split(",").length;
                names=str.split(",");
            }else{
                num=nextProps.rowData.pyear;
                for (let i = 0; i <num; i++) {
                    let name=this.getChinese(i)+"年级"
                    names.push(name);
                }
            }
            this.setState({
                rowData:nextProps.rowData,//表格行数据
                grdNum:num,//年级数量
                names:names
            })
        }
    }

    //提交成功回调方法
    handleSuccess=()=>{
        this.props.form.resetFields();
        this.props.onCancelModel();
        this.props.onRefreshTable();
    }

    //年级选择事件
    handleCurrencyChange = currency => {
        let names=[];
        for (let i = 0; i <currency; i++) {
            let name=this.getChinese(i)+"年级"
            names.push(name);
        }
        this.setState({
            grdNum:currency,
            names:names
        })
    };

    //取消按钮点击事件
    handleReset=()=>{
        this.props.form.resetFields();
        this.props.onCancelModel();
    }
    //检察是否含有英文“ ,”
    checkDH=(rule, value, callback)=>{
        if(value.indexOf(",")!=-1){
            callback(-1)
        }
        callback()
    }
    //提交表单数据
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                let num =this.state.grdNum;
                let grdStr=[];
                for (let i = 0; i < num; i++) {
                    let key='grd'+i;
                    grdStr.push(values[key])
                }
                let params = {
                    id:this.state.rowData.id,
                    name:values.name,
                    pyear:parseInt(values.pyear),
                    sonnames:grdStr.join(","),
                    stat:parseInt(values.stat)
                };
                console.log(params)
                add_editData("SysPerAorE",params,msg=>{
                    if(msg==="success"){
                        this.handleSuccess();
                    }
                })
            }
        });
    };

    getChinese=i=>{
        switch (++i) {
            case 1:
                return "一";
            case 2:
                return "二";
            case 3:
                return "三";
            case 4:
                return "四";
            case 5:
                return "五";
            case 6:
                return "六";
            case 7:
                return "七";
            case 8:
                return "八";
            case 9:
                return "九";
            case 10:
                return "十";
            case 11:
                return "十一";
            case 12:
                return "十二";
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 15 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 14,
                    offset: 9,
                },
            },
        };
        let data=this.state.rowData;
        let name=data.name;
        let pyear=data.pyear;
        let stat=data.stat;
        let grdList=[];
        for(let i=0;i<this.state.grdNum;i++){
            let style=null
            if(i==this.state.grdNum-1){
                style={marginBottom:80}
            }
            let domObj=<Form.Item label={this.getChinese(i)+"年级"} key={i} hasFeedback style={style}>
                {getFieldDecorator('grd'+i, {
                    initialValue:this.state.names[i],
                    rules: [
                        {
                            required: true,
                            message: '请填写年级名称',
                        },
                        {
                            validator:this.checkDH,
                            message: '禁止输入英文逗号',
                        }
                    ],
                })(<Input />)}
            </Form.Item>
            grdList.push(domObj);
        }

        return (
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                <Form.Item label="学段名称" hasFeedback>
                    {getFieldDecorator('name', {
                        initialValue:name,
                        rules: [
                            {
                                required: true,
                                message: '请输入学段名称',
                            },
                        ],
                    })(<Input />)}
                </Form.Item>
                <Form.Item label="状态" hasFeedback>
                    {getFieldDecorator('stat', {
                        initialValue:stat,
                        rules: [
                            {
                                required: true,
                                message: '请选择状态',
                            },
                        ],
                    })(
                        <Select>
                            <Option value={0}>停用</Option>
                            <Option value={1}>正常</Option>
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label="学年制" hasFeedback>
                    {getFieldDecorator('pyear', {
                        initialValue:pyear,
                        rules: [
                            {
                                required: true,
                                message: '请选择学年',
                            },
                        ],
                    })(
                        <Select onChange={this.handleCurrencyChange}>
                            <Option value={1}>1</Option>
                            <Option value={2}>2</Option>
                            <Option value={3}>3</Option>
                            <Option value={4}>4</Option>
                            <Option value={5}>5</Option>
                            <Option value={6}>6</Option>
                            <Option value={7}>7</Option>
                            <Option value={8}>8</Option>
                            <Option value={9}>9</Option>
                            <Option value={10}>10</Option>
                            <Option value={11}>11</Option>
                            <Option value={12}>12</Option>
                        </Select>
                    )}
                </Form.Item>
                {grdList}
                <Form.Item {...tailFormItemLayout} className={"modal-footer"}>
                    <Button type="primary" htmlType="submit">
                        修改
                    </Button>
                    <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                        取消
                    </Button>
                </Form.Item>
            </Form>
            )
    }
}
const _EditComponent = Form.create({ name: 'edit' })(EditComponent);


//学段年级组件
class GrdAndCls extends Component {

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
            add:false,//增加权限
            edit:false,//修改权限
            rowData:"",//点击的行数据
        }
    }

    //显示新增对话框
    showModal_add = () => {
        this.setState({
            visible_add: true,
        });
    };
    //新增对话框关闭事件
    handleCancel_add = e => {
        this.setState({
            visible_add: false,
        });
    };
    //显示编辑对话框
    showModal_edit = (record) => {
        this.setState({
            visible_edit: true,
            rowData:record
        });
    };
    //编辑对话框关闭事件
    handleCancel_edit = e => {
        this.setState({
            visible_edit: false,
        });
    };
    //刷新表格
    onRefreshTable=()=>{
        getTableData("SysPerP",this,this.state.pagesize,this.state.pageindex)
    }

    getPermission=()=>{
        let utoken =store.get(storekeyname.TOKEN);
        let personal=store.get(storekeyname.PERSONALINFO);
        // let paramsUserInfo = {
        //     access_token: utoken,
        // };
        //  myUtils.post(0, "api/user/currentUserInfo", paramsUserInfo, res => {
        //     console.log(JSON.stringify(res))
        //     if (res.code == 0) {
        //         let personal = res.data;
        //         if(personal.app_code==""){
        //             personal.app_code="aaabbbccc"
        //         }
        //         store.set(storekeyname.PERSONALINFO, personal);
        //1.9: 查询权限符（前端调用，判断按钮是否显示）
        let permissions = [
            storekeyname.common_add, storekeyname.common_edit,
        ]
        let access = [];
        permissions.map(item => {
            access.push(personal.app_code + item)
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
                    add:permissionsObj.get(storekeyname.common_add),
                    edit:permissionsObj.get(storekeyname.common_edit)
                })
                getTableData("SysPerP",this,this.state.pagesize,this.state.pageindex)
            } else {
                message.error(res.msg)
            }
        });
        //     }else{
        //         message.error(res.msg)
        //     }
        // });
    }

    componentDidMount() {
        if(storekeyname.testType===1){
            let that=this;
            window.addEventListener('message', function(ev) {
                let data=ev.data.cache;
                if(data){
                    let personal=JSON.parse(data);
                    console.log("personal:"+JSON.stringify(personal))
                    let utoken=personal.access_token;
                    store.set(storekeyname.TOKEN, utoken);
                    store.set(storekeyname.PERSONALINFO, personal);
                    that.getPermission();
                }else{

                }
            }, false);
        }else if(storekeyname.testType===0){
            this.getPermission();
        }
    }

    render() {
        let columns= getColumns("grd")
        let button=null;
        if(this.state.add){
            button=<Button className={"info-button"} type="primary" icon="plus-circle" onClick={()=>this.showModal_add()}>添加</Button>
        }
        if(this.state.edit){
            let edit={
                title: '操作',
                key: 'action',
                width: 100,
                align:"center",
                render: (record) => (
                    <Icon type="form" style={{color:"#1890ff"}} onClick={()=>this.showModal_edit(record)}/>
                ),
            }
            columns.push(edit)
        }
        return (
            <div className={"info"}>
                {button}
                <Table className={"info-table"}
                       columns={columns}
                       dataSource={this.state.data}
                       bordered
                       size='middle'
                       loading={this.state.loading}
                       rowKey={record=>record.id}
                       rowClassName={(record,index)=>index %2 ===0 ? "odd":"even"}
                       pagination={{
                           onChange: page => {
                               this.setState({
                                   loading:true,
                                   pageindex:page
                               })
                               getTableData("SysPerP",this,this.state.pagesize,page)
                           },
                           pageSize: this.state.pagesize,
                           hideOnSinglePage:true,
                           total:this.state.total
                       }}
                />
                <Modal
                    title="添加学段"
                    visible={this.state.visible_add}
                    maskClosable={false}
                    footer={null}
                    width={520}
                    bodyStyle={{minHeight:275,maxHeight:520,overflow:"auto"}}
                    centered
                    onCancel={this.handleCancel_add}
                >
                    <_AddComponent onCancelModel={this.handleCancel_add} onRefreshTable={this.onRefreshTable}/>
                </Modal>
                <Modal
                    title="修改学段"
                    visible={this.state.visible_edit}
                    maskClosable={false}
                    footer={null}
                    width={520}
                    bodyStyle={{minHeight:270,maxHeight:520,overflow:"auto"}}
                    centered
                    onCancel={this.handleCancel_edit}
                >
                    <_EditComponent  onCancelModel={this.handleCancel_edit} onRefreshTable={this.onRefreshTable} rowData={this.state.rowData}/>
                </Modal>
            </div>
        )
    }
}

let _GrdAndCls = withRouter(GrdAndCls)
export default _GrdAndCls;
