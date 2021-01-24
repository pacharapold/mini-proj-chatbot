import './aliases';

import App from '@app';
import config from '@config/config';

const app = new App(config);
// tslint:disable-next-line: no-floating-promises
app.start();
export default app;
