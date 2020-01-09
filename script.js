let rules;
let rulesModal = false;
$(document).ready(() => {
  $('#rules-container').load('rules.html');
  $('#rules').click(() => {
    rulesModal = true;
    $('#rules-container').show();
  });

  $('#rules-container').ready(() => {
    $('#close').click(() => {
      closeRules();
    });

    $('#rules-container').click(e => {
      if (!$(e.target).is('#rules-modal')) {
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
