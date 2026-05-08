import { AppRegistry } from 'react-native-web';
import App from './App.jsx';

const appName = 'WealthCurator';

AppRegistry.registerComponent(appName, () => App);

const rootTag = document.getElementById('root');
if (!rootTag) {
  throw new Error('Root element #root not found');
}

AppRegistry.runApplication(appName, {
  initialProps: {},
  rootTag,
});
