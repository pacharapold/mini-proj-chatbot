import moduleAlias from 'module-alias';
import path from 'path';

const rootPath = path.resolve(__dirname, '..');
const srcPath = path.resolve(rootPath, 'src');
const distPath = path.resolve(rootPath, 'dist');
let aliasPath;
switch (process.env.NODE_ENV) {
  case 'production':
  case 'development':
    aliasPath = `${distPath}`;
    break;
  default:
    aliasPath = `${srcPath}`;
    break;
}

moduleAlias.addAliases({
  '@app': `${aliasPath}/app`,
  '@common/service': `${aliasPath}/common/services`,
  '@common/error': `${aliasPath}/common/errors`,
  '@common/type': `${aliasPath}/common/types`,
  '@common/enum': `${aliasPath}/common/enums`,
  '@common/util': `${aliasPath}/common/utils`,
  '@common/repository': `${aliasPath}/common/repository`,
  '@common/queue': `${aliasPath}/common/queue`,
  '@config': `${aliasPath}/configs`,
  '@route': `${aliasPath}/controller-routes`,
  '@executor': `${aliasPath}/executors`,
  '@middleware': `${aliasPath}/middleware`,
  '@service': `${aliasPath}/services`,
  '@socket': `${aliasPath}/socket`,
  '@type': `${aliasPath}/types`,
  '@enum': `${aliasPath}/enums`,
  '@util': `${aliasPath}/utils`,
});
