import '../../../themes/teacher_card.css';
import React, {Component} from 'react';
import store from '../../../utils/store';
import storekeyname from '../../../utils/storeKeyName';
import myUtils from '../../../utils/myUtils';
import {Table, Modal, Button, Icon, Form, Input, Select, message, Col, Row,} from 'antd';
import {withRouter} from 'react-router-dom';
import {getColumns} from "../../../utils/commom-colums";

class AdvancedSearchForm extends React.Component {
    handleSearch = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log('Received values of form: ', values);
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
                    <Col span={6} >
                        <Form.Item label={"老师姓名"}>
                            {getFieldDecorator("uname", {
                            })(<Input placeholder="请输入老师姓名" />)}
                        </Form.Item>
                    </Col>
                    <Col span={6}  >
                        <Form.Item label={"卡地址"}>
                            {getFieldDecorator("cardId", {
                            })(<Input placeholder="请输入卡地址" />)}
                        </Form.Item>
                    </Col>
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
                </Row>
                <Row className={"form-item-btn"}>
                    <Col span={24} style={{ textAlign: 'right' }}>
                        <Button type="primary" htmlType="submit">
                            查找
                        </Button>
                        <Button type="primary" style={{ marginLeft: 8 }} onClick={this.handleReset}>
                            批量保存
                        </Button>
                    </Col>
                </Row>
            </Form>
        );
    }
}
const WrappedAdvancedSearchForm = Form.create({ name: 'advanced_search' })(AdvancedSearchForm);



class TeacherCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],//列表数据
            cardType:[],//卡类型
            searchData:{
                cardid:"",//卡id
                uname:"",//用户姓名
                cardtp:0,//卡类型
                iscard:-1,//是否有卡
            },//搜索框数据
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
                this.setState({
                    cardType
                })
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
        let cardType=this.state.cardType;
        let code=cardType[0].code;
        let paramsUserInfo = {
            platform_code:personal.platform_code,
            app_code:personal.app_code,
            access_token: utoken,
            pagesize:this.state.pagesize,
            pageindex:this.state.pageindex,
            cardid:this.state.searchData.cardid,
            uname:this.state.searchData.uname,
            cardtp:parseInt(code),
            school_id:personal.school_code,
            iscard:this.state.searchData.iscard,
        };
        myUtils.post(1, "HrTecCardP", paramsUserInfo, res => {
            console.log(JSON.stringify(res))
            if (res.code == 0) {
                let datas =res.data.list;
                let data=[];
                datas.map((item,index)=>{
                    item.xh=index+1;
                    item.showBtn=false;
                    data.push(item)
                });
                this.setState({
                    data,
                    loading:false,
                    total:res.data.pagerowc
                })
            }else{
                message.error(res.msg)
            }
        });
    }

    //刷新表格
    onRefreshTable=()=>{
        // getTableData("SysMajorP",this,this.state.pagesize,this.state.pageindex)
    }

    onchange=(e,cardid,rowdata)=>{
        // console.log(e.target.value)
        // console.log(cardid)
        // console.log(rowdata)

        let data =this.state.data;
        let uid=rowdata.uid;
        let newData=[];
        data.map(item=>{
            if(item.uid===uid){
                item.showBtn=true;
            }
            newData.push(item)
        })
        // console.log(newData)
        this.setState({
            data:newData
        })
    }
    componentDidMount() {
        this.getPersonalInfo(()=>{
            this.getCardType(()=>{
                this.getTableData();
            })
        })
    }

    render() {
        let columns= getColumns("teach_card",this)
        return (
            <div>
                <Row className={"search-box"}>
                    <Col span={24}>
                        <WrappedAdvancedSearchForm cardType={this.state.cardType}/>
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
                                       onChange: page => {
                                           this.setState({
                                               loading:true,
                                               pageindex:page
                                           })
                                           // getTableData("SysMajorP",this,this.state.pagesize,page)
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
const TeacherCards = Form.create({ name: 'teacher_card' })(TeacherCard);

let _TeacherCard = withRouter(TeacherCards)
export default _TeacherCard;
