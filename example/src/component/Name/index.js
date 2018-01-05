import React from 'react';
import {$connect} from '../../app';
import TextField from 'material-ui/TextField';

const UI =  ({label = '姓名', className = '', value, onChange}) => {
    const textFieldProps = {
        label,
        className,
        value,
        onChange
    };

    return <TextField {...textFieldProps} />;
};

const callbacks = {
    onChange({dispatch, getState}, event) {
        dispatch({
            type: 'name/changeValue',
            payload: event.target.value
        })
    }
};

const getUIState = function ({name}) {
    return {
        value: name.value
    }
};

export default $connect(getUIState, callbacks)(UI);