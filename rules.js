let rulesModal = false;

$(document).ready(() => {
  $('#rules-container').load('rules.html');
  $('#rules').click(() => {
    rulesModal = true;
    $('#rules-container').show();
  });

  $('#rules-container').ready(() => {
    loadRules();

    $('#close').click(() => {
      closeRules();
    });

    $('#rules-container').click(e => {
      if (
        !$(e.target).is('#rules-modal') &&
        !$(e.target).is('#rules-modal h1') &&
        !$(e.target).is('#rules-modal p')
      ) {
        closeRules();
      }
    });
  });
});

function closeRules() {
  if (rulesModal) {
    rulesModal = false;
    $('#rules-container').hide();
  }
}

function loadRules() {
  $.ajax({
    url: 'rules.txt',
    dataType: 'text',
    success: res => {
      let text = res.split('\n').join('<br>');
      $('#rules-modal #text').html(text);
    }
  });
}
