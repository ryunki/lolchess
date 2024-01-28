import axios from 'axios';
import { atom, selector} from 'recoil';

export const userInfo = atom({
  key: 'userInfo',
  default: JSON.parse(localStorage.getItem('userInfo')) || null,
});

export const userDeck = atom({
  key: 'userDeck',
  default: [{
    name:'',
    champions:[],
  }],
});

export const logoutSelector = selector({
  key:'logoutSelector',
  get: ({get}) => {
    return {
      logout: ()=>{
      localStorage.clear()
      // document.location.href = "/";
      axios.get('/api/logout')
    }
  }
  }
})
