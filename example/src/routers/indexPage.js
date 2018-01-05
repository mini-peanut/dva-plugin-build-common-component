import React from 'react';
import {connect} from 'dva';
import Tabs, { Tab } from 'material-ui/Tabs';
import Name from '../component/Name'
import './style.less';

const TAB_VALUE_MAP = {
    tabA: 'name',
    tabB: 'petName',
    tabC: 'englishName'
};

const LABEL_MAP = {
    tabA: '姓名',
    tabB: '奶名',
    tabC: '英文名'
};


const UI = function({value, dispatch}) {
    return (
        <div className="container">
            <Tabs value={value} onChange={(e, value) => handleChange(dispatch, value)}>
                {
                    Object.keys(TAB_VALUE_MAP).map(key => {
                        return <Tab key={key} label={TAB_VALUE_MAP[key]} value={key} />
                    })
                }
            </Tabs>
            <div className="main">
                <Name {...{prefix: {name: value}, label: LABEL_MAP[value]}}/>
            </div>

        </div>
    );
};

function handleChange(dispatch, value) {
    dispatch({
        type: 'tab/switchTab',
        payload: value
    })
}

function getUIState({tab}) {
    return {
        value: tab.value
    }
}

export default connect(getUIState)(UI);