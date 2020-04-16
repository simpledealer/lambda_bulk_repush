import axios from 'axios';

import { findApps } from './Utils/queryDB';
import { listExecutions } from './listExecutions';

export async function handleRepush() {
  console.log('inside Repush handler');
  try {
    let list = await listExecutions();
    let apps = await findApps("trello");

    // apps.forEach(element => {
    //   axios({
    //     method: 'post',
    //     url: 'https://ba457hm7fl.execute-api.us-east-1.amazonaws.com/da/transformer/parse_form',
    //     data: {
    //       testMark: 'test',
    //       element
    //     }
    //   });
    // });
  } catch (e) { console.log(e); }

  console.log('Repush Done');
}
