export const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5000' : '';
export const AVATAR_MODEL_PATH = './models/male.glb';
export const AVATAR_MODELS = [
  { path: '/models/male.glb', label: 'Avatar 1' },
  { path: '/models/male01.glb', label: 'Startwar' },
  { path: '/models/james_franco_avatar.glb', label: 'James Franco' },
];
