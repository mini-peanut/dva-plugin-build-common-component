import dva, {connect} from 'dva';
import buildCommonComponent from 'dva-plugin-build-common-component';

const app = dva();

export default app;
export const {$connect, $model} = buildCommonComponent(app, connect);