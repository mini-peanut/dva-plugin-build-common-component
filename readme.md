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
- 从重复的reducer，handler解脱出来，一套搞定多份实例

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

export const app = dva();

export const {$model, $connect} = buildCommonComponent(app, connect);

```

index.js 入口处注入公共组件的model
```javascript
import app, {$model} from './app.js';
import modelList from './path/to/normal/models';
import commonModelList from './path/to/commonModels';


modelList.map(model => app.model(model));
commonModelList.map(model => $model(model)) // 在这里注入公共组件的model
```

#### 编写公共组件 model 多加一个字段prefix，组件编写时使用$connect, 组件引用时传入相应的prefix
eg: 
model todo.js 相对之前多加一个prefix字段，需为数组格式
```javascript
export default {
    namespace: 'count',
    prefix: ['count1', 'count2'], // 多加一个prefix字段, state 将会根据该字段被分发为多份
    state: {
        count: 0,
    },
    reducers: {
        addCount(state) {
            return {
                ...state,
                count: state.count++
            }
        }
    },
    //...
}
```

index.js 使用组件时，用$connect 包裹，第一个参数还是原来的mapStateToProps，
第二个参数为一个对象，对象内的方法会以参数方式传给UI
```js
import {$connect} from 'app';
export default $connect(
    ({count})=> {
        return {
            count: count++
        }
    },
    {
        onAdd({dispatch, getState}, ...args) {
            dispatch({
                type: 'count/addCount'
            })
        }
    }
)(UI); 

function UI({count, onAdd}) {
  return ({onAdd}) => {
      return <div>
            <span onClick={onAdd()}>{count}</span>
        </div>
  }
}


```
 
 UI引用时仅仅需要多传入一个参数prefix, prefix是一个对象
```js
import Count from './path/../';

export default () => {
    return <div>
    // otherElement
    <Count {{prefix: {count: 'count1'}}}/>
    <Count {{prefix: {count: 'count2'}}}/>
</div>
}
```
