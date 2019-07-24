import React from "react";
 function getColumns(type) {
        switch (type) {
            case "grd":
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
            case "oth":
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
            default:
                return []
        }
 }
 export {getColumns};
