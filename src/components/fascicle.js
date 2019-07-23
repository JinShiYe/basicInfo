import '../themes/schinfo.css';
import React, {Component} from 'react';
import store from '../utils/store';
import storekeyname from '../utils/storeKeyName';
import myUtils,{getTableData,add_editData} from '../utils/myUtils';
import {getColumns} from '../utils/commom-colums';
import {Table,Modal,Button,Icon, Form, Input, Select,} from 'antd';
import {withRouter} from 'react-router-dom';

//新增学段年级组件
const { Option } = Select;
class AddComponent extends Component {
    constructor(props) {
        super(props);
    }
    //提交表单数据
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                let params = {
                    id:0,
                    name:values.name,
                    stat:parseInt(values.stat)
                };
                add_editData("SysFascAorE",params,msg=>{
                    if(msg==="success"){
                        this.handleSuccess();
                    }
                })
            }
        });
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

        return (
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                <Form.Item label="名称" hasFeedback>
                    {getFieldDecorator('name', {
                        rules: [
                            {
                                required: true,
                                message: '请输入名称',
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
        }
    }
    componentWillReceiveProps(nextProps, nextContext) {
        if(this.props.rowData===nextProps.rowData){}else{
            this.setState({
                rowData:nextProps.rowData,//表格行数据
            })
        }
    }

    //提交成功回调方法
    handleSuccess=()=>{
        this.props.form.resetFields();
        this.props.onCancelModel();
        this.props.onRefreshTable();
    }

    //取消按钮点击事件
    handleReset=()=>{
        this.props.form.resetFields();
        this.props.onCancelModel();
    }
    //提交表单数据
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                let params = {
                    id:this.state.rowData.id,
                    name:values.name,
                    stat:parseInt(values.stat)
                };
                console.log(params)
                add_editData("SysFascAorE",params,msg=>{
                    if(msg==="success"){
                        this.handleSuccess();
                    }
                })
            }
        });
    };


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
        let stat=data.stat;
        return (
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                <Form.Item label="名称" hasFeedback>
                    {getFieldDecorator('name', {
                        initialValue:name,
                        rules: [
                            {
                                required: true,
                                message: '请输入名称',
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
class Fascicle extends Component {

    constructor(props) {
        super(props);
        let map=myUtils.Json2Map(store.get(storekeyname.PERMISSIONSWHYNOTALLOW));
        this.state = {
            data: [],//列表数据
            loading:true,//正在加载中
            visible_add:false,//显示新增对话框
            visible_edit:false,//显示编辑对话框
            pagesize:10,//每页显示条数
            pageindex:1,//默认当前页
            total:0,//数据总数
            add:map.get(storekeyname.common_add),//增加权限
            edit:map.get(storekeyname.common_edit),//修改权限
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
        getTableData("SysFascP",this,this.state.pagesize,this.state.pageindex)
    }

    componentDidMount() {
        getTableData("SysFascP",this,this.state.pagesize,this.state.pageindex)
    }

    render() {
        let columns= getColumns("oth",this.state.edit)
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
                       loading={this.state.loading}
                       rowClassName={(record,index)=>index %2 ===0 ? "odd":"even"}
                       locale={{emptyText: '暂无数据'}}
                       pagination={{
                           onChange: page => {
                               this.setState({
                                   loading:true
                               })
                               getTableData("SysFascP",this,this.state.pagesize,page)
                           },
                           pageSize: this.state.pagesize,
                           hideOnSinglePage:true,
                           total:this.state.total
                       }}
                />
                <Modal
                    title="添加教材分册"
                    visible={this.state.visible_add}
                    maskClosable={false}
                    footer={null}
                    width={520}
                    bodyStyle={{minHeight:220,maxHeight:520,overflow:"auto"}}
                    centered
                    onCancel={this.handleCancel_add}
                >
                    <_AddComponent onCancelModel={this.handleCancel_add} onRefreshTable={this.onRefreshTable}/>
                </Modal>
                <Modal
                    title="修改教材分册"
                    visible={this.state.visible_edit}
                    maskClosable={false}
                    footer={null}
                    width={520}
                    bodyStyle={{minHeight:220,maxHeight:520,overflow:"auto"}}
                    centered
                    onCancel={this.handleCancel_edit}
                >
                    <_EditComponent  onCancelModel={this.handleCancel_edit} onRefreshTable={this.onRefreshTable} rowData={this.state.rowData}/>
                </Modal>
            </div>
        )
    }
}

let _Fascicle = withRouter(Fascicle)
export default _Fascicle;
