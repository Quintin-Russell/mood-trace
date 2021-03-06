const $newJournalButton = $("[button='new-journal']")

const $draftButton = $('[button = "drafts"]')

const $graphButton = $('[button = "view-moodgraph"]')

const $homeDiv = $('[data-view = "home-screen"]');

const $gratefulDiv = $('[data-view = "grateful"]');

const $5thingsForm = $('#five-things');

const $journalTextForm = $('#journal-cont');

const $headerUl = $('.header-list').first();

const $headerLogo = $('[data = "header-logo"]')

const $dateH2 = $('[data="date"]');

const $saveDraftButton = $('[button = "save-draft"]');

const $nJContButton = $('[button = "new-journal-cont"]');

const $5things = $("ul#grateful-ul li textarea")

const $NJDiv = $('[data-view="new-journal"]').first();

const $NJTextCont = $('#journal-cont-text');

const $doneButton = $('[button="done"]');

const $modalDiv = $('[data-view="done-modal"]');

const $scoreH1 = $('[data="modal-score"]');

const $modalQuoteP = $('[data="modal-quote"]');

const $homeButton = $('[button="home"]');

const $graphDiv = $('[data-view ="graph"]');

const $graphCanv = $('#myChart');

const $draftDiv = $('[data-view = "draft"]');

const $draftUl = $('[data="draft-ul"]');

const $draftDivList = $('[data="draft-list"]');

const $draftDeleteModal = $('[data="draft-delete-modal"]');

const $draftDeleteModalCont = $('[data="draft-delete-cont"]');

const $pgList = [$gratefulDiv, $NJDiv, $modalDiv, $graphDiv, $draftDiv, $draftDeleteModalCont, $draftDeleteModal];

const monthArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
let currentObj = null;
let date;
let formattedDate;

const showPage = (show, hide) => {
  $(show).attr('class','container');
  $(hide).attr('class', 'hidden');
}

const setHeaderID = () => {
  $($headerLogo).attr('id', 'header-logo');
}

const removeHeaderID = () => {
  $($headerLogo).attr('id', null);
}

const getDate = () => {
  date = new Date();
  let month = date.getMonth();
  month = monthArr[month];
  let day = date.getDate();
  day = day.toString();
  let year = date.getFullYear();
  year = year.toString();
  formattedDate = `${month} ${day}, ${year}`;
}

const removePageID = () => {
  if (($($headerUl).children.length) > 1) {
    const $pgID = $('[data = "pg-ID"]');
    $($pgID).remove();
  }
}

const getScoreNum = (score) => {
  if (score === 'P+') {
    currentObj.scoreNum = 2;
  } else if (score === 'P') {
    currentObj.scoreNum = 1;
  } else if (score === 'NEU') {
    currentObj.scoreNum = 0;
  } else if (score === 'N') {
    currentObj.scoreNum = -1;
  } else if (score === 'N+') {
    currentObj.scoreNum = -2;
  } else {
    score = "NEU"
    currentObj.scoreNum = 0;
  }
}

const randQuote = (score) => {
  let quote = '';
  for (const key in quotes) {
    if (key === score) {
      const quoteArr = quotes[key];
      const index = Math.floor(Math.random() * (quoteArr.length - 1));
      quote = quoteArr[index];
      return quote;
    }
  }
}

const afterAPI = () => {
  $($5thingsForm)[0].reset();
  $($journalTextForm)[0].reset();
  getScoreNum(currentObj.score);
  const modalScore = `Your Score: ${currentObj.scoreNum}`;
  const quote = randQuote(currentObj.score);
  $($scoreH1).text(modalScore);
  $($modalQuoteP).text(quote);
  removePageID();
  entries.push(currentObj);
  currentObj = null;
  showPage($modalDiv, $NJDiv);
}

const sendGraphAPI = (entries) => {
  const xlabels = [];
  const ylabels = [];
  for (const ent of entries) {
    xlabels.push(ent.formattedDate);
    ylabels.push(ent.scoreNum);
  }
  const scatterChart = new Chart($graphCanv, {
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

const saveDraft = (event, arrPush) => {
      const draftsLenBefore = drafts.drafts.length
      if (!drafts.editing) {
        event.preventDefault();
        currentObj = new Entry();
        currentObj.draftNum = drafts.nextDraftNum
        drafts.nextDraftNum++
        currentObj.title = date;
        currentObj.formattedDate = formattedDate;
        for (const item of $5things) {
          currentObj.fiveThings.push(`${$(item).val()}`);
        }
        const $journalText = $('textarea#journal-cont-text')
        currentObj.text = $($journalText).val();

        if (arrPush) {
          arrPush.push(currentObj);
        }
      } else {
        for (let i = 0; i < ($5things.length - 1); i++) {
          drafts.editing.fiveThings[i] = $($5things[i]).val();
        }

        if ($($NJTextCont).val().length > 0) drafts.editing.text = $($NJTextCont).val();

        for (let dr of drafts.drafts) {
          if (dr.draftNum === drafts.editing.draftNum) dr = drafts.editing
        }
      }
      if (draftsLenBefore !== drafts.drafts.length && arrPush) {
        alert('Your journal entry was saved as a draft!')
      }
}

const sendMoodReq = (text) => {
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
      currentObj.response = responseJSON;
      currentObj.score = currentObj.response.score_tag;
      afterAPI();
      currentObj = null;
    })
    .catch(error =>{
      window.alert("We don't know what happened there, but something went wrong. Please try to submit again")});
}

const makeDraftBox = (draft) => {
  const $draftLi = `
    <li class="container draft-li"
    data=${draft.draftNum}>
      <div class="container">
        <div class="row div-background">
          <div>
            <img
              class="item-img"
              src="images/ajax-logo.jpg"
              alt="ajax-logo"
            />
          </div>
          <div class="container">
            <h2 class="header-logo work-sans">
              Date: ${draft.formattedDate}
            </h2>
          </div>
        </div>
          <div class="row div-background small-margin">
            <i class="fas fa-trash-alt"
              funct="delete"
              data=${draft.draftNum}
            ></i>
            <i class="fas fa-pen-fancy"
            funct="edit"
            data=${draft.draftNum}
            ></i>
        </div>
      </div>
    </li>
  `

  return $draftLi
}

const journalContExists = () => {
  for (const item of $5things) {
    if ($(item).val().length > 0) {
      return true
    }
  }
  if (($($NJTextCont).val().length > 0)) {
    return true;
  }
  return false
}

const compileDraftBoxes = () => {
  if (drafts.drafts.length > 0) {
    const $noDraft = $('[data="no-drafts"]');
    if ($noDraft) {
      $($draftUl)
        .remove($noDraft);
    }
    for (const dr of drafts.drafts) {
      if (!drafts.renderedTitles.includes(dr.draftNum)) {
      const $draftLi = makeDraftBox(dr, dr.draftNum);
      drafts.renderedTitles.push(dr.draftNum)
      $($draftUl)
        .append($draftLi);
    }
    }
  } else {
    $($draftUl)
      .append(`
        <li data="no-drafts">
          <p className="roboto">There are no saved drafts yet</p>
        </li>
        `
        )

  }
}

const editDraft = (draft) => {
  let count = 0;
    for (const txtBox of $5things) {
      $(txtBox).val(draft.fiveThings[count]);
      count++
    }
  $($NJTextCont).val(drafts.editing.text)
    for ($dtH2 of $dateH2) {
      $($dtH2).val(draft.formattedDate);
    }
  }

const deleteDraft = (draft) => {
  const drNum = draft.draftNum;
  const $drLi = $(`[data="${drNum}"]`);
  const COIndexDr = drafts.drafts.indexOf(draft);
  const COIndexRT = drafts.renderedTitles.indexOf(drNum);
  if ((COIndexDr > -1) && (COIndexRT > -1)) {
    drafts.drafts.splice(COIndexDr,1);
    drafts.renderedTitles.splice(COIndexRT,1);
    $($drLi).remove()
  }
}

$(window).click((e) => {
  for (const sm of $saveDraftButton) {
    if (e.target === sm) {
        for (const pg of $pgList) {
          removeHeaderID();
          removePageID();
          showPage($homeDiv, pg);
        }
        if (journalContExists()){
          saveDraft(e, drafts.drafts);
          drafts.editing = null
          currentObj = null;
          $($journalTextForm)[0].reset();
          $($5thingsForm)[0].reset();
            break
        } else {
          window.alert(`There is nothing to save! We'll take you back to the home page so you can come back to this later`)
        }

      }
  }
});

$($headerLogo).click((e) => {
  const hL = $('#header-logo');
  if ((hL)) {
    if (journalContExists() && ($($graphDiv).attr('class') === 'hidden')) {
      window.alert('Your journal entry was saved as a draft!');
      saveDraft(e, drafts.drafts)
      drafts.editing = null
      currentObj = null;
      $($journalTextForm)[0].reset();
      $($5thingsForm)[0].reset();
    }
    for (const page of $pgList) {
      showPage($homeDiv, page);
    }
    removeHeaderID();
    removePageID();
  }
  });

$(window).click((e) => {
  for (const gr of $graphButton){
    if (e.target == gr) {
    for (const pg of $pgList) {
    removeHeaderID();
    removePageID();
    showPage($graphDiv, pg);
  }
  showPage($graphDiv, $homeDiv)
  setHeaderID();

  $($headerUl).append(`
    <li data="pg-ID">
      <h2 class='new-journal-header work-sans'>MoodGraph</h2>
    </li>
    `
  )
  $($headerLogo).attr('header-logo work-sans')
  sendGraphAPI(entries);
  }
    }
});

$(window).click((e) => {
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
$($newJournalButton).click((e) => {
  showPage($gratefulDiv, $homeDiv);
  setHeaderID();
  // $headerUl.appendChild($nJHeader);
  $($headerUl).append(`
    <li data='pg-ID'>
      <h2 class='new-journal-header work-sans'>New Journal Entry</h2>
    </li>
    `
  )
  // const $nJHeader = document.createElement('li');
  //   $nJHeader.setAttribute('data', 'pg-ID');
  //   $nJHeader.appendChild($nJHeaderH2);

  // const $nJHeaderH2 = document.createElement('h2');
  //  $nJHeaderH2.textContent = 'New Journal Entry';
  //   $nJHeaderH2.setAttribute('class', 'new-journal-header work-sans');
  getDate();

  $($headerLogo).attr('class', 'header-logo work-sans');

  for (let item of $dateH2) {
    $(item).text(`Date: ${formattedDate}`);
  }
  for (const item of $5things) {
    $(item).text("");
  }
});



$($draftButton).click((e) => {
  showPage($draftDiv, $homeDiv);
  $($headerUl).append(`
    <li data='pg-ID'>
      <h2 class='new-journal-header work-sans'>Drafts</h2>
    </li>
    `
  );

  $($headerLogo).attr('class', 'header-logo work-sans');

  setHeaderID();
  compileDraftBoxes();
});

// gratefulDiv eventListeners
$($nJContButton).click((e) => {
  e.preventDefault();
  showPage($NJDiv, $gratefulDiv);
  saveDraft(e, null)
  if ((!currentObj) && (drafts.editing)) {
    currentObj = drafts.editing
  }
  });

$($doneButton).click((e) => {
  if (($($NJTextCont).val().length) > 0) {
    e.preventDefault();
    if (drafts.editing) {
      currentObj = drafts.editing;
    }
    currentObj.text = $($NJTextCont).val();
    sendMoodReq(currentObj.text);
    if (drafts.editing) {
      deleteDraft(drafts.editing)
      drafts.editing = null;
    }
    removeHeaderID();
  } else {
    window.alert("It looks like you forgot to write something. Tell us what's on your mind! (or save it as a draft for later)");
  }
});

// draftDiv eventListeners

$($draftUl).click((e) => {
  const tar = e.target;
  if ($(tar).attr('data') && $(tar).attr('funct')) {
  let tarNum = $(tar).attr('data')
  tarNum = parseInt(tarNum)
  const tarFunct = $(tar).attr('funct')
  const d = drafts.drafts.find((d) => d.draftNum === tarNum)
  if (d) drafts.editing = d
    if ((tarFunct === 'edit') && (drafts.editing)) {
      editDraft(drafts.editing);
      showPage($gratefulDiv,$draftDiv);
  } else if ((tarFunct === 'delete') && (drafts.editing)){
    showPage($draftDeleteModal,$draftDivList);
    const $modalDelBut = $('[data="draftmodal-delete-but"]');
    const $modalCanBut = $('[data="draftmodal-cancel-but"]');
    $($draftDeleteModal).attr('class', 'overlay')
    $($draftDeleteModalCont).attr('class', 'container modal')
      .click((event2) => {
      if ((event2.target === $modalDelBut[0]) || (event2.target === $modalCanBut[0])) {
        if (event2.target === $modalDelBut[0]) {
          deleteDraft(drafts.editing);
          showPage($draftDivList,$draftDeleteModal);
          $($draftDeleteModalCont).attr('class', 'hidden');
          drafts.editing = null
        } else {
          showPage($draftDivList, $draftDeleteModal);
          $($draftDeleteModalCont).attr('class', 'hidden');
          currentObj = null;
        }
      }
    })

}
  }
})
