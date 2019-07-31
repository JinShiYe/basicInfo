import React from "react";
import {Button,  Input,Avatar} from "antd";
// import images from "../images/headimg.png";
 function getColumns(type,that) {
        switch (type) {
            case "grd"://学段与年级
                let columns_grd=[
                    {
                        title: '序号',
                        key: 'xh',
                        align:"center",
                        dataIndex: 'xh',
                        width:30,
                    },
                    {
                        title: '学段编号',
                        key: 'code',
                        dataIndex: 'code',
                        width: 30,
                    },
                    {
                        title: '学段名称',
                        key: 'name',
                        dataIndex: 'name',
                        width: 100,
                    },
                    {
                        title: '年制',
                        key: 'pyear',
                        dataIndex: 'pyear',
                        width: 100,
                        align:"center",
                        render: (pyear) => (<span>{pyear} 年制</span>),
                    },
                    {
                        title: '包含年级',
                        key: 'sonnames',
                        dataIndex: 'sonnames',
                        width: 200,
                    },
                    {
                        title: '状态',
                        key: 'stat',
                        dataIndex: 'stat',
                        width: 80,
                        align:"center",
                        render: (stat) => (<span>{stat===1?"正常":"停用"}</span>),
                    },
                ]
                return columns_grd;;
            case "oth"://统一信息 其他8种类型
                let columns_oth=[
                    {
                        title: '序号',
                        key: 'xh',
                        align:"center",
                        dataIndex: 'xh',
                        width:30,
                    },
                    {
                        title: '编号',
                        key: 'code',
                        dataIndex: 'code',
                        width: 100,
                    },
                    {
                        title: '名称',
                        key: 'name',
                        dataIndex: 'name',
                        width: 180,
                    },
                    {
                        title: '状态',
                        key: 'stat',
                        dataIndex: 'stat',
                        width: 80,
                        align:"center",
                        render: (stat) => (<span>{stat===1?"正常":"停用"}</span>),
                    },
                ]
                return columns_oth;
            case "teach_card"://教师卡
                let teach_card=[
                    {
                        title: '序号',
                        align:"center",
                        dataIndex: 'xh',
                        width:100,
                    },
                    {
                        title: '老师姓名',
                        dataIndex: 'uname',
                        width: 200,
                    },
                    {
                        title: '卡地址',
                        dataIndex: 'newCardId',
                        render: (newCardId,record) => {
                            let error=null;
                            if(record.showError){
                                error=  <div className={"form-explain"}>{record.msg}</div>;
                            }
                            let input =null;
                            if(that.state.add_edit){
                                input=<Input placeholder="请输入卡地址" defaultValue={record.newCardId} onChange={event => {that.onchange(event,record)}}/>
                            }else{
                                input=<div>{record.newCardId}</div>
                            }
                            return(
                                <div>
                                    {input}
                                    {error}
                                </div>
                            )
                        },
                    },
                ]
                if(that.state.add_edit){
                    let col={
                            title: '操作',
                            dataIndex: '',
                            width: 100,
                            align:"center",
                            render: (record) => {
                                let btn=null;
                                if(record.showBtn){
                                    btn=<Button type="primary" onClick={()=>that.onSubmitRecord(record,"DG")}>保存</Button>
                                }
                                return btn
                            }
                        }
                    teach_card.push(col);
                }
                return teach_card;
            case "stu_card"://学生卡
                let stu_card=[
                    {
                        title: '序号',
                        align:"center",
                        dataIndex: 'xh',
                        width:100,
                    },
                    {
                        title: '年级名称',
                        dataIndex: 'grade_name',
                        width: 200,
                    },
                    {
                        title: '班级名称',
                        dataIndex: 'cls_name',
                        width: 200,
                    },
                    {
                        title: '学生姓名',
                        dataIndex: 'uname',
                        width: 200,
                    },
                    {
                        title: '卡地址',
                        dataIndex: 'newCardId',
                        render: (newCardId,record) => {
                            let error=null;
                            if(record.showError){
                                error=  <div className={"form-explain"}>{record.msg}</div>;
                            }
                            let input =null;
                            if(that.state.add_edit){
                                input=<Input placeholder="请输入卡地址" defaultValue={record.newCardId} onChange={event => {that.onchange(event,record)}}/>
                            }else{
                                input=<div>{record.newCardId}</div>
                            }
                            return(
                                <div>
                                    {input}
                                    {error}
                                </div>
                            )
                        },
                    },
                ]
                if(that.state.add_edit){
                    let col={
                        title: '操作',
                        dataIndex: '',
                        width: 100,
                        align:"center",
                        render: (record) => {
                            let btn=null;
                            if(record.showBtn){
                                btn=<Button type="primary" onClick={()=>that.onSubmitRecord(record,"DG")}>保存</Button>
                            }
                            return btn
                        }
                    }
                    stu_card.push(col);
                }
                return stu_card;
            case "stu_face"://学生人脸头像录入
                let stu_face=[
                    {
                        title: '序号',
                        align:"center",
                        dataIndex: 'xh',
                        width:100,
                    },
                    {
                        title: '用户ID',
                        dataIndex: 'uid',
                        width: 200,
                    },
                    {
                        title: '年级名称',
                        dataIndex: 'grade_name',
                        width: 100,
                    },
                    {
                        title: '班级名称',
                        dataIndex: 'cls_name',
                        width: 100,
                    },
                    {
                        title: '学生姓名',
                        dataIndex: 'uname',
                        width: 200,
                    },
                    {
                        title: '头像',
                        dataIndex: 'vcardimg',
                        width: 100,
                        align:"center",
                        render: (img) =>{
                            let domDiv=""
                            if(img!=""){
                                domDiv=<Avatar shape="square" size={64}  src={img} />
                            }else{
                                domDiv=<Avatar shape="square" size={64}  icon="user" />
                            }
                            return domDiv;
                        }
                    },
                    {
                        title: '同步状态',
                        dataIndex: 'vcardstat',
                        width: 100,
                        align:"center",
                        render: (vcardstat,record) =>{
                            let domDiv=null;
                            if(record.vcardimg==="" || record.vcardimg===null){
                                domDiv=<span>无同步状态</span>
                            }
                            return domDiv;
                        }
                    },
                ]

                if(that.state.add_edit){
                    let col={
                        title: '操作',
                        dataIndex: '',
                        width: 100,
                        align:"center",
                        render: (record) => {
                            return <Button type="primary" onClick={()=>that.showModal_edit(record)}>修改</Button>
                        }
                    }
                    stu_face.push(col);
                }
                return stu_face;
            case "teach_face"://教师人脸头像录入
                let teach_face=[
                    {
                        title: '序号',
                        align:"center",
                        dataIndex: 'xh',
                        width:100,
                    },
                    {
                        title: '用户ID',
                        dataIndex: 'uid',
                        width: 200,
                    },
                    {
                        title: '老师姓名',
                        dataIndex: 'uname',
                        width: 200,
                    },
                    {
                        title: '头像',
                        dataIndex: 'vcardimg',
                        width: 100,
                        align:"center",
                        render: (img) =>{
                            let domDiv=""
                            if(img!=""){
                                domDiv=<Avatar shape="square" size={64}  src={img} />
                            }else{
                                domDiv=<Avatar shape="square" size={64}  icon="user" />
                            }
                            return domDiv;
                        }
                    },
                    {
                        title: '同步状态',
                        dataIndex: 'vcardstat',
                        width: 100,
                        align:"center",
                        render: (vcardstat,record) =>{
                            let domDiv=null;
                            if(record.vcardimg==="" || record.vcardimg===null){
                                domDiv=<span>无同步状态</span>
                            }
                            return domDiv;
                        }
                    },
                ]
                if(that.state.add_edit){
                    let col={
                        title: '操作',
                        dataIndex: '',
                        width: 100,
                        align:"center",
                        render: (record) => {
                            return <Button type="primary" onClick={()=>that.showModal_edit(record)}>修改</Button>
                        }
                    }
                    teach_face.push(col);
                }
                return teach_face;

            default:
                return []
        }
 }
 export {getColumns};
