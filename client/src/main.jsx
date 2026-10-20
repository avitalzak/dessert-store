import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import './index.css'
import './theme/atelier.css'
import './theme/noir.css'
import './theme/rose.css'
import './theme/kiosk.css'
import './device/device.css'
import App from './App.jsx'
import { store } from './redux/store.js';
import { applyTheme } from './theme/theme.js';
import { getDeviceMode, isInsideTabletFrame, isTabletView } from './device/device.js';
import DeviceSwitch from './device/DeviceSwitch.jsx';
import TabletFrame from './device/TabletFrame.jsx';

// במצב טאבלט החלון הראשי מציג רק את מסגרת הטאבלט, והאתר עצמו רץ בתוכה
const showTabletFrame = getDeviceMode() === "tablet" && !isInsideTabletFrame

if (!showTabletFrame) applyTheme()
if (isTabletView) document.documentElement.classList.add("tablet")

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {showTabletFrame ? (
      <TabletFrame/>
    ) : (
      <Provider store={store}>
      <BrowserRouter>
      <App />
      {!isInsideTabletFrame && <DeviceSwitch/>}
      </BrowserRouter>
     </Provider>
    )}
  </StrictMode>,
)
