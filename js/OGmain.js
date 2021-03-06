/*eslint-disable */

const $newJournalButton = document.querySelector('[button = "new-journal"]');
const $draftButton = document.querySelector('[button = "drafts"]');
const $graphButton = document.querySelectorAll('[button = "view-moodgraph"]');
const $homeDiv = document.querySelector('[data-view = "home-screen"]');
const $gratefulDiv = document.querySelector('[data-view = "grateful"]');
const $5thingsForm = document.getElementById('five-things');
const $journalTextForm = document.querySelector('#journal-cont');
const $headerUl = document.querySelector('.header-list');
const $headerLogo = document.querySelector('[data = "header-logo"]');
const $dateH2 = document.querySelectorAll('[data="date"]');
const $saveDraftButton = document.querySelectorAll('[button = "save-draft"]');
const $nJContButton = document.querySelector('[button = "new-journal-cont"]');
const $grateful1 = document.getElementById('grateful1');
const $grateful2 = document.getElementById('grateful2');
const $grateful3 = document.getElementById('grateful3');
const $grateful4 = document.getElementById('grateful4');
const $grateful5 = document.getElementById('grateful5');
const $fiveThings = [$grateful1, $grateful2, $grateful3, $grateful4, $grateful5];
const $NJDiv = document.querySelector('[data-view="new-journal"]');
const $NJTextCont = document.querySelector('#journal-cont-text');
const $doneButton = document.querySelector('[button="done"]');
const $modalDiv = document.querySelector('[data-view="done-modal"]');
const $scoreH1 = document.querySelector('[data="modal-score"]');
const $modalQuoteP = document.querySelector('[data="modal-quote"]');
const $homeButton = document.querySelectorAll('[button="home"]');
const $graphDiv = document.querySelector('[data-view ="graph"]');
const $graphCanv = document.querySelector('#myChart');
const $draftDiv = document.querySelector('[data-view = "draft"]');
const $draftUl = document.querySelector('[data="draft-ul"]');
const $draftDivList = document.querySelector('[data="draft-list"]');
const $draftDeleteModal = document.querySelector('[data="draft-delete-modal"]');
const $draftDeleteModalCont = document.querySelector('[data="draft-delete-cont"]');
const $pgList = [$gratefulDiv, $NJDiv, $modalDiv, $graphDiv, $draftDiv, $draftDeleteModalCont, $draftDeleteModal];
const monthArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
let currentObj = null;
let date;
let formattedDate;

function showPage(show, hide) {
  show.setAttribute('class', 'container');
  hide.setAttribute('class', 'hidden');
}

function setHeaderID() {
  $headerLogo.setAttribute('id', 'header-logo');
}

function removeHeaderID() {
  $headerLogo.setAttribute('id', null);
}

function getDate() {
  date = new Date();
  let month = date.getMonth();
  month = monthArr[month];
  let day = date.getDate();
  day = day.toString();
  let year = date.getFullYear();
  year = year.toString();
  formattedDate = month + ' ' + day + ', ' + year;
}

function removePageID() {
  if (($headerUl.childNodes.length) > 3) {
    const $pgID = document.querySelector('[data = "pg-ID"]');
    $headerUl.removeChild($pgID);
  }
}

function getScoreNum(score) {
  if (score === 'P+') {
    // eslint-disable-next-line no-undef
    currentObj.scoreNum = 2;
  } else if (score === 'P') {
    // eslint-disable-next-line no-undef
    currentObj.scoreNum = 1;
  } else if (score === 'NEU') {
    // eslint-disable-next-line no-undef
    currentObj.scoreNum = 0;
  } else if (score === 'N') {
    // eslint-disable-next-line no-undef
    currentObj.scoreNum = -1;
  } else if (score === 'N+') {
    // eslint-disable-next-line no-undef
    currentObj.scoreNum = -2;
  } else {
    score = "NEU"
    currentObj.scoreNum = 0;
  }
}

function randQuote(score) {
  let quote = '';
  // eslint-disable-next-line no-undef
  for (const key in quotes) {
    if (key === score) {
      // eslint-disable-next-line no-undef
      const quoteArr = quotes[key];
      const index = Math.floor(Math.random() * (quoteArr.length - 1));
      quote = quoteArr[index];
      return quote;
    }
  }
}

function afterAPI() {
  $5thingsForm.reset();
  $journalTextForm.reset();
  // eslint-disable-next-line no-undef
  getScoreNum(currentObj.score);
  // eslint-disable-next-line no-undef
  const modalScore = `Your Score: ${currentObj.scoreNum}`;
  // eslint-disable-next-line no-undef
  const quote = randQuote(currentObj.score);
  $scoreH1.textContent = modalScore;
  $modalQuoteP.textContent = quote;
  removePageID();
  // eslint-disable-next-line no-undef
  entries.push(currentObj);
  currentObj = null;
  showPage($modalDiv, $NJDiv);
}
// eslint-disable-next-line no-unused-vars
function sendGraphAPI(entries) {
  const xlabels = [];
  const ylabels = [];
  for (const ent of entries) {
    xlabels.push(ent.formattedDate);
    ylabels.push(ent.scoreNum);
  }
  // eslint-disable-next-line no-unused-vars
  const scatterChart = new Chart($graphCanv, { // eslint-disable no-undef
    type: 'line',
    data: {
      labels: xlabels,
      datasets: [{
        label: 'Daily MoodScore',
        data: ylabels,
        fill: false,
        backgroundColor: '#292929',
        borderColor: '#B5CDA3'
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            suggestedMin: -2,
            suggestedMax: 2,
            stepSize: 1,
            callback: tickVal => {
              const vals = ['N+', 'N', 'Neu', 'P', 'P+'];
              if (tickVal === -2) {
                return vals[0];
              } else if (tickVal === -1) {
                return vals[1];
              } else if (tickVal === 0) {
                return vals[2];
              } else if (tickVal === 1) {
                return vals[3];
              } else {
                return vals[4];
              }
            }
          }
        }]
      }
    }
  });
}

function saveDraft(event, arrPush) {
//  const hL = document.getElementById('header-logo');
      if (drafts.editing === null) {
        event.preventDefault();
        // eslint-disable-next-line no-undef
        currentObj = new Entry();
        currentObj.draftNum = drafts.nextDraftNum
        drafts.nextDraftNum++
        currentObj.title = date;
        currentObj.formattedDate = formattedDate;
        for (const item of $fiveThings) {
          const txt = item.value;
          currentObj.fiveThings.push(txt);
        }
        if ($journalTextForm.value !== undefined) {
          currentObj.text = $journalTextForm.value;
        }
        // eslint-disable-next-line no-undef
        if (arrPush !== null) {
          arrPush.push(currentObj);
        }
      } else if (drafts.editing !== null) {
        for (let i = 0; i < ($fiveThings.length - 1); i++) {
          const txt = $fiveThings[i].value;
          drafts.editing.fiveThings[i] = txt;
        }
        if ($NJTextCont.value.length > 0) {
          drafts.editing.text = $NJTextCont.value;
        }
        //find og drafts.editing obj in drafts.drafts and reassign
        for (let dr of drafts.drafts) {
          if (dr.draftNum === drafts.editing.draftNum) {
            dr = drafts.editing
          }
        }

      }
}

function sendMoodReq(text) {
  const formdata = new FormData();
  formdata.append('key', 'e599b98b4c266944eb2b0f2ada2724cc');
  formdata.append('txt', text);
  formdata.append('lang', 'auto');

  const requestOptions = {
    method: 'POST',
    body: formdata,
    redirect: 'follow'
  };

  fetch('https://api.meaningcloud.com/sentiment-2.1', requestOptions)
    .then(response => response.json())
    .then(responseJSON => {
      // eslint-disable-next-line no-undef
      currentObj.response = responseJSON;
      // eslint-disable-next-line no-undef
      currentObj.score = currentObj.response.score_tag;
      afterAPI();
      // eslint-disable-next-line no-undef
      currentObj = null;
    })
    // eslint-disable-next-line node/handle-callback-err
    .catch(error =>
      window.alert("We don't know what happened there, but something went wrong. Please try to submit again"));
}

function makeDraftBox(draft) {
  const $draftImgDiv = document.createElement('div');
  const $draftImg = document.createElement('img');
  $draftImg.setAttribute('class', 'item-img');
  $draftImg.setAttribute('src', 'images/ajax-logo.jpg');
  $draftImg.setAttribute('alt', 'ajax-logo');
  $draftImgDiv.appendChild($draftImg);
  const $draftDivH2 = document.createElement('div');
  const $draftH2 = document.createElement('h2');
  $draftDivH2.setAttribute('class', 'container');
  $draftH2.setAttribute('class', 'header-logo work-sans');
  $draftH2.textContent = `Date: ${draft.formattedDate}`;
  $draftDivH2.appendChild($draftH2);

  const $draftOptionsDiv = document.createElement('div');
  $draftOptionsDiv.setAttribute('class', 'row div-background small-margin')
  const $draftIt = document.createElement('i');
  $draftIt.setAttribute('class', 'fas fa-trash-alt');
  $draftIt.setAttribute('data', draft.draftNum)
  $draftIt.setAttribute('funct', 'delete')
  const $draftIp = document.createElement('i');
  $draftIp.setAttribute('class', 'fas fa-pen-fancy')
  $draftIp.setAttribute('data', draft.draftNum)
  $draftIp.setAttribute('funct', 'edit')
  $draftOptionsDiv.appendChild($draftIt);
  $draftOptionsDiv.appendChild($draftIp);

  const $draftContDiv = document.createElement('div');
  $draftContDiv.setAttribute('class', 'row div-background');
  $draftContDiv.appendChild($draftImgDiv);
  $draftContDiv.appendChild($draftDivH2);

  const $draftFullContDiv = document.createElement('div');
  $draftFullContDiv.setAttribute('class', 'container');
  $draftFullContDiv.appendChild($draftContDiv);
  $draftFullContDiv.appendChild($draftOptionsDiv);

  const $draftLi = document.createElement('li');
  $draftLi.setAttribute('class', 'container draft-li');
  const draftId = draft.draftNum;
  $draftLi.setAttribute('data', draftId);
  $draftLi.appendChild($draftFullContDiv);


  return $draftLi
}

function journalContExists() {
  let contentExists = false
  for (const item of $5thingsForm) {
    if (item.value.length > 0) {
      contentExists = true
      break
    }
  }
  if ((contentExists === false) && ($NJTextCont.value.length > 0)) {
    contentExists = true;
  }
  return contentExists
}

function compileDraftBoxes() {
  if (drafts.drafts.length > 0) {
    const $noDraft = document.querySelector('[data="no-drafts"]');
    if ($noDraft) {
      $draftUl.removeChild($noDraft);
    }
    for (const dr of drafts.drafts) {
      if (!drafts.renderedTitles.includes(dr.draftNum)) {
      const $draftLi = makeDraftBox(dr, dr.draftNum);
      drafts.renderedTitles.push(dr.draftNum)
      $draftUl.appendChild($draftLi);
    }
    }
  } else {
    let $noDraftP = document.createElement('p');
    $noDraftP.setAttribute('class', 'roboto');
    $noDraftP.textContent = "There are no saved drafts yet";
    const $noDraftLi = document.createElement('li');
    $noDraftLi.setAttribute('data', 'no-drafts')
    $noDraftLi.appendChild($noDraftP);
    $draftUl.appendChild($noDraftLi)

  }
}

function editDraft(draft) {
  let count = 0;
    for (const txtBox of $fiveThings) {
      txtBox.textContent = draft.fiveThings[count];
      count++
    }
    $NJTextCont.textContent = drafts.editing.text
    for ($dtH2 of $dateH2) {
      $dtH2.textContent = draft.formattedDate;
    }
  }

function deleteDraft(draft) {
  const drNum = draft.draftNum;
  const $drLi = document.querySelector(`[data="${drNum}"]`);
  const COIndexDr = drafts.drafts.indexOf(draft);
  const COIndexRT = drafts.renderedTitles.indexOf(drNum);
  if ((COIndexDr > -1) && (COIndexRT > -1)) {
    drafts.drafts.splice(COIndexDr,1);
    drafts.renderedTitles.splice(COIndexRT,1);
    $draftUl.removeChild($drLi)
  }
}

window.addEventListener('click', function (e) {
  for (const sm of $saveDraftButton) {
    if (e.target === sm) {
      const contExists = journalContExists();
        if (contExists === true){
          saveDraft(e, drafts.drafts);
        drafts.editing = null
        currentObj = null;
        for (const pg of $pgList) {
          removeHeaderID();
          removePageID();
          showPage($homeDiv, pg);
        }
        $journalTextForm.reset();
        $5thingsForm.reset();
            break
        } else {
          window.alert(`There is nothing to save! We'll take you back to the home page so you can come back to this later`)
        }
    }
  }
});

$headerLogo.addEventListener('click', function (e) {
  const event = e;
  const hL = document.getElementById('header-logo');
  const contentExists = journalContExists();
  if ((hL !== null) && ($graphDiv.attributes.class.value === 'hidden')) {
    if (contentExists === true) {
    window.alert('Your journal entry was saved as a draft!');
     saveDraft(event, drafts.drafts)
      drafts.editing = null
      currentObj = null;
      for (const pg of $pgList) {
        removeHeaderID();
        removePageID();
        showPage($homeDiv, pg);
      }
      $journalTextForm.reset();
      $5thingsForm.reset();
    } else {
      for (const page of $pgList) {
        showPage($homeDiv, page);
      }
    }

  }
  });

window.addEventListener('click', function (e) {
  for (const gr of $graphButton){
    if (e.target == gr) {
    for (const pg of $pgList) {
    removeHeaderID();
    removePageID();
    showPage($graphDiv, pg);
  }
      showPage($graphDiv, $homeDiv)
  setHeaderID();
  const $nJHeader = document.createElement('li');
  const $nJHeaderH2 = document.createElement('h2');
  $nJHeaderH2.textContent = 'MoodGraph';
  $nJHeader.setAttribute('data', 'pg-ID');
  $nJHeader.appendChild($nJHeaderH2);
  $headerUl.appendChild($nJHeader);
  $nJHeaderH2.setAttribute('class', 'new-journal-header work-sans');
  $headerLogo.setAttribute('class', 'header-logo work-sans');
  // eslint-disable-next-line no-undef
  sendGraphAPI(entries);
  }
    }
});

window.addEventListener('click', function (e) {
  for (const but of $homeButton) {
    if (e.target === but) {
      for (const pg of $pgList) {
        removeHeaderID();
        removePageID();
        showPage($homeDiv, pg);
      }
      break;
    }
  }
});

// home page eventListeners
$newJournalButton.addEventListener('click', function (e) {
  showPage($gratefulDiv, $homeDiv);
  setHeaderID();
  const $nJHeader = document.createElement('li');
  const $nJHeaderH2 = document.createElement('h2');
  getDate();
  $nJHeaderH2.textContent = 'New Journal Entry';
  $nJHeader.setAttribute('data', 'pg-ID');
  $nJHeader.appendChild($nJHeaderH2);
  $headerUl.appendChild($nJHeader);
  $nJHeaderH2.setAttribute('class', 'new-journal-header work-sans');
  $headerLogo.setAttribute('class', 'header-logo work-sans');
  let item;
  for (item of $dateH2) {
    item.textContent = 'Date: ' + formattedDate;
  }
  for (const item of $fiveThings) {
    item.textContent = "";
  }
});



$draftButton.addEventListener('click', function (e) {
  showPage($draftDiv, $homeDiv);
  const $draftHeader = document.createElement('li');
  const $draftHeaderH2 = document.createElement('h2');
  $draftHeaderH2.textContent = 'Drafts';
  $draftHeader.setAttribute('data', 'pg-ID');
  $draftHeader.appendChild($draftHeaderH2);
  $headerUl.appendChild($draftHeader);
  $draftHeaderH2.setAttribute('class', 'new-journal-header work-sans');
  $headerLogo.setAttribute('class', 'header-logo work-sans');
  setHeaderID();
  compileDraftBoxes();
});

// gratefulDiv eventListeners
$nJContButton.addEventListener('click', function (e) {
  e.preventDefault();
  showPage($NJDiv, $gratefulDiv);
  // eslint-disable-next-line no-undef
  saveDraft(e, null)
  if ((currentObj === null) && (drafts.editing !== null)) {
    currentObj = drafts.editing
  }
  });

$doneButton.addEventListener('click', function (e) {
  if (($NJTextCont.value.length) > 0) {
    e.preventDefault();
    if (drafts.editing !== null) {
      currentObj = drafts.editing;
    }
    // eslint-disable-next-line no-undef
    currentObj.text = $NJTextCont.value;
    // eslint-disable-next-line no-undef
    sendMoodReq(currentObj.text);
    deleteDraft(drafts.editing)
    drafts.editing = null;
    removeHeaderID();
  } else {
    window.alert("It looks like you forgot to write something. Tell us what's on your mind! (or save it as a draft for later)");
  }
});

// draftDiv eventListeners

$draftUl.addEventListener('click', (e) => {
  const tar = e.target;
  if ((tar.getAttribute('data') !== null) && (tar.getAttribute('funct')!== null)){
  let tarNum = tar.getAttribute('data')
  tarNum = parseInt(tarNum)
  const tarFunct = tar.getAttribute('funct')
    for (const d of drafts.drafts) {
      if (d.draftNum === tarNum) {
        drafts.editing = d
        break
      }
  }
    if ((tarFunct === 'edit') && (drafts.editing !== null)) {
      editDraft(drafts.editing);
      showPage($gratefulDiv,$draftDiv);
  } else if ((tarFunct === 'delete') && (drafts.editing !== null)){
    showPage($draftDeleteModal,$draftDivList);
    const $modalDelBut = document.querySelector('[data="draftmodal-delete-but"]');
    const $modalCanBut = document.querySelector('[data="draftmodal-cancel-but"]');
    $draftDeleteModal.setAttribute('class', 'overlay')
    $draftDeleteModalCont.setAttribute('class', 'container modal')
    $draftDeleteModalCont.addEventListener('click', (event2) => {
      if ((event2.target === $modalDelBut) || (event2.target === $modalCanBut)) {
        if (event2.target === $modalDelBut) {
          deleteDraft(drafts.editing);
          showPage($draftDivList,$draftDeleteModal);
          $draftDeleteModalCont.setAttribute('class', 'hidden');
          drafts.editing = null
        } else {
          showPage($draftDivList, $draftDeleteModal);
          $draftDeleteModalCont.setAttribute('class', 'hidden');
          currentObj = null;
        }
      }
    })

}
  }
})
