import './grd_cls_sub.css';
import React, {Component} from 'react';
import store from '../../../utils/store';
import storekeyname from '../../../utils/storeKeyName';
import myUtils from '../../../utils/myUtils';
import {Table, Modal, Button, Icon, Form, Input, Select, message, Row, Col,Switch,Tag,Transfer } from 'antd';
import {withRouter} from 'react-router-dom';
import Container from "../../../common_from_baseframe/Container";
import Header from "../../../common_from_baseframe/Header";
import {ContentDark} from "../../../common_from_baseframe/Content";

class GrdClsSub extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],//列表数据
            loading:true,//正在加载中
            add_edit:true,//显示编辑对话框
            showFk:false,//是否显示分科设置
            cengci:[],//层次 数据
            grds:[],//年级 数据
            subs:[],//开设科目 数据
            clss:[],//班级属性 数据
            subincluds:[],//综合科目包含 数据
            cengci_checked:"",//层次 选择值
            clss_checked:"",//层次 选择值
            modalTitle:"",//弹出层标题
            modalType:0,//弹出层类型
            showModal:false,//是否显示弹出层

            mockData:[],
            targetKeys: [],
            selectedKeys: [],
        }
    }

    //-------------Tag---------------------
    //是否分科点击事件
    fenKeChange=(isFk,e)=>{
        if(isFk){
            this.setState({
                showFk:true
            })
        }else{
            this.setState({
                showFk:false
            })
        }
    }

    //层次Tag  点击事件
    handleClick_Cengci=(code)=>{
        console.log("层次Tag  点击事件")
        console.log(code)
        if(code===-100){
            this.setState({
                showModal:true,
                modalType:"cengci",
                modalTitle:"修改层次",
            })
        }else{
            this.setState({
                cengci_checked:code,
            })
        }
    }

    //开设科目Tag 点击事件
    handleClick_Subs=()=>{
        console.log("开设科目Tag  点击事件")
        this.setState({
            showModal:true,
            modalType:"subs",
            modalTitle:"修改开设科目",
        })
    }

    //班级属性Tag 点击事件
    handleClick_Clss=(code)=>{
        console.log("班级属性Tag  点击事件")
        console.log(code)
        if(code===-100){
            this.setState({
                showModal:true,
                modalType:"clss",
                modalTitle:"修改班级属性",
            })
        }else{
            this.setState({
                clss_checked:code,
            })
        }
    }

    //综合科目包含Tag 点击事件
    handleClick_Subincluds=()=>{
        console.log("综合科目包含Tag  点击事件")
        this.setState({
            showModal:true,
            modalType:"subincluds",
            modalTitle:"修改综合科目",
        })
    }
    //-------------Tag---------------------end

    //---------------------------穿梭框---------------------
    handleChange = (nextTargetKeys, direction, moveKeys) => {
        this.setState({ targetKeys: nextTargetKeys });
        console.log('targetKeys: ', nextTargetKeys);
        console.log('direction: ', direction);
        console.log('moveKeys: ', moveKeys);
    };

    handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
        console.log('sourceSelectedKeys: ', sourceSelectedKeys);
        console.log('targetSelectedKeys: ', targetSelectedKeys);
    };

    filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1;

    //---------------------------穿梭框---------------------end

    //--------------------modal------------------
    //编辑对话框关闭事件

    handleOk = e => {
        console.log(e);
        console.log(this.state.targetKeys)
        this.setState({
            visible: false,
        });
    };

    handleCancel = e => {
        console.log(e)
        this.setState({
            showModal: false,
        });
    };
    //----------------------modal----------------end

    componentDidMount() {

        const mockData = [];
        for (let i = 0; i < 20; i++) {
            mockData.push({
                key: i.toString(),
                title: `content${i + 1}`,
                description: `description of content${i + 1}`,
                disabled: i % 3 < 1,
            });
        }

        const oriTargetKeys = mockData.filter(item => +item.key % 3 > 1).map(item => item.key);



        this.setState({
            cengci:[{"code":"3","name":"初中"},{"code":"17","name":"专升本"}],//层次 数据
            cengci_checked:"3",//层次 选择值
            grds:[{"temp":false,"per_name":"初中","code":"3001","school_id":100000,"per_code":"3","year":"2019","graduation":false,"name":"初一","del":false,"id":9,"sort":0,"status":1},{"temp":false,"per_name":"初中","code":"3002","school_id":100000,"per_code":"3","year":"2018","graduation":false,"name":"初二","del":false,"id":10,"sort":0,"status":1},{"temp":false,"per_name":"初中","code":"3003","school_id":100000,"per_code":"3","year":"2017","graduation":false,"name":"初三","del":false,"id":11,"sort":0,"status":1},{"temp":false,"per_name":"初中","code":"3004","school_id":100000,"per_code":"3","year":"2016","graduation":false,"name":"初四","del":false,"id":12,"sort":0,"status":1}],//年级 数据
            grds_checked:"3001",//年级 选择值
            subs:[{"code":"01","name":"语文"},{"code":"02","name":"数学"},{"code":"03","name":"英语"},{"code":"04","name":"物理"},{"code":"05","name":"化学"},{"code":"06","name":"历史"},{"code":"07","name":"地理"},{"code":"08","name":"生物"},{"code":"09","name":"政治"},{"code":"22","name":"道德与法治"},{"code":"666","name":"计算机学院信息管理与信息系统"}],//开设科目 数据
            subs_checked:"01",//开设科目 选择值
            clss:[{"code":"01","name":"文科"},{"code":"02","name":"理科"}],//班级属性 数据
            clss_checked:"01",//班级属性 选择值
            subincluds:[{"code":"06","name":"历史"},{"code":"07","name":"地理"},{"code":"09","name":"政治"}],//综合科目包含 数据
            subincluds_checked:"06",//综合科目包含 选择值

            targetKeys:oriTargetKeys,//Test
            mockData:mockData,//Test
        })
    }


    render() {
        let cengci=this.state.cengci;
        let cengciTags=[];
        cengci.map(item=>{
            let tag=null;
            if(item.code===this.state.cengci_checked){
                tag=<Tag color="blue" key={item.code} onClick={()=>{this.handleClick_Cengci(item.code)}}>{item.name}</Tag>
            }else{
                tag=<Tag key={item.code} onClick={()=>{this.handleClick_Cengci(item.code)}}>{item.name}</Tag>
            }
            cengciTags.push(tag)
        })

        let grds=this.state.grds;
        let grdsTags=[];
        grds.map(item=>{
            let tag=<Tag key={item.code}>{item.name} ({item.year}级)</Tag>
            grdsTags.push(tag)
        })


        let subs=this.state.subs;
        let subsTags=[];
        subs.map(item=>{
            let tag=<Tag key={item.code}>{item.name} ({item.code})</Tag>
            subsTags.push(tag)
        })

        let clss=this.state.clss;
        let clssTags=[];
        clss.map(item=>{
            let tag=null;
            if(item.code===this.state.clss_checked){
                tag=<Tag color="blue" key={item.code} onClick={()=>{this.handleClick_Clss(item.code)}}>{item.name}</Tag>
            }else{
                tag=<Tag key={item.code} onClick={()=>{this.handleClick_Clss(item.code)}}>{item.name}</Tag>
            }
            clssTags.push(tag)
        })

        let subincluds=this.state.subincluds;
        let subincludsTags=[];
        subincluds.map(item=>{
            let tag=<Tag key={item.code}>{item.name}</Tag>
            subincludsTags.push(tag)
        })


        let clssT=null;
        let subinT=null;
        if(this.state.showFk){
            clssT= <Row style={{marginTop:10}}><Col span={3}><span className={"tag-span"}>班级属性：</span></Col><Col span={21}>{clssTags}</Col></Row>
            subinT=<Row style={{marginTop:10}}><Col span={3}><span className={"tag-span"}>综合科目包含：</span></Col><Col span={21}>{subincludsTags}</Col></Row>
        }

        let disabled=true;
        if(this.state.add_edit){//是否有编辑权限
            disabled=false;

            let cengci_tag_add=<Tag key={-1} className={"ant-tag-add"} onClick={()=>this.handleClick_Cengci(-100)}><Icon type="edit" /></Tag>
            cengciTags.push(cengci_tag_add)

            let subs_tag_add=<Tag key={-1} className={"ant-tag-add"} onClick={this.handleClick_Subs}><Icon type="edit" /></Tag>
            subsTags.push(subs_tag_add)

            let clss_tag_add=<Tag key={-1} className={"ant-tag-add"} onClick={()=>this.handleClick_Clss(-100)}><Icon type="edit" /></Tag>
            clssTags.push(clss_tag_add)

            let subincluds_tag_add=<Tag key={-1} className={"ant-tag-add"} onClick={this.handleClick_Subincluds}><Icon type="edit" /></Tag>
            subincludsTags.push(subincluds_tag_add)
        }

        return (
            <Container>
                <Header refresh={true}/>
                <ContentDark>
            <Row style={{marginLeft:15,marginRight:15}}>
                <Row style={{textAlign:"center",marginTop:25}}>
                    <h1>济南第三职业中专</h1>
                </Row>
                <Row style={{marginTop:10}}>
                    <Col span={24}>
                        <Row>
                            <h3>1、学段与年级</h3>
                        </Row>
                        <Row style={{marginTop:10}}>
                            <Row>
                                <Col span={3}>
                                    <span className={"tag-span"}>层次：</span>
                                </Col>
                                <Col span={21}>
                                    {cengciTags}
                                </Col>
                            </Row>
                            <Row style={{marginTop:10}}>
                                <Col span={3}>
                                    <span className={"tag-span"}>年级：</span>
                                </Col>
                                <Col span={21}>
                                    {grdsTags}
                                </Col>
                            </Row>
                        </Row>
                    </Col>
                    <Col span={24} style={{marginTop:10}}>
                        <Row>
                            <h3>2、学校开设科目</h3>
                        </Row>
                        <Row style={{marginTop:10}}>
                            <Col span={3}>
                                <span className={"tag-span"}>开设科目：</span>
                            </Col>
                            <Col span={21}>
                                {subsTags}
                            </Col>
                        </Row>
                    </Col>
                    <Col span={24} style={{marginTop:10}}>
                        <Row>
                            <h3>3、学校分科选择</h3>
                        </Row>
                        <Row style={{marginTop:8}}>
                            <Row>
                                <Col span={3}>
                                    <span className={"tag-span"}>是否分科：</span>
                                </Col>
                                <Col span={21}>
                                    <Switch disabled={disabled} checkedChildren={`  分科`} unCheckedChildren="不分科" defaultChecked={false} style={{width:75,marginTop:10,marginLeft:5}} onClick={this.fenKeChange}/>
                                </Col>
                            </Row>
                            {clssT}
                            {subinT}
                        </Row>
                    </Col>
                </Row>
                <Modal
                    title={this.state.modalTitle}
                    visible={this.state.showModal}
                    maskClosable={false}
                    width={700}
                    bodyStyle={{minHeight:220,maxHeight:520,overflow:"auto"}}
                    centered
                    okText="确认"
                    cancelText="取消"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Transfer
                        dataSource={this.state.mockData}
                        targetKeys={this.state.targetKeys}
                        selectedKeys={this.state.selectedKeys}
                        showSearch
                        filterOption={this.filterOption}
                        onChange={this.handleChange}
                        onSelectChange={this.handleSelectChange}
                        render={item => item.title}
                    />
                </Modal>
            </Row>
                </ContentDark>
            </Container>
        )
    }
}

let _GrdClsSub = withRouter(GrdClsSub)
export default _GrdClsSub;
