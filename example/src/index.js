import app, {$model} from './app';
import models from './models';
import commonModels from './commonModels';
import router from './router';

models.map(model => app.model(model));
commonModels.map(model => $model(model));


// 4. Router
app.router(router);

// 5. Start
app.start('#root');