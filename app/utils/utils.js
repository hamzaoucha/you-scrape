export const convertRelativeDates = (date) => {
    const now = new Date();
    
    const timeUnits = {
        year: 365 * 24 * 60 * 60 * 1000,
        month: 30 * 24 * 60 * 60 * 1000,
        week: 7 * 24 * 60 * 60 * 1000,
        day: 24 * 60 * 60 * 1000,
        hour: 60 * 60 * 1000,
        minute: 60 * 1000,
    }
    
    const [value, unit] = date.split(/\s+/);
    const timeAgo = parseInt(value, 10) * timeUnits[unit.toLowerCase().replace(/s$/, '')];
    const newDate = new Date(now - timeAgo);
    const formattedDate = formatDate(newDate)
    console.log(formattedDate);
    return formattedDate;
}

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}
   
function formatDate(date) {
    return [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
    ].join('-');
}


export const convertViewsToNumber = (viewsString) => {
    const viewsCount = viewsString.toLowerCase().split(' ')[0]
    if (viewsCount.endsWith('k')) {
       let numberPart = viewsCount.slice(0, -1);
       return parseInt(numberPart) * 1000;
    }
    else if (viewsCount.endsWith('m')) {
       let numberPart = viewsCount.slice(0, -1);
       return parseInt(numberPart) * 1000000;
    }
    else if (viewsCount.endsWith('b')) {
       let numberPart = viewsCount.slice(0, -1);
       return parseInt(numberPart) * 1000000000;
    }
    else {
       return parseInt(viewsCount);
    }
}

// export async function autoScroll(page){
//     await page.evaluate(async () => {
//         await new Promise((resolve) => {
//             let totalHeight = 0;
//             let distance = 100;
//             let timer = setInterval(() => {
//                 let scrollHeight = document.body.scrollHeight;
//                 window.scrollBy(0, distance);
//                 totalHeight += distance;
//                 if(totalHeight >= scrollHeight){
//                 clearInterval(timer);
//                 resolve();
//                 }
//             }, 100);
//         });
//     });
// }

export async function autoScroll(page) {
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        let timer = setInterval(() => {
          let scrollHeight = document.querySelector('ytd-app').scrollHeight;
          // Randomize scroll step
          let scrollStep = Math.round(Math.random() * 100) + 50;
          totalHeight += scrollStep;
          window.scrollBy(0, scrollStep);
          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, Math.round(Math.random() * 1000) + 500); // Randomize interval
      });
    });
  }

  