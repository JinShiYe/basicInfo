import '../themes/schinfo.css';
import React, {Component} from 'react';
import {HashRouter, Route,  Switch, Redirect} from 'react-router-dom';
import {message} from 'antd';
import store from '../utils/store';
import myUtils from '../utils/myUtils';
import storekeyname from '../utils/storeKeyName';
import GrdAndCls from './grd-cls';
import CollegeDep from './college_department';
import Major from './major';
import Subject from './subject';
import TeachingEdition from  './teaching_edition'
import Fascicle from  './fascicle'
import Semester from  './semester'
import SubjectType from './subject_type'
import EquipmentType from './equipment_type'
//路由
class SchInfoMain extends Component {

    constructor(props){
        super(props)
    }


    componentWillMount() {
        window.addEventListener('message', function(ev) {}, false);
        let search=myUtils.getUrlSearch();
        let utoken= "";
        if(search){
            utoken=search.access_token;
            store.set(storekeyname.TOKEN, utoken);
        }else{
            utoken="ZmQzZWE0YjMtNmViOS00OTdkLWJiMWMtMGM4ODBjMGU4ZmQ3";
            store.set(storekeyname.TOKEN, utoken);
        }
    }


    render() {
        return (
            <div>
                <HashRouter>
                    {/*<Switch>*/}
                    <Route  path='/grd_cls' component={GrdAndCls}/>{/*学段及年级*/}
                    <Route  path='/college_department' component={CollegeDep}/>{/*院系*/}
                    <Route  path='/major' component={Major}/>{/*专业*/}
                    <Route  path='/subject' component={Subject}/>{/*科目*/}
                    <Route  path='/teaching_edition' component={TeachingEdition}/>{/*教版*/}
                    <Route  path='/fascicle' component={Fascicle}/>{/*教材分册*/}
                    <Route  path='/semester' component={Semester}/>{/*季期*/}
                    <Route  path='/subject_type' component={SubjectType}/>{/*分科*/}
                    <Route  path='/equipment_type' component={EquipmentType}/>{/*设备类型*/}
                    {/*</Switch>*/}
                </HashRouter>
            </div>
        )
    }
}
export default SchInfoMain;
