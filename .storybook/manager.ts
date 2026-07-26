import { addons } from 'storybook/manager-api';
import MitoUITheme from './MitoUITheme';

addons.setConfig({
  theme: MitoUITheme,
});

window.onload = () => {
  const existingIcons = document.querySelectorAll('link[rel*="icon"]');
  existingIcons.forEach((icon) => icon.remove());

  const customFavicon = document.createElement('link');
  customFavicon.rel = 'icon';
  customFavicon.type = 'image/png';
  customFavicon.href = '/me-dev-logo-white.png?v=2';

  document.head.appendChild(customFavicon);
};