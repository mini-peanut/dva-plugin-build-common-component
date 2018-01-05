# dva插件：build-common-component

用于封装大型公共业务组件

对于公共的业务组件如果封装成state+生命周期的组件，当组件的体量较大时不便维护

如果还用普通的dva组件形式，共用同一份model数据，相互之间会产生干扰（组件可以实例化多份，但model是单例的）

本插件结合两者的优势，在model中加入prefix字段，数据的读写都自动代理到相应prefix中，使用起来更简单，一个model即可解决redux体系中
公共业务组件中model会产生相互干扰的情况


## 特点
- 只有两个api($connect, $model)，上手成本低
- 组件更易于维护
- 数据之间不会产生干扰

## 原理

- 在原来model的基础上加一个字段prefix，注入model时，同一份数据根据prefix被分发为多份
- 引用组件时，传入prefix，格式为{namespace: prefix} 这个参数决定了
 1. getUIState，找到相应的namespace时，会映射到哪个prefix上的数据
 2. getState 会在找到相应的model后，找到哪个prefix上的数据
 2. dispatch 时会将action.meta附加上这个参数，prefix
 3. reducer收到dispatch的action后，会根据action.meta的prefix，决定最终更新哪个prefix下的state

### 如何用
app.js 引入dva-plugin-build-common-component

#### 项目引用 引入插件将实例化的dva，与connect传入得到$model, $connect 方法
```js
import dva, {connect} from 'dva';
import buildCommonComponent from 'dva-plugin-build-common-component';

const app = dva();

export default app;
export const {$connect, $model} = buildCommonComponent(app, connect);

```

index.js 入口处注入公共组件的model
```javascript
import app, {$model} from './app';
import models from './models';
import commonModels from './commonModels';


models.map(model => app.model(model));
commonModels.map(model => $model(model)); // 在这里注入公共组件的model
```

#### 编写公共组件 model 多加一个字段prefix，组件编写时使用$connect, 组件引用时传入相应的prefix
eg: 
model todo.js 相对之前多加一个prefix字段，需为数组格式
```javascript
export default {
    namespace: 'name',
    prefix: ['tabA', 'tabB', 'tabC'], // 多加一个prefix字段, state 将会根据该字段被分发为多份
    state: {
        value: ''
    },
    reducers: {
        changeValue(state, {payload: value}) {
            console.log(value)
            return {
                ...state,
                value
            }
        }
    },

};
```

index.js 使用组件时，用$connect 包裹，第一个参数还是原来的mapStateToProps，
第二个参数为一个对象，对象内的方法会以参数方式传给UI
(ps: 对象内的每个方法都已经在插件内部为其注入了第一个参数{dispatch, getState))
```js
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


```
 
 UI引用时仅仅需要多传入一个参数prefix, prefix是一个对象
```js
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
```

// 具体参照example下的代码
