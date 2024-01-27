import { atom} from 'recoil';

export const userInfo = atom({
  key: 'userInfo',
  default: localStorage.getItem('userInfo') || null,
});

export const userDeck = atom({
  key: 'userDeck',
  default: [{
    name:'',
    champions:[],
  }],
});
